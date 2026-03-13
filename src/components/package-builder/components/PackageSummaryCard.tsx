import * as React from "react";

import { Button } from "@/components/ui/button";
import { BUSINESS_EMAILS } from "@/consts";
import { inputClassName } from "@/components/package-builder/utils/field-styles";

export type RequestPackageConfig = {
  subject: string;
  summaryText: string;
};

export type PackageSummaryCardProps = {
  children: React.ReactNode;
  total: string;
  title?: string;
  totalLabel?: string;
  feeLabel?: string;
  feeAmount?: string;
  canRequestPackage?: boolean;
  requestPackage?: RequestPackageConfig;
  requestButtonLabel?: string;
  requestDialogTitle?: string;
  requestDialogDescription?: string;
  downloadButtonLabel?: string;
  downloadFilePrefix?: string;
};

export default function PackageSummaryCard({
  children,
  total,
  title = "Package Summary",
  totalLabel = "Total",
  feeLabel,
  feeAmount,
  canRequestPackage,
  requestPackage,
  requestButtonLabel = "Request This Package",
  requestDialogTitle = "Request This Package",
  requestDialogDescription = `Enter your name + email, and I'll receive your package details at ${BUSINESS_EMAILS.requests}`,
  downloadButtonLabel = "Download Request (.txt)",
  downloadFilePrefix = "package-request",
}: PackageSummaryCardProps) {
  const [isRequestOpen, setIsRequestOpen] = React.useState(false);
  const [requestName, setRequestName] = React.useState("");
  const [requestEmail, setRequestEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sentToVintique, setSentToVintique] = React.useState(false);
  const [sentToSelf, setSentToSelf] = React.useState(false);
  const [sendResult, setSendResult] = React.useState<
    | { kind: "idle" }
    | { kind: "success"; dryRun: boolean; deliveredToVintique: boolean; deliveredToCustomer: boolean }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const packageKey = React.useMemo(() => {
    if (!requestPackage) return "";
    return `${requestPackage.subject}::${requestPackage.summaryText}::${total}`;
  }, [requestPackage, total]);

  const vintiqueSentKey = React.useMemo(
    () => (packageKey ? `package-request:vintique:${packageKey}` : ""),
    [packageKey]
  );

  const selfSentKey = React.useMemo(
    () => (packageKey ? `package-request:self:${packageKey}:${requestEmail.trim().toLowerCase()}` : ""),
    [packageKey, requestEmail]
  );

  React.useEffect(() => {
    if (!vintiqueSentKey || typeof window === "undefined") return;
    setSentToVintique(window.localStorage.getItem(vintiqueSentKey) === "1");
  }, [vintiqueSentKey]);

  React.useEffect(() => {
    if (!selfSentKey || typeof window === "undefined") return;
    setSentToSelf(window.localStorage.getItem(selfSentKey) === "1");
  }, [selfSentKey]);

  const canRequest = Boolean(requestName.trim()) && /.+@.+\..+/.test(requestEmail.trim());

  function buildDownloadText() {
    if (!requestPackage) return "";
    return `Subject: ${requestPackage.subject}\n${totalLabel}: ${total}\n\nName: ${requestName.trim() || "—"}\nEmail: ${requestEmail.trim() || "—"}\n\n${requestPackage.summaryText}`;
  }

  function downloadRequestSummary() {
    if (typeof window === "undefined" || !requestPackage) return;
    const blob = new Blob([buildDownloadText()], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
    anchor.href = url;
    anchor.download = `${downloadFilePrefix}-${timestamp}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  async function submitRequest(target: "vintique" | "self") {
    if (!requestPackage) return;
    if (target === "vintique" && sentToVintique) return;
    if (target === "self" && sentToSelf) return;

    setIsSending(true);
    setSendResult({ kind: "idle" });

    try {
      const response = await fetch("/api/request-package", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: requestName.trim(),
          email: requestEmail.trim(),
          subject: requestPackage.subject,
          summaryText: requestPackage.summaryText,
          total,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          deliverToVintique: target === "vintique",
          deliverToCustomer: target === "self",
        }),
      });

      const json = (await response.json().catch(() => null)) as
        | { ok: true; dryRun: boolean; deliveredToVintique: boolean; deliveredToCustomer: boolean }
        | { ok: false; error: string }
        | null;

      if (!json) {
        setSendResult({ kind: "error", message: "Request failed. Please try again." });
        return;
      }

      if (!response.ok) {
        setSendResult({
          kind: "error",
          message: json.ok ? "Request failed. Please try again." : json.error || "Request failed. Please try again.",
        });
        return;
      }

      if (json.ok) {
        if (json.deliveredToVintique) {
          setSentToVintique(true);
          if (vintiqueSentKey && typeof window !== "undefined") {
            window.localStorage.setItem(vintiqueSentKey, "1");
          }
        }

        if (json.deliveredToCustomer) {
          setSentToSelf(true);
          if (selfSentKey && typeof window !== "undefined") {
            window.localStorage.setItem(selfSentKey, "1");
          }
        }

        setSendResult({
          kind: "success",
          dryRun: json.dryRun,
          deliveredToVintique: json.deliveredToVintique,
          deliveredToCustomer: json.deliveredToCustomer,
        });
        return;
      }

      setSendResult({ kind: "error", message: json.error || "Request failed. Please try again." });
    } catch {
      setSendResult({ kind: "error", message: "Request failed. Please try again." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <aside className="space-y-4 rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold">{title}</h3>

      {children}

      <div className="h-px bg-border" />

      {feeLabel && feeAmount && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{feeLabel}</span>
          <span className="tabular-nums">{feeAmount}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="font-semibold">{totalLabel}</span>
        <span className="font-semibold">{total}</span>
      </div>

      {canRequestPackage && requestPackage && (
        <Button type="button" className="w-full" onClick={() => setIsRequestOpen(true)}>
          {requestButtonLabel}
        </Button>
      )}

      {isRequestOpen && requestPackage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Request this package"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setIsRequestOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-5 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-lg font-semibold">{requestDialogTitle}</div>
                <div className="text-sm text-muted-foreground">{requestDialogDescription}</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setIsRequestOpen(false)}>
                Close
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  className={inputClassName}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  className={inputClassName}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Email preview</div>
              <pre className="max-h-56 overflow-auto rounded-md border border-border bg-muted p-3 text-xs whitespace-pre-wrap">
{`Subject: ${requestPackage.subject}
${totalLabel}: ${total}

${requestPackage.summaryText}`}
              </pre>
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={downloadRequestSummary}>
                  {downloadButtonLabel}
                </Button>
              </div>
            </div>

            {sendResult.kind === "success" && (
              <div className="rounded-md border border-border bg-muted p-3 text-sm">
                {sendResult.dryRun ? "Dry run: request received (email not sent)." : "Sent successfully."}
                {sendResult.deliveredToVintique && " Sent to Vintique Sound."}
                {sendResult.deliveredToCustomer && " Sent copy to your email."}
              </div>
            )}

            {sendResult.kind === "error" && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {sendResult.message}
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsRequestOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={!canRequest || isSending || sentToSelf}
                onClick={() => submitRequest("self")}
              >
                {sentToSelf ? "Already Sent to Me" : isSending ? "Sending…" : "Send Copy to Me"}
              </Button>
              <Button
                type="button"
                disabled={!canRequest || isSending || sentToVintique}
                onClick={() => submitRequest("vintique")}
              >
                {sentToVintique ? "Already Sent to Vintique" : isSending ? "Sending…" : "Send to Vintique"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
