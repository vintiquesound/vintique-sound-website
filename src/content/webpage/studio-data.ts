export type GearListItem = {
	name: string;
	details?: string;
};

export type GearCategory = {
	icon: string;
	title: string;
	description?: string;
	items: GearListItem[];
};

export type StudioPhotoSlot = {
	title: string;
	caption?: string;
	/** Optional until you add real photos in /public */
	src?: string;
	alt?: string;
};

export const gearCategories: GearCategory[] = [
	{
		icon: "lucide:speaker",
		title: "Monitoring",
		description:
			"Accurate monitoring is everything. This setup is focused on translation, detail, and repeatability.",
		items: [
			{ name: "Main monitors", details: "Nearfield monitors (studio reference)" },
			{ name: "Secondary reference", details: "Small speaker / mono checks" },
			{ name: "Headphone reference", details: "Closed-back + open-back" },
		],
	},
	{
		icon: "lucide:home",
		title: "Room & Acoustic Treatment",
		description:
			"A controlled room makes mixing decisions faster and more reliable.",
		items: [
			{ name: "Bass control", details: "Low-frequency management" },
			{ name: "Reflection control", details: "Early reflections + stereo imaging" },
			{ name: "Isolation", details: "Low noise floor" },
		],
	},
	{
		icon: "lucide:mic",
		title: "Recording Chain",
		description:
			"Clean capture with good gain staging and dependable conversion.",
		items: [
			{ name: "Microphones", details: "Vocal + instrument options" },
			{ name: "Interfaces & conversion", details: "Low-latency tracking" },
			{ name: "Preamps", details: "Transparent + character options" },
		],
	},
	{
		icon: "lucide:settings",
		title: "Outboard & Hardware",
		description:
			"Selective hardware tools for tone and control when it makes sense.",
		items: [
			{ name: "Dynamics", details: "Compression / limiting" },
			{ name: "EQ", details: "Surgical + sweetening" },
			{ name: "Utility", details: "Re-amping / routing" },
		],
	},
	{
		icon: "lucide:music",
		title: "DAW & Workflow",
		description:
			"A fast workflow means more time spent on the music, not the session.",
		items: [
			{ name: "DAW", details: "Primary DAW + compatibility options" },
			{ name: "Session templates", details: "Recallable routing & mix bus chains" },
			{ name: "Deliverables", details: "Stems, instrumentals, TV mixes" },
		],
	},
	{
		icon: "lucide:plug",
		title: "Plugins & Software",
		description:
			"Curated plugin set: modern digital tools + tasteful analog modeling.",
		items: [
			{ name: "EQ", details: "Surgical + musical" },
			{ name: "Compression", details: "Bus glue + transparent control" },
			{ name: "Reverb & delay", details: "Depth, space, and movement" },
			{ name: "Metering", details: "LUFS, true peak, spectrum" },
		],
	},
];

export const studioPhotoSlots: StudioPhotoSlot[] = [
	{
		title: "Mix position",
		caption: "Main desk + monitoring alignment.",
		// Example: src: "/images/studio/mix-position.jpg",
	},
	{
		title: "Outboard / rack",
		caption: "Hardware chain and routing.",
		// Example: src: "/images/studio/rack.jpg",
	},
	{
		title: "Tracking corner",
		caption: "A quiet, controlled space for vocals and instruments.",
		// Example: src: "/images/studio/tracking.jpg",
	},
	{
		title: "Room treatment",
		caption: "Acoustic treatment for reliable decisions.",
		// Example: src: "/images/studio/treatment.jpg",
	},
];
