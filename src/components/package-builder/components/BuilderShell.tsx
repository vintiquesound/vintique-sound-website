import * as React from "react";

export type BuilderShellProps = {
  children: React.ReactNode;
  summary: React.ReactNode;
};

export default function BuilderShell({ children, summary }: BuilderShellProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 space-y-8">{children}</div>
      {summary}
    </div>
  );
}
