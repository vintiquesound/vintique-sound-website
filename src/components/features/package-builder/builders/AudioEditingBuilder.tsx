import { EDITING_SERVICE_PER_TRACK_CAD_CENTS, cadCentsToDollars } from "@/lib/pricing/catalog";
import AudioTrackServiceBuilder from "@/components/features/package-builder/builders/AudioTrackServiceBuilder";
import { EDITING_SERVICE_NOTE_PLACEHOLDERS } from "@/components/features/package-builder/config/service-note-placeholders";

export type AudioEditingBuilderProps = {
  onChangeCategory?: () => void;
};

type ServiceKey = keyof typeof EDITING_SERVICE_NOTE_PLACEHOLDERS;

const SERVICE_DEFINITIONS: Array<{ key: ServiceKey; label: string; notePlaceholder: string }> = [
  {
    key: "timeAlignment",
    label: "Time alignment",
    notePlaceholder: EDITING_SERVICE_NOTE_PLACEHOLDERS.timeAlignment,
  },
  {
    key: "comping",
    label: "Comping",
    notePlaceholder: EDITING_SERVICE_NOTE_PLACEHOLDERS.comping,
  },
  {
    key: "vocalTuning",
    label: "Vocal tuning",
    notePlaceholder: EDITING_SERVICE_NOTE_PLACEHOLDERS.vocalTuning,
  },
  {
    key: "instrumentTuning",
    label: "Instrument tuning",
    notePlaceholder: EDITING_SERVICE_NOTE_PLACEHOLDERS.instrumentTuning,
  },
  {
    key: "cleanupNoiseRemoval",
    label: "Cleanup / noise removal",
    notePlaceholder: EDITING_SERVICE_NOTE_PLACEHOLDERS.cleanupNoiseRemoval,
  },
];

const PER_SERVICE_BASE = cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.timeAlignment);

export default function AudioEditingBuilder({ onChangeCategory }: AudioEditingBuilderProps) {
  return (
    <AudioTrackServiceBuilder
      onChangeCategory={onChangeCategory}
      perServiceBase={PER_SERVICE_BASE}
      serviceDefinitions={SERVICE_DEFINITIONS}
      copy={{
        stepTitles: {
          tracks: "Tracks",
          details: "Track Length",
          services: "Editing Services",
          extras: "Extras",
        },
        stepDescriptions: {
          tracks: "Set how many tracks need editing.",
          details: "Set the typical length for each track so pricing can include the correct surcharge.",
          services: `Audio editing pricing is per track. Each enabled service adds a base service price plus any length surcharge.`,
          extras: "Add optional rush turnaround or extended revision coverage.",
        },
        trackCountLabel: "How many tracks need editing?",
        trackNamePlaceholder: "Example: Track 1 — Intro",
        noteLabel: "Notes",
        requestServiceName: "Audio Editing",
        requestSubject: "Package Request — Audio Editing",
      }}
    />
  );
}
