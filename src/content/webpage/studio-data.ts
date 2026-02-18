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
			{ name: "Main monitors", details: "Neumann KH 310 3-Way Studio Monitors" },
			{ name: "Secondary reference", details: "Avantone Mixcube Studio Monitors" },
			{ name: "Headphone reference", details: "Focal Spirit Pro Closed-back Headphones" },
			{ name: "Speaker Calibration", details: "Sonarworks Reference 4 Studio Edition" },
			{ name: "Reference software", details: "Mastering the Mix Reference plugin" },
		],
	},
	{
		icon: "lucide:home",
		title: "Room & Acoustic Treatment",
		description:
			"Controlling reflections makes mixing and mastering decisions faster and more reliable.",
		items: [
			{ name: "Bass control", details: "Auralex LENRD Bass Traps" },
			{ name: "Bass control", details: "Auralex CornerFill Cubes" },
			{ name: "Reflection control", details: "Auralex Custom Built Panels (7\", 5\", and 3\" thick)" },
			{ name: "Speaker isolation", details: "Auralex MoPAD Monitor Pads" },
		],
	},
	{
		icon: "lucide:hard-drive",
		title: "Converter / Interface",
		description:
			"High quality converters/interfaces for accurate monitoring and recording.",
		items: [
			{ name: "Main interface", details: "Antelope Audio Zen Studio" },
			{ name: "Secondary interface", details: "Universal Audio Solo USB" },
		],
	},
	{
		icon: "lucide:music",
		title: "DAW's and Editors",
		description:
			"I use state of the art software for all of my audio engineering tasks.",
		items: [
			{ name: "Mixing", details: "Cubase Pro 14" },
			{ name: "Mastering", details: "Wave Lab Pro 12" },
			{ name: "Production", details: "Ableton Live 10 Standard" },
			{ name: "Production", details: "Bitwig Studio 5" },
			{ name: "Repair & Restoration", details: "iZotope RX10 Standard" },
			{ name: "Repair & Restoration", details: "Spectral Layers Pro 9" },
		],
	},
	{
		icon: "lucide:plug",
		title: "Plugins",
		description:
			"Curated plugin set: modern digital tools + tasteful analog modeling.",
		items: [
			{ name: "Universal Audio", details: "Ultimate 11 Bundle" },
			{ name: "Fab Filter", details: "Pro Bundle" },
			{ name: "SSL", details: "Fusion Bundle/Native Bus Compressor" },
			{ name: "Waves", details: "Mercury Bundle/Studio Classics/Abbey Road Collection" },
			{ name: "Soundtoys", details: "Soundtoys 5 Bundle" },
			{ name: "iZotope", details: "Music Production Suite 3 Bundle" },
			{ name: "Other", details: "Plugin Alliance, Brainworx, Eventide, SIR Audio, and more!" },
		],
	},
  {
		icon: "lucide:mic",
		title: "Microphones",
		description:
			"Clean capture with good gain staging and dependable conversion.",
		items: [
			{ name: "Large diaphragm condenser", details: "AKG C414-XLS" },
			{ name: "Large diaphragm condenser", details: "Audio technica AT4040" },
			{ name: "Small diaphragm condenser", details: "AKG C1000S" },
			{ name: "Large diaphragm dynamic", details: "Sennheiser MD 421" },
			{ name: "Small diaphragm dynamic", details: "Shure SM57" },
		],
	},
  {
		icon: "lucide:keyboard-music",
		title: "Vintage Synths",
		description:
			"Classic vintage digital synths from the 80's.",
		items: [
			{ name: "Yamaha", details: "DX7 Keyboard Synth" },
			{ name: "Yamaha", details: "TX81Z FM Tone Generator" },
			{ name: "Roland", details: "MKS-50 Synth Module" },
			{ name: "Roland", details: "PG-300 Synth Programmer" },
		],
	},
  {
		icon: "lucide:keyboard-music",
		title: "Virtual Synths",
		description:
			"Some of the best modeled virtual synths, with all of the benefits of digital control.",
		items: [
			{ name: "Native Instruments", details: "Komplete 13 Ultimate Collector's" },
			{ name: "Roland", details: "Jupiter 8, SH-2, JV-1080" },
			{ name: "Arturia", details: "V Collection 8" },
			{ name: "Universal Audio", details: "Mini Moog" },
		],
	},
  {
		icon: "lucide:keyboard-music",
		title: "MIDI Controllers",
		description:
			"Studio workflow enhancements via MIDI controllers.",
		items: [
			{ name: "Native Instruments", details: "Komplete Kontrol S25" },
			{ name: "Steinberg", details: "CMC PD/TP/CH" },
			{ name: "Roland", details: "UM-ONE USB MIDI" },
		],
	},
];

export const studioPhotoSlots: StudioPhotoSlot[] = [
	{
		title: "Monitoring Position",
		caption: "The listening position and the placement of my studio monitors were heavily informed by objective acoustic measurements and subjective but practical techniques like the \"bass hunter technique\" designed by Jesco at Acoustics Insider.",
		src: "src/assets/website/studio-room_treatment.jpg"
	},
	// {
  //   title: "Outboard / rack",
	// 	caption: "Hardware chain and routing.",
  //   // src: "src/assets/website/studio-room_treatment.jpg"
	// },
	{
    title: "Studio Monitors",
		caption: "High quality Neumann KH 310 3-way studio monitors offer a great deal of clarity. The 3-way speaker design results in more detailed low and low-mid frequencies. The Avantone MixCubes are a single cone design which eliminate potential phase disturbances providing further insight.",
		src: "src/assets/website/studio-neumann_kh310_studio_monitors.jpg",
	},
	{
    title: "Room Treatment",
		caption: "The design of my acoustic treatment panels and their placement were also heavily informed by acoustic measurements using software like Room EQ Wizard. The result is a more balanced and accurate monitoring environment.",
    src: "src/assets/website/studio-monitoring_position.jpg"
	},
];
