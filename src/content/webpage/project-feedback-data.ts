export const feedbackTopics = [
  {
    icon: "lucide:audio-waveform",
    title: "Mix Feedback",
    description:
      "Get clear, practical feedback on balance, tone, depth, impact, and the decisions shaping your mix.",
    points: [
      "Track-by-track notes on what is and is not working",
      "Specific guidance on EQ, compression, effects, automation, and arrangement issues",
      "Prioritized next steps so you know what to fix first",
    ],
  },
  {
    icon: "lucide:waves",
    title: "Mastering Feedback",
    description:
      "Understand how your master translates, where it falls short, and what to adjust before release.",
    points: [
      "Feedback on tonal balance, loudness, limiting, and translation",
      "Guidance on reference use and platform readiness",
      "Help separating mastering issues from upstream mix problems",
    ],
  },
  {
    icon: "lucide:app-window",
    title: "Session & Workflow Diagnosis",
    description:
      "Bring your DAW session and identify the routing, organization, or workflow bottlenecks slowing you down.",
    points: [
      "Routing, gain staging, bussing, and session layout review",
      "Troubleshooting for Cubase and other supported DAWs",
      "Workflow improvements that make future projects easier to finish",
    ],
  },
  {
    icon: "lucide:target",
    title: "Actionable Next Steps",
    description:
      "Leave with a clearer strategy for what to improve now, what can wait, and how to move your project forward.",
    points: [
      "A practical revision roadmap tailored to your project",
      "Clarity on whether the biggest issue is arrangement, mix, master, or workflow",
      "Focused recommendations instead of vague general advice",
    ],
  },
] as const;

export const whyProjectFeedbackWithKevin = {
  eyebrow: "Why Get Feedback From Kevin",
  title: "Objective feedback from an active engineer.",
  subtitle: "Get practical notes from someone who actively mixes, masters, teaches, and helps artists solve real production problems.",
  description:
    "My name is Kevin Ulliac. I work on real-world mixes and masters every day, and I also teach producers how to hear problems more clearly and fix them with purpose. That means your feedback is grounded in both engineering experience and communication that is easy to apply.",
  secondaryDescription:
    "Whether you are stuck on a single mix, unsure about your master, or overwhelmed by what your session is telling you, I focus on helping you understand the problem, not just pointing it out.",
  highlights: [
    "15+ years of audio engineering experience",
    "Hands-on background in recording, mixing, and mastering",
    "Detailed feedback that stays practical and project-specific",
    "Clear next-step guidance you can apply immediately",
  ],
  stats: [
    { label: "Years Experience", value: "15+" },
    { label: "Projects Completed", value: "250+" },
    { label: "YouTube Subscribers", value: "10K+" },
  ],
} as const;

export const idealFeedbackClients = [
  {
    icon: "lucide:music",
    title: "Artists Finishing Their Own Releases",
    description:
      "You want experienced ears on your mix or master before you commit to the final version.",
  },
  {
    icon: "lucide:audio-lines",
    title: "Producers Stuck In Revision Loops",
    description:
      "You keep tweaking but are not sure which changes will actually improve the result.",
  },
  {
    icon: "lucide:laptop-minimal",
    title: "DAW Users With Session Problems",
    description:
      "You need help identifying routing, organization, or workflow issues inside the project itself.",
  },
  {
    icon: "lucide:message-square-more",
    title: "Self-Taught Engineers",
    description:
      "You want direct, honest feedback that helps you improve faster than trial-and-error alone.",
  },
] as const;

export const projectFeedbackDawOptions = ["Cubase", "Ableton", "Bitwig"] as const;

export const projectFeedbackFocusAreas = [
  "Mix feedback and revision priorities",
  "Mastering feedback and translation issues",
  "Session workflow, routing, or organization",
  "General production direction and next steps",
] as const;

