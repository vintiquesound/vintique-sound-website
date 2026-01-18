export const services = [
  {
    title: "Mixing",
    description:
      "Transform your individual tracks into a cohesive, balanced, and polished song. Mixing involves level balancing, EQ, compression, spatial placement, and creative effects.",
    features: [
      "Multi-track level balancing",
      "EQ and frequency management",
      "Dynamic processing (compression, limiting)",
      "Spatial placement and depth",
      "Creative effects and automation",
      "Detailed mix referencing and quality checks",
    ],
    price: "from $200",
    color: "primary",
  },
  {
    title: "Mastering",
    description:
      "The final polish that ensures your mixed track sounds professional across all playback systems.",
    features: [
      "Final EQ and tonal balance",
      "Compression and limiting",
      "Loudness optimization (LUFS)",
      "Stereo width enhancement",
      "Multiple format delivery",
      "Platform-specific masters available",
    ],
    price: "from $30",
    color: "secondary",
  },
  {
    title: "Mix + Master Package",
    description:
      "Complete audio production from raw tracks to release-ready masters. You get everything that's included in the mixing and mastering packages.",
    features: [
      "Everything in Mixing",
      "Everything in Mastering",
      "3 mix revisions and 3 mastering revisions included",
      "Mix decisions made with final master in mind",
      "Fewer revisions due to end-to-end consistency",
      "Best overall value for full production",
    ],
    price: "from $220",
    color: "accent",
    badge: "Best Value",
  },
  {
    title: "Stem Mastering",
    description:
      "Master your song using individual stems for more control while maintaining cohesion from an existing mix.",
    features: [
      "Enhanced control over mix elements",
      "Targeted processing per stem",
      "Maintains mix cohesion",
      "Greater flexibility than stereo mastering",
      "Ideal for EDM and hip-hop",
      "Available for up to 12 stems",
    ],
    price: "from $80",
    color: "primary",
  },
];

export const genreExperience = [
  {
    genre: "Rock & Alternative",
    description: "Punchy drums, controlled dynamics, and natural energy.",
    subgenres: "Indie, post-rock, classic-inspired productions.",
  },
  {
    genre: "Indie & Acoustic",
    description: "Clarity, texture, warmth, and emotional balance.",
    subgenres: "Acoustic, singer-songwriter, minimal arrangements.",
  },
  {
    genre: "Hip Hop & Rap",
    description: "Hard-hitting low end, vocal presence, and translation.",
    subgenres: "Boom bap, 90s/2000s-inspired, modern hybrid styles.",
  },
  {
    genre: "Electronic",
    description: "Tight low-end, clean transients, and club-ready loudness.",
    subgenres: "House, bass-driven, experimental electronic.",
  },
  {
    genre: "Classical & Orchestral",
    description: "Natural tone, depth, and dynamic integrity.",
    subgenres: "Solo piano, full orchestral, symphonic works.",
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
    title: "Initial Review",
    description:
      "I carefully review your files, reference tracks, and notes to fully understand your sound and goals with the project.",
  },
  {
    icon: "lucide:audio-lines",
    title: "Mixing & Mastering",
    description:
      "Your tracks are mixed and/or mastered using professional tools. A high-quality preview is uploaded for feedback.",
  },
  {
    icon: "lucide:rotate-ccw",
    title: "Revisions & Feedback",
    description:
      "If you're not completely satisfied, you can request adjustments, and I refine the mix and/or master until it feels right to you.",
  },
  {
    icon: "lucide:download",
    title: "Final Delivery",
    description:
      "Download your finished files in whatever formats you specify in your package. All finished files are ready for release.",
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
      "Other studios outsourcing mastering or seeking a second opinion on mixes",
  },
  {
    icon: "lucide:video",
    title: "Content Creators",
    description:
      "Podcasters, YouTubers, and media creators who need audio post-production",
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
      "24-bit / 44.1kHz or higher",
      "Individual tracks or stems",
    ],
    recommendations: [
      "24-bit / 48kHz for best results",
      "Leave 3-6 dB of headroom",
      "No master bus processing on stems",
      "Include reference tracks if desired",
    ],
  },

  deliveryFormats: {
    icon: "lucide:download",
    iconClassName: "text-primary",
    title: "Delivery Formats",
    contentClassName: "space-y-3",
    standardDelivery: [
      "WAV (24-bit / 44.1kHz or 48kHz)",
      "16-bit / 44.1kHz for CD mastering (optional)",
      "MP3 (320kbps), FLAC, and AIFF (all optional)",
    ],
    platformSpecificMasters: [
      "Spotify / YouTube / YouTube Music (-14 LUFS integrated)",
      "Apple Music / iTunes (-16 LUFS integrated)",
      "Deezer (-15 LUFS integrated)",
      "And more!",
    ],
  },

  qualityStandards: {
    icon: "lucide:waves",
    iconClassName: "text-accent",
    title: "Quality Standards",
    contentClassName: "space-y-2",
    mixing: [
      "Frequency masking mitigation",
      "Preservation of emotional dynamics (genre specific)",
      "Careful cohesive automation to guide the listener's focus",
    ],
    mastering: [
      "Industry-standard loudness (LUFS) targeting",
      "True peak limiting to prevent clipping",
      "Final EQ for tonal balance across all systems",
      "Stereo field optimization & mono compatibility checks",
    ],
  },

  turnaroundRevisions: {
    icon: "lucide:rotate-ccw",
    iconClassName: "text-secondary",
    title: "Turnaround & Revisions",
    contentClassName: "space-y-2",
    timeframes: [
      { label: "Mixing:", value: "4-6 business days (up to 3 revisions)" },
      { label: "Mastering:", value: "3-4 business days (up to 3 revisions)" },
      { label: "Mix + Master:", value: "7-10 business days (up to 3 revisions)" },
    ],
    additionalAddons: [
      "Rush service for 2 business days delivery (additional fee).",
      "Unlimited revisions within 1 month of purchase (additional fee).",
    ],
  },
} as const;
