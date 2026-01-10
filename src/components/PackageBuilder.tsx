import * as React from "react";

import { Button } from "@/components/ui/button";

type ProjectType = "single" | "album";
type BuilderStep = "project" | "songs";
type SongStep = "details" | "alignment" | "extras";

type MixService = "mix" | "master" | "mixAndMaster" | "stemMaster";
type ServiceSelection = MixService | "";
type AdditionalMixVersion = "instrumental" | "acapella" | "radioEdit" | "cleanVersion";

type SongConfig = {
  name: string;
  service: ServiceSelection;
  trackCount: number;
  timeAlignment: { enabled: boolean; trackCount: number };
  vocalTuning: { enabled: boolean; trackCount: number };
  multitrackExport: boolean;
  additionalMixVersions: Record<AdditionalMixVersion, boolean>;
  rushService2Days: boolean;
  unlimitedRevisions1Month: boolean;
};

const PRICING = {
  serviceBase: {
    mix: 220,
    master: 50,
    mixAndMaster: 250,
    stemMaster: 90,
  } satisfies Record<MixService, number>,

  trackCountSurcharge: {
    tiers: [
      // Tiered pricing for "number of tracks" (stems). Fill in add values.
      // Rules requested:
      // 1 is cheapest, up to 5 second cheapest, up to 10 next, up to 24, then 48, 72, max 96.
      { upTo: 3, add: 0 },
      { upTo: 6, add: 10 },
      { upTo: 12, add: 20 },
      { upTo: 24, add: 30 },
      { upTo: 32, add: 40 },
      { upTo: 48, add: 50 },
      { upTo: 72, add: 75 },
      { upTo: 96, add: 100 },
      { upTo: Number.POSITIVE_INFINITY, add: 0 },
    ],
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
    cleanVersion: 90,
  },
  rushService2Days: 100,
  unlimitedRevisions1Month: 100,
} as const;

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
    trackCount: 1,
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

