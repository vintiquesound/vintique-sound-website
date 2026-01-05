export type SocialLink = {
  name: string;
  url: string;
  iconName: string;
  label: string;
};

export const socials: SocialLink[] = [
  {
    name: "YouTube",
    url: "https://www.youtube.com/c/vintiquesound",
    iconName: "simple-icons:youtube",
    label: "Follow Vintique Sound on YouTube",
  },
  {
    name: "SoundCloud",
    url: "https://soundcloud.com/vintiquesound",
    iconName: "simple-icons:soundcloud",
    label: "Follow Vintique Sound on SoundCloud",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/vintiquesound/",
    iconName: "simple-icons:instagram",
    label: "Follow Vintique Sound on Instagram",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/vintiquesound/",
    iconName: "simple-icons:facebook",
    label: "Follow Vintique Sound on Facebook",
  },
];
