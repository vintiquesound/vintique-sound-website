import type { APIRoute } from "astro";

// setting "prerender = false" enables POST on localhost/build without switching your whole site output mode
export const prerender = false;

type RequestBody = {
  name?: string;
  email?: string;
  subject?: string;
  summaryText?: string;
  total?: string;
  pageUrl?: string;
  deliverToVintique?: boolean;
  deliverToCustomer?: boolean;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

const requestTimestampsByIp = new Map<string, number[]>();
const recentRequestKeys = new Map<string, number>();

function getEnv(key: string): string | undefined {
  // Runtime-only env lookup to avoid build-time inlining of secrets.
  return process.env[key];
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function parseRequestBody(request: Request): Promise<RequestBody | null> {
  const jsonClone = request.clone();
  try {
    const parsed = (await request.json()) as unknown;
    if (parsed && typeof parsed === "object") return parsed as RequestBody;
  } catch {
    // Fall through to alternate body parsers.
  }

  try {
    const formData = await jsonClone.formData();
    if ([...formData.keys()].length > 0) {
      return Object.fromEntries(formData.entries()) as RequestBody;
    }
  } catch {
    // Ignore and continue to text fallback.
  }

  const textClone = request.clone();
  const rawText = await textClone.text().catch(() => "");
  if (!rawText.trim()) return null;

  try {
    const parsed = JSON.parse(rawText) as unknown;
    if (parsed && typeof parsed === "object") return parsed as RequestBody;
    return null;
  } catch {
    const params = new URLSearchParams(rawText);
    if ([...params.keys()].length > 0) {
      return Object.fromEntries(params.entries()) as RequestBody;
    }
  }

  return null;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function pruneRecentMaps(now: number) {
  for (const [ip, timestamps] of requestTimestampsByIp.entries()) {
    const recent = timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      requestTimestampsByIp.delete(ip);
    } else {
      requestTimestampsByIp.set(ip, recent);
    }
  }

  for (const [key, timestamp] of recentRequestKeys.entries()) {
    if (now - timestamp > DEDUPE_WINDOW_MS) {
      recentRequestKeys.delete(key);
    }
  }
}

function isRateLimited(ip: string, now: number): boolean {
  const timestamps = requestTimestampsByIp.get(ip) ?? [];
  const recent = timestamps.filter((ts) => now - ts <= RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestampsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestTimestampsByIp.set(ip, recent);
  return false;
}

function isDuplicateRequest(requestKey: string, now: number): boolean {
  const existing = recentRequestKeys.get(requestKey);
  if (existing && now - existing <= DEDUPE_WINDOW_MS) {
    return true;
  }
  recentRequestKeys.set(requestKey, now);
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await parseRequestBody(request);

    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON." }), { status: 400 });
    }

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const subject = (body.subject ?? "Package request").trim();
    const summaryText = (body.summaryText ?? "").trim();
    const total = (body.total ?? "").trim();
    const pageUrl = (body.pageUrl ?? "").trim();
    const deliverToVintique = body.deliverToVintique !== false;
    const deliverToCustomer = body.deliverToCustomer === true;

    if (!deliverToVintique && !deliverToCustomer) {
      return new Response(JSON.stringify({ ok: false, error: "Select at least one delivery target." }), { status: 400 });
    }

    if (!name) return new Response(JSON.stringify({ ok: false, error: "Name is required." }), { status: 400 });
    if (!email || !/.+@.+\..+/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Valid email is required." }), { status: 400 });
    }
    if (!summaryText) {
      return new Response(JSON.stringify({ ok: false, error: "Package summary is required." }), { status: 400 });
    }

    const to = getEnv("REQUEST_PACKAGE_TO") ?? "info@vintiquesound.com";
    const from = getEnv("SMTP_FROM") ?? to;

    const now = Date.now();
    pruneRecentMaps(now);

    const ip = getClientIp(request);
    if (isRateLimited(ip, now)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Too many requests. Please wait a few minutes and try again." }),
        { status: 429 }
      );
    }

    const dedupeKey = JSON.stringify({
      email: email.toLowerCase(),
      subject,
      summaryText,
      total,
      deliverToVintique,
      deliverToCustomer,
    });
    if (isDuplicateRequest(dedupeKey, now)) {
      return new Response(
        JSON.stringify({ ok: false, error: "This request was already submitted recently." }),
        { status: 409 }
      );
    }

    const dryRunEnv = (getEnv("EMAIL_DRY_RUN") ?? "").toLowerCase();
    const dryRun = dryRunEnv === "1" || dryRunEnv === "true";

    const fullText = [
      `Name: ${name}`,
      `Email: ${email}`,
      pageUrl ? `Page: ${pageUrl}` : null,
      total ? `Total: ${total}` : null,
      "",
      summaryText,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.4;">
  <h2 style="margin: 0 0 12px;">${escapeHtml(subject)}</h2>
  <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}<br/>
  <strong>Email:</strong> ${escapeHtml(email)}${pageUrl ? `<br/><strong>Page:</strong> ${escapeHtml(pageUrl)}` : ""}${total ? `<br/><strong>Total:</strong> ${escapeHtml(total)}` : ""}</p>
  <pre style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 8px; border: 1px solid #ddd;">${escapeHtml(summaryText)}</pre>
</div>`;

    const host = getEnv("SMTP_HOST");
    const portRaw = getEnv("SMTP_PORT");
    const user = getEnv("SMTP_USER");
    const pass = getEnv("SMTP_PASS");

    const hasSmtp = Boolean(host) && Boolean(portRaw) && Boolean(user) && Boolean(pass);

    if (dryRun || !hasSmtp) {
      console.log("Package request (dry run)", {
        to,
        from,
        subject,
        name,
        email,
        total,
        pageUrl,
        summaryText,
        deliverToVintique,
        deliverToCustomer,
      });
      return new Response(
        JSON.stringify({ ok: true, dryRun: true, deliveredToVintique: deliverToVintique, deliveredToCustomer: deliverToCustomer }),
        { status: 200 }
      );
    }

    const port = Number(portRaw);
    const secure = (getEnv("SMTP_SECURE") ?? "").toLowerCase() === "true" || port === 465;

    let nodemailerModule: unknown;
    try {
      // nodemailer is an optional dependency: only needed when SMTP_* is configured.
      // @ts-expect-error - module may not be installed in all environments
      nodemailerModule = await import("nodemailer");
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Email is not configured (missing nodemailer). Set EMAIL_DRY_RUN=1 for testing, or install nodemailer and configure SMTP_* env vars.",
        }),
        { status: 500 }
      );
    }

    const nodemailer = nodemailerModule as {
      createTransport: (opts: {
        host: string;
        port: number;
        secure: boolean;
        auth: { user: string; pass: string };
      }) => {
        sendMail: (opts: {
          to: string;
          from: string;
          replyTo: string;
          subject: string;
          text: string;
          html: string;
        }) => Promise<unknown>;
      };
    };

    const transporter = nodemailer.createTransport({
      host: host as string,
      port,
      secure,
      auth: {
        user: user as string,
        pass: pass as string,
      },
    });

    if (deliverToVintique) {
      await transporter.sendMail({
        to,
        from,
        replyTo: email,
        subject,
        text: fullText,
        html,
      });
    }

    if (deliverToCustomer) {
      await transporter.sendMail({
        to: email,
        from,
        replyTo: to,
        subject: `${subject} (Copy)`,
        text: fullText,
        html,
      });
    }

    return new Response(
      JSON.stringify({ ok: true, dryRun: false, deliveredToVintique: deliverToVintique, deliveredToCustomer: deliverToCustomer }),
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof SyntaxError) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON." }), { status: 400 });
    }
    console.error("Package request error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error." }), { status: 500 });
  }
};
