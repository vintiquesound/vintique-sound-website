import * as React from "react";

import BuilderShell from "@/components/package-builder/components/BuilderShell";
import BuilderStepFooter from "@/components/package-builder/components/BuilderStepFooter";
import PackageSummaryCard from "@/components/package-builder/components/PackageSummaryCard";
import { useStepFlow } from "@/components/package-builder/hooks/useStepFlow";
import { inputClassName, textareaClassName } from "@/components/package-builder/utils/field-styles";
import {
  packageOptions,
  trainingRecordingAddOn,
  trainingBuilderTopics,
} from "@/content/webpage/one-on-one-training-data";
import {
  feedbackPackageOptions,
  projectFeedbackDawOptions,
  projectFeedbackFocusAreas,
} from "@/content/webpage/project-feedback-data";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

export type TrainingBuilderProps = {
  onChangeCategory?: () => void;
  initialRequestType?: TrainingRequestType;
};

export type TrainingRequestType = "oneOnOneTraining" | "projectFeedback";

type RequestType = "" | TrainingRequestType;
type TrainingTopicKey = keyof typeof trainingBuilderTopics;
type TrainingPackage = "" | (typeof packageOptions)[number]["title"];
type ProjectFeedbackPackage = "" | (typeof feedbackPackageOptions)[number]["title"];
type ProjectFeedbackDaw = "" | (typeof projectFeedbackDawOptions)[number];
type TrainingStepId =
  | "requestType"
  | "trainingPackage"
  | "trainingTopics"
  | TrainingTopicKey
  | "projectFeedbackPackage"
  | "projectFeedback"
  | "review";

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

