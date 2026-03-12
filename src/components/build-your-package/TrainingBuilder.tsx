import * as React from "react";

import { Button } from "@/components/ui/button";

import PackageSummaryCard from "@/components/build-your-package/PackageSummaryCard";
import {
  projectFeedbackDawOptions,
  projectFeedbackFocusAreas,
  trainingBuilderTopics,
} from "@/content/webpage/training-data";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

export type TrainingBuilderProps = {
  onChangeCategory?: () => void;
};

type RequestType = "" | "oneOnOneTraining" | "projectFeedback";
type TrainingTopicKey = keyof typeof trainingBuilderTopics;
type ProjectFeedbackDaw = "" | (typeof projectFeedbackDawOptions)[number];
type TrainingStepId = "requestType" | "trainingTopics" | TrainingTopicKey | "projectFeedback" | "review";

type StepConfig = {
  id: TrainingStepId;
  title: string;
  description: string;
};

const REQUEST_TYPE_LABELS: Record<Exclude<RequestType, "">, string> = {
  oneOnOneTraining: "One-on-One Training",
  projectFeedback: "Project Feedback",
};

const REQUEST_TYPE_OPTIONS = [
  { value: "oneOnOneTraining", label: "One-on-One Training" },
  { value: "projectFeedback", label: "Project Feedback" },
] as const;

const TOPIC_ORDER: TrainingTopicKey[] = ["cubase", "mixing", "mastering"];
const DEFAULT_STEP: StepConfig = {
  id: "requestType",
  title: "Request Type",
  description: "Start by choosing whether you want customized training or project feedback.",
};

function createEmptyTopicSelection(): Record<TrainingTopicKey, boolean> {
  return {
    cubase: false,
    mixing: false,
    mastering: false,
  };
}

function createEmptyFocusSelections(): Record<TrainingTopicKey, string[]> {
  return {
    cubase: [],
    mixing: [],
    mastering: [],
  };
}

