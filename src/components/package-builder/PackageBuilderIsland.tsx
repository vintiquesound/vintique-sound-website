import * as React from "react";

import MixingAndMasteringBuilder from "@/components/package-builder/builders/MixingAndMasteringBuilder";
import AudioEditingBuilder from "@/components/package-builder/builders/AudioEditingBuilder";
import AudioRepairBuilder from "@/components/package-builder/builders/AudioRepairBuilder";
import TrainingBuilder from "@/components/package-builder/builders/TrainingBuilder";
import ChangeCategoryButton from "@/components/package-builder/components/ChangeCategoryButton";

type BuilderGroup = "audio" | "training";
type AudioCategory = "mixingAndMastering" | "audioEditing" | "audioRepair";
type TrainingCategory = "oneOnOneTraining" | "projectFeedback";
type BuilderCategory = AudioCategory | TrainingCategory;

const GROUP_TO_HASH: Record<BuilderGroup, string> = {
  audio: "audio-services",
  training: "training",
};

const HASH_GROUP_TO_KEY: Record<string, BuilderGroup> = {
  audio: "audio",
  "audio-services": "audio",
  training: "training",
  education: "training",
};

const AUDIO_CATEGORY_HASH_TO_KEY: Record<string, AudioCategory> = {
  "mixing-and-mastering": "mixingAndMastering",
  "audio-editing": "audioEditing",
  "audio-repair": "audioRepair",
};

const TRAINING_CATEGORY_HASH_TO_KEY: Record<string, TrainingCategory> = {
  "one-on-one-training": "oneOnOneTraining",
  "project-feedback": "projectFeedback",
};

const CATEGORY_TO_HASH: Record<BuilderCategory, string> = {
  mixingAndMastering: "mixing-and-mastering",
  audioEditing: "audio-editing",
  audioRepair: "audio-repair",
  oneOnOneTraining: "one-on-one-training",
  projectFeedback: "project-feedback",
};

const GROUP_META: Record<BuilderGroup, { title: string; description: string }> = {
  audio: {
    title: "Audio Engineering Services",
    description: "Build a custom package for mixing & mastering, audio editing, or audio repair.",
  },
  training: {
    title: "1-on-1 Training",
    description: "Build a tailored request for 1-on-1 training or project feedback.",
  },
};

const AUDIO_CATEGORY_META: Record<AudioCategory, { title: string; description: string; badge?: string }> = {
  mixingAndMastering: {
    title: "Mixing & Mastering",
    description: "Full package builder for singles/albums, editing add-ons, exports, and extras.",
    badge: "Most Popular",
  },
  audioEditing: {
    title: "Audio Editing",
    description: "Per-track editing services with track-length surcharges and extras.",
  },
  audioRepair: {
    title: "Audio Repair",
    description: "Per-track repair services (hiss, clicks/pops, etc.) with track-length surcharges and extras.",
  },
};

const TRAINING_CATEGORY_META: Record<TrainingCategory, { title: string; description: string; badge?: string }> = {
  oneOnOneTraining: {
    title: "One-on-One Training",
    description: "Build a tailored private coaching request for Cubase, mixing, mastering, and workflow development.",
    badge: "Most Popular",
  },
  projectFeedback: {
    title: "Project Feedback",
    description: "Request focused feedback on your mix, master, production choices, and next-step improvements.",
  },
};

function parseGroup(value: string | null): BuilderGroup | null {
  if (value === "audio" || value === "training") return value;
  return null;
}

