import * as React from "react";

import { Button } from "@/components/ui/button";

import PackageSummaryCard from "@/components/build-your-package/PackageSummaryCard";
import PagedItemNav from "@/components/build-your-package/PagedItemNav";
import {
  EDITING_SERVICE_NOTE_PLACEHOLDERS,
  REPAIR_SERVICE_NOTE_PLACEHOLDERS,
} from "@/components/build-your-package/service-note-placeholders";
import {
  type BaseService,
} from "@/lib/pricing/catalog";
import {
  BASE_SERVICE_PRICING,
  type BaseServicePricing,
  EDITING_SERVICE_PRICING,
  EXPORTS_PRICING,
  EXTRAS_PRICING,
  REPAIR_SERVICE_PRICING,
} from "@/lib/pricing/package-builder";
import { getDisplayCurrency } from "@/lib/pricing/currency-preference";
import { convertCadCentsToCurrencyCents, formatMoneyFromCents } from "@/lib/pricing/money";
import { useDisplayCurrency } from "@/lib/pricing/use-display-currency";

type ProjectType = "single" | "album";
type BuilderStep = "project" | "songs" | "delivery";
type SongStep = "details" | "base" | "editing" | "repair" | "exports" | "addons";

type ServiceSelection = BaseService | "";
type AdditionalMixVersion = "instrumental" | "acapella" | "radioEdit" | "cleanVersion";
type DeliveryFormat = "standardDelivery" | "cdMaster" | "mp3_320" | "flac24" | "aiff24" | "custom";
type PlatformMasterOption = "spotifyYoutube" | "appleMusic" | "deezer" | "custom";

type EditingServiceConfig = {
  enabled: boolean;
  trackCount: number;
  notes: string;
};

type RepairService = "clippingRepair" | "clicksPopsRemoval" | "hissRemoval" | "cracklingRemoval" | "plosiveReduction" | "reverbReduction";

type SongConfig = {
  name: string;
  service: ServiceSelection;
  trackCount: number | null;
  lengthMinutes: number | null;
  editingServices: {
    timeAlignment: EditingServiceConfig;
    comping: EditingServiceConfig;
    vocalTuning: EditingServiceConfig;
    instrumentTuning: EditingServiceConfig;
    cleanupNoiseRemoval: EditingServiceConfig;
  };
  repairServices: Record<RepairService, EditingServiceConfig>;
  multitrackExport: boolean;
  additionalMixVersions: Record<AdditionalMixVersion, boolean>;
  rushService2Days: boolean;
  unlimitedRevisions1Month: boolean;
};

export type PackageBuilderProps = {
  onChangeCategory?: () => void;
};

const REPAIR_SERVICE_LABELS: Record<RepairService, string> = {
  clippingRepair: "Clipping repair",
  clicksPopsRemoval: "Clicks / pops removal",
  hissRemoval: "Hiss removal",
  cracklingRemoval: "Crackling removal",
  plosiveReduction: "Plosive reduction",
  reverbReduction: "Reverb reduction",
} as const;

const BASE_SERVICE_LABELS: Record<BaseService, string> = {
  mix: "Mix",
  master: "Master",
  mixAndMaster: "Mix + Master",
  stemMaster: "Stem Master",
};

const EDITING_SERVICE_LABELS: Record<keyof SongConfig["editingServices"], string> = {
  timeAlignment: "Time alignment",
  comping: "Comping",
  vocalTuning: "Vocal tuning",
  instrumentTuning: "Instrument tuning",
  cleanupNoiseRemoval: "Cleanup / noise removal",
};

const DELIVERY_FORMAT_LABELS: Record<DeliveryFormat, string> = {
  standardDelivery: "Standard delivery (WAV 24-bit / ** kHz)",
  cdMaster: "CD master (WAV 16-bit / 44.1kHz)",
  flac24: "Lossless (FLAC 24-bit / ** kHz)",
  aiff24: "Lossless (AIFF 24-bit / ** kHz)",
  mp3_320: "Lossy (MP3 320 kbps)",
  custom: "Custom delivery formats",
};

const PLATFORM_MASTER_LABELS: Record<PlatformMasterOption, string> = {
  spotifyYoutube: "Spotify / YouTube / YouTube Music (-14 LUFS integrated)",
  appleMusic: "Apple Music / iTunes (-16 LUFS integrated)",
  deezer: "Deezer (-15 LUFS integrated)",
  custom: "Custom platform target",
};

function getSongLengthSurcharge(lengthMinutes: number | null, service?: ServiceSelection): number {
  if (lengthMinutes == null) return 0;
  if (!service) return 0;
  const tiers = getServicePricing(service).songLengthTiers;
  for (const interval of tiers) {
    if (lengthMinutes <= interval.max) return interval.surcharge;
  }
  const last = tiers.at(-1);
  return last?.surcharge ?? 0;
}

function getServicePricing(service: BaseService): BaseServicePricing {
  return BASE_SERVICE_PRICING[service];
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
  const cadCents = Math.round(normalized * 100);
  const currency = getDisplayCurrency();
  const convertedCents = convertCadCentsToCurrencyCents(cadCents, currency);
  return formatMoneyFromCents(convertedCents, currency);
}

