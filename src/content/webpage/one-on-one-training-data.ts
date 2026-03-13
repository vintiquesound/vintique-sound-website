export const learningTopics = [
  {
    icon: "lucide:app-window",
    title: "Cubase",
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
    title: "Mixing",
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
    title: "Mastering",
    description:
      "Understand what mastering actually is, how it differs from mixing, and how to prepare release-ready masters.",
    points: [
      "Tonal balance, loudness, limiting, and translation",
      "Reference-based decision making and platform considerations",
      "Master bus workflow and avoiding common mastering mistakes",
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
    { label: "YouTube Subscribers", value: "10K+" },
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
    title: "Beginner to Intermediate Cubase Users",
    description:
      "You want to move faster in Cubase, understand its deeper features, or stop feeling overwhelmed by the workflow.",
  },
  {
    icon: "lucide:graduation-cap",
    title: "Self-Taught Engineers & Producers",
    description:
      "You've learned from videos and trial-and-error, and now want direct feedback tailored to your own music.",
  },
] as const;

export const packageOptions = [
  {
    title: "Topic Intensive Session",
    badge: "Best for focused help",
    description:
      "A focused training session built around one clearly defined goal in Cubase, mixing, or mastering.",
    includes: [
      "Ideal for Cubase troubleshooting, focused mixing or mastering techniques, or one bottleneck inside your workflow",
      "We stay tightly focused on the topic that will help you move forward fastest",
      "Great when you want clarity in one session without mapping out a longer plan",
    ],
    fit: "Choose this if you want to focus on a specific problem, tool, or technique.",
  },
  {
    title: "Project-Based Session",
    badge: "Most practical",
    description:
      "A working session built directly around your own song, session, mix, or master so the training stays immediately useful.",
    includes: [
      "Ideal when you learn best by opening a real project and solving problems in context",
      "Perfect for Cubase workflow help, mix troubleshooting, or mastering decisions inside your material",
      "Learning outcomes are achieved through real examples instead of abstract demonstrations",
    ],
    fit: "Choose this if you want hands-on coaching inside your own project files.",
  },
  {
    title: "Guided Development Plan",
    badge: "Best for long term success",
    description:
      "A structured training direction for students who want to move beyond signle sessions and into a bigger learning plan.",
    includes: [
      "Best when you want to combine Cubase, mixing, and mastering into a personalized roadmap",
      "We identify the right sequence of hourly sessions based on your current level and goals",
      "Useful when you want momentum, progression, and a clearer long-term skill-building path",
    ],
    fit: "Choose this if you want a custom progression instead of a one-off lesson.",
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
    text: "I will recommend the right format based on whether you need one focused topic session, a project-based session inside your own material, or a broader development plan built from multiple hourly sessions.",
  },
  {
    text: "Training is provided in 1-hour increments, so the final quote depends on how many sessions you want, how specialized the topic is, and whether you add session recording delivery.",
  },
] as const;

export const trainingRecordingAddOn = {
  label: "Recorded session delivery",
  description:
    "Add recording + delivery if you want a copy of the lesson to revisit afterward. This is offered as an extra-cost add-on.",
} as const;

export const processSteps = [
  {
    icon: "lucide:message-square",
    title: "Submit Your Request",
    description:
      "Tell me what you want to learn, what DAW you use, whether you want a focused lesson or project-based session, and the topics you want to cover.",
  },
  {
    icon: "lucide:file-text",
    title: "Receive Quote & Plan",
    description:
      "I take your request and build a structured learning plan along with a quote based on the topics, number of hours, and package you requested.",
  },
  {
    icon: "lucide:monitor",
    title: "Train 1-on-1 Online",
    description:
      "Sessions are delivered live online in 1-hour increments and tailored to your pace, questions, and current level. We can work from examples or directly inside your own projects.",
  },
  {
    icon: "lucide:folder-open",
    title: "Work In Context",
    description:
      "Whenever possible, we work from your own songs, sessions, or mastering chain so the lesson turns into something you can apply immediately.",
  },
  {
    icon: "lucide:arrow-up-right",
    title: "Add More Support If Needed",
    description:
      "If you want to keep going, we can add more hourly sessions, map out a development plan, or include recording delivery as an add-on.",
  },
] as const;

export const trainingDetails = {
  sessionFormat: {
    icon: "lucide:monitor",
    iconClassName: "text-primary",
    title: "Session Format",
    contentClassName: "space-y-3",
    items: [
      "Private 1-on-1 online training delivered in 1-hour increments",
      "Available as a focused topic session, a project-based working session, or a broader development plan",
      "Session recording can be added as an extra-cost deliverable",
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
      "A custom path that can combine Cubase, mixing, and mastering topics around your goals",
    ],
  },
  curriculum: {
    icon: "lucide:route",
    iconClassName: "text-primary",
    title: "Curriculum & Scope",
    contentClassName: "space-y-3",
    items: [
      "Training can be broad or highly focused depending on the session format you choose",
      "Curriculum is custom-built after learning your goals, level, and project context",
      "You can book one or more hours, work directly on a project, or build a guided roadmap from multiple sessions",
    ],
  },
} as const;

export const requestPlaceholder = {
  title: "Ready to start learning?",
  description:
    "Use the training request builder to choose your format, select your focus areas, and send a detailed 1-on-1 training request.",
  buttonLabel: "Build Your Training Request",
} as const;
