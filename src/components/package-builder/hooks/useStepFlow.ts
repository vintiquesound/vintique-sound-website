import * as React from "react";

export function useStepFlow<T>(steps: readonly T[], fallbackStep: T) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  React.useEffect(() => {
    setCurrentStepIndex((prev) => Math.min(prev, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const currentStep = steps[currentStepIndex] ?? steps[0] ?? fallbackStep;

  const goToNextStep = React.useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const goToPreviousStep = React.useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    currentStepIndex,
    currentStep,
    totalSteps: steps.length,
    setCurrentStepIndex,
    goToNextStep,
    goToPreviousStep,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex >= steps.length - 1,
  };
}
