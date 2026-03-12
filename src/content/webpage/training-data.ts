export const learningTopics = [
  {
    icon: "lucide:app-window",
    title: "Cubase Training",
    description:
      "Learn the Cubase workflow from the ground up or focus on the exact features slowing you down in real projects.",
    points: [
      "Navigation, templates, routing, and session organization",
      "VariAudio, Group Editing, Sampler Track, Groove Agent, Halion, and automation",
      "Workflow shortcuts, project cleanup, and export best practices",
    ],
  },
  {
    icon: "lucide:sliders-horizontal",
    title: "Mixing Training",
    description:
      "Build reliable mixing instincts so your sessions sound clearer, punchier, and more emotionally intentional.",
    points: [
      "EQ, compression, saturation, effects, and automation",
      "Balance, depth, width, and arrangement-aware decision making",
      "Genre-specific strategies for rock, indie, electronic music, and more",
    ],
  },
  {
    icon: "lucide:waves",
    title: "Mastering Training",
    description:
      "Understand what mastering actually is, how it differs from mixing, and how to prepare release-ready masters.",
    points: [
      "Tonal balance, loudness, limiting, and translation",
      "Reference-based decision making and platform considerations",
      "Master bus workflow and avoiding common mastering mistakes",
    ],
  },
  {
    icon: "lucide:message-square-more",
    title: "Project Feedback & Problem Solving",
    description:
      "Bring your own session and get focused guidance on the exact issues holding your mix, master, or workflow back.",
    points: [
      "Track-by-track feedback on your current project",
      "Live troubleshooting for mix problems, routing issues, or workflow bottlenecks",
      "Custom training that combines Cubase, mixing, and mastering topics",
    ],
  },
] as const;

export const trainingBuilderTopics = {
  cubase: {
    label: "Cubase",
    description: "Focus your training around Cubase workflow, tools, and session management.",
    focusAreas: [
      "Session organization",
      "Templates",
      "Navigation",
      "Routing",
      "Group Editing",
      "Automation",
      "VariAudio",
      "Groove Agent",
      "Halion",
      "Sampler Track",
      "Workflow shortcuts",
      "Project cleanup",
      "Export best practices",
      "Other/custom topic",
    ],
  },
  mixing: {
    label: "Mixing",
    description: "Build clearer mixing instincts and a more reliable decision-making process.",
    focusAreas: [
      "EQ",
      "Compression",
      "Saturation",
      "Effects",
      "Automation",
      "Balance",
      "Depth",
      "Width",
      "Arrangement-aware decision making",
      "Genre-specific strategies",
      "Other/custom topic",
    ],
  },
  mastering: {
    label: "Mastering",
    description: "Learn the mastering concepts and workflow needed for release-ready results.",
    focusAreas: [
      "Tonal balance",
      "Loudness",
      "Limiting",
      "Translation",
      "Reference-based decision making",
      "Platform considerations",
      "Master bus workflow",
      "Avoiding common mastering mistakes",
      "Other/custom topic",
    ],
  },
} as const;

export const projectFeedbackDawOptions = ["Cubase", "Ableton", "Bitwig"] as const;

export const projectFeedbackFocusAreas = [
  "Track-by-track feedback on mix",
  "Mastering session feedback",
  "DAW-specific feedback",
] as const;

export const whyTrainWithKevin = {
  eyebrow: "Why Learn With Kevin",
  title: "Real-world training from an active engineer.",
  subtitle: "Learn from someone who actively mixes, masters, teaches, and works inside Cubase every day.",
  description:
    "My name is Kevin Ulliac. Cubase is my preferred DAW, and I've been using it extensively since version 6.5. I also publish Cubase tutorials on YouTube and regularly help artists improve their workflow, mixes, and masters through real-world sessions.",
  secondaryDescription:
    "I specialize in mixing rock, indie, and electronic music, and I approach training the same way I approach engineering: identify the problem, simplify the process, and build repeatable habits that actually improve results.",
  highlights: [
    "15+ years of audio engineering experience",
    "Hands-on background in recording, mixing, and mastering",
    "Extensive Cubase experience since version 6.5",
    "Teaching approach built around your own songs, sessions, and goals",
  ],
  stats: [
    { label: "Years Experience", value: "15+" },
    { label: "Projects Completed", value: "250+" },
    { label: "YouTube Audience", value: "10K+" },
  ],
} as const;

export const idealStudents = [
  {
    icon: "lucide:music",
    title: "Artists Producing Their Own Music",
    description:
      "You want better demos, singles, or releases without guessing your way through the process.",
  },
  {
    icon: "lucide:audio-lines",
    title: "Beginner to Intermediate Mixers",
    description:
      "You understand some of the tools already, but need a clearer system for making confident decisions.",
  },
  {
    icon: "lucide:laptop-minimal",
    title: "Cubase Users",
    description:
      "You want to move faster in Cubase, understand its deeper features, or stop feeling overwhelmed by the workflow.",
  },
  {
    icon: "lucide:graduation-cap",
    title: "Self-Taught Producers",
    description:
      "You've learned from videos and trial-and-error, and now want direct feedback tailored to your own music.",
  },
] as const;

