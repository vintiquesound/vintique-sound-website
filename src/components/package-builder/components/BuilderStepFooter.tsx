import { Button } from "@/components/ui/button";

export type BuilderStepFooterProps = {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideNext?: boolean;
  backDisabled?: boolean;
};

export default function BuilderStepFooter({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next",
  nextDisabled = false,
  hideNext = false,
  backDisabled = false,
}: BuilderStepFooterProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground self-end">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="flex items-center justify-end gap-2 mt-0">
        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack} disabled={backDisabled}>
            {backLabel}
          </Button>
        )}
        {!hideNext && onNext && (
          <Button type="button" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
