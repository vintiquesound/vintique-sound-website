import { REPAIR_SERVICE_PER_TRACK_CAD_CENTS, cadCentsToDollars } from "@/lib/pricing/catalog";
import AudioTrackServiceBuilder from "@/components/package-builder/builders/AudioTrackServiceBuilder";
import { REPAIR_SERVICE_NOTE_PLACEHOLDERS } from "@/components/package-builder/config/service-note-placeholders";

export type AudioRepairBuilderProps = {
  onChangeCategory?: () => void;
};

type ServiceKey = keyof typeof REPAIR_SERVICE_NOTE_PLACEHOLDERS;

const SERVICE_DEFINITIONS: Array<{ key: ServiceKey; label: string; notePlaceholder: string }> = [
  {
    key: "clippingRepair",
    label: "Clipping repair",
    notePlaceholder: REPAIR_SERVICE_NOTE_PLACEHOLDERS.clippingRepair,
  },
  {
    key: "clicksPopsRemoval",
    label: "Clicks / pops removal",
    notePlaceholder: REPAIR_SERVICE_NOTE_PLACEHOLDERS.clicksPopsRemoval,
  },
  {
    key: "hissRemoval",
    label: "Hiss removal",
    notePlaceholder: REPAIR_SERVICE_NOTE_PLACEHOLDERS.hissRemoval,
  },
  {
    key: "cracklingRemoval",
    label: "Crackling removal",
    notePlaceholder: REPAIR_SERVICE_NOTE_PLACEHOLDERS.cracklingRemoval,
  },
  {
    key: "plosiveReduction",
    label: "Plosive reduction",
    notePlaceholder: REPAIR_SERVICE_NOTE_PLACEHOLDERS.plosiveReduction,
  },
  {
    key: "reverbReduction",
    label: "Reverb reduction",
    notePlaceholder: REPAIR_SERVICE_NOTE_PLACEHOLDERS.reverbReduction,
  },
];

const PER_SERVICE_BASE = cadCentsToDollars(REPAIR_SERVICE_PER_TRACK_CAD_CENTS.hissRemoval);

export default function AudioRepairBuilder({ onChangeCategory }: AudioRepairBuilderProps) {
  return (
    <AudioTrackServiceBuilder
      onChangeCategory={onChangeCategory}
      perServiceBase={PER_SERVICE_BASE}
      serviceDefinitions={SERVICE_DEFINITIONS}
      copy={{
        stepTitles: {
          tracks: "Tracks",
          details: "Track Length",
          services: "Audio Repair Services",
          extras: "Extras",
        },
        stepDescriptions: {
          tracks: "Set how many tracks need repair.",
          details: "Set the typical length for each track so pricing can include the correct surcharge.",
          services: `Audio repair pricing is per track. Each enabled service adds a base service price plus any length surcharge.`,
          extras: "Add optional rush turnaround or extended revision coverage.",
        },
        trackCountLabel: "How many tracks need repair?",
        trackNamePlaceholder: "Example: Track 2 — Verse",
        noteLabel: "Notes / track names",
        requestServiceName: "Audio Repair",
        requestSubject: "Package Request — Audio Repair",
      }}
    />
  );
}