export const feedbackPackageOptions = [
  {
    title: "Recorded Walkthrough",
    badge: "Lowest-cost option",
    description:
      "You send me the project and I record a walkthrough reviewing what is working, what is holding it back, and what to fix next.",
    includes: [
      "Async review delivered as a recording you can watch back on your own time",
      "Ideal if you want clear direction without scheduling a live call",
      "Best for a lower-cost option that still gives you project-specific guidance",
    ],
    fit: "Choose this if you want a practical recorded review without a live session.",
  },
  {
    title: "Live Walkthrough",
    badge: "Most interactive",
    description:
      "We meet live, walk through your project together, and I also record the session so you can revisit the feedback later.",
    includes: [
      "Best when you want to ask questions in real time and unpack the reasoning behind the notes",
      "Useful for mix decisions, mastering questions, and DAW-specific troubleshooting",
      "Includes recording delivery after the session",
    ],
    fit: "Choose this if you want the most collaborative version of project feedback.",
  },
  {
    title: "Deep-Dive Review",
    badge: "Best for larger projects",
    description:
      "A more involved review for projects that need extra scope, more context, or both a detailed walkthrough and live follow-up.",
    includes: [
      "Best for more complex sessions, multiple concerns, or producers who want deeper explanation",
      "Can combine a detailed recorded walkthrough with a live follow-up conversation",
      "Useful when the project needs more than a quick pass to identify the real bottlenecks",
    ],
    fit: "Choose this if you need more depth than a standard recorded or live walkthrough.",
  },
] as const;

export const feedbackPackageGuidance = [
  {
    beforeLink: "If you're unsure what kind of review you need, ",
    linkLabel: "send",
    href: "/contact#project-feedback",
    afterLink: " a short note about your project, your DAW, and where you feel stuck.",
  },
  {
    text: "I will recommend the right format based on whether a recorded walkthrough is enough, a live walkthrough makes more sense, or the project needs a deeper review scope.",
  },
  {
    text: "Final quotes depend on the scope of the project, how much material I need to review, and whether the feedback is delivered as a recording, a live session, or a deeper hybrid review.",
  },
] as const;

export const feedbackProcessSteps = [
  {
    icon: "lucide:message-square",
    title: "Submit Your Request",
    description:
      "Tell me about the project, your DAW, what kind of walkthrough you want, and where you feel stuck in the mix, master, workflow, or overall direction.",
  },
  {
    icon: "lucide:file-text",
    title: "Receive a Quote & Review Plan",
    description:
      "I take your request and build a structured feedback plan along with a quote based on the topics, number of hours, and package you requested.",
  },
  {
    icon: "lucide:folder-open",
    title: "Send Your Material",
    description:
      "Send your audio files, notes, references, screenshots, or project files depending on the level of walkthrough the project needs.",
  },
  {
    icon: "lucide:video",
    title: "Receive The Walkthrough",
    description:
      "I walk through the project, identify what is working, what is holding it back, and explain which changes will make the biggest difference.",
  },
  {
    icon: "lucide:arrow-up-right",
    title: "Revise With Clarity",
    description:
      "You leave with a clearer roadmap for your next revision and a recording or live-session recap you can return to while making changes.",
  },
] as const;

export const feedbackDetails = {
  reviewFormat: {
    icon: "lucide:monitor",
    iconClassName: "text-primary",
    title: "Review Format",
    contentClassName: "space-y-3",
    items: [
      "Choose between a recorded walkthrough, a live walkthrough with recording delivery, or a deeper hybrid review",
      "Feedback can be based on stereo files, screenshots, notes, or deeper full project analysis",
      "Tailored to the complexity of the project and the level of explanation you need",
    ],
  },
  whatYouCanSend: {
    icon: "lucide:briefcase",
    iconClassName: "text-secondary",
    title: "What You Can Send",
    contentClassName: "space-y-3",
    items: [
      "Project files and details you want me to walk through (NOTE: this option gives best results)",
      "A stereo bounce of your mix or master",
      "References, notes, screenshots, and questions about what feels off",
    ],
  },
  whatYouReceive: {
    icon: "lucide:list-checks",
    iconClassName: "text-accent",
    title: "What You Receive",
    contentClassName: "space-y-3",
    items: [
      "A walkthrough focused on the biggest issues affecting the result",
      "Practical suggestions you can apply in your next revision",
      "Context for why specific changes matter and where to focus first",
    ],
  },
  outcomes: {
    icon: "lucide:route",
    iconClassName: "text-primary",
    title: "Outcomes",
    contentClassName: "space-y-3",
    items: [
      "More confidence in your next revision",
      "A better understanding of your recurring weak points",
      "A clearer path toward stronger mixes, masters, and workflow decisions",
    ],
  },
} as const;

export const feedbackRequestPlaceholder = {
  title: "Ready to get focused feedback?",
  description:
    "Use the project feedback builder to choose your walkthrough format, describe your project, and send a detailed request.",
  buttonLabel: "Build Your Feedback Request",
} as const;
