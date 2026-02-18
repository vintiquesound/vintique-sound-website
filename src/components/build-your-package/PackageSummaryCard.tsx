import * as React from "react";

import { Button } from "@/components/ui/button";

export type RequestPackageConfig = {
  subject: string;
  summaryText: string;
};

export type PackageSummaryCardProps = {
  children: React.ReactNode;
  total: string;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  requestPackage?: RequestPackageConfig;
};

export default function PackageSummaryCard({
  children,
  total,
  showAddToCart,
  onAddToCart,
  requestPackage,
}: PackageSummaryCardProps) {
  const [isRequestOpen, setIsRequestOpen] = React.useState(false);
  const [requestName, setRequestName] = React.useState("");
  const [requestEmail, setRequestEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sendResult, setSendResult] = React.useState<
    | { kind: "idle" }
    | { kind: "success"; dryRun: boolean }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const canRequest = Boolean(requestName.trim()) && /.+@.+\..+/.test(requestEmail.trim());

  async function submitRequest() {
    if (!requestPackage) return;

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
        }),
      });

      const json = (await response.json().catch(() => null)) as
        | { ok: true; dryRun: boolean }
        | { ok: false; error: string }
        | null;

      if (!response.ok || !json) {
        setSendResult({ kind: "error", message: "Request failed. Please try again." });
        return;
      }

      if (json.ok) {
        setSendResult({ kind: "success", dryRun: json.dryRun });
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
      <h3 className="text-lg font-semibold">Package Summary</h3>

      {children}

      <div className="h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">{total}</span>
      </div>

      {showAddToCart && (
        <Button type="button" className="w-full" onClick={onAddToCart}>
          Add to Cart
        </Button>
      )}

      {showAddToCart && requestPackage && (
        <Button type="button" className="w-full" onClick={() => setIsRequestOpen(true)}>
          Request This Package
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
                <div className="text-lg font-semibold">Request This Package</div>
                <div className="text-sm text-muted-foreground">
                  Enter your name + email, and I’ll receive your package details at info@vintiquesound.com.
                </div>
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
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Email preview</div>
              <pre className="max-h-56 overflow-auto rounded-md border border-border bg-muted p-3 text-xs whitespace-pre-wrap">
{`Subject: ${requestPackage.subject}
Total: ${total}

${requestPackage.summaryText}`}
              </pre>
              <div className="text-xs text-muted-foreground">
                Tip: Set `EMAIL_DRY_RUN=1` to test without sending.
              </div>
            </div>

            {sendResult.kind === "success" && (
              <div className="rounded-md border border-border bg-muted p-3 text-sm">
                {sendResult.dryRun
                  ? "Dry run: request received (email not sent)."
                  : "Sent! I’ve received your package request."}
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
              <Button type="button" disabled={!canRequest || isSending} onClick={submitRequest}>
                {isSending ? "Sending…" : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
