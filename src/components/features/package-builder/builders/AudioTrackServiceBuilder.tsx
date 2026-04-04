import * as React from "react";

import BuilderShell from "@/components/features/package-builder/components/BuilderShell";
import BuilderStepFooter from "@/components/features/package-builder/components/BuilderStepFooter";
import PackageSummaryCard from "@/components/features/package-builder/components/PackageSummaryCard";
import PagedItemNav from "@/components/features/package-builder/components/PagedItemNav";
import ProjectStartDate from "@/components/features/package-builder/components/ProjectStartDate";
import { EXTRAS_PRICING, formatCurrency, getLengthSurcharge, TRACK_LENGTH_TIERS } from "@/components/features/package-builder/config/pricing";
import { useCollectionBuilder } from "@/components/features/package-builder/hooks/useCollectionBuilder";
import { inputClassName, narrowInputClassName, textareaClassName } from "@/components/features/package-builder/utils/field-styles";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

export type AudioTrackBuilderStep = "tracks" | "details" | "services" | "extras" | "startDate";

type ServiceConfig = {
  enabled: boolean;
  notes: string;
};

type TrackConfig<ServiceKey extends string> = {
  name: string;
  lengthMinutes: number | null;
  services: Record<ServiceKey, ServiceConfig>;
};

export type AudioTrackServiceDefinition<ServiceKey extends string> = {
  key: ServiceKey;
  label: string;
  notePlaceholder: string;
};

export type AudioTrackBuilderCopy = {
  stepTitles: Record<AudioTrackBuilderStep, string>;
  stepDescriptions: Record<AudioTrackBuilderStep, string>;
  trackCountLabel: string;
  trackNamePlaceholder: string;
  noteLabel: string;
  requestServiceName: string;
  requestSubject: string;
  summaryTitle?: string;
};

export type AudioTrackServiceBuilderProps<ServiceKey extends string> = {
  copy: AudioTrackBuilderCopy;
  serviceDefinitions: readonly AudioTrackServiceDefinition<ServiceKey>[];
  perServiceBase: number;
  onChangeCategory?: (() => void) | undefined;
};

function createEmptyTrack<ServiceKey extends string>(
  serviceDefinitions: readonly AudioTrackServiceDefinition<ServiceKey>[]
): TrackConfig<ServiceKey> {
  return {
    name: "",
    lengthMinutes: null,
    services: Object.fromEntries(
      serviceDefinitions.map((service) => [service.key, { enabled: false, notes: "" }])
    ) as Record<ServiceKey, ServiceConfig>,
  };
}

