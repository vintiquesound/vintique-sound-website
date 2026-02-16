import * as React from "react";

import { Button } from "@/components/ui/button";

import PackageSummaryCard from "@/components/build-your-package/PackageSummaryCard";
import PagedItemNav from "@/components/build-your-package/PagedItemNav";
import { EDITING_SERVICE_NOTE_PLACEHOLDERS } from "@/components/build-your-package/service-note-placeholders";
import { EDITING_SERVICE_PER_TRACK_CAD_CENTS, cadCentsToDollars } from "@/lib/pricing/catalog";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

import { clampInt, EXTRAS_PRICING, formatCurrency, getLengthSurcharge, TRACK_LENGTH_TIERS } from "./pricing";

type BuilderStep = "tracks" | "track" | "services" | "extras";

type ServiceKey = "timeAlignment" | "comping" | "vocalTuning" | "instrumentTuning" | "cleanupNoiseRemoval";

type ServiceConfig = {
  enabled: boolean;
  notes: string;
};

type TrackConfig = {
  name: string;
  lengthMinutes: number | null;
  services: Record<ServiceKey, ServiceConfig>;
};

const SERVICE_LABELS: Record<ServiceKey, string> = {
  timeAlignment: "Time alignment",
  comping: "Comping",
  vocalTuning: "Vocal tuning",
  instrumentTuning: "Instrument tuning",
  cleanupNoiseRemoval: "Cleanup / noise removal",
};


const PER_SERVICE_BASE = cadCentsToDollars(EDITING_SERVICE_PER_TRACK_CAD_CENTS.timeAlignment);

function createEmptyTrack(): TrackConfig {
  return {
    name: "",
    lengthMinutes: null,
    services: {
      timeAlignment: { enabled: false, notes: "" },
      comping: { enabled: false, notes: "" },
      vocalTuning: { enabled: false, notes: "" },
      instrumentTuning: { enabled: false, notes: "" },
      cleanupNoiseRemoval: { enabled: false, notes: "" },
    },
  };
}

function ensureTrackCount(tracks: TrackConfig[], desiredCount: number) {
  const next = tracks.slice(0, desiredCount);
  while (next.length < desiredCount) next.push(createEmptyTrack());
  return next;
}

export type AudioEditingBuilderProps = {
  onChangeCategory?: () => void;
};