export default function PackageBuilderIsland() {
  const [lockedGroup, setLockedGroup] = React.useState<BuilderGroup | null>(null);
  const [activeGroup, setActiveGroup] = React.useState<BuilderGroup | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<BuilderCategory | null>(null);

  const updateUrl = React.useCallback((group: BuilderGroup | null, category: BuilderCategory | null) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.delete("group");
    url.hash = category ? CATEGORY_TO_HASH[category] : group ? GROUP_TO_HASH[group] : "";
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const syncStateFromLocation = React.useCallback(() => {
    const requestedGroup = parseGroup(new URLSearchParams(window.location.search).get("group"));
    const hash = window.location.hash.replace(/^#/, "").trim().toLowerCase();
    const hashGroup = HASH_GROUP_TO_KEY[hash];
    const audioCategory = AUDIO_CATEGORY_HASH_TO_KEY[hash];
    const trainingCategory = TRAINING_CATEGORY_HASH_TO_KEY[hash];
    const resolvedGroup = requestedGroup ?? hashGroup ?? (audioCategory ? "audio" : trainingCategory ? "training" : null);

    setLockedGroup(requestedGroup ?? hashGroup ?? null);

    if (!resolvedGroup) {
      setActiveGroup(null);
      setActiveCategory(null);
      return;
    }

    setActiveGroup(resolvedGroup);

    if (resolvedGroup === "audio") {
      setActiveCategory(audioCategory ?? null);
      return;
    }

    setActiveCategory(trainingCategory ?? null);
  }, []);

  React.useEffect(() => {
    syncStateFromLocation();
    window.addEventListener("hashchange", syncStateFromLocation);

    return () => {
      window.removeEventListener("hashchange", syncStateFromLocation);
    };
  }, [syncStateFromLocation]);

  const selectGroup = React.useCallback(
    (group: BuilderGroup) => {
      setActiveGroup(group);

      if (group === "audio") {
        setActiveCategory(null);
        updateUrl(group, null);
        return;
      }

      setActiveCategory(null);
      updateUrl(group, null);
    },
    [updateUrl]
  );

  const selectAudioCategory = React.useCallback(
    (category: AudioCategory) => {
      setActiveGroup("audio");
      setActiveCategory(category);
      updateUrl(lockedGroup ?? "audio", category);
    },
    [lockedGroup, updateUrl]
  );

  const selectTrainingCategory = React.useCallback(
    (category: TrainingCategory) => {
      setActiveGroup("training");
      setActiveCategory(category);
      updateUrl(lockedGroup ?? "training", category);
    },
    [lockedGroup, updateUrl]
  );

  const onChangeCategory = React.useCallback(() => {
    const parentGroup = lockedGroup ?? activeGroup;

    if (parentGroup === "audio") {
      setActiveGroup("audio");
      setActiveCategory(null);
      updateUrl("audio", null);
      return;
    }

    if (parentGroup === "training") {
      setActiveGroup("training");
      setActiveCategory(null);
      updateUrl("training", null);
      return;
    }

    setActiveGroup(null);
    setActiveCategory(null);
    updateUrl(null, null);
  }, [activeGroup, lockedGroup, updateUrl]);

  const currentCategoryMeta = activeCategory
    ? activeCategory in TRAINING_CATEGORY_META
      ? TRAINING_CATEGORY_META[activeCategory as TrainingCategory]
      : AUDIO_CATEGORY_META[activeCategory as AudioCategory]
    : null;

  const showChangeCategoryButton = Boolean(activeCategory && (activeGroup === "audio" || lockedGroup !== "training"));

  return (
    <div className="space-y-6">
      {!activeGroup && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Choose a builder</h2>
            <p className="text-muted-foreground">
              Start by selecting whether you want an audio service package or a training request.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(GROUP_META) as BuilderGroup[]).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => selectGroup(group)}
                className="rounded-xl border border-border p-5 text-left hover:bg-muted/40 hover:border-primary cursor-pointer transition"
              >
                <div className="space-y-1">
                  <div className="font-semibold">{GROUP_META[group].title}</div>
                  <div className="text-sm text-muted-foreground">{GROUP_META[group].description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeGroup === "audio" && !activeCategory && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Choose an audio service</h2>
            <p className="text-muted-foreground">
              Start by selecting the type of audio service you want to price out.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(Object.keys(AUDIO_CATEGORY_META) as AudioCategory[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => selectAudioCategory(key)}
                className="relative rounded-xl border border-border p-5 text-left hover:bg-muted/40 hover:border-primary cursor-pointer transition"
              >
                {AUDIO_CATEGORY_META[key].badge && (
                  <span className="absolute -top-3 right-4 z-10 inline-block rounded-md bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    {AUDIO_CATEGORY_META[key].badge}
                  </span>
                )}
                <div className="space-y-1">
                  <div className="font-semibold">{AUDIO_CATEGORY_META[key].title}</div>
                  <div className="text-sm text-muted-foreground">{AUDIO_CATEGORY_META[key].description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeGroup === "training" && !activeCategory && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Choose a training service</h2>
            <p className="text-muted-foreground">
              Start by selecting whether you want private 1-on-1 training or detailed project feedback.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(TRAINING_CATEGORY_META) as TrainingCategory[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => selectTrainingCategory(key)}
                className="relative rounded-xl border border-border p-5 text-left hover:bg-muted/40 hover:border-primary cursor-pointer transition"
              >
                {TRAINING_CATEGORY_META[key].badge && (
                  <span className="absolute -top-3 right-4 z-10 inline-block rounded-md bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    {TRAINING_CATEGORY_META[key].badge}
                  </span>
                )}
                <div className="space-y-1">
                  <div className="font-semibold">{TRAINING_CATEGORY_META[key].title}</div>
                  <div className="text-sm text-muted-foreground">{TRAINING_CATEGORY_META[key].description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeCategory && currentCategoryMeta && (
        <div className="space-y-2">
          {showChangeCategoryButton && <ChangeCategoryButton onClick={onChangeCategory} />}
          <h2 className="text-2xl font-semibold">{currentCategoryMeta.title}</h2>
          <p className="text-sm text-muted-foreground">{currentCategoryMeta.description}</p>
        </div>
      )}

      <div className={activeCategory ? "block" : "hidden"}>
        <div className={activeCategory === "mixingAndMastering" ? "block" : "hidden"}>
          <MixingAndMasteringBuilder onChangeCategory={onChangeCategory} />
        </div>
        <div className={activeCategory === "audioEditing" ? "block" : "hidden"}>
          <AudioEditingBuilder onChangeCategory={onChangeCategory} />
        </div>
        <div className={activeCategory === "audioRepair" ? "block" : "hidden"}>
          <AudioRepairBuilder onChangeCategory={onChangeCategory} />
        </div>
        <div className={activeCategory === "oneOnOneTraining" || activeCategory === "projectFeedback" ? "block" : "hidden"}>
          <TrainingBuilder
            key={activeCategory}
            onChangeCategory={onChangeCategory}
            initialRequestType={activeCategory === "projectFeedback" ? "projectFeedback" : "oneOnOneTraining"}
          />
        </div>
      </div>
    </div>
  );
}