export default function TrainingBuilder({ onChangeCategory: _onChangeCategory }: TrainingBuilderProps) {
  useDisplayCurrency();

  const [requestType, setRequestType] = React.useState<RequestType>("");
  const [selectedTopics, setSelectedTopics] = React.useState<Record<TrainingTopicKey, boolean>>(
    createEmptyTopicSelection
  );
  const [topicFocusSelections, setTopicFocusSelections] = React.useState<Record<TrainingTopicKey, string[]>>(
    createEmptyFocusSelections
  );
  const [projectFeedbackDaw, setProjectFeedbackDaw] = React.useState<ProjectFeedbackDaw>("");
  const [projectFeedbackSelections, setProjectFeedbackSelections] = React.useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = React.useState("");
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const textareaClassName =
    "flex w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  const selectedTopicKeys = React.useMemo(
    () => TOPIC_ORDER.filter((topic) => selectedTopics[topic]),
    [selectedTopics]
  );

  const steps = React.useMemo<StepConfig[]>(() => {
    if (requestType === "oneOnOneTraining") {
      return [
        DEFAULT_STEP,
        {
          id: "trainingTopics",
          title: "Training Topics",
          description: "Choose the core areas you want to focus on during your training.",
        },
        ...selectedTopicKeys.map((topic) => ({
          id: topic,
          title: `${trainingBuilderTopics[topic].label} Focus Areas`,
          description: trainingBuilderTopics[topic].description,
        })),
        {
          id: "review",
          title: "Review Your Request",
          description: "Add any final notes, then send your training request.",
        },
      ];
    }

    if (requestType === "projectFeedback") {
      return [
        DEFAULT_STEP,
        {
          id: "projectFeedback",
          title: "Project Feedback Details",
          description: "Tell me which DAW you use and what kind of feedback you want.",
        },
        {
          id: "review",
          title: "Review Your Request",
          description: "Add any final notes, then send your project feedback request.",
        },
      ];
    }

    return [DEFAULT_STEP];
  }, [requestType, selectedTopicKeys]);

  React.useEffect(() => {
    setCurrentStepIndex((prev) => Math.min(prev, Math.max(0, steps.length - 1)));
  }, [steps.length]);

  const currentStep: StepConfig = steps[currentStepIndex] ?? steps[0] ?? DEFAULT_STEP;

  const isCurrentStepComplete = React.useMemo(() => {
    if (!currentStep) return false;

    switch (currentStep.id) {
      case "requestType":
        return Boolean(requestType);
      case "trainingTopics":
        return selectedTopicKeys.length > 0;
      case "projectFeedback":
        return Boolean(projectFeedbackDaw) && projectFeedbackSelections.length > 0;
      case "review":
        return true;
      default:
        return topicFocusSelections[currentStep.id].length > 0;
    }
  }, [currentStep, projectFeedbackDaw, projectFeedbackSelections.length, requestType, selectedTopicKeys.length, topicFocusSelections]);

  const isRequestComplete = React.useMemo(() => {
    if (requestType === "oneOnOneTraining") {
      return (
        selectedTopicKeys.length > 0 &&
        selectedTopicKeys.every((topic) => topicFocusSelections[topic].length > 0)
      );
    }

    if (requestType === "projectFeedback") {
      return Boolean(projectFeedbackDaw) && projectFeedbackSelections.length > 0;
    }

    return false;
  }, [projectFeedbackDaw, projectFeedbackSelections.length, requestType, selectedTopicKeys, topicFocusSelections]);

  const requestPackage = React.useMemo(() => {
    const lines: string[] = [];

    if (!requestType) {
      return {
        subject: "Training Request",
        summaryText: "",
      };
    }

    lines.push(`Request type: ${REQUEST_TYPE_LABELS[requestType]}`);

    if (requestType === "oneOnOneTraining") {
      lines.push("");
      lines.push("Training topics:");
      selectedTopicKeys.forEach((topic) => {
        lines.push(`- ${trainingBuilderTopics[topic].label}`);
        topicFocusSelections[topic].forEach((focusArea) => {
          lines.push(`  - ${focusArea}`);
        });
      });
    }

    if (requestType === "projectFeedback") {
      lines.push(`DAW: ${projectFeedbackDaw || "—"}`);
      lines.push("");
      lines.push("Requested feedback:");
      projectFeedbackSelections.forEach((selection) => {
        lines.push(`- ${selection}`);
      });
    }

    if (additionalNotes.trim()) {
      lines.push("");
      lines.push("Additional notes:");
      lines.push(additionalNotes.trim());
    }

    return {
      subject: `Training Request — ${REQUEST_TYPE_LABELS[requestType]}`,
      summaryText: lines.join("\n"),
    };
  }, [additionalNotes, projectFeedbackDaw, projectFeedbackSelections, requestType, selectedTopicKeys, topicFocusSelections]);

  const canRequestPackage = currentStep?.id === "review" && isRequestComplete && Boolean(requestPackage.summaryText);

  function updateRequestType(nextValue: RequestType) {
    setRequestType(nextValue);
    setCurrentStepIndex(0);

    if (nextValue === "oneOnOneTraining") {
      setProjectFeedbackDaw("");
      setProjectFeedbackSelections([]);
      return;
    }

    if (nextValue === "projectFeedback") {
      setSelectedTopics(createEmptyTopicSelection());
      setTopicFocusSelections(createEmptyFocusSelections());
      return;
    }

    setSelectedTopics(createEmptyTopicSelection());
    setTopicFocusSelections(createEmptyFocusSelections());
    setProjectFeedbackDaw("");
    setProjectFeedbackSelections([]);
  }

  function toggleTrainingTopic(topic: TrainingTopicKey, checked: boolean) {
    setSelectedTopics((prev) => ({
      ...prev,
      [topic]: checked,
    }));

    if (!checked) {
      setTopicFocusSelections((prev) => ({
        ...prev,
        [topic]: [],
      }));
    }
  }

  function toggleTopicFocusArea(topic: TrainingTopicKey, focusArea: string, checked: boolean) {
    setTopicFocusSelections((prev) => {
      const current = prev[topic];
      return {
        ...prev,
        [topic]: checked
          ? [...current, focusArea]
          : current.filter((entry) => entry !== focusArea),
      };
    });
  }

  function toggleProjectFeedbackSelection(selection: string, checked: boolean) {
    setProjectFeedbackSelections((prev) =>
      checked ? [...prev, selection] : prev.filter((entry) => entry !== selection)
    );
  }

  function goToNextStep() {
    if (!isCurrentStepComplete || currentStepIndex >= steps.length - 1) return;
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function goToPreviousStep() {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 space-y-8">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold">{currentStep.title}</h2>
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        </div>

        <section className="space-y-5">
          {currentStep.id === "requestType" && (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What would you like to request?</label>
                <select
                  value={requestType}
                  onChange={(e) => updateRequestType(e.target.value as RequestType)}
                  className={inputClassName}
                >
                  <option value="">Select a request type</option>
                  {REQUEST_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep.id === "trainingTopics" && (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                Select one or more training areas, then you'll choose the specific focus areas for each one.
              </div>

              <div className="space-y-4">
                {TOPIC_ORDER.map((topic) => (
                  <label key={topic} className="flex items-start gap-3 rounded-md border border-border p-4 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedTopics[topic]}
                      onChange={(e) => toggleTrainingTopic(topic, e.target.checked)}
                    />
                    <span className="space-y-1">
                      <span className="block font-medium">{trainingBuilderTopics[topic].label}</span>
                      <span className="block text-muted-foreground">{trainingBuilderTopics[topic].description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {TOPIC_ORDER.includes(currentStep.id as TrainingTopicKey) && currentStep.id in trainingBuilderTopics && (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                Select the specific areas you want to cover for {trainingBuilderTopics[currentStep.id as TrainingTopicKey].label.toLowerCase()}.
              </div>

              <div className="space-y-3">
                {trainingBuilderTopics[currentStep.id as TrainingTopicKey].focusAreas.map((focusArea) => (
                  <label key={focusArea} className="flex items-start gap-3 rounded-md border border-border p-4 text-sm">
                    <input
                      type="checkbox"
                      checked={topicFocusSelections[currentStep.id as TrainingTopicKey].includes(focusArea)}
                      onChange={(e) =>
                        toggleTopicFocusArea(currentStep.id as TrainingTopicKey, focusArea, e.target.checked)
                      }
                    />
                    <span>{focusArea}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep.id === "projectFeedback" && (
            <div className="rounded-lg border border-border p-4 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">DAW</label>
                <select
                  value={projectFeedbackDaw}
                  onChange={(e) => setProjectFeedbackDaw(e.target.value as ProjectFeedbackDaw)}
                  className={inputClassName}
                >
                  <option value="">Select your DAW</option>
                  {projectFeedbackDawOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">What kind of feedback do you want?</div>
                {projectFeedbackFocusAreas.map((focusArea) => (
                  <label key={focusArea} className="flex items-start gap-3 rounded-md border border-border p-4 text-sm">
                    <input
                      type="checkbox"
                      checked={projectFeedbackSelections.includes(focusArea)}
                      onChange={(e) => toggleProjectFeedbackSelection(focusArea, e.target.checked)}
                    />
                    <span>{focusArea}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep.id === "review" && (
            <div className="rounded-lg border border-border p-4 space-y-5">
              <div className="space-y-2">
                <div className="text-sm font-medium">Request overview</div>
                <div className="rounded-md border border-border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                  {requestPackage.summaryText}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional notes (optional)</label>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className={textareaClassName + " h-28"}
                  placeholder="Anything else you'd like me to know about your goals, current skill level, or project?"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground self-end">
              Step {currentStepIndex + 1} of {steps.length}
            </p>
            <div className="flex items-center justify-end gap-2 mt-0">
              <Button type="button" variant="ghost" onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
                Back
              </Button>
              {currentStep.id !== "review" && (
                <Button type="button" onClick={goToNextStep} disabled={!isCurrentStepComplete}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>

      <PackageSummaryCard
        title="Training Request Summary"
        totalLabel="Pricing"
        total="Custom quote after review"
        canRequestPackage={canRequestPackage}
        requestPackage={requestPackage}
        requestButtonLabel={requestType === "projectFeedback" ? "Request Project Feedback" : "Request Training"}
        requestDialogTitle={requestType === "projectFeedback" ? "Request Project Feedback" : "Request Training"}
        requestDialogDescription="Enter your name + email, and I'll receive your training request details so I can review the scope and follow up with the best next step."
        downloadFilePrefix="training-request"
      >
        <ul className="text-sm space-y-2">
          <li>Request: {requestType ? REQUEST_TYPE_LABELS[requestType] : "—"}</li>

          {requestType === "oneOnOneTraining" && (
            <>
              <li>
                Topics: {selectedTopicKeys.length > 0 ? selectedTopicKeys.map((topic) => trainingBuilderTopics[topic].label).join(", ") : "—"}
              </li>
              {selectedTopicKeys.map((topic) => (
                <li key={topic}>
                  {trainingBuilderTopics[topic].label}: {topicFocusSelections[topic].length > 0 ? topicFocusSelections[topic].join("; ") : "—"}
                </li>
              ))}
            </>
          )}

          {requestType === "projectFeedback" && (
            <>
              <li>DAW: {projectFeedbackDaw || "—"}</li>
              <li>
                Feedback: {projectFeedbackSelections.length > 0 ? projectFeedbackSelections.join(", ") : "—"}
              </li>
            </>
          )}

          <li>Notes: {additionalNotes.trim() || "—"}</li>
        </ul>
      </PackageSummaryCard>
    </div>
  );
}
