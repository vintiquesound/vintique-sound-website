import * as React from "react";

import { Button } from "@/components/ui/button";

type ProjectType = "single" | "album";
type BuilderStep = "project" | "songs";
type SongStep = "details" | "base" | "alignment" | "exports" | "addons";

type MixService = "mix" | "master" | "mixAndMaster" | "stemMaster";
type ServiceSelection = MixService | "";
type AdditionalMixVersion = "instrumental" | "acapella" | "radioEdit" | "cleanVersion";

type TrackCountTier = { max: number; surcharge: number };

type SongConfig = {
  name: string;
  service: ServiceSelection;
  trackCount: number | null;
  lengthMinutes: number | null;
  timeAlignment: { enabled: boolean; trackCount: number };
  vocalTuning: { enabled: boolean; trackCount: number };
  multitrackExport: boolean;
  additionalMixVersions: Record<AdditionalMixVersion, boolean>;
  rushService2Days: boolean;
  unlimitedRevisions1Month: boolean;
};

const MIXING_TRACK_TIERS: TrackCountTier[] = [
  { max: 1, surcharge: 0 },
  { max: 4, surcharge: 5 },
  { max: 8, surcharge: 10 },
  { max: 12, surcharge: 15 },
  { max: 16, surcharge: 20 },
  { max: 24, surcharge: 30 },
  { max: 32, surcharge: 40 },
  { max: 40, surcharge: 50 },
  { max: 48, surcharge: 60 },
  { max: 64, surcharge: 80 },
  { max: 72, surcharge: 90 },
];

const STEM_MASTERING_TRACK_TIERS: TrackCountTier[] = [
  { max: 4, surcharge: 0 },
  { max: 6, surcharge: 10 },
  { max: 8, surcharge: 20 },
  { max: 10, surcharge: 30 },
  { max: 12, surcharge: 40 },
];

const MIXING_SONG_LENGTH_TIERS = [
  { max: 1, surcharge: 0 },
  { max: 2, surcharge: 10 },
  { max: 4, surcharge: 20 },
  { max: 6, surcharge: 30 },
  { max: 8, surcharge: 40 },
  { max: 12, surcharge: 60 },
  { max: 16, surcharge: 80 },
];

const MASTERING_SONG_LENGTH_TIERS = [
  { max: 1, surcharge: 0 },
  { max: 2, surcharge: 10 },
  { max: 4, surcharge: 20 },
  { max: 6, surcharge: 25 },
  { max: 8, surcharge: 30 },
  { max: 12, surcharge: 40 },
  { max: 16, surcharge: 50 },
];

const STEM_MASTERING_SONG_LENGTH_TIERS = [
  { max: 1, surcharge: 0 },
  { max: 2, surcharge: 5 },
  { max: 4, surcharge: 10 },
  { max: 6, surcharge: 15 },
  { max: 8, surcharge: 20 },
  { max: 12, surcharge: 30 },
  { max: 16, surcharge: 40 },
];

const PRICING = {
  mixing: {
    base: 190,
    trackTiers: MIXING_TRACK_TIERS,
    songLengthTiers: MIXING_SONG_LENGTH_TIERS,
  },

  mastering: {
    base: 30,
    trackTiers: [{ max: 1, surcharge: 0 }],
    songLengthTiers: MASTERING_SONG_LENGTH_TIERS,
  },

  mixingAndMastering: {
    base: 220,
    trackTiers: MIXING_TRACK_TIERS,
    songLengthTiers: MIXING_SONG_LENGTH_TIERS,
  },

  stemMastering: {
    base: 70,
    trackTiers: STEM_MASTERING_TRACK_TIERS,
    songLengthTiers: STEM_MASTERING_SONG_LENGTH_TIERS,
  },

  timeAlignment: {
    perTrack: 10,
  },

  vocalTuning: {
    perTrack: 10,
  },

  multitrackExport: {
    flat: 80,
  },

  additionalExports: {
    instrumental: 30,
    acapella: 30,
    radioEdit: 80,
    cleanVersion: 80,
  },

  rushService2Days: 100,
  unlimitedRevisions1Month: 80,
} as const;

