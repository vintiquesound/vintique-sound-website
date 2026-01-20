import type { APIRoute } from "astro";

function getEnv(key: string): string | undefined {
  // Prefer Astro's server env if available, then fall back to process.env.
  const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[key] ?? process.env[key];
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json().catch(() => null)) as
      | {
          name?: string;
          email?: string;
          subject?: string;
          summaryText?: string;
          total?: string;
          pageUrl?: string;
        }
      | null;

    if (!body) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid JSON." }), { status: 400 });
    }

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const subject = (body.subject ?? "Package request").trim();
    const summaryText = (body.summaryText ?? "").trim();
    const total = (body.total ?? "").trim();
    const pageUrl = (body.pageUrl ?? "").trim();

    if (!name) return new Response(JSON.stringify({ ok: false, error: "Name is required." }), { status: 400 });
    if (!email || !/.+@.+\..+/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Valid email is required." }), { status: 400 });
    }
    if (!summaryText) {
      return new Response(JSON.stringify({ ok: false, error: "Package summary is required." }), { status: 400 });
    }

    const to = getEnv("REQUEST_PACKAGE_TO") ?? "info@vintiquesound.com";
    const from = getEnv("SMTP_FROM") ?? to;

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
      console.log("Package request (dry run)", { to, from, subject, name, email, total, pageUrl, summaryText });
      return new Response(JSON.stringify({ ok: true, dryRun: true }), { status: 200 });
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

    await transporter.sendMail({
      to,
      from,
      replyTo: email,
      subject,
      text: fullText,
      html,
    });

    return new Response(JSON.stringify({ ok: true, dryRun: false }), { status: 200 });
  } catch (err) {
    console.error("Package request error", err);
    return new Response(JSON.stringify({ ok: false, error: "Server error." }), { status: 500 });
  }
};
