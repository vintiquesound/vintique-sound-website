import { EDITING_SERVICE_PER_TRACK_CAD_CENTS } from "@/lib/pricing/catalog";

export const services = [
  {
    title: "Time Alignment",
    description:
      "Align vocals, drums, and other tracks precisely with the beat, ensuring a tight rhythmic foundation.",
    features: [
      "Beat-mapping and grid locking",
      "Phase-coherent multi-track alignment",
      "Dynamic timing adjustment where needed",
    ],
    priceCadCents: EDITING_SERVICE_PER_TRACK_CAD_CENTS.timeAlignment,
    color: "primary",
  },
  {
    title: "Comping",
    description:
      "Align vocals, drums, and other tracks precisely with the beat, ensuring a tight rhythmic foundation.",
    features: [
      "Comping of vocal and/or instrument tracks",
      "Selecting the best takes for each track",
    ],
    priceCadCents: EDITING_SERVICE_PER_TRACK_CAD_CENTS.comping,
    color: "primary",
  },
  {
    title: "Instrument Pitch Correction",
    description:
      "Subtle pitch correction to instruments while maintaining natural expression.",
    features: [
      "Cubase VariAudio or Melodyne pitch correction",
      "Manual pitch correction",
      "Vibrato and formant preservation",
      "Stem-wise tuning for multi-instrument projects",
    ],
    priceCadCents: EDITING_SERVICE_PER_TRACK_CAD_CENTS.instrumentTuning,
    color: "secondary",
  },
  {
    title: "Vocal Tuning",
    description:
      "Subtle tuning to tighten vocals while maintaining natural expression.",
    features: [
      "Cubase VariAudio or Melodyne tuning",
      "Manual pitch correction",
      "Vibrato and formant preservation",
      "Stem-wise tuning for multi-instrument projects",
    ],
    priceCadCents: EDITING_SERVICE_PER_TRACK_CAD_CENTS.vocalTuning,
    color: "secondary",
    badge: "Most Popular",
  },
  {
    title: "Cleanup & Noise Removal",
    description:
      "Remove bleed, unwanted noise, plosives, clicks, and pops to improve audio clarity.",
    features: [
      "Silence trimming and editing",
      "Removal of bleed from other instruments",
      "Noise reduction (plosives, clicks, pops, hum, and hiss)",
      "Transient repair",
    ],
    priceCadCents: EDITING_SERVICE_PER_TRACK_CAD_CENTS.cleanupNoiseRemoval,
    color: "accent",
  },
];

export const idealClients = [
  {
    icon: "lucide:user",
    title: "Independent Artists",
    description:
      "Musicians releasing their own music who want professional-quality results without a label budget",
  },
  {
    icon: "lucide:headphones",
    title: "Music Producers",
    description:
      "Producers who want an experienced engineer's perspective on their productions",
  },
  {
    icon: "lucide:drum",
    title: "Bands",
    description:
      "Groups working on EPs, albums, or singles who need consistent, professional sound",
  },
  {
    icon: "lucide:speaker",
    title: "Studios & Engineers",
    description:
      "Other studios outsourcing editing or seeking a second opinion",
  },
  {
    icon: "lucide:video",
    title: "Content Creators",
    description:
      "Podcasters, YouTubers, and media creators who need audio post-production",
  },
];

export const processSteps = [
  {
    icon: "lucide:upload",
    title: "Project Upload",
    description:
      // "Upload your Cubase, Ableton, or Bitwig project (or consolidated audio files) through my secure transfer system.",
      "Upload your Cubase, Ableton, or Bitwig project (or consolidated audio files) through my secure transfer system.",
  },
  {
    icon: "lucide:list-music",
    title: "Initial Review",
    description:
      "I carefully review each track, noting issues, targets, and editing goals.",
  },
  {
    icon: "lucide:audio-lines",
    title: "Audio Editing",
    description:
      "Precision editing with minimal side-effects to preserve sound quality. A high-quality preview is uploaded for feedback.",
  },
  {
    icon: "lucide:rotate-ccw",
    title: "Revisions & Feedback",
    description:
      "You can request adjustments. Up to 3 revisions are included. I refine the edits until they feel right to you.",
  },
  {
    icon: "lucide:download",
    title: "Final Delivery",
    description:
      "Download the edited files in your requested format, ready for production or release."
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
      "Provide timestamps and notes on what needs editing and how you want it improved",
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
    icon: "lucide:waves",
    iconClassName: "text-accent",
    title: "Quality Standards",
    contentClassName: "space-y-2",
    editing: [
      "Phase-coherent multitrack time alignment of drums and other multi-track recordings",
      "Comping of multiple vocal or instrument takes to craft the best performance",
      "Precision pitch correction using Cubase's VariAudio or Melodyne while preserving natural expression",
      "Pre‑delivery quality checks to catch artifacts and ensure pristine edits",
    ],
  },

  turnaroundRevisions: {
    icon: "lucide:rotate-ccw",
    iconClassName: "text-secondary",
    title: "Turnaround & Revisions",
    contentClassName: "space-y-2",
    timeframes: [
      { label: "Single Edit (per track):", value: "2-3 business days" },
      { label: "Full Suite of Edits:", value: "3-5 business days" },
    ],
    additionalAddons: [
      "Rush service for 2-day delivery (additional fee).",
      "Unlimited revisions within 1 month of project start date (additional fee).",
    ],
  },
} as const;