function getSongLengthSurcharge(lengthMinutes: number | null, service?: ServiceSelection): number {
  if (lengthMinutes == null) return 0;
  let tiers = MIXING_SONG_LENGTH_TIERS;
  if (service) {
    const pricing = getServicePricing(service as MixService);
    if (pricing && Array.isArray((pricing as any).songLengthTiers)) {
      tiers = (pricing as any).songLengthTiers;
    }
  }
  for (const interval of tiers) {
    if (lengthMinutes <= interval.max) return interval.surcharge;
  }
  const last = tiers.at(-1);
  return last?.surcharge ?? 0;
}

type ServicePricing = {
  base: number;
  trackTiers: readonly TrackCountTier[];
};

function getServicePricing(service: MixService): ServicePricing {
  switch (service) {
    case "mix":
      return PRICING.mixing;
    case "master":
      return PRICING.mastering;
    case "mixAndMaster":
      return PRICING.mixingAndMastering;
    case "stemMaster":
      return PRICING.stemMastering;
  }
}

function normalizeTrackCountForService(service: ServiceSelection, trackCount: number | null) {
  if (!service) return trackCount;
  if (service === "master") return 1;
  if (trackCount == null) return null;

  const tiers = getServicePricing(service).trackTiers;
  const matched = tiers.find((t) => trackCount <= t.max);
  return (matched ?? tiers.at(-1))?.max ?? null;
}

function getTrackCountSurcharge(service: ServiceSelection, trackCount: number | null) {
  if (!service) return 0;
  if (service === "master") return 0;
  if (trackCount == null) return 0;

  const tiers = getServicePricing(service).trackTiers;
  const matched = tiers.find((t) => trackCount <= t.max);
  return (matched ?? tiers.at(-1))?.surcharge ?? 0;
}

