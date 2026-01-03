export type BgColorToken =
  | "primary"
  | "primary/10"
  | "primary/15"
  | "primary/60"
  | "primary/80"
  | "secondary"
  | "secondary/10"
  | "secondary/15"
  | "secondary/60"
  | "secondary/80"
  | "accent"
  | "accent/10"
  | "accent/15"
  | "accent/60"
  | "accent/80"
  | "muted"
  | "muted/10"
  | "muted/15"
  | "muted/60"
  | "muted/80"
  | "background"
  | "foreground"
  | string;

const colorMap: Record<string, string> = {
  primary: "var(--primary)",
  "primary/10": "color-mix(in srgb, var(--primary) 10%, transparent)",
  "primary/15": "color-mix(in srgb, var(--primary) 15%, transparent)",
  "primary/60": "color-mix(in srgb, var(--primary) 60%, transparent)",
  "primary/80": "color-mix(in srgb, var(--primary) 80%, transparent)",

  secondary: "var(--secondary)",
  "secondary/10": "color-mix(in srgb, var(--secondary) 10%, transparent)",
  "secondary/15": "color-mix(in srgb, var(--secondary) 15%, transparent)",
  "secondary/60": "color-mix(in srgb, var(--secondary) 60%, transparent)",
  "secondary/80": "color-mix(in srgb, var(--secondary) 80%, transparent)",

  accent: "var(--accent)",
  "accent/10": "color-mix(in srgb, var(--accent) 10%, transparent)",
  "accent/15": "color-mix(in srgb, var(--accent) 15%, transparent)",
  "accent/60": "color-mix(in srgb, var(--accent) 60%, transparent)",
  "accent/80": "color-mix(in srgb, var(--accent) 80%, transparent)",

  muted: "var(--muted)",
  "muted/10": "color-mix(in srgb, var(--muted) 10%, transparent)",
  "muted/15": "color-mix(in srgb, var(--muted) 15%, transparent)",
  "muted/60": "color-mix(in srgb, var(--muted) 60%, transparent)",
  "muted/80": "color-mix(in srgb, var(--muted) 80%, transparent)",

  background: "var(--background)",
  foreground: "var(--foreground)",
};

function resolveColor(token: BgColorToken | undefined): string {
  if (!token) return "var(--primary)";
  return colorMap[token] ?? token;
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
    background: `linear-gradient(to bottom right, ${resolved[0]}, ${resolved[1]}, ${resolved[2]})`,
  } as const;
}