export default function TrainingBuilder({ onChangeCategory: _onChangeCategory, initialRequestType }: TrainingBuilderProps) {
  useDisplayCurrency();

  const [requestType, setRequestType] = React.useState<RequestType>(initialRequestType ?? "");
  const [trainingPackage, setTrainingPackage] = React.useState<TrainingPackage>("");
  const [trainingRecordingRequested, setTrainingRecordingRequested] = React.useState(false);
  const [selectedTopics, setSelectedTopics] = React.useState<Record<TrainingTopicKey, boolean>>(
    createEmptyTopicSelection
  );
  const [topicFocusSelections, setTopicFocusSelections] = React.useState<Record<TrainingTopicKey, string[]>>(
    createEmptyFocusSelections
  );
  const [projectFeedbackPackage, setProjectFeedbackPackage] = React.useState<ProjectFeedbackPackage>("");
  const [projectFeedbackDaw, setProjectFeedbackDaw] = React.useState<ProjectFeedbackDaw>("");
  const [projectFeedbackSelections, setProjectFeedbackSelections] = React.useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = React.useState("");

  const selectedTopicKeys = React.useMemo(
    () => TOPIC_ORDER.filter((topic) => selectedTopics[topic]),
    [selectedTopics]
  );

  React.useEffect(() => {
    setRequestType(initialRequestType ?? "");
  }, [initialRequestType]);

  const isRequestTypeLocked = Boolean(initialRequestType);

  const steps = React.useMemo<StepConfig[]>(() => {
    if (requestType === "oneOnOneTraining") {
      return [
        ...(isRequestTypeLocked ? [] : [DEFAULT_STEP]),
        {
          id: "trainingPackage",
          title: "Training Format",
          description: "Choose how you want your 1-on-1 training structured.",
        },
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
        ...(isRequestTypeLocked ? [] : [DEFAULT_STEP]),
        {
          id: "projectFeedbackPackage",
          title: "Walkthrough Format",
          description: "Choose how you want the project walkthrough delivered.",
        },
        {
          id: "projectFeedback",
          title: "Project Feedback Details",
          description: "Tell me which DAW you use and what you want me to focus on during the walkthrough.",
        },
        {
          id: "review",
          title: "Review Your Request",
          description: "Add any final notes, then send your project feedback request.",
        },
      ];
    }

    return [DEFAULT_STEP];
  }, [isRequestTypeLocked, requestType, selectedTopicKeys]);

  const {
    currentStepIndex,
    currentStep,
    totalSteps,
    setCurrentStepIndex,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
  } = useStepFlow(steps, DEFAULT_STEP);

  const isCurrentStepComplete = React.useMemo(() => {
    switch (currentStep.id) {
      case "requestType":
        return Boolean(requestType);
      case "trainingPackage":
        return Boolean(trainingPackage);
      case "trainingTopics":
        return selectedTopicKeys.length > 0;
      case "projectFeedbackPackage":
        return Boolean(projectFeedbackPackage);
      case "projectFeedback":
        return Boolean(projectFeedbackDaw) && projectFeedbackSelections.length > 0;
      case "review":
        return true;
      default:
        return topicFocusSelections[currentStep.id].length > 0;
    }
  }, [
    currentStep,
    projectFeedbackDaw,
    projectFeedbackPackage,
    projectFeedbackSelections.length,
    requestType,
    selectedTopicKeys.length,
    topicFocusSelections,
    trainingPackage,
  ]);

  const isRequestComplete = React.useMemo(() => {
    if (requestType === "oneOnOneTraining") {
      return Boolean(trainingPackage)
        && selectedTopicKeys.length > 0
        && selectedTopicKeys.every((topic) => topicFocusSelections[topic].length > 0);
    }

    if (requestType === "projectFeedback") {
      return Boolean(projectFeedbackPackage) && Boolean(projectFeedbackDaw) && projectFeedbackSelections.length > 0;
    }

    return false;
  }, [
    projectFeedbackDaw,
    projectFeedbackPackage,
    projectFeedbackSelections.length,
    requestType,
    selectedTopicKeys,
    topicFocusSelections,
    trainingPackage,
  ]);

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
      lines.push(`Training format: ${trainingPackage || "—"}`);
      lines.push(`Recorded session add-on: ${trainingRecordingRequested ? "Yes" : "No"}`);
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
      lines.push(`Walkthrough format: ${projectFeedbackPackage || "—"}`);
      lines.push(`DAW: ${projectFeedbackDaw || "—"}`);
      lines.push("");
      lines.push("Walkthrough focus:");
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
      subject: `Service Request — ${REQUEST_TYPE_LABELS[requestType]}`,
      summaryText: lines.join("\n"),
    };
  }, [
    additionalNotes,
    projectFeedbackDaw,
    projectFeedbackPackage,
    projectFeedbackSelections,
    requestType,
    selectedTopicKeys,
    topicFocusSelections,
    trainingPackage,
    trainingRecordingRequested,
  ]);

  const canRequestPackage = currentStep.id === "review" && isRequestComplete && Boolean(requestPackage.summaryText);

  function updateRequestType(nextValue: RequestType) {
    setRequestType(nextValue);
    setCurrentStepIndex(0);
    setTrainingPackage("");
    setTrainingRecordingRequested(false);
    setProjectFeedbackPackage("");

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
        [topic]: checked ? [...current, focusArea] : current.filter((entry) => entry !== focusArea),
      };
    });
  }

  function toggleProjectFeedbackSelection(selection: string, checked: boolean) {
    setProjectFeedbackSelections((prev) =>
      checked ? [...prev, selection] : prev.filter((entry) => entry !== selection)
    );
  }

  const summary = (
    <PackageSummaryCard
      title="Request Summary"
      totalLabel="Pricing"
      total="Custom quote after review"
      canRequestPackage={canRequestPackage}
      requestPackage={requestPackage}
      requestButtonLabel={requestType === "projectFeedback" ? "Request Project Feedback" : "Request Training"}
      requestDialogTitle={requestType === "projectFeedback" ? "Request Project Feedback" : "Request Training"}
      requestDialogDescription="Enter your name + email, and I'll receive your request details so I can review the scope and follow up with the best next step."
      downloadFilePrefix="training-request"
    >
      <ul className="text-sm space-y-2">
        <li>Request: {requestType ? REQUEST_TYPE_LABELS[requestType] : "—"}</li>

        {requestType === "oneOnOneTraining" && (
          <>
            <li>Format: {trainingPackage || "—"}</li>
            <li>
              Topics: {selectedTopicKeys.length > 0 ? selectedTopicKeys.map((topic) => trainingBuilderTopics[topic].label).join(", ") : "—"}
            </li>
            <li>Recorded session add-on: {trainingRecordingRequested ? "Yes" : "No"}</li>
            {selectedTopicKeys.map((topic) => (
              <li key={topic}>
                {trainingBuilderTopics[topic].label}: {topicFocusSelections[topic].length > 0 ? topicFocusSelections[topic].join("; ") : "—"}
              </li>
            ))}
          </>
        )}

        {requestType === "projectFeedback" && (
          <>
            <li>Walkthrough: {projectFeedbackPackage || "—"}</li>
            <li>DAW: {projectFeedbackDaw || "—"}</li>
            <li>
              Focus: {projectFeedbackSelections.length > 0 ? projectFeedbackSelections.join(", ") : "—"}
            </li>
          </>
        )}

        <li>Notes: {additionalNotes.trim() || "—"}</li>
      </ul>
    </PackageSummaryCard>
  );

  return (
    <BuilderShell summary={summary}>
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
              Select one or more training areas, then choose the specific focus areas for each one.
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

        {currentStep.id === "trainingPackage" && (
          <div className="rounded-lg border border-border p-4 space-y-5">
            <div className="space-y-3">
              {packageOptions.map((option) => (
                <label key={option.title} className="flex items-start gap-3 rounded-md border border-border p-4 text-sm">
                  <input
                    type="radio"
                    name="training-package"
                    checked={trainingPackage === option.title}
                    onChange={() => setTrainingPackage(option.title)}
                  />
                  <span className="space-y-1">
                    <span className="block font-medium">{option.title}</span>
                    <span className="block text-muted-foreground">{option.description}</span>
                    <span className="block text-xs text-primary">{option.fit}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="rounded-md border border-border bg-muted/40 p-4 space-y-3">
              <div className="text-sm font-medium">Optional add-on</div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={trainingRecordingRequested}
                  onChange={(e) => setTrainingRecordingRequested(e.target.checked)}
                />
                <span className="space-y-1">
                  <span className="block font-medium">{trainingRecordingAddOn.label}</span>
                  <span className="block text-muted-foreground">{trainingRecordingAddOn.description}</span>
                </span>
              </label>
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
                    onChange={(e) => toggleTopicFocusArea(currentStep.id as TrainingTopicKey, focusArea, e.target.checked)}
                  />
                  <span>{focusArea}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep.id === "projectFeedbackPackage" && (
          <div className="rounded-lg border border-border p-4 space-y-5">
            <div className="space-y-3">
              {feedbackPackageOptions.map((option) => (
                <label key={option.title} className="flex items-start gap-3 rounded-md border border-border p-4 text-sm">
                  <input
                    type="radio"
                    name="project-feedback-package"
                    checked={projectFeedbackPackage === option.title}
                    onChange={() => setProjectFeedbackPackage(option.title)}
                  />
                  <span className="space-y-1">
                    <span className="block font-medium">{option.title}</span>
                    <span className="block text-muted-foreground">{option.description}</span>
                    <span className="block text-xs text-primary">{option.fit}</span>
                  </span>
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
              <div className="text-sm font-medium">What should I focus on during the walkthrough?</div>
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
                placeholder="Anything else you'd like me to know about your goals, current skill level, project scope, or timeline?"
              />
            </div>
          </div>
        )}

        <BuilderStepFooter
          currentStep={currentStepIndex + 1}
          totalSteps={totalSteps}
          onBack={goToPreviousStep}
          backDisabled={isFirstStep}
          nextDisabled={!isCurrentStepComplete}
          hideNext={currentStep.id === "review"}
          {...(currentStep.id !== "review" ? { onNext: goToNextStep } : {})}
        />
      </section>
    </BuilderShell>
  );
}
