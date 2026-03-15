export function getServerEnv(key: string): string | undefined {
  const runtimeValue = process.env[key];
  if (typeof runtimeValue === "string" && runtimeValue.trim()) return runtimeValue;

  const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const astroValue = astroEnv?.[key];
  if (typeof astroValue === "string" && astroValue.trim()) return astroValue;

  return runtimeValue ?? astroValue;
}

export function isTruthyEnv(value: string | undefined): boolean {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized === "1" || normalized === "true";
}
