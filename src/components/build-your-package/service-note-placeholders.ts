export const EDITING_SERVICE_NOTE_PLACEHOLDERS = {
  timeAlignment: "e.g., Tighten kick/snare timing; align doubled guitars",
  comping: "e.g., Lead vocal takes; comp best phrases; keep take 3 for the bridge",
  vocalTuning: "e.g., Tune chorus vocal harmonies; fix a few flat notes in verse 2",
  instrumentTuning: "e.g., Correct bass DI pitch in the chorus; fix a few sharp notes",
  cleanupNoiseRemoval: "e.g., Remove breaths/mouth clicks; trim count-ins; reduce headphone bleed",
} as const;

export const REPAIR_SERVICE_NOTE_PLACEHOLDERS = {
  clippingRepair: "e.g., Repair digital clipping at 1:08 and 1:18; try to preserve natural transients",
  clicksPopsRemoval: "e.g., Remove clicks at 0:32 and 1:18; fix pops on the first downbeat",
  hissRemoval: "e.g., Reduce hiss between vocal lines; keep natural air on tails",
  cracklingRemoval: "e.g., Remove crackle in the intro; keep any vinyl texture if desired",
  plosiveReduction: "e.g., Reduce \"P\" pops on lead vocal (verse 1); tame plosives on ad-libs",
  reverbReduction: "e.g., Reduce room reverb on dialogue; keep natural ambience where possible",
} as const;
