import type { APIRoute } from "astro";
import { getServerEnv, isTruthyEnv } from "@/lib/server-env";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const debugEnabled = isTruthyEnv(getServerEnv("EMAIL_DEBUG_ENABLED"));
  if (!debugEnabled) {
    return new Response("Not found", { status: 404 });
  }

  const requiredToken = (getServerEnv("EMAIL_DEBUG_TOKEN") ?? "").trim();
  if (requiredToken) {
    const suppliedToken = request.headers.get("x-email-debug-token") ?? new URL(request.url).searchParams.get("token") ?? "";
    if (suppliedToken !== requiredToken) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized." }), { status: 401 });
    }
  }

  const host = (getServerEnv("SMTP_HOST") ?? "").trim();
  const portRaw = (getServerEnv("SMTP_PORT") ?? "").trim();
  const user = (getServerEnv("SMTP_USER") ?? "").trim();
  const pass = (getServerEnv("SMTP_PASS") ?? "").trim();
  const from = (getServerEnv("SMTP_FROM") ?? "").trim();
  const emailDryRun = isTruthyEnv(getServerEnv("EMAIL_DRY_RUN"));

  const smtpChecks = {
    smtpHostSet: Boolean(host),
    smtpPortSet: Boolean(portRaw),
    smtpUserSet: Boolean(user),
    smtpPassSet: Boolean(pass),
    smtpFromSet: Boolean(from),
  };

  const hasSmtp = Object.values(smtpChecks)
    .filter((_, index) => index < 4)
    .every(Boolean);

  const port = Number(portRaw);
  const smtpPortValid = Number.isFinite(port) && port > 0;
  const smtpSecure = (getServerEnv("SMTP_SECURE") ?? "").toLowerCase() === "true" || port === 465;

  let nodemailerAvailable = false;
  try {
    // nodemailer is optional in some environments.
    // @ts-expect-error - module may not be installed in all environments
    await import("nodemailer");
    nodemailerAvailable = true;
  } catch {
    nodemailerAvailable = false;
  }

  const mode = emailDryRun
    ? "dry-run"
    : hasSmtp && smtpPortValid && nodemailerAvailable
      ? "smtp-ready"
      : "smtp-misconfigured";

  return new Response(
    JSON.stringify(
      {
        ok: true,
        mode,
        emailDryRun,
        smtpConfigured: hasSmtp,
        smtpPortValid,
        smtpSecure,
        nodemailerAvailable,
        ...smtpChecks,
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    }
  );
};