export default function AudioEditingBuilder({ onChangeCategory: _onChangeCategory }: AudioEditingBuilderProps) {
  useDisplayCurrency();

  const [step, setStep] = React.useState<BuilderStep>("tracks");
  const [trackCount, setTrackCount] = React.useState(1);
  const [tracks, setTracks] = React.useState<TrackConfig[]>(() => [createEmptyTrack()]);
  const [activeTrackIndex, setActiveTrackIndex] = React.useState(0);

  const [rushService2Days, setRushService2Days] = React.useState(false);
  const [unlimitedRevisions1Month, setUnlimitedRevisions1Month] = React.useState(false);

  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const narrowInputClassName =
    "flex h-10 w-24 rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const textareaClassName =
    "flex w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  React.useEffect(() => {
    setTracks((prev) => ensureTrackCount(prev, trackCount));
    setActiveTrackIndex((prev) => clampInt(prev, 0, Math.max(0, trackCount - 1)));
  }, [trackCount]);

  const activeTrack = tracks[activeTrackIndex];

  const activeTrackLengthSurcharge = React.useMemo(
    () => getLengthSurcharge(activeTrack?.lengthMinutes ?? null, TRACK_LENGTH_TIERS),
    [activeTrack?.lengthMinutes]
  );

  const trackTotals = React.useMemo(() => {
    return tracks.map((track) => {
      const surcharge = getLengthSurcharge(track.lengthMinutes, TRACK_LENGTH_TIERS);
      let enabledCount = 0;
      for (const key of Object.keys(track.services) as ServiceKey[]) {
        if (track.services[key].enabled) enabledCount += 1;
      }
      return enabledCount * (PER_SERVICE_BASE + surcharge);
    });
  }, [tracks]);

  const servicesSubtotal = React.useMemo(() => trackTotals.reduce((sum, v) => sum + v, 0), [trackTotals]);

  const extrasSubtotal =
    (rushService2Days ? EXTRAS_PRICING.rushService2Days : 0) +
    (unlimitedRevisions1Month ? EXTRAS_PRICING.unlimitedRevisions1Month : 0);

  const total = servicesSubtotal + extrasSubtotal;

  const showAddToCart = step === "extras";

  const requestPackage = React.useMemo(() => {
    const lines: string[] = [];
    lines.push("Service: Audio Editing");
    lines.push(`Tracks: ${trackCount}`);

    tracks.forEach((track, idx) => {
      lines.push("");
      lines.push(`Track ${idx + 1}${track.name.trim() ? ` — ${track.name.trim()}` : ""}`);
      lines.push(`Length: ${track.lengthMinutes == null ? "—" : `Up to ${track.lengthMinutes} min`}`);

      const enabled = (Object.keys(track.services) as ServiceKey[])
        .filter((k) => track.services[k].enabled)
        .map((k) => ({ key: k, notes: track.services[k].notes.trim() }));

      if (enabled.length === 0) {
        lines.push("Services: —");
      } else {
        lines.push("Services:");
        enabled.forEach(({ key, notes }) => {
          lines.push(`- ${SERVICE_LABELS[key]}${notes ? ` — ${notes}` : ""}`);
        });
      }
    });

    lines.push("");
    lines.push("Extras:");
    lines.push(`- Rush service (2 days): ${rushService2Days ? "Yes" : "No"}`);
    lines.push(`- Unlimited revisions (1 month): ${unlimitedRevisions1Month ? "Yes" : "No"}`);

    return {
      subject: "Package Request — Audio Editing",
      summaryText: lines.join("\n"),
    };
  }, [trackCount, tracks, rushService2Days, unlimitedRevisions1Month]);

  const canStartTracks = trackCount >= 1;
  const canGoNextFromTrack = Boolean(activeTrack?.lengthMinutes != null);

  const hasAnyServiceOnActiveTrack = React.useMemo(() => {
    if (!activeTrack) return false;
    return (Object.keys(activeTrack.services) as ServiceKey[]).some((k) => activeTrack.services[k].enabled);
  }, [activeTrack]);

  function updateActiveTrack(patch: Partial<TrackConfig>) {
    setTracks((prev) => {
      const next = prev.slice();
      const current = next[activeTrackIndex] ?? createEmptyTrack();
      next[activeTrackIndex] = { ...current, ...patch };
      return next;
    });
  }

  function updateActiveService(key: ServiceKey, patch: Partial<ServiceConfig>) {
    setTracks((prev) => {
      const next = prev.slice();
      const current = next[activeTrackIndex] ?? createEmptyTrack();
      next[activeTrackIndex] = {
        ...current,
        services: {
          ...current.services,
          [key]: {
            ...current.services[key],
            ...patch,
          },
        },
      };
      return next;
    });
  }

  function goToNextTrackAfterServices() {
    if (activeTrackIndex >= trackCount - 1) {
      setStep("extras");
      return;
    }

    setActiveTrackIndex((i) => Math.min(trackCount - 1, i + 1));
    setStep("track");
  }

  function goToPreviousTrackFromTrackStep() {
    if (activeTrackIndex <= 0) {
      setStep("tracks");
      return;
    }

    setActiveTrackIndex((i) => Math.max(0, i - 1));
    setStep("services");
  }

  function goToPreviousTrackInPlace() {
    setActiveTrackIndex((i) => Math.max(0, i - 1));
  }

  function goToNextTrackInPlace() {
    setActiveTrackIndex((i) => Math.min(trackCount - 1, i + 1));
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-2 space-y-8">
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold">
            {step === "tracks"
              ? "Tracks"
              : step === "track"
                ? "Track Length"
                : step === "services"
                  ? "Editing Services"
                  : "Extras"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Audio editing pricing is per track. Each enabled service adds {formatCurrency(PER_SERVICE_BASE)} + a length surcharge.
          </p>
        </div>

        {step === "tracks" && (
          <section className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">How many tracks need editing? <span className="text-destructive">*</span></label>
                <input
                  type="number"
                  min={1}
                  value={trackCount}
                  onChange={(e) => setTrackCount(Math.max(1, Number(e.target.value) || 1))}
                  className={narrowInputClassName}
                />
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="text-sm text-muted-foreground">Step 1 of 3</p>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setActiveTrackIndex(0);
                    setStep("track");
                  }}
                  disabled={!canStartTracks}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        )}

        {step === "track" && activeTrack && (
          <section className="space-y-4">
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-medium">
                    Track {activeTrackIndex + 1} of {trackCount}
                    {activeTrack.name.trim() && (
                      <span className="text-muted-foreground"> — {activeTrack.name.trim()}</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Set the typical length for this track.</div>
                </div>
                <PagedItemNav
                  itemLabel="Track"
                  currentIndex={activeTrackIndex}
                  total={trackCount}
                  onPrevious={goToPreviousTrackInPlace}
                  onNext={goToNextTrackInPlace}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Track Name (optional)</label>
                <input
                  type="text"
                  value={activeTrack.name}
                  onChange={(e) => updateActiveTrack({ name: e.target.value })}
                  className={inputClassName}
                  placeholder="Example: Track 1 — Intro"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Track Length <span className="text-destructive">*</span></label>
                <select
                  value={activeTrack.lengthMinutes == null ? "" : String(activeTrack.lengthMinutes)}
                  onChange={(e) => {
                    const val = e.target.value === "" ? null : Number(e.target.value);
                    updateActiveTrack({ lengthMinutes: val });
                  }}
                  className={inputClassName}
                  required
                >
                  <option value="">Select track length</option>
                  {TRACK_LENGTH_TIERS.map((interval) => (
                    <option key={interval.max} value={interval.max}>
                      Up to {interval.max} min{interval.max > 1 ? "s" : ""}
                      {interval.surcharge > 0 ? ` (+${formatCurrency(interval.surcharge)}/service)` : " (no surcharge)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="text-sm text-muted-foreground">Step 2 of 3</p>
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={goToPreviousTrackFromTrackStep}>
                  Back
                </Button>
                <Button type="button" onClick={() => setStep("services")} disabled={!canGoNextFromTrack}>
                  Next
                </Button>
              </div>
            </div>
          </section>
        )}

        {step === "services" && activeTrack && (
          <section className="space-y-5">
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">
                    Track {activeTrackIndex + 1} of {trackCount}
                    {activeTrack.name.trim() && (
                      <span className="text-muted-foreground"> — {activeTrack.name.trim()}</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Length surcharge: {formatCurrency(activeTrackLengthSurcharge)}/service</div>
                </div>
                <PagedItemNav
                  itemLabel="Track"
                  currentIndex={activeTrackIndex}
                  total={trackCount}
                  onPrevious={goToPreviousTrackInPlace}
                  onNext={goToNextTrackInPlace}
                />
              </div>

              <div>
                {(Object.keys(activeTrack.services) as ServiceKey[]).map((key, index, list) => {
                  const cfg = activeTrack.services[key];
                  return (
                    <div key={key}>
                      <div className="py-4 space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={cfg.enabled}
                            onChange={(e) => updateActiveService(key, { enabled: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <span className="font-medium">{SERVICE_LABELS[key]}</span>
                          <span className="text-sm text-muted-foreground">
                            ({formatCurrency(PER_SERVICE_BASE)} + {formatCurrency(activeTrackLengthSurcharge)})
                          </span>
                        </label>

                        {cfg.enabled && (
                          <div className="space-y-1">
                            <label className="text-sm text-muted-foreground">Notes</label>
                            <textarea
                              value={cfg.notes}
                              onChange={(e) => updateActiveService(key, { notes: e.target.value })}
                              className={textareaClassName}
                              rows={3}
                              placeholder={EDITING_SERVICE_NOTE_PLACEHOLDERS[key]}
                            />
                          </div>
                        )}
                      </div>

                      {index < list.length - 1 && <div className="h-px bg-border w-[85%] mx-auto" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="text-sm text-muted-foreground">Step 3 of 3</p>
              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep("track")}>
                  Back
                </Button>
                <Button type="button" onClick={goToNextTrackAfterServices} disabled={!hasAnyServiceOnActiveTrack}>
                  {activeTrackIndex >= trackCount - 1 ? "Next" : "Next track"}
                </Button>
              </div>
            </div>
          </section>
        )}

        {step === "extras" && (
          <section className="space-y-5">
            <div className="rounded-lg border border-border p-4 space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={rushService2Days}
                  onChange={(e) => setRushService2Days(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="font-medium">Rush service (2 days)</span>
                <span className="text-sm text-muted-foreground">(+{formatCurrency(EXTRAS_PRICING.rushService2Days)})</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={unlimitedRevisions1Month}
                  onChange={(e) => setUnlimitedRevisions1Month(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="font-medium">Unlimited revisions (1 month)</span>
                <span className="text-sm text-muted-foreground">(+{formatCurrency(EXTRAS_PRICING.unlimitedRevisions1Month)})</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setActiveTrackIndex(trackCount - 1);
                  setStep("services");
                }}
              >
                Back
              </Button>
            </div>
          </section>
        )}
      </div>

      <PackageSummaryCard
        total={formatCurrency(total)}
        showAddToCart={showAddToCart}
        requestPackage={requestPackage}
      >
        <div className="space-y-2 text-sm">
          <p className="font-medium">Tracks</p>
          {tracks.map((track, idx) => (
            <div key={idx} className="flex justify-between gap-3">
              <span className="text-muted-foreground">Track {idx + 1}{track.name.trim() ? ` — ${track.name.trim()}` : ""}</span>
              <span>{formatCurrency(trackTotals[idx] ?? 0)}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-2 text-sm">
          <p className="font-medium">Extras</p>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Rush</span>
            <span>{formatCurrency(rushService2Days ? EXTRAS_PRICING.rushService2Days : 0)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Unlimited revisions</span>
            <span>{formatCurrency(unlimitedRevisions1Month ? EXTRAS_PRICING.unlimitedRevisions1Month : 0)}</span>
          </div>
        </div>
      </PackageSummaryCard>
    </div>
  );
}