export const packageOptions = [
  {
    title: "Single Session",
    badge: "Best for quick wins",
    description:
      "A focused 1-on-1 session built around one problem, one workflow bottleneck, or one project review.",
    includes: [
      "Ideal for mix feedback, Cubase troubleshooting, or mastering Q&A",
      "Focused curriculum based on your goals before the session",
      "Great if you want clarity fast without committing to a longer package",
    ],
    fit: "Choose this if you need targeted help on one project or one skill area.",
  },
  {
    title: "Multi-Session",
    badge: "Most flexible",
    description:
      "A short custom training plan for students who want to improve a full workflow across multiple sessions.",
    includes: [
      "Ideal for learning Cubase, mixing fundamentals, or mastering step by step",
      "Lets us apply concepts, review progress, and build momentum",
      "Best when you want structure without committing to long-term coaching",
    ],
    fit: "Choose this if you want guided progress across several sessions.",
  },
  {
    title: "Ongoing Mentorship",
    badge: "Best for long-term growth",
    description:
      "A deeper coaching relationship for producers or artists who want continued feedback, accountability, and development.",
    includes: [
      "Recurring support for mixes, masters, workflow, and release prep",
      "Curriculum evolves as your skills and projects evolve",
      "Excellent for serious students building a repeatable professional process",
    ],
    fit: "Choose this if you want continued support, feedback, and long-term growth.",
  },
] as const;

export const packageGuidance = [
  {
    beforeLink: "If you're unsure where to start, ",
    linkLabel: "send",
    href: "/contact#one-on-one-training",
    afterLink: " a short description of your goals and current experience level.",
  },
  {
    text: "I will recommend the right training format based on whether you need project feedback, Cubase help, or a deeper mixing/mastering plan.",
  },
  {
    text: "Every package is tailored, so the final quote depends on scope, number of sessions, and how customized the training needs to be.",
  },
] as const;

export const processSteps = [
  {
    icon: "lucide:message-square",
    title: "Submit Your Request",
    description:
      "Tell me what you want to learn, what DAW you use, your experience level, and whether you want help with Cubase, mixing, mastering, or all three.",
  },
  {
    icon: "lucide:file-text",
    title: "Receive a Quote & Plan",
    description:
      "I send you a quote and outline the best session format. Once the deposit is handled, we choose a start date and I build a custom curriculum around your needs.",
  },
  {
    icon: "lucide:monitor",
    title: "Train 1-on-1 Online",
    description:
      "Sessions are delivered live online and tailored to your pace, questions, and current skill level. We can work from examples or directly inside your own projects.",
  },
  {
    icon: "lucide:folder-open",
    title: "Apply It To Real Projects",
    description:
      "We use your songs, sessions, or mastering chain whenever possible so the training stays practical and immediately useful.",
  },
  {
    icon: "lucide:arrow-up-right",
    title: "Keep Improving",
    description:
      "Choose a single session, a short intensive, or ongoing mentorship depending on how much support and accountability you want.",
  },
] as const;

export const trainingDetails = {
  sessionFormat: {
    icon: "lucide:monitor",
    iconClassName: "text-primary",
    title: "Session Format",
    contentClassName: "space-y-3",
    items: [
      "Private 1-on-1 online training",
      "Sessions tailored to your pace, questions, and goals",
      "Cubase-specific or broader mixing/mastering training",
    ],
  },
  whatYouCanBring: {
    icon: "lucide:briefcase",
    iconClassName: "text-secondary",
    title: "What You Can Bring",
    contentClassName: "space-y-3",
    items: [
      "A current project, mix, or master in progress",
      "A list of Cubase features or workflow issues you want to learn",
      "Reference tracks, notes, or recurring problems you want to solve",
    ],
  },
  whatYouReceive: {
    icon: "lucide:list-checks",
    iconClassName: "text-accent",
    title: "What You Receive",
    contentClassName: "space-y-3",
    items: [
      "Clear explanations of what to do and why it works",
      "Direct feedback on your decisions, workflow, and sonic results",
      "A custom path that can combine Cubase, mixing, mastering, and project critique",
    ],
  },
  curriculum: {
    icon: "lucide:route",
    iconClassName: "text-primary",
    title: "Curriculum & Scope",
    contentClassName: "space-y-3",
    items: [
      "Training can be broad or highly focused",
      "Curriculum is custom-built after learning your goals and current level",
      "You can start with one topic or combine multiple areas into a guided roadmap",
    ],
  },
} as const;

export const requestPlaceholder = {
  title: "Ready to start learning?",
  description:
    "Use the training request builder to choose 1-on-1 training or project feedback, select your focus areas, and send a detailed request.",
  buttonLabel: "Build Your Training Request",
} as const;