export default function AudioTrackServiceBuilder<ServiceKey extends string>({
  copy,
  serviceDefinitions,
  perServiceBase,
  onChangeCategory: _onChangeCategory,
}: AudioTrackServiceBuilderProps<ServiceKey>) {
  useDisplayCurrency();

  const [step, setStep] = React.useState<AudioTrackBuilderStep>("tracks");
  const [isPackageFinalized, setIsPackageFinalized] = React.useState(false);
  const [rushService2Days, setRushService2Days] = React.useState(false);
  const [unlimitedRevisions1Month, setUnlimitedRevisions1Month] = React.useState(false);
  const [projectStartDate, setProjectStartDate] = React.useState("");

  const createTrack = React.useCallback(
    () => createEmptyTrack(serviceDefinitions),
    [serviceDefinitions]
  );

  const {
    count: trackCount,
    setCount: setTrackCount,
    items: tracks,
    activeIndex: activeTrackIndex,
    setActiveIndex,
    activeItem: activeTrack,
    updateActiveItem,
    goToPreviousItem,
    goToNextItem,
  } = useCollectionBuilder({
    createEmptyItem: createTrack,
    initialCount: 1,
    minCount: 1,
  });

  React.useEffect(() => {
    setIsPackageFinalized(false);
  }, [trackCount, tracks, rushService2Days, unlimitedRevisions1Month, projectStartDate]);

  const activeTrackLengthSurcharge = React.useMemo(
    () => getLengthSurcharge(activeTrack?.lengthMinutes ?? null, TRACK_LENGTH_TIERS),
    [activeTrack?.lengthMinutes]
  );

  const trackTotals = React.useMemo(() => {
    return tracks.map((track) => {
      const surcharge = getLengthSurcharge(track.lengthMinutes, TRACK_LENGTH_TIERS);
      const enabledCount = serviceDefinitions.reduce(
        (sum, service) => sum + (track.services[service.key].enabled ? 1 : 0),
        0
      );
      return enabledCount * (perServiceBase + surcharge);
    });
  }, [perServiceBase, serviceDefinitions, tracks]);

  const servicesSubtotal = React.useMemo(() => trackTotals.reduce((sum, value) => sum + value, 0), [trackTotals]);

  const extrasSubtotal =
    (rushService2Days ? EXTRAS_PRICING.rushService2Days : 0) +
    (unlimitedRevisions1Month ? EXTRAS_PRICING.unlimitedRevisions1Month : 0);

  const total = servicesSubtotal + extrasSubtotal;

  const requestPackage = React.useMemo(() => {
    const lines: string[] = [];
    lines.push(`Service: ${copy.requestServiceName}`);
    lines.push(`Tracks: ${trackCount}`);
    lines.push(`Project start date: ${projectStartDate || "—"}`);

    tracks.forEach((track, idx) => {
      lines.push("");
      lines.push(`Track ${idx + 1}: ${track.name.trim() || "(unnamed)"}`);
      lines.push(`- Length: ${track.lengthMinutes == null ? "—" : `Up to ${track.lengthMinutes} min`}`);

      const lengthSurcharge = getLengthSurcharge(track.lengthMinutes, TRACK_LENGTH_TIERS);

      const enabledServices = serviceDefinitions
        .filter((service) => track.services[service.key].enabled)
        .map((service) => ({
          label: service.label,
          notes: track.services[service.key].notes.trim(),
          amount: perServiceBase + lengthSurcharge,
        }));

      const trackServicesSubtotal = enabledServices.reduce((sum, service) => sum + service.amount, 0);

      lines.push("- Price breakdown:");
      lines.push(`  - Per-service base: ${formatCurrency(perServiceBase)}`);
      if (lengthSurcharge > 0) {
        lines.push(`  - Length surcharge (per service): ${formatCurrency(lengthSurcharge)}`);
      }
      if (enabledServices.length > 0) {
        lines.push("  - Selected services:");
        enabledServices.forEach(({ label, notes, amount }) => {
          lines.push(
            `    - ${label}: ${formatCurrency(perServiceBase)} + ${formatCurrency(lengthSurcharge)} = ${formatCurrency(amount)}${notes ? ` — ${notes}` : ""}`
          );
        });
      }

      lines.push("- Track subtotal:");
      if (trackServicesSubtotal > 0) {
        lines.push(`  - services: ${formatCurrency(trackServicesSubtotal)}`);
      }
      lines.push(`- Track total: ${formatCurrency(trackServicesSubtotal)}`);
    });

    const extrasLineItems: Array<{ label: string; amount: number }> = [];
    if (rushService2Days) {
      extrasLineItems.push({ label: "Rush service (2 days)", amount: EXTRAS_PRICING.rushService2Days });
    }
    if (unlimitedRevisions1Month) {
      extrasLineItems.push({ label: "Unlimited revisions (1 month)", amount: EXTRAS_PRICING.unlimitedRevisions1Month });
    }

    if (extrasLineItems.length > 0) {
      lines.push("");
      lines.push("Extras:");
      extrasLineItems.forEach((item) => {
        lines.push(`- ${item.label}: ${formatCurrency(item.amount)}`);
      });
      lines.push(`- Extras total: ${formatCurrency(extrasSubtotal)}`);
    }

    lines.push("");
    lines.push("Package pricing summary:");
    if (servicesSubtotal > 0) {
      lines.push(`- Services subtotal: ${formatCurrency(servicesSubtotal)}`);
    }
    if (extrasSubtotal > 0) {
      lines.push(`- Extras subtotal: ${formatCurrency(extrasSubtotal)}`);
    }
    lines.push(`- Package total: ${formatCurrency(total)}`);

    return {
      subject: copy.requestSubject,
      summaryText: lines.join("\n"),
    };
  }, [
    copy.requestServiceName,
    copy.requestSubject,
    extrasSubtotal,
    perServiceBase,
    rushService2Days,
    serviceDefinitions,
    servicesSubtotal,
    total,
    trackCount,
    tracks,
    unlimitedRevisions1Month,
    projectStartDate,
  ]);

  const canGoNextFromTrack = Boolean(activeTrack?.lengthMinutes != null);

  const hasAnyServiceOnActiveTrack = React.useMemo(() => {
    if (!activeTrack) return false;
    return serviceDefinitions.some((service) => activeTrack.services[service.key].enabled);
  }, [activeTrack, serviceDefinitions]);

  function updateTrack(patch: Partial<TrackConfig<ServiceKey>>) {
    updateActiveItem(patch);
  }

  function updateService(key: ServiceKey, patch: Partial<ServiceConfig>) {
    updateActiveItem((current) => ({
      ...current,
      services: {
        ...current.services,
        [key]: {
          ...current.services[key],
          ...patch,
        },
      },
    }));
  }

  const summary = (
    <PackageSummaryCard
      title={copy.summaryTitle ?? "Package Summary"}
      total={formatCurrency(total)}
      canRequestPackage={isPackageFinalized && step === "startDate" && Boolean(projectStartDate)}
      requestPackage={requestPackage}
    >
      <div className="space-y-2 text-sm">
        <p className="font-medium">Tracks</p>
        {tracks.map((track, idx) => (
          <div key={idx} className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              Track {idx + 1}
              {track.name.trim() ? ` — ${track.name.trim()}` : ""}
            </span>
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
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Project start date</span>
          <span>{projectStartDate || "—"}</span>
        </div>
      </div>
    </PackageSummaryCard>
  );

  return (
    <BuilderShell summary={summary}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold">{copy.stepTitles[step]}</h2>
        <p className="text-sm text-muted-foreground">{copy.stepDescriptions[step]}</p>
      </div>

      {step === "tracks" && (
        <section className="space-y-4">
          <div className="rounded-lg border border-border p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {copy.trackCountLabel} <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={trackCount}
                onChange={(e) => setTrackCount(Math.max(1, Number(e.target.value) || 1))}
                className={narrowInputClassName}
              />
            </div>
          </div>

          <BuilderStepFooter
            currentStep={1}
            totalSteps={5}
            onNext={() => {
              setActiveIndex(0);
              setStep("details");
            }}
          />
        </section>
      )}

      {step === "details" && activeTrack && (
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
                onPrevious={goToPreviousItem}
                onNext={goToNextItem}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Track Name (optional)</label>
              <input
                type="text"
                value={activeTrack.name}
                onChange={(e) => updateTrack({ name: e.target.value })}
                className={inputClassName}
                placeholder={copy.trackNamePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Track Length <span className="text-destructive">*</span>
              </label>
              <select
                value={activeTrack.lengthMinutes == null ? "" : String(activeTrack.lengthMinutes)}
                onChange={(e) => {
                  const nextValue = e.target.value === "" ? null : Number(e.target.value);
                  updateTrack({ lengthMinutes: nextValue });
                }}
                className={inputClassName}
                required
              >
                <option value="">Select track length</option>
                {TRACK_LENGTH_TIERS.map((interval) => (
                  <option key={interval.max} value={interval.max}>
                    Up to {interval.max} min{interval.max > 1 ? "s" : ""}
                    {interval.surcharge > 0
                      ? ` (+${formatCurrency(interval.surcharge)}/service)`
                      : " (no surcharge)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <BuilderStepFooter
            currentStep={2}
            totalSteps={5}
            onBack={() => setStep("tracks")}
            onNext={() => setStep("services")}
            nextDisabled={!canGoNextFromTrack}
          />
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
                <div className="text-sm text-muted-foreground">
                  Length surcharge: {formatCurrency(activeTrackLengthSurcharge)}/service
                </div>
              </div>
              <PagedItemNav
                itemLabel="Track"
                currentIndex={activeTrackIndex}
                total={trackCount}
                onPrevious={goToPreviousItem}
                onNext={goToNextItem}
              />
            </div>

            <div>
              {serviceDefinitions.map((service, index) => {
                const config = activeTrack.services[service.key];
                return (
                  <div key={service.key}>
                    <div className="py-4 space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) => updateService(service.key, { enabled: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <span className="font-medium">{service.label}</span>
                        <span className="text-sm text-muted-foreground">
                          ({formatCurrency(perServiceBase)} + {formatCurrency(activeTrackLengthSurcharge)})
                        </span>
                      </label>

                      {config.enabled && (
                        <div className="space-y-1">
                          <label className="text-sm text-muted-foreground">{copy.noteLabel}</label>
                          <textarea
                            value={config.notes}
                            onChange={(e) => updateService(service.key, { notes: e.target.value })}
                            className={textareaClassName}
                            rows={3}
                            placeholder={service.notePlaceholder}
                          />
                        </div>
                      )}
                    </div>

                    {index < serviceDefinitions.length - 1 && <div className="h-px bg-border w-[85%] mx-auto" />}
                  </div>
                );
              })}
            </div>
          </div>

          <BuilderStepFooter
            currentStep={3}
            totalSteps={5}
            onBack={() => setStep("details")}
            onNext={() => {
              if (activeTrackIndex >= trackCount - 1) {
                setStep("extras");
                return;
              }
              setActiveIndex((prev) => Math.min(trackCount - 1, prev + 1));
              setStep("details");
            }}
            nextDisabled={!hasAnyServiceOnActiveTrack}
            nextLabel={activeTrackIndex >= trackCount - 1 ? "Next" : "Next track"}
          />
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
              <span className="text-sm text-muted-foreground">
                (+{formatCurrency(EXTRAS_PRICING.rushService2Days)})
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={unlimitedRevisions1Month}
                onChange={(e) => setUnlimitedRevisions1Month(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="font-medium">Unlimited revisions (1 month)</span>
              <span className="text-sm text-muted-foreground">
                (+{formatCurrency(EXTRAS_PRICING.unlimitedRevisions1Month)})
              </span>
            </label>
          </div>

          <BuilderStepFooter
            currentStep={4}
            totalSteps={5}
            onBack={() => {
              setActiveIndex(trackCount - 1);
              setStep("services");
            }}
            onNext={() => setStep("startDate")}
            nextLabel="Next"
          />
        </section>
      )}

      {step === "startDate" && (
        <section className="space-y-5">
          <ProjectStartDate
            selectedDate={projectStartDate}
            onSelectDate={setProjectStartDate}
          />

          <BuilderStepFooter
            currentStep={5}
            totalSteps={5}
            onBack={() => setStep("extras")}
            onNext={() => setIsPackageFinalized(true)}
            nextDisabled={!projectStartDate}
            nextLabel="Done"
          />
        </section>
      )}
    </BuilderShell>
  );
}