function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function formatCurrency(amount: number) {
  const normalized = Number.isFinite(amount) ? amount : 0;
  return normalized.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function createEmptySong(): SongConfig {
  return {
    name: "",
    service: "",
    trackCount: null,
    lengthMinutes: null,
    timeAlignment: { enabled: false, trackCount: 1 },
    vocalTuning: { enabled: false, trackCount: 1 },
    multitrackExport: false,
    additionalMixVersions: {
      instrumental: false,
      acapella: false,
      radioEdit: false,
      cleanVersion: false,
    },
    rushService2Days: false,
    unlimitedRevisions1Month: false,
  };
}

function ensureSongCount(songs: SongConfig[], desiredCount: number) {
  const next = songs.slice(0, desiredCount);
  while (next.length < desiredCount) next.push(createEmptySong());
  return next;
}

function getAdditionalExportsPrice(versions: Record<AdditionalMixVersion, boolean>) {
  let total = 0;
  if (versions.instrumental) total += PRICING.additionalExports.instrumental;
  if (versions.acapella) total += PRICING.additionalExports.acapella;
  return total;
}

function getAdditionalEditsPrice(versions: Record<AdditionalMixVersion, boolean>) {
  let total = 0;
  if (versions.radioEdit) total += PRICING.additionalExports.radioEdit;
  if (versions.cleanVersion) total += PRICING.additionalExports.cleanVersion;
  return total;
}

function computeSongPrice(song: SongConfig) {
  if (!song.service) return 0;

  const pricing = getServicePricing(song.service);
  const base = pricing.base;
  const trackSurcharge = getTrackCountSurcharge(song.service, song.trackCount);
  const lengthSurcharge = getSongLengthSurcharge(song.lengthMinutes, song.service);

  const effectiveTrackCount = song.service === "master" ? 1 : song.trackCount ?? 1;

  const timeAlignPrice = song.timeAlignment.enabled
    ? PRICING.timeAlignment.perTrack * clampInt(song.timeAlignment.trackCount, 1, effectiveTrackCount)
    : 0;

  const vocalTuningPrice = song.vocalTuning.enabled
    ? PRICING.vocalTuning.perTrack * clampInt(song.vocalTuning.trackCount, 1, effectiveTrackCount)
    : 0;

  const multitrackExportPrice = song.multitrackExport ? PRICING.multitrackExport.flat : 0;
  const additionalExportsPrice = getAdditionalExportsPrice(song.additionalMixVersions);
  const additionalEditsPrice = getAdditionalEditsPrice(song.additionalMixVersions);
  const rushPrice = song.rushService2Days ? PRICING.rushService2Days : 0;
  const revisionsPrice = song.unlimitedRevisions1Month ? PRICING.unlimitedRevisions1Month : 0;

  return (
    base +
    trackSurcharge +
    lengthSurcharge +
    timeAlignPrice +
    vocalTuningPrice +
    multitrackExportPrice +
    additionalExportsPrice +
    additionalEditsPrice +
    rushPrice +
    revisionsPrice
  );
}

function isSongConfigured(song: SongConfig) {
  const songNameOk = song.name.trim().length > 0;
  const serviceSelected = Boolean(song.service);
  const lengthSelected = song.lengthMinutes != null;
  const trackCountSelected = song.service === "master" ? true : song.trackCount != null;
  return songNameOk && serviceSelected && trackCountSelected && lengthSelected;
}

function computeSongBreakdown(song: SongConfig) {
  if (!song.service) {
    return {
      detailsSubtotal: 0,
      alignmentSubtotal: 0,
      exportsSubtotal: 0,
      addonsSubtotal: 0,
      songTotal: 0,
    };
  }

  const pricing = getServicePricing(song.service);
  const base = pricing.base;
  const trackSurcharge = getTrackCountSurcharge(song.service, song.trackCount);
  const lengthSurcharge = getSongLengthSurcharge(song.lengthMinutes, song.service);

  const effectiveTrackCount = song.service === "master" ? 1 : song.trackCount ?? 1;

  const timeAlignPrice = song.timeAlignment.enabled
    ? PRICING.timeAlignment.perTrack * clampInt(song.timeAlignment.trackCount, 1, effectiveTrackCount)
    : 0;

  const vocalTuningPrice = song.vocalTuning.enabled
    ? PRICING.vocalTuning.perTrack * clampInt(song.vocalTuning.trackCount, 1, effectiveTrackCount)
    : 0;

  const multitrackExportPrice = song.multitrackExport ? PRICING.multitrackExport.flat : 0;
  const additionalExportsPrice = getAdditionalExportsPrice(song.additionalMixVersions);
  const additionalEditsPrice = getAdditionalEditsPrice(song.additionalMixVersions);
  const rushPrice = song.rushService2Days ? PRICING.rushService2Days : 0;
  const revisionsPrice = song.unlimitedRevisions1Month ? PRICING.unlimitedRevisions1Month : 0;

  const detailsSubtotal = base + trackSurcharge + lengthSurcharge;
  const alignmentSubtotal = timeAlignPrice + vocalTuningPrice;
  const exportsSubtotal = multitrackExportPrice + additionalExportsPrice;
  const addonsSubtotal = additionalEditsPrice + rushPrice + revisionsPrice;
  const songTotal = detailsSubtotal + alignmentSubtotal + exportsSubtotal + addonsSubtotal;

  return {
    detailsSubtotal,
    alignmentSubtotal,
    exportsSubtotal,
    addonsSubtotal,
    songTotal,
  };
}

export default function PackageBuilder() {
  const [step, setStep] = React.useState<BuilderStep>("project");
  const [songStep, setSongStep] = React.useState<SongStep>("details");
  const [projectType, setProjectType] = React.useState<ProjectType>("single");
  const [songCount, setSongCount] = React.useState(1);
  const [artistName, setArtistName] = React.useState("");
  const [albumName, setAlbumName] = React.useState("");

  const [songs, setSongs] = React.useState<SongConfig[]>(() => [createEmptySong()]);
  const [activeSongIndex, setActiveSongIndex] = React.useState(0);
  const [duplicateToNextSong, setDuplicateToNextSong] = React.useState(false);

  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const narrowInputClassName =
    "flex h-10 w-24 rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  React.useEffect(() => {
    if (projectType === "single") {
      setSongCount(1);
      setAlbumName("");
    } else {
      setSongCount((prev) => Math.max(2, prev));
    }
  }, [projectType]);

  React.useEffect(() => {
    const desiredCount = projectType === "album" ? Math.max(2, songCount) : 1;
    setSongs((prev) => ensureSongCount(prev, desiredCount));
    setActiveSongIndex((prev) => clampInt(prev, 0, Math.max(0, desiredCount - 1)));
  }, [projectType, songCount]);

  React.useEffect(() => {
    if (step !== "songs") return;
    setSongStep("details");
    setDuplicateToNextSong(false);
  }, [activeSongIndex, step]);

  const total = React.useMemo(() => songs.reduce((sum, song) => sum + computeSongPrice(song), 0), [
    songs,
  ]);

  const canGoNextFromProject = React.useMemo(() => {
    const hasArtist = artistName.trim().length > 0;
    const hasAlbumName = projectType === "album" ? albumName.trim().length > 0 : true;
    return hasArtist && hasAlbumName;
  }, [artistName, albumName, projectType]);

  const activeSong = songs[activeSongIndex];
  const activeSongTrackCount = activeSong?.service === "master" ? 1 : activeSong?.trackCount ?? 1;
  const canGoNextFromSongDetails = React.useMemo(() => {
    const songNameOk = (activeSong?.name ?? "").trim().length > 0;
    return songNameOk;
  }, [activeSong]);

  const canGoNextFromBase = React.useMemo(() => {
    const serviceSelected = Boolean(activeSong?.service);
    const lengthSelected = activeSong?.lengthMinutes != null;
    const trackCountSelected = activeSong?.service === "master" ? true : activeSong?.trackCount != null;
    return serviceSelected && trackCountSelected && lengthSelected;
  }, [activeSong]);

  const activeSongBreakdown = React.useMemo(
    () => (activeSong ? computeSongBreakdown(activeSong) : null),
    [activeSong]
  );

  function updateActiveSong(patch: Partial<SongConfig>) {
    setSongs((prev) => {
      const next = prev.slice();
      const current = next[activeSongIndex] ?? createEmptySong();
      let merged = { ...current, ...patch };

      merged.trackCount = normalizeTrackCountForService(merged.service, merged.trackCount);
      const effectiveTrackCount = merged.service === "master" ? 1 : merged.trackCount ?? 1;

      merged.timeAlignment = {
        ...merged.timeAlignment,
        trackCount: clampInt(merged.timeAlignment.trackCount, 1, effectiveTrackCount),
      };
      merged.vocalTuning = {
        ...merged.vocalTuning,
        trackCount: clampInt(merged.vocalTuning.trackCount, 1, effectiveTrackCount),
      };

      next[activeSongIndex] = merged;
      return next;
    });
  }

  function goToNextSong() {
    if (activeSongIndex >= songs.length - 1) return;

    if (duplicateToNextSong) {
      setSongs((prev) => {
        const next = prev.slice();
        const current = next[activeSongIndex] ?? createEmptySong();
        const target = next[activeSongIndex + 1] ?? createEmptySong();
        next[activeSongIndex + 1] = {
          ...target,
          service: current.service,
          trackCount: current.trackCount,
          lengthMinutes: current.lengthMinutes,
          timeAlignment: { ...current.timeAlignment },
          vocalTuning: { ...current.vocalTuning },
          multitrackExport: current.multitrackExport,
          additionalMixVersions: { ...current.additionalMixVersions },
          rushService2Days: current.rushService2Days,
          unlimitedRevisions1Month: current.unlimitedRevisions1Month,
          // Do not copy song name.
          name: "",
        };
        return next;
      });
    }

    setActiveSongIndex((i) => Math.min(songs.length - 1, i + 1));
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Left: Configuration */}
      <div className="md:col-span-2 space-y-8">
        {step === "project" && (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Project Type</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant={projectType === "single" ? "solid" : "ghost"}
                  onClick={() => setProjectType("single")}
                >
                  Single
                </Button>
                <Button
                  type="button"
                  variant={projectType === "album" ? "solid" : "ghost"}
                  onClick={() => setProjectType("album")}
                >
                  Album / EP
                </Button>
              </div>
            </section>

            {projectType === "album" && (
              <section className="space-y-2">
                <h3 className="font-medium">Number of Songs</h3>
                <input
                  type="number"
                  min={2}
                  value={songCount}
                  onChange={(e) => setSongCount(Math.max(2, Number(e.target.value) || 2))}
                  className={narrowInputClassName}
                />
              </section>
            )}

            <section className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Artist Name <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>

              {projectType === "album" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Album Name <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    className={inputClassName}
                    required
                  />
                </div>
              )}
            </section>

            <div className="flex items-center justify-end">
              <Button
                type="button"
                onClick={() => {
                  setStep("songs");
                  setSongStep("details");
                }}
                disabled={!canGoNextFromProject}
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === "songs" && activeSong && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h2 className="text-xl font-semibold">
                  {songStep === "details"
                    ? "Song Details"
                    : songStep === "base"
                      ? "Base Services"
                    : songStep === "alignment"
                      ? "Addon Services"
                      : songStep === "exports"
                        ? "Exports"
                        : "Edits & Extras"}
                </h2>
                <p className="text-sm text-muted-foreground mb-1">
                  Song {activeSongIndex + 1} of {songs.length}
                  {activeSong?.name ? `: ${activeSong.name}` : ""}
                </p>
              </div>
              {projectType === "album" && songs.length > 1 && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveSongIndex((i) => Math.max(0, i - 1))}
                    disabled={activeSongIndex === 0}
                  >
                    Previous Song
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveSongIndex((i) => Math.min(songs.length - 1, i + 1))}
                    disabled={activeSongIndex >= songs.length - 1}
                  >
                    Next Song
                  </Button>
                </div>
              )}
            </div>

            <section className="space-y-5">
              {songStep === "details" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Song Name <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      value={activeSong.name}
                      onChange={(e) => updateActiveSong({ name: e.target.value })}
                      className={inputClassName}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Page 1 of 5
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep("project")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setSongStep("base")}
                        disabled={!canGoNextFromSongDetails}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {songStep === "base" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service <span className="text-destructive">*</span></label>
                    <select
                      value={activeSong.service}
                      onChange={(e) => {
                        const nextService = e.target.value as ServiceSelection;
                        if (nextService === "") {
                          updateActiveSong({ service: "", trackCount: null, lengthMinutes: null });
                          return;
                        }
                        if (nextService === "master") {
                          updateActiveSong({ service: nextService, trackCount: 1 });
                          return;
                        }
                        updateActiveSong({
                          service: nextService,
                          trackCount: normalizeTrackCountForService(nextService, activeSong.trackCount),
                        });
                      }}
                      className={inputClassName}
                      required
                    >
                      <option value="">Please select a service</option>
                      <option value="mix">Mix ({formatCurrency(PRICING.mixing.base)})</option>
                      <option value="master">Master ({formatCurrency(PRICING.mastering.base)})</option>
                      <option value="mixAndMaster">Mix + Master ({formatCurrency(PRICING.mixingAndMastering.base)})</option>
                      <option value="stemMaster">Stem Master ({formatCurrency(PRICING.stemMastering.base)})</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Tracks in the Song <span className="text-destructive">*</span></label>
                    <select
                      value={
                        activeSong.service === "master"
                          ? "1"
                          : activeSong.trackCount == null
                            ? ""
                            : String(activeSong.trackCount)
                      }
                      onChange={(e) => {
                        const nextValue = e.target.value === "" ? null : Number(e.target.value);
                        updateActiveSong({
                          trackCount: nextValue,
                          timeAlignment: {
                            ...activeSong.timeAlignment,
                            trackCount: clampInt(activeSong.timeAlignment.trackCount, 1, nextValue ?? 1),
                          },
                          vocalTuning: {
                            ...activeSong.vocalTuning,
                            trackCount: clampInt(activeSong.vocalTuning.trackCount, 1, nextValue ?? 1),
                          },
                        });
                      }}
                      className={inputClassName}
                      required
                      disabled={!activeSong.service || activeSong.service === "master"}
                    >
                      {activeSong.service !== "master" && <option value="">Select track count</option>}
                      {(activeSong.service ? getServicePricing(activeSong.service as MixService).trackTiers : []).map(
                        (tier) => (
                          <option key={tier.max} value={tier.max}>
                            Up to {tier.max} track{tier.max === 1 ? "" : "s"}
                            {tier.surcharge > 0
                              ? ` (+${formatCurrency(tier.surcharge)})`
                              : " (no surcharge)"}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Song Length <span className="text-destructive">*</span></label>
                    <select
                      value={activeSong.lengthMinutes == null ? "" : String(activeSong.lengthMinutes)}
                      onChange={e => {
                        const val = e.target.value === "" ? null : Number(e.target.value);
                        updateActiveSong({ lengthMinutes: val });
                      }}
                      className={inputClassName}
                      required
                      disabled={!activeSong.service}
                    >
                      <option value="">Select song length</option>
                      {(activeSong.service
                        ? (getServicePricing(activeSong.service as MixService) as any).songLengthTiers
                        : MIXING_SONG_LENGTH_TIERS
                      ).map((interval: { max: number; surcharge: number }) => (
                        <option key={interval.max} value={interval.max}>
                          Up to {interval.max} min{interval.max > 1 ? "s" : ""}
                          {interval.surcharge > 0 ? ` (+${formatCurrency(interval.surcharge)})` : " (no surcharge)"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Page 2 of 5
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("details")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setSongStep("alignment")}
                        disabled={!canGoNextFromBase}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {songStep === "alignment" && (
                <>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.timeAlignment.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            timeAlignment: {
                              ...activeSong.timeAlignment,
                              enabled: e.target.checked,
                              trackCount: clampInt(
                                activeSong.timeAlignment.trackCount,
                                1,
                                activeSongTrackCount
                              ),
                            },
                          })
                        }
                      />
                      Time Alignment ({formatCurrency(PRICING.timeAlignment.perTrack)} / track)
                    </label>
                    {activeSong.timeAlignment.enabled && (
                      <div className="space-y-2 pl-7">
                        <label className="text-sm font-medium">How many tracks need alignment?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.timeAlignment.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              timeAlignment: {
                                ...activeSong.timeAlignment,
                                trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                      </div>
                    )}

                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.vocalTuning.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            vocalTuning: {
                              ...activeSong.vocalTuning,
                              enabled: e.target.checked,
                              trackCount: clampInt(activeSong.vocalTuning.trackCount, 1, activeSongTrackCount),
                            },
                          })
                        }
                      />
                      Vocal Tuning ({formatCurrency(PRICING.vocalTuning.perTrack)} / track)
                    </label>
                    {activeSong.vocalTuning.enabled && (
                      <div className="space-y-2 pl-7">
                        <label className="text-sm font-medium">How many tracks need tuning?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.vocalTuning.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              vocalTuning: {
                                ...activeSong.vocalTuning,
                                trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Page 3 of 5
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("base")}
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={() => setSongStep("exports")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {songStep === "exports" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Multitrack Export</label>
                    <select
                      value={activeSong.multitrackExport ? "yes" : "no"}
                      onChange={(e) => updateActiveSong({ multitrackExport: e.target.value === "yes" })}
                      className={inputClassName}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes (+{formatCurrency(PRICING.multitrackExport.flat)})</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Additional Exports</div>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.additionalMixVersions.instrumental}
                        onChange={(e) =>
                          updateActiveSong({
                            additionalMixVersions: {
                              ...activeSong.additionalMixVersions,
                              instrumental: e.target.checked,
                            },
                          })
                        }
                      />
                      Instrumental
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(PRICING.additionalExports.instrumental)})</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.additionalMixVersions.acapella}
                        onChange={(e) =>
                          updateActiveSong({
                            additionalMixVersions: {
                              ...activeSong.additionalMixVersions,
                              acapella: e.target.checked,
                            },
                          })
                        }
                      />
                      Acapella
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(PRICING.additionalExports.acapella)})</span>
                    </label>
                  </div>

                  {songs.length > 1 && activeSongIndex < songs.length - 1 && (
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={duplicateToNextSong}
                        onChange={(e) => setDuplicateToNextSong(e.target.checked)}
                      />
                      Duplicate these options to next song
                    </label>
                  )}

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Page 4 of 5
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("alignment")}
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={() => setSongStep("addons")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {songStep === "addons" && (
                <>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Additional Edits</div>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.additionalMixVersions.radioEdit}
                        onChange={(e) =>
                          updateActiveSong({
                            additionalMixVersions: {
                              ...activeSong.additionalMixVersions,
                              radioEdit: e.target.checked,
                            },
                          })
                        }
                      />
                      Radio Edit
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(PRICING.additionalExports.radioEdit)})</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.additionalMixVersions.cleanVersion}
                        onChange={(e) =>
                          updateActiveSong({
                            additionalMixVersions: {
                              ...activeSong.additionalMixVersions,
                              cleanVersion: e.target.checked,
                            },
                          })
                        }
                      />
                      Clean Edit
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(PRICING.additionalExports.cleanVersion)})</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium">Extras</div>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.rushService2Days}
                        onChange={(e) => updateActiveSong({ rushService2Days: e.target.checked })}
                      />
                      Rush service (2-day turnaround)
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(PRICING.rushService2Days)})</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.unlimitedRevisions1Month}
                        onChange={(e) => updateActiveSong({ unlimitedRevisions1Month: e.target.checked })}
                      />
                      Unlimited revisions within 1 month
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(PRICING.unlimitedRevisions1Month)})</span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Page 5 of 5
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("exports")}
                      >
                        Back
                      </Button>
                      {projectType === "album" && activeSongIndex < songs.length - 1 ? (
                        <Button type="button" onClick={goToNextSong}>
                          Next Song
                        </Button>
                      ) : (
                        <Button type="button" disabled>
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </section>
          </>
        )}
      </div>

      {/* Right: Summary */}
      <aside className="p-6 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">
          Package Summary
        </h3>

        <ul className="text-sm space-y-2 mb-5">
          <li>Type: {projectType}</li>
          <li>Artist: {artistName.trim() || "—"}</li>
          {projectType === "album" && <li>Album: {albumName.trim() || "—"}</li>}
          <li>Songs: {projectType === "album" ? Math.max(2, songCount) : 1}</li>
        </ul>

        {projectType === "album" && songs.length > 1 && step === "songs" && activeSongIndex > 0 && (
          <div className="mb-5">
            <div className="text-sm font-semibold mb-2">Finished songs</div>
            <div className="space-y-2">
              {songs.slice(0, activeSongIndex).map((song, idx) => {
                if (!isSongConfigured(song)) return null;
                const finishedSongTotal = computeSongPrice(song);
                return (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-3">{song.name}</span>
                    <span className="tabular-nums">{formatCurrency(finishedSongTotal)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "songs" && activeSong && activeSongBreakdown && (
          <div className="mb-5">
            <div className="text-sm font-semibold mb-2">Current song</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="truncate pr-3">Base Service</span>
                <span className="tabular-nums">{formatCurrency(activeSongBreakdown.detailsSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate pr-3">Addon Services</span>
                <span className="tabular-nums">{formatCurrency(activeSongBreakdown.alignmentSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate pr-3">Exports</span>
                <span className="tabular-nums">{formatCurrency(activeSongBreakdown.exportsSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate pr-3">Edits & Extras</span>
                <span className="tabular-nums">{formatCurrency(activeSongBreakdown.addonsSubtotal)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t text-sm">
              <span className="font-semibold truncate pr-3">
                {activeSong.name.trim() ? activeSong.name.trim() : "Current song total"}
              </span>
              <span className="font-semibold tabular-nums">{formatCurrency(activeSongBreakdown.songTotal)}</span>
            </div>
          </div>
        )}

        <div className="font-bold text-xl mb-6">
          Total: {formatCurrency(total)}
        </div>

        <Button type="button" className="w-full">
          Add to Cart
        </Button>

      </aside>
    </div>
  );
}