function trackCountTierSurcharge(trackCount: number) {
  const safe = clampInt(trackCount, 1, 999);
  for (const tier of PRICING.trackCountSurcharge.tiers) {
    if (safe <= tier.upTo) return tier.add;
  }
  return 0;
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

  const base = PRICING.serviceBase[song.service];
  const trackSurcharge = trackCountTierSurcharge(song.trackCount);

  const timeAlignPrice = song.timeAlignment.enabled
    ? PRICING.timeAlignment.perTrack * clampInt(song.timeAlignment.trackCount, 1, song.trackCount)
    : 0;

  const vocalTuningPrice = song.vocalTuning.enabled
    ? PRICING.vocalTuning.perTrack * clampInt(song.vocalTuning.trackCount, 1, song.trackCount)
    : 0;

  const multitrackExportPrice = song.multitrackExport ? PRICING.multitrackExport.flat : 0;
  const additionalExportsPrice = getAdditionalExportsPrice(song.additionalMixVersions);
  const additionalEditsPrice = getAdditionalEditsPrice(song.additionalMixVersions);
  const rushPrice = song.rushService2Days ? PRICING.rushService2Days : 0;
  const revisionsPrice = song.unlimitedRevisions1Month ? PRICING.unlimitedRevisions1Month : 0;

  return (
    base +
    trackSurcharge +
    timeAlignPrice +
    vocalTuningPrice +
    multitrackExportPrice +
    additionalExportsPrice +
    additionalEditsPrice +
    rushPrice +
    revisionsPrice
  );
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
  const canGoNextFromSongDetails = React.useMemo(() => {
    const songNameOk = (activeSong?.name ?? "").trim().length > 0;
    const serviceSelected = Boolean(activeSong?.service);
    return songNameOk && serviceSelected;
  }, [activeSong]);

  const songTotal = activeSong ? computeSongPrice(activeSong) : 0;

  function clampTrackCountForService(trackCount: number, service: ServiceSelection) {
    if (service === "master") return 1;
    if (service === "stemMaster") return clampInt(trackCount, 2, 24);
    return clampInt(trackCount, 1, 96);
  }

  function commitActiveSongTrackCount() {
    if (!activeSong) return;
    updateActiveSong({
      trackCount: clampTrackCountForService(activeSong.trackCount, activeSong.service),
    });
  }

  function updateActiveSong(patch: Partial<SongConfig>) {
    setSongs((prev) => {
      const next = prev.slice();
      const current = next[activeSongIndex] ?? createEmptySong();
      let merged = { ...current, ...patch };

      // Best-practice UX: don't clamp minimums on every keystroke.
      // - Master: always pinned to 1.
      // - Stem Master: allow typing (including transient "1"), but keep a hard max of 24.
      //   The min of 2 is enforced on blur / Next via commitActiveSongTrackCount().
      // - Other services: keep a hard max of 96.
      if (merged.service === "master") {
        merged.trackCount = 1;
      } else if (merged.service === "stemMaster") {
        merged.trackCount = clampInt(merged.trackCount, 1, 24);
      } else {
        merged.trackCount = clampInt(merged.trackCount, 1, 96);
      }

      merged.timeAlignment = {
        ...merged.timeAlignment,
        trackCount: clampInt(merged.timeAlignment.trackCount, 1, merged.trackCount),
      };
      merged.vocalTuning = {
        ...merged.vocalTuning,
        trackCount: clampInt(merged.vocalTuning.trackCount, 1, merged.trackCount),
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {songStep === "details"
                    ? "Song Details"
                    : songStep === "alignment"
                      ? "Time Alignment & Vocal Tuning"
                      : "Exports & Extras"}
                </h2>
                <p className="text-sm text-muted-foreground">
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

            <section className="space-y-6">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Service <span className="text-destructive">*</span></label>
                    <select
                      value={activeSong.service}
                      onChange={(e) => {
                        const nextService = e.target.value as ServiceSelection;

                        if (nextService === "") {
                          updateActiveSong({ service: "" });
                          return;
                        }
                        // If they pick master, pin immediately.
                        if (nextService === "master") {
                          updateActiveSong({ service: nextService, trackCount: 1 });
                          return;
                        }

                        // If they pick stem master, clamp to max 24 immediately (min is enforced on blur/Next).
                        if (nextService === "stemMaster") {
                          updateActiveSong({
                            service: nextService,
                            trackCount: clampInt(activeSong.trackCount, 1, 24),
                          });
                          return;
                        }

                        // Other services: clamp to max 96.
                        updateActiveSong({
                          service: nextService,
                          trackCount: clampInt(activeSong.trackCount, 1, 96),
                        });
                      }}
                      className={inputClassName}
                      required
                    >
                      <option value="">Please select a service</option>
                      <option value="mix">Mix ({formatCurrency(PRICING.serviceBase.mix)})</option>
                      <option value="master">Master ({formatCurrency(PRICING.serviceBase.master)})</option>
                      <option value="mixAndMaster">Mix + Master ({formatCurrency(PRICING.serviceBase.mixAndMaster)})</option>
                      <option value="stemMaster">Stem Master ({formatCurrency(PRICING.serviceBase.stemMaster)})</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Tracks in the Song <span className="text-destructive">*</span></label>
                    <input
                      type="number"
                      min={activeSong.service === "stemMaster" ? 2 : 1}
                      max={activeSong.service === "stemMaster" ? 24 : 96}
                      value={activeSong.trackCount}
                      onChange={(e) =>
                        updateActiveSong({
                          trackCount: Number(e.target.value),
                          timeAlignment: {
                            ...activeSong.timeAlignment,
                            trackCount: Math.min(
                              Number(e.target.value) || (activeSong.service === "stemMaster" ? 2 : 1),
                              activeSong.timeAlignment.trackCount
                            ),
                          },
                          vocalTuning: {
                            ...activeSong.vocalTuning,
                            trackCount: Math.min(
                              Number(e.target.value) || (activeSong.service === "stemMaster" ? 2 : 1),
                              activeSong.vocalTuning.trackCount
                            ),
                          },
                        })
                      }
                      onBlur={commitActiveSongTrackCount}
                      className={narrowInputClassName}
                      required
                      disabled={activeSong.service === "master"}
                    />
                    <p className="text-sm text-muted-foreground">
                      Track-count surcharge: {formatCurrency(trackCountTierSurcharge(activeSong.trackCount))}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        if (songStep === "details") {
                          setStep("project");
                        } else if (songStep === "alignment") {
                          setSongStep("details");
                        } else {
                          setSongStep("alignment");
                        }
                      }}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        commitActiveSongTrackCount();
                        setSongStep("alignment");
                      }}
                      disabled={!canGoNextFromSongDetails}
                    >
                      Next
                    </Button>
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
                                activeSong.trackCount
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
                          max={activeSong.trackCount}
                          value={activeSong.timeAlignment.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              timeAlignment: {
                                ...activeSong.timeAlignment,
                                trackCount: clampInt(Number(e.target.value), 1, activeSong.trackCount),
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
                              trackCount: clampInt(activeSong.vocalTuning.trackCount, 1, activeSong.trackCount),
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
                          max={activeSong.trackCount}
                          value={activeSong.vocalTuning.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              vocalTuning: {
                                ...activeSong.vocalTuning,
                                trackCount: clampInt(Number(e.target.value), 1, activeSong.trackCount),
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSongStep("details")}
                    >
                      Back
                    </Button>
                    <Button type="button" onClick={() => setSongStep("extras")}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}

              {songStep === "extras" && (
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
                    <div className="text-sm font-medium">Other Addons</div>
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

                  <div className="flex items-center justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSongStep("alignment")}
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

        <ul className="text-sm space-y-2 mb-4">
          <li>Type: {projectType}</li>
          <li>Artist: {artistName.trim() || "—"}</li>
          {projectType === "album" && <li>Album: {albumName.trim() || "—"}</li>}
          <li>Songs: {projectType === "album" ? Math.max(2, songCount) : 1}</li>
          {step === "songs" && (
            <li>
              Current song total: <span className="font-medium">{formatCurrency(songTotal)}</span>
            </li>
          )}
        </ul>

        <div className="font-bold text-xl mb-6">
          Total: {formatCurrency(total)}
        </div>

        <Button type="button" className="w-full">
          Add to Cart
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          Track-count tier add-ons (1/5/10/24/48/72/96) are configurable in this component.
        </p>
      </aside>
    </div>
  );
}
