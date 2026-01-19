export const services = [
  {
    title: "Time Alignment & Comping",
    description:
      "Align vocals, drums, and other tracks precisely with the beat, ensuring a tight rhythmic foundation.",
    features: [
      "Beat-mapping and grid locking",
      "Phase-coherent multi-track alignment",
      "Dynamic timing adjustment where needed",
      "Comping of vocal and/or instrument tracks",
    ],
    price: "from $10 per track",
    color: "primary",
  },
  {
    title: "Pitch Correction & Tuning",
    description:
      "Subtle pitch correction to tighten vocals and instruments while maintaining natural expression.",
    features: [
      "AutoTune or Melodyne tuning",
      "Manual pitch correction",
      "Vibrato and formant preservation",
      "Stem-wise tuning for multi-instrument projects",
    ],
    price: "from $10 per track",
    color: "secondary",
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
    price: "from $10 per track",
    color: "accent",
  },
  {
    title: "Full Edit Package",
    description:
      "Everything from time alignment, tuning, and cleanup for the entire project.",
    features: [
      "All of the above services",
      "Up to 3 revisions included",
      "Fast turnaround (depends on complexity)",
    ],
    price: "from $25",
    color: "primary",
    badge: "Best Value",
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
      "Upload your Cubase, Ableton, or Bitwig project (or consolidated audio files) through my secure transfer system.",
  },
  {
    icon: "lucide:list-music",
    title: "Review",
    description:
      "I carefully review each track, noting issues, targets, and editing goals.",
  },
  {
    icon: "lucide:audio-lines",
    title: "Editing",
    description:
      "Precision editing with minimal side-effects to preserve sound quality. A high-quality preview is uplaoded for feedback.",
  },
  {
    icon: "lucide:rotate-ccw",
    title: "Revisions & Feedback",
    description:
      "You can request changes. Up to 3 revisions are included. I refine the edits until they feel right to you.",
  },
  {
    icon: "lucide:download",
    title: "Final Delivery",
    description:
      "Dowanload your finished files in whatever formats you specify in your package. All finished files are ready for your project."
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
      "Individual tracks or stems",
    ],
    recommendations: [
      "24-bit / 48kHz for best results",
      "Leave 3-6 dB of headroom",
      "Provide clear and descriptive notes on what needs editing and how you want it improved",
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
      { label: "Edit (single track):", value: "2-3 business days" },
      { label: "Full Edit Package:", value: "3-5 business days" },
    ],
    additionalAddons: [
      "Rush service for 24 hours delivery (additional fee).",
      "Unlimited revisions within 1 month of project start date (additional fee).",
    ],
  },
} as const;
