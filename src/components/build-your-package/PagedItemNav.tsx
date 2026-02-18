import * as React from "react";

import { Button } from "@/components/ui/button";

export type PagedItemNavProps = {
  itemLabel: string;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function PagedItemNav({
  itemLabel,
  currentIndex,
  total,
  onPrevious,
  onNext,
}: PagedItemNavProps) {
  if (total <= 1) return null;

  return (
    <div className="flex gap-2">
      <Button type="button" variant="ghost" onClick={onPrevious} disabled={currentIndex === 0}>
        Previous {itemLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={onNext} disabled={currentIndex >= total - 1}>
        Next {itemLabel}
      </Button>
    </div>
  );
}
