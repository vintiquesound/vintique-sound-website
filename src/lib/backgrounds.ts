export type BgColorToken = string;


const baseColors = [
  "primary",
  "secondary",
  "accent",
  "muted",
  "background",
  "foreground",
];


function resolveColor(token: BgColorToken | undefined): string {
  if (!token) return "var(--primary)";
  // Handle base color
  if (baseColors.includes(token)) {
    return `var(--${token})`;
  }
  // Handle color with /xx suffix (0-100)
  const match = token.match(/^(primary|secondary|accent|muted)\/(\d{1,3})$/);
  if (match) {
    const base = match[1];
    let percent = parseInt(match[2]!, 10);
    percent = Math.max(0, Math.min(percent, 100));
    return `color-mix(in srgb, var(--${base}) ${percent}%, transparent)`;
  }
  // Fallback: allow any custom CSS value
  return token;
}

export function buildBackgroundStyle(bgColors?: BgColorToken[]) {
  const colors = bgColors?.length ? bgColors : ["primary"];
  const resolved = colors.map(resolveColor);

  if (resolved.length === 1) {
    return { background: resolved[0] } as const;
  }

  if (resolved.length === 2) {
    return {
      background: `linear-gradient(to bottom right, ${resolved[0]}, ${resolved[1]})`,
    } as const;
  }

  return {
    background: `linear-gradient(to bottom right, ${resolved.join(", ")})`,
  } as const;
}
