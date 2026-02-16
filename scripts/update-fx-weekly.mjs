import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_PATH = path.resolve(__dirname, "../src/lib/pricing/fx-weekly-snapshot.ts");
const FX_URL = "https://open.er-api.com/v6/latest/CAD";

const DEFAULT_SUPPORTED_CURRENCIES = ["CAD", "USD", "EUR", "GBP"];
const FALLBACK_RATES = {
  CAD: 1,
  USD: 0.74,
  EUR: 0.68,
  GBP: 0.58,
};

const now = new Date();
const fetchedAt = now.toISOString();
const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

async function fetchFxRates() {
  const response = await fetch(FX_URL, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`FX request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const rates = payload?.rates;
  if (!rates || typeof rates !== "object") {
    throw new Error("FX response missing rates object");
  }

  const parsed = {
    CAD: Number(rates.CAD ?? 1),
    USD: Number(rates.USD),
    EUR: Number(rates.EUR),
    GBP: Number(rates.GBP),
  };

  if (!Number.isFinite(parsed.USD) || !Number.isFinite(parsed.EUR) || !Number.isFinite(parsed.GBP)) {
    throw new Error("FX response missing required currency rates");
  }

  return parsed;
}

function serializeSnapshot(rates) {
  return `import type { FxRatesSnapshot } from "@/lib/pricing/types";

export const fxWeeklySnapshot: FxRatesSnapshot = {
  baseCurrency: "CAD",
  fetchedAt: "${fetchedAt}",
  validUntil: "${validUntil}",
  provider: "lemon-squeezy",
  providerSupportedCurrencies: ${JSON.stringify(DEFAULT_SUPPORTED_CURRENCIES)},
  rates: {
    CAD: ${rates.CAD},
    USD: ${rates.USD},
    EUR: ${rates.EUR},
    GBP: ${rates.GBP},
  },
};
`;
}

async function main() {
  let rates = FALLBACK_RATES;
  try {
    rates = await fetchFxRates();
  } catch (error) {
    console.warn("Using fallback FX rates:", error instanceof Error ? error.message : String(error));
  }

  const output = serializeSnapshot(rates);
  await writeFile(TARGET_PATH, output, "utf8");
  console.log(`Updated weekly FX snapshot at ${TARGET_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
