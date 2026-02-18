import { REPAIR_SERVICE_PER_TRACK_CAD_CENTS } from "src/lib/pricing/catalog.ts";

export const services = [
  {
    title: "Clipping Repair",
    description:
      "Repair clipped peaks and distortion artifacts to recover clarity while preserving musical dynamics.",
    features: [
      "Digital clipping detection and restoration",
      "Targeted repair of overloaded sections",
      "Level balancing to prevent recurring overload",
    ],
    priceCadCents: REPAIR_SERVICE_PER_TRACK_CAD_CENTS.clippingRepair,
    color: "primary",
  },
  {
    title: "Clicks & Pops Removal",
    description:
      "Remove transient clicks, pops, and digital glitches for cleaner playback.",
    features: [
      "Manual click and pop removal",
      "De-click processing for noisy passages",
      "Artifact control with transparent correction",
    ],
    priceCadCents: REPAIR_SERVICE_PER_TRACK_CAD_CENTS.clicksPopsRemoval,
    color: "primary",
    badge: "Most Popular",
  },
  {
    title: "Hiss Removal",
    description:
      "Reduce broadband hiss from recordings while protecting tone and detail.",
    features: [
      "Noise print capture and reduction",
      "Section-based processing for consistency",
      "Preservation of high-frequency clarity",
    ],
    priceCadCents: REPAIR_SERVICE_PER_TRACK_CAD_CENTS.hissRemoval,
    color: "secondary",
  },
  {
    title: "Crackling Removal",
    description:
      "Repair intermittent crackle and static artifacts for a smoother listening experience.",
    features: [
      "Crackle pattern detection and cleanup",
      "Problem-area restoration by hand",
      "Artifact checks before final delivery",
    ],
    priceCadCents: REPAIR_SERVICE_PER_TRACK_CAD_CENTS.cracklingRemoval,
    color: "secondary",
  },
  {
    title: "Plosive Reduction",
    description:
      "Tame excessive plosives and low-end bursts in vocals and spoken-word recordings.",
    features: [
      "P-pop and breath burst control",
      "Low-frequency transient smoothing",
      "Natural vocal tone preservation",
    ],
    priceCadCents: REPAIR_SERVICE_PER_TRACK_CAD_CENTS.plosiveReduction,
    color: "accent",
  },
  {
    title: "Reverb Reduction",
    description:
      "Reduce excessive room reverb to improve intelligibility and focus.",
    features: [
      "De-reverb treatment for room-heavy recordings",
      "Dialogue and vocal clarity enhancement",
      "Balance between dryness and natural ambience",
    ],
    priceCadCents: REPAIR_SERVICE_PER_TRACK_CAD_CENTS.reverbReduction,
    color: "accent",
  },
];

export const idealClients = [
  {
    icon: "lucide:user",
    title: "Independent Artists",
    description:
      "Musicians who need damaged takes restored before release, mixing, or mastering.",
  },
  {
    icon: "lucide:mic",
    title: "Vocalists",
    description:
      "Singers and voice artists who want cleaner vocal tracks with fewer distractions.",
  },
  {
    icon: "lucide:headphones",
    title: "Producers & Engineers",
    description:
      "Creators who need specialized cleanup support to keep productions moving.",
  },
  {
    icon: "lucide:video",
    title: "Content Creators",
    description:
      "Podcasters, YouTubers, and media teams improving spoken-word and recorded content.",
  },
  {
    icon: "lucide:building-2",
    title: "Studios & Agencies",
    description:
      "Production teams outsourcing repair work for deadlines and quality consistency.",
  },
];

export const processSteps = [
  {
    icon: "lucide:upload",
    title: "Project Upload",
    description:
      "Upload your Cubase, Ableton, or Bitwig project (or consolidated audio files) through my secure transfer system.",
  },
  {
    icon: "lucide:list-music",
    title: "Review",
    description:
      "I analyze the audio, identify artifacts, and choose the best repair approach.",
  },
  {
    icon: "lucide:audio-lines",
    title: "Audio Repair",
    description:
      "Targeted repair is applied to remove problems while preserving the original tone. A high-quality preview is uploaded for feedback.",
  },
  {
    icon: "lucide:rotate-ccw",
    title: "Revisions & Feedback",
    description:
      "You can request adjustments. Up to 3 revisions are included. I refine the repairs until they feel right to you.",
  },
  {
    icon: "lucide:download",
    title: "Final Delivery",
    description:
      "Download the repaired files in your requested format, ready for production or release.",
  },
];

export type TechnicalDetailsCardBase = {
  icon: string;
  iconClassName: string;
  title: string;
  contentClassName: string;
};

export const technicalDetails = {
  acceptedFormats: {
    icon: "lucide:upload",
    iconClassName: "text-primary",
    title: "Accepted Formats",
    contentClassName: "space-y-3",
    audioFiles: [
      "WAV, FLAC, or AIFF (FLAC preferred)",
      "16-bit / 44.1kHz or higher",
      "Mono, stereo, or stem files",
    ],
    recommendations: [
      "24-bit / 48kHz for best results",
      "Avoid additional processing before export",
      "Provide timestamps and notes for known problem sections",
    ],
  },

  deliveryFormats: {
    icon: "lucide:download",
    iconClassName: "text-primary",
    title: "Delivery Formats",
    contentClassName: "space-y-3",
    standardDelivery: [
      "WAV (24-bit / 44.1kHz or 48kHz)",
      "Custom bit/sample rates and file formats available upon request",
    ],
    customDelivery: [
      "WAV, FLAC, and AIFF (lossless formats)",
      "16-bit to 32-bit fixed point",
      "From 44.1kHz to 96kHz",
      "And more!",
    ],
  },

  qualityStandards: {
    icon: "lucide:shield-check",
    iconClassName: "text-accent",
    title: "Quality Standards",
    contentClassName: "space-y-2",
    editing: [
      "Artifact-focused repair without over-processing",
      "Manual spot-fixes for critical issues and exposed passages",
      "Noise-floor and tonal consistency checks from start to finish",
      "Pre-delivery quality checks to ensure clean, usable files",
    ],
  },

  turnaroundRevisions: {
    icon: "lucide:rotate-ccw",
    iconClassName: "text-secondary",
    title: "Turnaround & Revisions",
    contentClassName: "space-y-2",
    timeframes: [
      { label: "Single Repair (per track):", value: "2-3 business days" },
      { label: "Full Suite of Repairs:", value: "3-5 business days" },
    ],
    additionalAddons: [
      "Rush service for 2-day delivery (additional fee).",
      "Unlimited revisions within 1 month of project start date (additional fee).",
    ],
  },
} as const;