function createEmptySong(): SongConfig {
  return {
    name: "",
    service: "",
    trackCount: null,
    lengthMinutes: null,
    editingServices: {
      timeAlignment: { enabled: false, trackCount: 1, notes: "" },
      comping: { enabled: false, trackCount: 1, notes: "" },
      vocalTuning: { enabled: false, trackCount: 1, notes: "" },
      instrumentTuning: { enabled: false, trackCount: 1, notes: "" },
      cleanupNoiseRemoval: { enabled: false, trackCount: 1, notes: "" },
    },
    repairServices: {
      clippingRepair: { enabled: false, trackCount: 1, notes: "" },
      clicksPopsRemoval: { enabled: false, trackCount: 1, notes: "" },
      hissRemoval: { enabled: false, trackCount: 1, notes: "" },
      cracklingRemoval: { enabled: false, trackCount: 1, notes: "" },
      plosiveReduction: { enabled: false, trackCount: 1, notes: "" },
      reverbReduction: { enabled: false, trackCount: 1, notes: "" },
    },
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

function isSongOptionsUnconfigured(song: SongConfig) {
  const empty = createEmptySong();
  return (
    song.service === empty.service &&
    song.trackCount === empty.trackCount &&
    song.lengthMinutes === empty.lengthMinutes &&
    song.multitrackExport === empty.multitrackExport &&
    song.rushService2Days === empty.rushService2Days &&
    song.unlimitedRevisions1Month === empty.unlimitedRevisions1Month &&
    song.additionalMixVersions.instrumental === empty.additionalMixVersions.instrumental &&
    song.additionalMixVersions.acapella === empty.additionalMixVersions.acapella &&
    song.additionalMixVersions.radioEdit === empty.additionalMixVersions.radioEdit &&
    song.additionalMixVersions.cleanVersion === empty.additionalMixVersions.cleanVersion &&
    (Object.keys(song.editingServices) as Array<keyof SongConfig["editingServices"]>).every((key) => {
      const current = song.editingServices[key];
      const baseline = empty.editingServices[key];
      return (
        current.enabled === baseline.enabled &&
        current.trackCount === baseline.trackCount &&
        current.notes === baseline.notes
      );
    }) &&
    (Object.keys(song.repairServices) as Array<keyof SongConfig["repairServices"]>).every((key) => {
      const current = song.repairServices[key];
      const baseline = empty.repairServices[key];
      return (
        current.enabled === baseline.enabled &&
        current.trackCount === baseline.trackCount &&
        current.notes === baseline.notes
      );
    })
  );
}

function cloneSongOptionsFromSource(source: SongConfig, name: string): SongConfig {
  return {
    name,
    service: source.service,
    trackCount: source.trackCount,
    lengthMinutes: source.lengthMinutes,
    editingServices: {
      timeAlignment: { ...source.editingServices.timeAlignment },
      comping: { ...source.editingServices.comping },
      vocalTuning: { ...source.editingServices.vocalTuning },
      instrumentTuning: { ...source.editingServices.instrumentTuning },
      cleanupNoiseRemoval: { ...source.editingServices.cleanupNoiseRemoval },
    },
    repairServices: {
      clippingRepair: { ...source.repairServices.clippingRepair },
      clicksPopsRemoval: { ...source.repairServices.clicksPopsRemoval },
      hissRemoval: { ...source.repairServices.hissRemoval },
      cracklingRemoval: { ...source.repairServices.cracklingRemoval },
      plosiveReduction: { ...source.repairServices.plosiveReduction },
      reverbReduction: { ...source.repairServices.reverbReduction },
    },
    multitrackExport: source.multitrackExport,
    additionalMixVersions: { ...source.additionalMixVersions },
    rushService2Days: source.rushService2Days,
    unlimitedRevisions1Month: source.unlimitedRevisions1Month,
  };
}

function getAdditionalExportsPrice(versions: Record<AdditionalMixVersion, boolean>) {
  let total = 0;
  if (versions.instrumental) total += EXPORTS_PRICING.additionalExports.instrumental;
  if (versions.acapella) total += EXPORTS_PRICING.additionalExports.acapella;
  return total;
}

function getAdditionalEditsPrice(versions: Record<AdditionalMixVersion, boolean>) {
  let total = 0;
  if (versions.radioEdit) total += EXPORTS_PRICING.additionalExports.radioEdit;
  if (versions.cleanVersion) total += EXPORTS_PRICING.additionalExports.cleanVersion;
  return total;
}

function getEditingServicesTotal(song: SongConfig) {
  const effectiveTrackCount = song.service === "master" ? 1 : song.trackCount ?? 1;

  const calc = (cfg: EditingServiceConfig, perTrack: number) =>
    cfg.enabled ? perTrack * clampInt(cfg.trackCount, 1, effectiveTrackCount) : 0;

  return (
    calc(song.editingServices.timeAlignment, EDITING_SERVICE_PRICING.timeAlignment.perTrack) +
    calc(song.editingServices.comping, EDITING_SERVICE_PRICING.comping.perTrack) +
    calc(song.editingServices.vocalTuning, EDITING_SERVICE_PRICING.vocalTuning.perTrack) +
    calc(song.editingServices.instrumentTuning, EDITING_SERVICE_PRICING.instrumentTuning.perTrack) +
    calc(song.editingServices.cleanupNoiseRemoval, EDITING_SERVICE_PRICING.cleanupNoiseRemoval.perTrack)
  );
}

function getRepairServicesTotal(song: SongConfig) {
  const effectiveTrackCount = song.service === "master" ? 1 : song.trackCount ?? 1;

  const calc = (cfg: EditingServiceConfig, perTrack: number) =>
    cfg.enabled ? perTrack * clampInt(cfg.trackCount, 1, effectiveTrackCount) : 0;

  return (
    calc(song.repairServices.hissRemoval, REPAIR_SERVICE_PRICING.hissRemoval.perTrack) +
    calc(song.repairServices.cracklingRemoval, REPAIR_SERVICE_PRICING.cracklingRemoval.perTrack) +
    calc(song.repairServices.clicksPopsRemoval, REPAIR_SERVICE_PRICING.clicksPopsRemoval.perTrack) +
    calc(song.repairServices.plosiveReduction, REPAIR_SERVICE_PRICING.plosiveReduction.perTrack) +
    calc(song.repairServices.reverbReduction, REPAIR_SERVICE_PRICING.reverbReduction.perTrack)
  );
}

function computeSongPrice(song: SongConfig) {
  if (!song.service) return 0;

  const pricing = getServicePricing(song.service);
  const base = pricing.base;
  const trackSurcharge = getTrackCountSurcharge(song.service, song.trackCount);
  const lengthSurcharge = getSongLengthSurcharge(song.lengthMinutes, song.service);

  const editingServicesTotal = getEditingServicesTotal(song);
  const repairServicesTotal = getRepairServicesTotal(song);

  const multitrackExportPrice = song.multitrackExport ? EXPORTS_PRICING.multitrackExportFlat : 0;
  const additionalExportsPrice = getAdditionalExportsPrice(song.additionalMixVersions);
  const additionalEditsPrice = getAdditionalEditsPrice(song.additionalMixVersions);
  const rushPrice = song.rushService2Days ? EXTRAS_PRICING.rushService2Days : 0;
  const revisionsPrice = song.unlimitedRevisions1Month ? EXTRAS_PRICING.unlimitedRevisions1Month : 0;

  return (
    base +
    trackSurcharge +
    lengthSurcharge +
    editingServicesTotal +
    repairServicesTotal +
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
      editingSubtotal: 0,
      repairSubtotal: 0,
      exportsSubtotal: 0,
      addonsSubtotal: 0,
      songTotal: 0,
    };
  }

  const pricing = getServicePricing(song.service);
  const base = pricing.base;
  const trackSurcharge = getTrackCountSurcharge(song.service, song.trackCount);
  const lengthSurcharge = getSongLengthSurcharge(song.lengthMinutes, song.service);

  const editingSubtotal = getEditingServicesTotal(song);
  const repairSubtotal = getRepairServicesTotal(song);

  const multitrackExportPrice = song.multitrackExport ? EXPORTS_PRICING.multitrackExportFlat : 0;
  const additionalExportsPrice = getAdditionalExportsPrice(song.additionalMixVersions);
  const additionalEditsPrice = getAdditionalEditsPrice(song.additionalMixVersions);
  const rushPrice = song.rushService2Days ? EXTRAS_PRICING.rushService2Days : 0;
  const revisionsPrice = song.unlimitedRevisions1Month ? EXTRAS_PRICING.unlimitedRevisions1Month : 0;

  const detailsSubtotal = base + trackSurcharge + lengthSurcharge;
  const exportsSubtotal = multitrackExportPrice + additionalExportsPrice;
  const addonsSubtotal = additionalEditsPrice + rushPrice + revisionsPrice;
  const songTotal = detailsSubtotal + editingSubtotal + repairSubtotal + exportsSubtotal + addonsSubtotal;

  return {
    detailsSubtotal,
    editingSubtotal,
    repairSubtotal,
    exportsSubtotal,
    addonsSubtotal,
    songTotal,
  };
}

export default function PackageBuilder({ onChangeCategory: _onChangeCategory }: PackageBuilderProps) {
  useDisplayCurrency();

  const [step, setStep] = React.useState<BuilderStep>("project");
  const [songStep, setSongStep] = React.useState<SongStep>("details");
  const [projectType, setProjectType] = React.useState<ProjectType>("single");
  const [songCount, setSongCount] = React.useState(1);
  const [artistName, setArtistName] = React.useState("");
  const [albumName, setAlbumName] = React.useState("");
  const [isPackageFinalized, setIsPackageFinalized] = React.useState(false);
  const [deliveryFormats, setDeliveryFormats] = React.useState<Record<DeliveryFormat, boolean>>({
    standardDelivery: true,
    cdMaster: false,
    mp3_320: false,
    flac24: false,
    aiff24: false,
    custom: false,
  });
  const [customDeliveryDetails, setCustomDeliveryDetails] = React.useState("");
  const [platformMasters, setPlatformMasters] = React.useState<Record<PlatformMasterOption, boolean>>({
    spotifyYoutube: false,
    appleMusic: false,
    deezer: false,
    custom: false,
  });
  const [customPlatformMasterDetails, setCustomPlatformMasterDetails] = React.useState("");

  const [songs, setSongs] = React.useState<SongConfig[]>(() => [createEmptySong()]);
  const [activeSongIndex, setActiveSongIndex] = React.useState(0);

  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const narrowInputClassName =
    "flex h-10 w-24 rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  const textareaClassName =
    "flex w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

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
  }, [activeSongIndex, step]);

  React.useEffect(() => {
    setIsPackageFinalized(false);
  }, [projectType, songCount, artistName, albumName, songs]);

  const total = React.useMemo(() => songs.reduce((sum, song) => sum + computeSongPrice(song), 0), [
    songs,
  ]);

  const isPackageComplete = React.useMemo(() => {
    if (projectType === "single") {
      const first = songs[0];
      if (songs.length !== 1) return false;
      if (!first) return false;
      return isSongConfigured(first);
    }
    const expected = Math.max(2, songCount);
    if (songs.length !== expected) return false;
    return songs.every(isSongConfigured);
  }, [projectType, songs, songCount]);

  const hasMasteringOrMixAndMasterService = React.useMemo(
    () => songs.some((song) => song.service === "master" || song.service === "mixAndMaster"),
    [songs]
  );

  React.useEffect(() => {
    if (hasMasteringOrMixAndMasterService) return;
    setPlatformMasters({
      spotifyYoutube: false,
      appleMusic: false,
      deezer: false,
      custom: false,
    });
    setCustomPlatformMasterDetails("");
  }, [hasMasteringOrMixAndMasterService]);

  const hasAtLeastOneDeliveryFormat = React.useMemo(
    () => (Object.keys(deliveryFormats) as DeliveryFormat[]).some((key) => deliveryFormats[key]),
    [deliveryFormats]
  );

  const hasValidCustomDeliveryDetails = !deliveryFormats.custom || customDeliveryDetails.trim().length > 0;
  const hasValidCustomPlatformDetails = !platformMasters.custom || customPlatformMasterDetails.trim().length > 0;

  const canRequestFinalizedPackage =
    isPackageComplete &&
    isPackageFinalized &&
    step === "delivery" &&
    hasAtLeastOneDeliveryFormat &&
    hasValidCustomDeliveryDetails &&
    hasValidCustomPlatformDetails;

  const selectedDeliveryFormatLabels = React.useMemo(
    () =>
      (Object.keys(deliveryFormats) as DeliveryFormat[])
        .filter((key) => deliveryFormats[key])
        .map((key) => DELIVERY_FORMAT_LABELS[key]),
    [deliveryFormats]
  );

  const selectedPlatformMasterLabels = React.useMemo(
    () =>
      (Object.keys(platformMasters) as PlatformMasterOption[])
        .filter((key) => platformMasters[key])
        .map((key) => PLATFORM_MASTER_LABELS[key]),
    [platformMasters]
  );

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

  const requestPackage = React.useMemo(() => {
    const lines: string[] = [];
    lines.push("Service: Mixing & Mastering");
    lines.push(`Project type: ${projectType}`);
    lines.push(`Artist: ${artistName.trim() || "—"}`);
    if (projectType === "album") lines.push(`Album: ${albumName.trim() || "—"}`);
    lines.push(`Songs: ${projectType === "album" ? Math.max(2, songCount) : 1}`);
    lines.push("");

    songs.forEach((song, idx) => {
      lines.push(`Song ${idx + 1}: ${song.name.trim() || "(unnamed)"}`);
      lines.push(`- Service: ${song.service ? BASE_SERVICE_LABELS[song.service] : "—"}`);
      lines.push(`- Tracks in song: ${song.service === "master" ? 1 : song.trackCount ?? "—"}`);
      lines.push(`- Length: ${song.lengthMinutes == null ? "—" : `Up to ${song.lengthMinutes} min`}`);

      if (!song.service) {
        lines.push("- Price breakdown: —");
        lines.push("");
        return;
      }

      const pricing = getServicePricing(song.service);
      const trackSurcharge = getTrackCountSurcharge(song.service, song.trackCount);
      const lengthSurcharge = getSongLengthSurcharge(song.lengthMinutes, song.service);
      const effectiveTrackCount = song.service === "master" ? 1 : song.trackCount ?? 1;

      lines.push("- Price breakdown:");
      lines.push(`  - Base service (${BASE_SERVICE_LABELS[song.service]}): ${formatCurrency(pricing.base)}`);
      lines.push(`  - Track-count surcharge: ${formatCurrency(trackSurcharge)}`);
      lines.push(`  - Song-length surcharge: ${formatCurrency(lengthSurcharge)}`);

      const editingLineItems = (Object.keys(song.editingServices) as Array<keyof SongConfig["editingServices"]>)
        .filter((key) => song.editingServices[key].enabled)
        .map((key) => {
          const cfg = song.editingServices[key];
          const units = clampInt(cfg.trackCount, 1, effectiveTrackCount);
          const perTrack = EDITING_SERVICE_PRICING[key].perTrack;
          const amount = perTrack * units;
          return {
            label: EDITING_SERVICE_LABELS[key],
            units,
            perTrack,
            amount,
            notes: cfg.notes.trim(),
          };
        });

      lines.push("  - Editing services:");
      if (editingLineItems.length === 0) {
        lines.push("    - —");
      } else {
        editingLineItems.forEach((item) => {
          lines.push(
            `    - ${item.label}: ${formatCurrency(item.perTrack)} × ${item.units} = ${formatCurrency(item.amount)}${item.notes ? ` — ${item.notes}` : ""}`
          );
        });
      }

      const repairLineItems = (Object.keys(song.repairServices) as RepairService[])
        .filter((key) => song.repairServices[key].enabled)
        .map((key) => {
          const cfg = song.repairServices[key];
          const units = clampInt(cfg.trackCount, 1, effectiveTrackCount);
          const perTrack = REPAIR_SERVICE_PRICING[key].perTrack;
          const amount = perTrack * units;
          return {
            label: REPAIR_SERVICE_LABELS[key],
            units,
            perTrack,
            amount,
            notes: cfg.notes.trim(),
          };
        });

      lines.push("  - Repair services:");
      if (repairLineItems.length === 0) {
        lines.push("    - —");
      } else {
        repairLineItems.forEach((item) => {
          lines.push(
            `    - ${item.label}: ${formatCurrency(item.perTrack)} × ${item.units} = ${formatCurrency(item.amount)}${item.notes ? ` — ${item.notes}` : ""}`
          );
        });
      }

      const multitrackExportPrice = song.multitrackExport ? EXPORTS_PRICING.multitrackExportFlat : 0;
      const instrumentalPrice = song.additionalMixVersions.instrumental ? EXPORTS_PRICING.additionalExports.instrumental : 0;
      const acapellaPrice = song.additionalMixVersions.acapella ? EXPORTS_PRICING.additionalExports.acapella : 0;
      lines.push("  - Exports:");
      lines.push(`    - Multitrack export: ${formatCurrency(multitrackExportPrice)}`);
      lines.push(`    - Instrumental version: ${formatCurrency(instrumentalPrice)}`);
      lines.push(`    - Acapella version: ${formatCurrency(acapellaPrice)}`);

      const radioEditPrice = song.additionalMixVersions.radioEdit ? EXPORTS_PRICING.additionalExports.radioEdit : 0;
      const cleanEditPrice = song.additionalMixVersions.cleanVersion ? EXPORTS_PRICING.additionalExports.cleanVersion : 0;
      const rushPrice = song.rushService2Days ? EXTRAS_PRICING.rushService2Days : 0;
      const revisionsPrice = song.unlimitedRevisions1Month ? EXTRAS_PRICING.unlimitedRevisions1Month : 0;
      lines.push("  - Edits & extras:");
      lines.push(`    - Radio edit: ${formatCurrency(radioEditPrice)}`);
      lines.push(`    - Clean edit: ${formatCurrency(cleanEditPrice)}`);
      lines.push(`    - Rush service (2 days): ${formatCurrency(rushPrice)}`);
      lines.push(`    - Unlimited revisions (1 month): ${formatCurrency(revisionsPrice)}`);

      const breakdown = computeSongBreakdown(song);
      lines.push(`  - Song subtotal (base + surcharges): ${formatCurrency(breakdown.detailsSubtotal)}`);
      lines.push(`  - Song subtotal (editing): ${formatCurrency(breakdown.editingSubtotal)}`);
      lines.push(`  - Song subtotal (repair): ${formatCurrency(breakdown.repairSubtotal)}`);
      lines.push(`  - Song subtotal (exports): ${formatCurrency(breakdown.exportsSubtotal)}`);
      lines.push(`  - Song subtotal (edits & extras): ${formatCurrency(breakdown.addonsSubtotal)}`);
      lines.push(`  - Song total: ${formatCurrency(breakdown.songTotal)}`);
      lines.push("");
    });

    lines.push("Package pricing summary:");
    const packageSubtotals = songs.reduce(
      (acc, song) => {
        const breakdown = computeSongBreakdown(song);
        return {
          details: acc.details + breakdown.detailsSubtotal,
          editing: acc.editing + breakdown.editingSubtotal,
          repair: acc.repair + breakdown.repairSubtotal,
          exports: acc.exports + breakdown.exportsSubtotal,
          addons: acc.addons + breakdown.addonsSubtotal,
          total: acc.total + breakdown.songTotal,
        };
      },
      { details: 0, editing: 0, repair: 0, exports: 0, addons: 0, total: 0 }
    );
    lines.push(`- Base + surcharges subtotal: ${formatCurrency(packageSubtotals.details)}`);
    lines.push(`- Editing services subtotal: ${formatCurrency(packageSubtotals.editing)}`);
    lines.push(`- Repair services subtotal: ${formatCurrency(packageSubtotals.repair)}`);
    lines.push(`- Exports subtotal: ${formatCurrency(packageSubtotals.exports)}`);
    lines.push(`- Edits & extras subtotal: ${formatCurrency(packageSubtotals.addons)}`);
    lines.push(`- Package total: ${formatCurrency(packageSubtotals.total)}`);
    lines.push("");

    lines.push("Delivery formats:");
    if (selectedDeliveryFormatLabels.length === 0) {
      lines.push("- —");
    } else {
      selectedDeliveryFormatLabels.forEach((label) => lines.push(`- ${label}`));
    }

    if (deliveryFormats.custom) {
      lines.push(`- Custom delivery details: ${customDeliveryDetails.trim() || "—"}`);
    }

    if (hasMasteringOrMixAndMasterService) {
      lines.push("");
      lines.push("Platform-specific masters:");
      if (selectedPlatformMasterLabels.length === 0) {
        lines.push("- —");
      } else {
        selectedPlatformMasterLabels.forEach((label) => lines.push(`- ${label}`));
      }

      if (platformMasters.custom) {
        lines.push(`- Custom platform target details: ${customPlatformMasterDetails.trim() || "—"}`);
      }
    }

    return {
      subject: "Package Request — Mixing & Mastering",
      summaryText: lines.join("\n"),
    };
  }, [
    projectType,
    artistName,
    albumName,
    songCount,
    songs,
    selectedDeliveryFormatLabels,
    deliveryFormats.custom,
    customDeliveryDetails,
    hasMasteringOrMixAndMasterService,
    selectedPlatformMasterLabels,
    platformMasters.custom,
    customPlatformMasterDetails,
  ]);

  function updateActiveSong(patch: Partial<SongConfig>) {
    setSongs((prev) => {
      const next = prev.slice();
      const current = next[activeSongIndex] ?? createEmptySong();
      let merged = { ...current, ...patch };

      merged.trackCount = normalizeTrackCountForService(merged.service, merged.trackCount);
      const effectiveTrackCount = merged.service === "master" ? 1 : merged.trackCount ?? 1;

      const clampEditingCfg = (cfg: EditingServiceConfig): EditingServiceConfig => ({
        ...cfg,
        trackCount: clampInt(cfg.trackCount, 1, effectiveTrackCount),
      });

      merged.editingServices = {
        ...merged.editingServices,
        timeAlignment: clampEditingCfg(merged.editingServices.timeAlignment),
        vocalTuning: clampEditingCfg(merged.editingServices.vocalTuning),
        comping: clampEditingCfg(merged.editingServices.comping),
        instrumentTuning: clampEditingCfg(merged.editingServices.instrumentTuning),
        cleanupNoiseRemoval: clampEditingCfg(merged.editingServices.cleanupNoiseRemoval),
      };

      merged.repairServices = {
        ...merged.repairServices,
        hissRemoval: clampEditingCfg(merged.repairServices.hissRemoval),
        cracklingRemoval: clampEditingCfg(merged.repairServices.cracklingRemoval),
        clicksPopsRemoval: clampEditingCfg(merged.repairServices.clicksPopsRemoval),
        plosiveReduction: clampEditingCfg(merged.repairServices.plosiveReduction),
        reverbReduction: clampEditingCfg(merged.repairServices.reverbReduction),
      };

      next[activeSongIndex] = merged;
      return next;
    });
  }

  function applyDefaultsToSongIfEligible(targetIndex: number) {
    setSongs((prev) => {
      if (targetIndex <= 0 || targetIndex >= prev.length) return prev;
      const target = prev[targetIndex];
      if (!target || !isSongOptionsUnconfigured(target)) return prev;
      const source = prev[targetIndex - 1];
      if (!source) return prev;

      const next = prev.slice();
      next[targetIndex] = cloneSongOptionsFromSource(source, target.name);
      return next;
    });
  }

  function goToSong(index: number) {
    const bounded = clampInt(index, 0, Math.max(0, songs.length - 1));
    if (bounded === activeSongIndex) return;

    if (bounded === activeSongIndex + 1) {
      applyDefaultsToSongIfEligible(bounded);
    }

    setActiveSongIndex(bounded);
  }

  function goToNextSong() {
    if (activeSongIndex >= songs.length - 1) return;
    goToSong(activeSongIndex + 1);
  }

  function goToFinalStep() {
    if (!isPackageComplete) return;
    setIsPackageFinalized(true);
    setStep("delivery");
  }

  function returnToLastSongExtrasStep() {
    setStep("songs");
    setActiveSongIndex(Math.max(0, songs.length - 1));
    setSongStep("addons");
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

            <div className="flex items-center justify-end gap-2">
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
                    : songStep === "editing"
                      ? "Editing Services"
                    : songStep === "repair"
                      ? "Repair Services"
                      : songStep === "exports"
                        ? "Exports"
                        : "Edits & Extras"}
                </h2>
                <p className="text-sm text-muted-foreground mb-1">
                  {songStep === "details"
                    ? "Name this song so we can label your package."
                    : songStep === "base"
                      ? "Choose the core service, track count, and song length."
                    : songStep === "editing"
                      ? "Optional editing services priced per track."
                    : songStep === "repair"
                      ? "Optional repair services priced per track."
                    : songStep === "exports"
                      ? "Optional exports for your final deliverables."
                    : "Optional edits and extras for turnaround and revisions."}
                </p>
              </div>
            </div>

            <section className="space-y-5">
              {songStep === "details" && (
                <>
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Song {activeSongIndex + 1} of {songs.length}
                          {activeSong?.name && (
                            <span className="text-muted-foreground"> — {activeSong.name}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Basic info for this song.</div>
                      </div>
                      <PagedItemNav
                        itemLabel="Song"
                        currentIndex={activeSongIndex}
                        total={songs.length}
                        onPrevious={() => goToSong(activeSongIndex - 1)}
                        onNext={() => goToSong(activeSongIndex + 1)}
                      />
                    </div>

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
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Step 1 of 6
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
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Song {activeSongIndex + 1} of {songs.length}
                          {activeSong?.name && (
                            <span className="text-muted-foreground"> — {activeSong.name}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Service, track count, and song length.</div>
                      </div>
                      <PagedItemNav
                        itemLabel="Song"
                        currentIndex={activeSongIndex}
                        total={songs.length}
                        onPrevious={() => goToSong(activeSongIndex - 1)}
                        onNext={() => goToSong(activeSongIndex + 1)}
                      />
                    </div>

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
                        <option value="mix">Mix ({formatCurrency(BASE_SERVICE_PRICING.mix.base)})</option>
                        <option value="master">Master ({formatCurrency(BASE_SERVICE_PRICING.master.base)})</option>
                        <option value="mixAndMaster">Mix + Master ({formatCurrency(BASE_SERVICE_PRICING.mixAndMaster.base)})</option>
                        <option value="stemMaster">Stem Master ({formatCurrency(BASE_SERVICE_PRICING.stemMaster.base)})</option>
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
                            editingServices: {
                              ...activeSong.editingServices,
                              timeAlignment: {
                                ...activeSong.editingServices.timeAlignment,
                                trackCount: clampInt(activeSong.editingServices.timeAlignment.trackCount, 1, nextValue ?? 1),
                              },
                              vocalTuning: {
                                ...activeSong.editingServices.vocalTuning,
                                trackCount: clampInt(activeSong.editingServices.vocalTuning.trackCount, 1, nextValue ?? 1),
                              },
                              comping: {
                                ...activeSong.editingServices.comping,
                                trackCount: clampInt(activeSong.editingServices.comping.trackCount, 1, nextValue ?? 1),
                              },
                              instrumentTuning: {
                                ...activeSong.editingServices.instrumentTuning,
                                trackCount: clampInt(activeSong.editingServices.instrumentTuning.trackCount, 1, nextValue ?? 1),
                              },
                              cleanupNoiseRemoval: {
                                ...activeSong.editingServices.cleanupNoiseRemoval,
                                trackCount: clampInt(activeSong.editingServices.cleanupNoiseRemoval.trackCount, 1, nextValue ?? 1),
                              },
                            },
                            repairServices: {
                              ...activeSong.repairServices,
                              hissRemoval: {
                                ...activeSong.repairServices.hissRemoval,
                                trackCount: clampInt(activeSong.repairServices.hissRemoval.trackCount, 1, nextValue ?? 1),
                              },
                              cracklingRemoval: {
                                ...activeSong.repairServices.cracklingRemoval,
                                trackCount: clampInt(activeSong.repairServices.cracklingRemoval.trackCount, 1, nextValue ?? 1),
                              },
                              clicksPopsRemoval: {
                                ...activeSong.repairServices.clicksPopsRemoval,
                                trackCount: clampInt(activeSong.repairServices.clicksPopsRemoval.trackCount, 1, nextValue ?? 1),
                              },
                              plosiveReduction: {
                                ...activeSong.repairServices.plosiveReduction,
                                trackCount: clampInt(activeSong.repairServices.plosiveReduction.trackCount, 1, nextValue ?? 1),
                              },
                              reverbReduction: {
                                ...activeSong.repairServices.reverbReduction,
                                trackCount: clampInt(activeSong.repairServices.reverbReduction.trackCount, 1, nextValue ?? 1),
                              },
                            },
                          });
                        }}
                        className={inputClassName}
                        required
                        disabled={!activeSong.service || activeSong.service === "master"}
                      >
                        {activeSong.service !== "master" && <option value="">Select track count</option>}
                        {(activeSong.service ? getServicePricing(activeSong.service as BaseService).trackTiers : []).map(
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
                        onChange={(e) => {
                          const val = e.target.value === "" ? null : Number(e.target.value);
                          updateActiveSong({ lengthMinutes: val });
                        }}
                        className={inputClassName}
                        required
                        disabled={!activeSong.service}
                      >
                        <option value="">Select song length</option>
                        {(activeSong.service
                          ? getServicePricing(activeSong.service as BaseService).songLengthTiers
                          : BASE_SERVICE_PRICING.mix.songLengthTiers
                        ).map((interval) => (
                          <option key={interval.max} value={interval.max}>
                            Up to {interval.max} min{interval.max > 1 ? "s" : ""}
                            {interval.surcharge > 0 ? ` (+${formatCurrency(interval.surcharge)})` : " (no surcharge)"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Step 2 of 6
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
                        onClick={() => setSongStep("editing")}
                        disabled={!canGoNextFromBase}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {songStep === "editing" && (
                <>
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Song {activeSongIndex + 1} of {songs.length}
                          {activeSong?.name && (
                            <span className="text-muted-foreground"> — {activeSong.name}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Optional editing services priced per track.</div>
                      </div>
                      <PagedItemNav
                        itemLabel="Song"
                        currentIndex={activeSongIndex}
                        total={songs.length}
                        onPrevious={() => goToSong(activeSongIndex - 1)}
                        onNext={() => goToSong(activeSongIndex + 1)}
                      />
                    </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={activeSong.editingServices.timeAlignment.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            editingServices: {
                              ...activeSong.editingServices,
                              timeAlignment: {
                                ...activeSong.editingServices.timeAlignment,
                                enabled: e.target.checked,
                                trackCount: clampInt(
                                  activeSong.editingServices.timeAlignment.trackCount,
                                  1,
                                  activeSongTrackCount
                                ),
                              },
                            },
                          })
                        }
                      />
                      <span className="font-medium">Time Alignment</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatCurrency(EDITING_SERVICE_PRICING.timeAlignment.perTrack)} / track)
                      </span>
                    </label>
                    {activeSong.editingServices.timeAlignment.enabled && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">How many tracks need alignment?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.editingServices.timeAlignment.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              editingServices: {
                                ...activeSong.editingServices,
                                timeAlignment: {
                                  ...activeSong.editingServices.timeAlignment,
                                  trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                                },
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                        <div className="space-y-1">
                          <label className="text-sm text-muted-foreground">Notes</label>
                          <textarea
                            value={activeSong.editingServices.timeAlignment.notes}
                            onChange={(e) =>
                              updateActiveSong({
                                editingServices: {
                                  ...activeSong.editingServices,
                                  timeAlignment: {
                                    ...activeSong.editingServices.timeAlignment,
                                    notes: e.target.value,
                                  },
                                },
                              })
                            }
                            className={textareaClassName + " h-24"}
                            placeholder={EDITING_SERVICE_NOTE_PLACEHOLDERS.timeAlignment}
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={activeSong.editingServices.comping.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            editingServices: {
                              ...activeSong.editingServices,
                              comping: {
                                ...activeSong.editingServices.comping,
                                enabled: e.target.checked,
                                trackCount: clampInt(activeSong.editingServices.comping.trackCount, 1, activeSongTrackCount),
                              },
                            },
                          })
                        }
                      />
                      <span className="font-medium">Comping</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatCurrency(EDITING_SERVICE_PRICING.comping.perTrack)} / track)
                      </span>
                    </label>
                    {activeSong.editingServices.comping.enabled && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">How many tracks need comping?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.editingServices.comping.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              editingServices: {
                                ...activeSong.editingServices,
                                comping: {
                                  ...activeSong.editingServices.comping,
                                  trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                                },
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                        <div className="space-y-1">
                          <label className="text-sm text-muted-foreground">Notes</label>
                          <textarea
                            value={activeSong.editingServices.comping.notes}
                            onChange={(e) =>
                              updateActiveSong({
                                editingServices: {
                                  ...activeSong.editingServices,
                                  comping: {
                                    ...activeSong.editingServices.comping,
                                    notes: e.target.value,
                                  },
                                },
                              })
                            }
                            className={textareaClassName + " h-24"}
                            placeholder={EDITING_SERVICE_NOTE_PLACEHOLDERS.comping}
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={activeSong.editingServices.vocalTuning.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            editingServices: {
                              ...activeSong.editingServices,
                              vocalTuning: {
                                ...activeSong.editingServices.vocalTuning,
                                enabled: e.target.checked,
                                trackCount: clampInt(
                                  activeSong.editingServices.vocalTuning.trackCount,
                                  1,
                                  activeSongTrackCount
                                ),
                              },
                            },
                          })
                        }
                      />
                      <span className="font-medium">Vocal Tuning</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatCurrency(EDITING_SERVICE_PRICING.vocalTuning.perTrack)} / track)
                      </span>
                    </label>
                    {activeSong.editingServices.vocalTuning.enabled && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">How many tracks need tuning?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.editingServices.vocalTuning.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              editingServices: {
                                ...activeSong.editingServices,
                                vocalTuning: {
                                  ...activeSong.editingServices.vocalTuning,
                                  trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                                },
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                        <div className="space-y-1">
                          <label className="text-sm text-muted-foreground">Notes</label>
                          <textarea
                            value={activeSong.editingServices.vocalTuning.notes}
                            onChange={(e) =>
                              updateActiveSong({
                                editingServices: {
                                  ...activeSong.editingServices,
                                  vocalTuning: {
                                    ...activeSong.editingServices.vocalTuning,
                                    notes: e.target.value,
                                  },
                                },
                              })
                            }
                            className={textareaClassName + " h-24"}
                            placeholder={EDITING_SERVICE_NOTE_PLACEHOLDERS.vocalTuning}
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={activeSong.editingServices.instrumentTuning.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            editingServices: {
                              ...activeSong.editingServices,
                              instrumentTuning: {
                                ...activeSong.editingServices.instrumentTuning,
                                enabled: e.target.checked,
                                trackCount: clampInt(
                                  activeSong.editingServices.instrumentTuning.trackCount,
                                  1,
                                  activeSongTrackCount
                                ),
                              },
                            },
                          })
                        }
                      />
                      <span className="font-medium">Instrument Tuning</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatCurrency(EDITING_SERVICE_PRICING.instrumentTuning.perTrack)} / track)
                      </span>
                    </label>
                    {activeSong.editingServices.instrumentTuning.enabled && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">How many tracks need instrument tuning?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.editingServices.instrumentTuning.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              editingServices: {
                                ...activeSong.editingServices,
                                instrumentTuning: {
                                  ...activeSong.editingServices.instrumentTuning,
                                  trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                                },
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                        <div className="space-y-1">
                          <label className="text-sm text-muted-foreground">Notes</label>
                          <textarea
                            value={activeSong.editingServices.instrumentTuning.notes}
                            onChange={(e) =>
                              updateActiveSong({
                                editingServices: {
                                  ...activeSong.editingServices,
                                  instrumentTuning: {
                                    ...activeSong.editingServices.instrumentTuning,
                                    notes: e.target.value,
                                  },
                                },
                              })
                            }
                            className={textareaClassName + " h-24"}
                            placeholder={EDITING_SERVICE_NOTE_PLACEHOLDERS.instrumentTuning}
                          />
                        </div>
                      </div>
                    )}

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={activeSong.editingServices.cleanupNoiseRemoval.enabled}
                        onChange={(e) =>
                          updateActiveSong({
                            editingServices: {
                              ...activeSong.editingServices,
                              cleanupNoiseRemoval: {
                                ...activeSong.editingServices.cleanupNoiseRemoval,
                                enabled: e.target.checked,
                                trackCount: clampInt(
                                  activeSong.editingServices.cleanupNoiseRemoval.trackCount,
                                  1,
                                  activeSongTrackCount
                                ),
                              },
                            },
                          })
                        }
                      />
                      <span className="font-medium">Cleanup &amp; Noise Removal</span>
                      <span className="text-sm text-muted-foreground">
                        ({formatCurrency(EDITING_SERVICE_PRICING.cleanupNoiseRemoval.perTrack)} / track)
                      </span>
                    </label>
                    {activeSong.editingServices.cleanupNoiseRemoval.enabled && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">How many tracks need cleanup / noise removal?</label>
                        <input
                          type="number"
                          min={1}
                          max={activeSongTrackCount}
                          value={activeSong.editingServices.cleanupNoiseRemoval.trackCount}
                          onChange={(e) =>
                            updateActiveSong({
                              editingServices: {
                                ...activeSong.editingServices,
                                cleanupNoiseRemoval: {
                                  ...activeSong.editingServices.cleanupNoiseRemoval,
                                  trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                                },
                              },
                            })
                          }
                          className={narrowInputClassName}
                        />
                        <div className="space-y-1">
                          <label className="text-sm text-muted-foreground">Notes</label>
                          <textarea
                            value={activeSong.editingServices.cleanupNoiseRemoval.notes}
                            onChange={(e) =>
                              updateActiveSong({
                                editingServices: {
                                  ...activeSong.editingServices,
                                  cleanupNoiseRemoval: {
                                    ...activeSong.editingServices.cleanupNoiseRemoval,
                                    notes: e.target.value,
                                  },
                                },
                              })
                            }
                            className={textareaClassName + " h-24"}
                            placeholder={EDITING_SERVICE_NOTE_PLACEHOLDERS.cleanupNoiseRemoval}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Step 3 of 6
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("base")}
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={() => setSongStep("repair")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {songStep === "repair" && (
                <>
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Song {activeSongIndex + 1} of {songs.length}
                          {activeSong?.name && (
                            <span className="text-muted-foreground"> — {activeSong.name}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Optional repair services priced per track.</div>
                      </div>
                      <PagedItemNav
                        itemLabel="Song"
                        currentIndex={activeSongIndex}
                        total={songs.length}
                        onPrevious={() => goToSong(activeSongIndex - 1)}
                        onNext={() => goToSong(activeSongIndex + 1)}
                      />
                    </div>

                    <div className="space-y-4">
                      {(Object.keys(REPAIR_SERVICE_LABELS) as RepairService[]).map((key) => {
                        const cfg = activeSong.repairServices[key];
                        return (
                          <div key={key}>
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={cfg.enabled}
                                onChange={(e) =>
                                  updateActiveSong({
                                    repairServices: {
                                      ...activeSong.repairServices,
                                      [key]: {
                                        ...cfg,
                                        enabled: e.target.checked,
                                        trackCount: clampInt(cfg.trackCount, 1, activeSongTrackCount),
                                      },
                                    },
                                  })
                                }
                              />
                              <span className="font-medium">{REPAIR_SERVICE_LABELS[key]}</span>
                              <span className="text-sm text-muted-foreground">
                                ({formatCurrency(REPAIR_SERVICE_PRICING[key].perTrack)} / track)
                              </span>
                            </label>

                            {cfg.enabled && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">How many tracks need this repair?</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={activeSongTrackCount}
                                  value={cfg.trackCount}
                                  onChange={(e) =>
                                    updateActiveSong({
                                      repairServices: {
                                        ...activeSong.repairServices,
                                        [key]: {
                                          ...cfg,
                                          trackCount: clampInt(Number(e.target.value), 1, activeSongTrackCount),
                                        },
                                      },
                                    })
                                  }
                                  className={narrowInputClassName}
                                />

                                <div className="space-y-1">
                                  <label className="text-sm text-muted-foreground">Notes</label>
                                  <textarea
                                    value={cfg.notes}
                                    onChange={(e) =>
                                      updateActiveSong({
                                        repairServices: {
                                          ...activeSong.repairServices,
                                          [key]: {
                                            ...cfg,
                                            notes: e.target.value,
                                          },
                                        },
                                      })
                                    }
                                    className={textareaClassName + " h-24"}
                                    placeholder={REPAIR_SERVICE_NOTE_PLACEHOLDERS[key]}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Step 4 of 6
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("editing")}
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
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Song {activeSongIndex + 1} of {songs.length}
                          {activeSong?.name && (
                            <span className="text-muted-foreground"> — {activeSong.name}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Optional exports for your deliverables.</div>
                      </div>
                      <PagedItemNav
                        itemLabel="Song"
                        currentIndex={activeSongIndex}
                        total={songs.length}
                        onPrevious={() => goToSong(activeSongIndex - 1)}
                        onNext={() => goToSong(activeSongIndex + 1)}
                      />
                    </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Multitrack Export</label>
                    <select
                      value={activeSong.multitrackExport ? "yes" : "no"}
                      onChange={(e) => updateActiveSong({ multitrackExport: e.target.value === "yes" })}
                      className={inputClassName}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes (+{formatCurrency(EXPORTS_PRICING.multitrackExportFlat)})</option>
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
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(EXPORTS_PRICING.additionalExports.instrumental)})</span>
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
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(EXPORTS_PRICING.additionalExports.acapella)})</span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Step 5 of 6
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSongStep("repair")}
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={() => setSongStep("addons")}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                  </div>
                </>
              )}

              {songStep === "addons" && (
                <>
                  <div className="rounded-lg border border-border p-4 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="font-medium">
                          Song {activeSongIndex + 1} of {songs.length}
                          {activeSong?.name && (
                            <span className="text-muted-foreground"> — {activeSong.name}</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">Optional edits and extras.</div>
                      </div>
                      <PagedItemNav
                        itemLabel="Song"
                        currentIndex={activeSongIndex}
                        total={songs.length}
                        onPrevious={() => goToSong(activeSongIndex - 1)}
                        onNext={() => goToSong(activeSongIndex + 1)}
                      />
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
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(EXPORTS_PRICING.additionalExports.radioEdit)})</span>
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
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(EXPORTS_PRICING.additionalExports.cleanVersion)})</span>
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
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(EXTRAS_PRICING.rushService2Days)})</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={activeSong.unlimitedRevisions1Month}
                        onChange={(e) => updateActiveSong({ unlimitedRevisions1Month: e.target.checked })}
                      />
                      Unlimited revisions within 1 month
                      <span className="ml-2 text-xs text-muted-foreground">(+{formatCurrency(EXTRAS_PRICING.unlimitedRevisions1Month)})</span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground self-end">
                      Step 6 of 6
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
                        <Button
                          type="button"
                          onClick={goToFinalStep}
                          disabled={!isPackageComplete}
                        >
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                  </div>
                </>
              )}
            </section>
          </>
        )}

        {step === "delivery" && (
          <>
            <div className="space-y-0.5">
              <h2 className="text-xl font-semibold">Final Delivery Options</h2>
              <p className="text-sm text-muted-foreground">
                Select your preferred export formats and platform-specific masters before requesting this package. The '**' indicates sample rate matches uploaded files
              </p>
            </div>

            <section className="space-y-5">
              <div className="rounded-lg border border-border p-4 space-y-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Export formats</div>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryFormats.standardDelivery}
                      onChange={(e) =>
                        setDeliveryFormats((prev) => ({
                          ...prev,
                          standardDelivery: e.target.checked,
                        }))
                      }
                    />
                    <span>{DELIVERY_FORMAT_LABELS.standardDelivery}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryFormats.cdMaster}
                      onChange={(e) =>
                        setDeliveryFormats((prev) => ({
                          ...prev,
                          cdMaster: e.target.checked,
                        }))
                      }
                    />
                    <span>{DELIVERY_FORMAT_LABELS.cdMaster}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryFormats.mp3_320}
                      onChange={(e) =>
                        setDeliveryFormats((prev) => ({
                          ...prev,
                          mp3_320: e.target.checked,
                        }))
                      }
                    />
                    <span>{DELIVERY_FORMAT_LABELS.mp3_320}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryFormats.flac24}
                      onChange={(e) =>
                        setDeliveryFormats((prev) => ({
                          ...prev,
                          flac24: e.target.checked,
                        }))
                      }
                    />
                    <span>{DELIVERY_FORMAT_LABELS.flac24}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryFormats.aiff24}
                      onChange={(e) =>
                        setDeliveryFormats((prev) => ({
                          ...prev,
                          aiff24: e.target.checked,
                        }))
                      }
                    />
                    <span>{DELIVERY_FORMAT_LABELS.aiff24}</span>
                  </label>

                  <label className="flex items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={deliveryFormats.custom}
                      onChange={(e) =>
                        setDeliveryFormats((prev) => ({
                          ...prev,
                          custom: e.target.checked,
                        }))
                      }
                    />
                    <span>{DELIVERY_FORMAT_LABELS.custom}</span>
                  </label>

                  {deliveryFormats.custom && (
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Custom delivery details</label>
                      <textarea
                        value={customDeliveryDetails}
                        onChange={(e) => setCustomDeliveryDetails(e.target.value)}
                        className={textareaClassName + " h-24"}
                        placeholder="Describe your required delivery format(s)."
                      />
                    </div>
                  )}
                </div>

                {hasMasteringOrMixAndMasterService && (
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="text-sm font-medium">Platform-specific masters</div>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={platformMasters.spotifyYoutube}
                        onChange={(e) =>
                          setPlatformMasters((prev) => ({
                            ...prev,
                            spotifyYoutube: e.target.checked,
                          }))
                        }
                      />
                      <span>{PLATFORM_MASTER_LABELS.spotifyYoutube}</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={platformMasters.appleMusic}
                        onChange={(e) =>
                          setPlatformMasters((prev) => ({
                            ...prev,
                            appleMusic: e.target.checked,
                          }))
                        }
                      />
                      <span>{PLATFORM_MASTER_LABELS.appleMusic}</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={platformMasters.deezer}
                        onChange={(e) =>
                          setPlatformMasters((prev) => ({
                            ...prev,
                            deezer: e.target.checked,
                          }))
                        }
                      />
                      <span>{PLATFORM_MASTER_LABELS.deezer}</span>
                    </label>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={platformMasters.custom}
                        onChange={(e) =>
                          setPlatformMasters((prev) => ({
                            ...prev,
                            custom: e.target.checked,
                          }))
                        }
                      />
                      <span>{PLATFORM_MASTER_LABELS.custom}</span>
                    </label>

                    {platformMasters.custom && (
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Custom platform target details</label>
                        <textarea
                          value={customPlatformMasterDetails}
                          onChange={(e) => setCustomPlatformMasterDetails(e.target.value)}
                          className={textareaClassName + " h-24"}
                          placeholder="Describe custom platform loudness / mastering targets."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={returnToLastSongExtrasStep}>
                  Back
                </Button>
              </div>
            </section>
          </>
        )}
      </div>

      <PackageSummaryCard
        total={formatCurrency(total)}
        canRequestPackage={canRequestFinalizedPackage}
        requestPackage={requestPackage}
      >
        <ul className="text-sm space-y-2">
          <li>Type: {projectType}</li>
          <li>Artist: {artistName.trim() || "—"}</li>
          {projectType === "album" && <li>Album: {albumName.trim() || "—"}</li>}
          <li>Songs: {projectType === "album" ? Math.max(2, songCount) : 1}</li>
        </ul>

        {projectType === "album" && songs.length > 1 && step === "songs" && activeSongIndex > 0 && (
          <>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              <div className="text-sm font-semibold">Finished songs</div>
              <div className="space-y-2">
                {songs.slice(0, activeSongIndex).map((song, idx) => {
                  if (!isSongConfigured(song)) return null;
                  const finishedSongTotal = computeSongPrice(song);
                  return (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="truncate pr-3 text-muted-foreground">{song.name}</span>
                      <span className="tabular-nums">{formatCurrency(finishedSongTotal)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step === "songs" && activeSong && activeSongBreakdown && (
          <>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              <div className="text-sm font-semibold">Current song</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate pr-3 text-muted-foreground">Base Service</span>
                  <span className="tabular-nums">{formatCurrency(activeSongBreakdown.detailsSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate pr-3 text-muted-foreground">Editing Services</span>
                  <span className="tabular-nums">{formatCurrency(activeSongBreakdown.editingSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate pr-3 text-muted-foreground">Repair Services</span>
                  <span className="tabular-nums">{formatCurrency(activeSongBreakdown.repairSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate pr-3 text-muted-foreground">Exports</span>
                  <span className="tabular-nums">{formatCurrency(activeSongBreakdown.exportsSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate pr-3 text-muted-foreground">Edits & Extras</span>
                  <span className="tabular-nums">{formatCurrency(activeSongBreakdown.addonsSubtotal)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold truncate pr-3">
                  {activeSong.name.trim() ? activeSong.name.trim() : "Current song total"}
                </span>
                <span className="font-semibold tabular-nums">{formatCurrency(activeSongBreakdown.songTotal)}</span>
              </div>
            </div>
          </>
        )}

        {step === "delivery" && (
          <>
            <div className="h-px bg-border" />
            <div className="space-y-2 text-sm">
              <div className="text-sm font-semibold">Selected delivery</div>
              <div className="space-y-1 text-muted-foreground">
                {selectedDeliveryFormatLabels.length > 0 ? (
                  selectedDeliveryFormatLabels.map((label) => <div key={label}>• {label}</div>)
                ) : (
                  <div>• —</div>
                )}
                {deliveryFormats.custom && customDeliveryDetails.trim() && (
                  <div>• Custom: {customDeliveryDetails.trim()}</div>
                )}
              </div>
            </div>

            {hasMasteringOrMixAndMasterService && (
              <div className="space-y-2 text-sm">
                <div className="text-sm font-semibold">Platform masters</div>
                <div className="space-y-1 text-muted-foreground">
                  {selectedPlatformMasterLabels.length > 0 ? (
                    selectedPlatformMasterLabels.map((label) => <div key={label}>• {label}</div>)
                  ) : (
                    <div>• —</div>
                  )}
                  {platformMasters.custom && customPlatformMasterDetails.trim() && (
                    <div>• Custom: {customPlatformMasterDetails.trim()}</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </PackageSummaryCard>
    </div>
  );
}
