import * as React from "react";
import { Pause, Play, RotateCcw, AudioWaveform } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

import { Button } from "@/components/ui/Button";

type SampleKey =
  | "rawTracks"
  | "rawStems"
  | "rawMix"
  | "mixed"
  | "mastered"
  | "stemMastered";

const ALL_SAMPLE_KEYS: SampleKey[] = [
  "rawTracks",
  "rawStems",
  "rawMix",
  "mixed",
  "mastered",
  "stemMastered",
];

const getAvailableKeysFromSamples = (
  samples: Partial<Record<SampleKey, string>>
): SampleKey[] =>
  ALL_SAMPLE_KEYS.filter((key) => Boolean(samples[key] && samples[key]?.trim().length));

type Props = {
  title: string;
  description?: string;
  samples: Partial<Record<SampleKey, string>>;
};

const LABELS: Record<SampleKey, string> = {
  rawTracks: "Raw Tracks",
  rawStems: "Raw Stems",
  rawMix: "Raw Mix",
  mixed: "Mixed",
  mastered: "Mastered",
  stemMastered: "Stem Mastered",
};

export default function AudioComparison({ title, description, samples }: Props) {
  const [active, setActive] = React.useState<SampleKey>(() => {
    const available = getAvailableKeysFromSamples(samples);
    return available[0] ?? "rawTracks";
  });
  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loudnessMatch, setLoudnessMatch] = React.useState(true);
  const [availableKeys, setAvailableKeys] = React.useState<SampleKey[]>(() =>
    getAvailableKeysFromSamples(samples)
  );

  // Unique instance ID for global play coordination
  const instanceIdRef = React.useRef<string>(
    `audio-comparison-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );

  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const buffersRef = React.useRef<Partial<Record<SampleKey, AudioBuffer>>>({});
  const matchGainsRef = React.useRef<Partial<Record<SampleKey, number>>>({});
  const trackGainsRef = React.useRef<Partial<Record<SampleKey, GainNode>>>({});
  const sourcesRef = React.useRef<Partial<Record<SampleKey, AudioBufferSourceNode>>>({});

  const durationRef = React.useRef<number>(0);
  const offsetRef = React.useRef<number>(0);
  const startedAtRef = React.useRef<number>(0);
  const rafRef = React.useRef<number | null>(null);
  const playSessionRef = React.useRef(0);
  const isPlayingRef = React.useRef(false);
  const seekingRef = React.useRef(false);

  const hasAnySampleUrl = React.useMemo(
    () => getAvailableKeysFromSamples(samples).length > 0,
    [samples]
  );

  const activeIsAvailable = React.useMemo(
    () => availableKeys.includes(active),
    [active, availableKeys]
  );

  const getFallbackActiveKey = React.useCallback((): SampleKey => {
    const fromDecoded = availableKeys[0];
    if (fromDecoded) return fromDecoded;
    const fromUrls = getAvailableKeysFromSamples(samples)[0];
    return fromUrls ?? "rawTracks";
  }, [availableKeys, samples]);

  // --- RMS loudness estimation ---
  const rms = (buffer: AudioBuffer) => {
    const data = buffer.getChannelData(0);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const sample = data[i] ?? 0;
      sum += sample * sample;
    }
    return Math.sqrt(sum / data.length);
  };

  const stopRaf = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopSources = React.useCallback(() => {
    stopRaf();
    (Object.keys(sourcesRef.current) as SampleKey[]).forEach((key) => {
      const src = sourcesRef.current[key];
      try {
        src?.stop();
      } catch {
        // ignore
      }
      try {
        src?.disconnect();
      } catch {
        // ignore
      }
      delete sourcesRef.current[key];
    });
  }, [stopRaf]);

  const getCurrentPosition = React.useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || !isPlaying) return offsetRef.current;
    const elapsed = ctx.currentTime - startedAtRef.current;
    // During the scheduled start window (before audio actually begins), return the offset
    if (elapsed < 0) return offsetRef.current;
    const pos = offsetRef.current + elapsed;
    return Math.max(0, Math.min(durationRef.current || Number.POSITIVE_INFINITY, pos));
  }, [isPlaying]);

  // --- Load & normalize ---
  React.useEffect(() => {
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    let cancelled = false;

    const load = async () => {
      const entries = Object.entries(samples) as [SampleKey, string][];
      const decoded: Partial<Record<SampleKey, AudioBuffer>> = {};

      for (const [key, url] of entries) {
        if (!url || url.trim().length === 0) continue;
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const arr = await res.arrayBuffer();
          decoded[key] = await audioCtx.decodeAudioData(arr);
        } catch {
          // ignore per-file load/decode errors; keep others working
        }
      }

      if (cancelled) return;

      const decodedKeys = (Object.keys(decoded) as SampleKey[]).filter((k) => decoded[k]);
      setAvailableKeys(decodedKeys);

      const rmsValues = decodedKeys
        .map((k) => decoded[k])
        .filter((b): b is AudioBuffer => Boolean(b))
        .map((b) => rms(b));
      const finitePositive = rmsValues.filter((v) => Number.isFinite(v) && v > 0);
      const target = finitePositive.length > 0 ? Math.min(...finitePositive) : 0;

      // Create gain nodes for all tracks so the mixer logic stays simple.
      ALL_SAMPLE_KEYS.forEach((key) => {
        const buffer = decoded[key];
        if (buffer && target > 0) {
          const bufferRms = rms(buffer);
          const match = bufferRms > 0 ? target / bufferRms : 1;
          matchGainsRef.current[key] = match;
        } else {
          matchGainsRef.current[key] = 1;
        }

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.connect(audioCtx.destination);
        trackGainsRef.current[key] = gainNode;
      });

      durationRef.current = Math.max(
        0,
        ...ALL_SAMPLE_KEYS.map((key) => decoded[key]?.duration ?? 0).filter((d) =>
          Number.isFinite(d)
        )
      );

      buffersRef.current = decoded;
      setIsReady(true);

      // If the currently active version isn't available, fall back.
      if (!decodedKeys.includes(active)) {
        setActive(decodedKeys[0] ?? "rawTracks");
      }
    };

    load();

    return () => {
      cancelled = true;
      stopSources();
      audioCtx.close();
      audioCtxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samples]);

  // --- WaveSurfer visual waveform ---
  const waveformRef = React.useRef<HTMLDivElement>(null);
  const waveRef = React.useRef<WaveSurfer | null>(null);
  const ignoreWaveEventRef = React.useRef(false);
  const waveLoadIdRef = React.useRef(0);
  const seekToRef = React.useRef<(time: number) => void>(() => {});
  const pauseRef = React.useRef<() => void>(() => {});

  const resolveCssColor = React.useCallback(
    (element: HTMLElement, cssVarName: string, fallback: string) => {
      const style = getComputedStyle(element);

      const resolveVar = (value: string, depth = 0): string => {
        if (depth > 8) return fallback;
        const trimmed = value.trim();
        const match = /^var\((--[^,\s)]+)(?:,\s*(.+))?\)$/.exec(trimmed);
        if (!match) return trimmed;

        const varName = match[1];
        if (!varName) return fallback;

        const varFallback = match[2] ?? fallback;
        const varValue = style.getPropertyValue(varName).trim();
        if (!varValue) return resolveVar(varFallback, depth + 1);
        return resolveVar(varValue, depth + 1);
      };

      const raw = style.getPropertyValue(cssVarName).trim();
      const resolved = raw ? resolveVar(raw) : resolveVar(fallback);

      const probe = document.createElement("span");
      probe.style.color = resolved;
      probe.style.display = "none";
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();

      return computed || resolved || fallback;
    },
    []
  );

  React.useEffect(() => {
    if (!waveformRef.current) return;

    const getWaveSurferColors = () => {
      const el = waveformRef.current;
      if (!el) {
        return {
          waveColor: "#888",
          progressColor: "#6366f1",
          cursorColor: "#6366f1",
        };
      }

      return {
        // Allow per-component overrides via CSS variables:
        // - --wavesurfer-wave
        // - --wavesurfer-progress
        // - --wavesurfer-cursor
        // Defaults map to existing theme variables from global.css.
        waveColor: resolveCssColor(el, "--wavesurfer-wave", "var(--muted-foreground)"),
        progressColor: resolveCssColor(el, "--wavesurfer-progress", "var(--secondary)"),
        cursorColor: resolveCssColor(el, "--wavesurfer-cursor", "var(--accent)"),
      };
    };

    const initialColors = getWaveSurferColors();

    const wave = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: initialColors.waveColor,
      progressColor: initialColors.progressColor,
      cursorColor: initialColors.cursorColor,
      cursorWidth: 2,
      height: 72,
      normalize: true,
      interact: true,
      dragToSeek: true,
    });

    waveRef.current = wave;

    const onInteraction = (newTime: number) => {
      if (ignoreWaveEventRef.current) return;
      seekToRef.current(newTime);
    };

    wave.on("interaction", onInteraction);

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const colors = getWaveSurferColors();

      // WaveSurfer v7 supports setOptions; if anything changes in the future,
      // this will safely no-op.
      (wave as unknown as { setOptions?: (opts: unknown) => void }).setOptions?.({
        waveColor: colors.waveColor,
        progressColor: colors.progressColor,
        cursorColor: colors.cursorColor,
      });
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class", "style"] });

    return () => {
      observer.disconnect();
      wave.un("interaction", onInteraction);
      wave.destroy();
      waveRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolveCssColor]);

  const syncWaveToTime = React.useCallback((time: number) => {
    const wave = waveRef.current;
    if (!wave) return;
    ignoreWaveEventRef.current = true;
    wave.setTime(time);
    ignoreWaveEventRef.current = false;
  }, []);

  // Load the waveform for the currently selected version.
  // Keep the playhead position stable when switching versions.
  React.useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    const loadId = ++waveLoadIdRef.current;
    const currentTime = getCurrentPosition();

    const url = samples[active];
    if (!url || url.trim().length === 0) {
      // Avoid WaveSurfer errors on blank URLs; clear the view instead.
      (wave as unknown as { empty?: () => void }).empty?.();
      syncWaveToTime(0);
      return;
    }

    wave
      .load(url)
      .then(() => {
        if (waveLoadIdRef.current !== loadId) return;
        syncWaveToTime(currentTime);
      })
      .catch(() => {
        // ignore load errors here; audio decoding already handled separately
      });
  }, [active, getCurrentPosition, samples, syncWaveToTime]);

  const startRaf = React.useCallback(() => {
    stopRaf();
    const tick = () => {
      // Skip waveform updates while seeking to avoid visual glitches
      if (!seekingRef.current) {
        const pos = getCurrentPosition();
        syncWaveToTime(pos);
      }
      if (isPlayingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [getCurrentPosition, stopRaf, syncWaveToTime]);

  const applyActiveGains = React.useCallback(
    (key: SampleKey, useLoudnessMatch: boolean) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      (Object.keys(trackGainsRef.current) as SampleKey[]).forEach((k) => {
        const gainNode = trackGainsRef.current[k];
        if (!gainNode) return;

        // When loudness matching is enabled, use the computed match gain;
        // otherwise use unity gain (1) for the active track.
        const matchGain = useLoudnessMatch ? (matchGainsRef.current[k] ?? 1) : 1;
        const target = k === key ? matchGain : 0;
        gainNode.gain.cancelScheduledValues(ctx.currentTime);
        gainNode.gain.setTargetAtTime(target, ctx.currentTime, 0.015);
      });
    },
    []
  );

  const playFrom = React.useCallback(
    async (offsetSeconds: number) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (!isReady) return;
      if (!hasAnySampleUrl) return;

      const playableKey: SampleKey = activeIsAvailable ? active : getFallbackActiveKey();
      if (!buffersRef.current[playableKey]) return;

      if (playableKey !== active) {
        setActive(playableKey);
      }

      await ctx.resume();

      const sessionId = ++playSessionRef.current;

      const startOffset = Math.max(0, Math.min(durationRef.current || Infinity, offsetSeconds));

      stopSources();

      const when = ctx.currentTime + 0.03;
      startedAtRef.current = when;
      offsetRef.current = startOffset;

      (Object.keys(buffersRef.current) as SampleKey[]).forEach((key) => {
        const buffer = buffersRef.current[key];
        const gainNode = trackGainsRef.current[key];
        if (!buffer || !gainNode) return;

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        source.onended = () => {
          // Only treat this as "finished" if it's for the latest play session.
          if (playSessionRef.current !== sessionId) return;

          // If we reached (or nearly reached) the end, reflect that in UI state.
          const pos = offsetRef.current + Math.max(0, ctx.currentTime - startedAtRef.current);
          if (durationRef.current && pos >= durationRef.current - 0.05) {
            stopSources();
            offsetRef.current = durationRef.current;
            setIsPlaying(false);
            syncWaveToTime(durationRef.current);
          }
        };
        source.start(when, startOffset);
        sourcesRef.current[key] = source;
      });

      applyActiveGains(playableKey, loudnessMatch);
      isPlayingRef.current = true;
      setIsPlaying(true);
      seekingRef.current = false;
      startRaf();

      // Notify other instances to pause
      window.dispatchEvent(
        new CustomEvent("audiocomparison:play", {
          detail: { instanceId: instanceIdRef.current },
        })
      );
    },
    [
      active,
      activeIsAvailable,
      applyActiveGains,
      getFallbackActiveKey,
      hasAnySampleUrl,
      isReady,
      loudnessMatch,
      startRaf,
      stopSources,
    ]
  );

  const pause = React.useCallback(() => {
    const pos = getCurrentPosition();
    stopSources();
    offsetRef.current = pos;
    isPlayingRef.current = false;
    setIsPlaying(false);
    syncWaveToTime(pos);
  }, [getCurrentPosition, stopSources, syncWaveToTime]);

  const togglePlayPause = React.useCallback(async () => {
    if (!isReady) return;
    if (isPlaying) {
      pause();
      return;
    }
    await playFrom(offsetRef.current);
  }, [isPlaying, isReady, pause, playFrom]);

  const reset = React.useCallback(() => {
    stopSources();
    offsetRef.current = 0;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setActive(getFallbackActiveKey());
    syncWaveToTime(0);
  }, [getFallbackActiveKey, stopSources, syncWaveToTime]);

  const seekTo = React.useCallback(
    (timeSeconds: number) => {
      // Immediately stop RAF and set seeking flag to prevent visual glitches
      seekingRef.current = true;
      stopRaf();

      const t = Math.max(0, Math.min(durationRef.current || Infinity, timeSeconds));
      offsetRef.current = t;
      syncWaveToTime(t);

      if (isPlaying) {
        // Restart sources at the new offset (AudioBufferSourceNode cannot truly seek).
        void playFrom(t);
      } else {
        // Not playing, just clear seeking flag
        seekingRef.current = false;
      }
    },
    [isPlaying, playFrom, stopRaf, syncWaveToTime]
  );

  // Keep seekToRef in sync with the latest seekTo callback.
  React.useEffect(() => {
    seekToRef.current = seekTo;
  }, [seekTo]);

  // Listen for global play events - pause this instance if another starts playing
  React.useEffect(() => {
    const handleGlobalPlay = (event: Event) => {
      const customEvent = event as CustomEvent<{ instanceId: string }>;
      if (customEvent.detail.instanceId !== instanceIdRef.current) {
        // Another instance started playing, pause this one
        pauseRef.current();
      }
    };

    window.addEventListener("audiocomparison:play", handleGlobalPlay);
    return () => {
      window.removeEventListener("audiocomparison:play", handleGlobalPlay);
    };
  }, []);

  // Keep isPlayingRef in sync with state.
  React.useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Keep pauseRef in sync with the latest pause callback.
  React.useEffect(() => {
    pauseRef.current = pause;
  }, [pause]);

  // Keep wave cursor in sync while playing.
  React.useEffect(() => {
    if (isPlaying) {
      startRaf();
      return;
    }
    stopRaf();
  }, [isPlaying, startRaf, stopRaf]);

  const handleSelectVersion = React.useCallback(
    (key: SampleKey) => {
      if (!availableKeys.includes(key)) return;
      setActive(key);
      applyActiveGains(key, loudnessMatch);
    },
    [applyActiveGains, availableKeys, loudnessMatch]
  );

  const toggleLoudnessMatch = React.useCallback(() => {
    setLoudnessMatch((prev) => {
      const next = !prev;
      applyActiveGains(active, next);
      return next;
    });
  }, [active, applyActiveGains]);

  return (
    <div className="p-6 border-2 rounded-lg bg-background shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-0">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="icon"
            variant="solid"
            onClick={() => void togglePlayPause()}
            disabled={!isReady || !activeIsAvailable}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={reset}
            disabled={!isReady}
            aria-label="Reset"
            title="Reset"
          >
            <RotateCcw className="size-5" />
          </Button>

          {/* <Button
            type="button"
            size="icon"
            variant={loudnessMatch ? "solid" : "ghost"}
            onClick={toggleLoudnessMatch}
            disabled={!isReady}
            aria-label={loudnessMatch ? "Disable loudness matching" : "Enable loudness matching"}
            title={loudnessMatch ? "Loudness matching ON" : "Loudness matching OFF"}
            className={cn(!loudnessMatch && "border border-border")}
          >
            {loudnessMatch ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </Button> */}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ALL_SAMPLE_KEYS.filter((key) => Boolean(samples[key] && samples[key]?.trim().length)).map(
          (key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={active === key ? "solid" : "ghost"}
              onClick={() => handleSelectVersion(key)}
              disabled={!isReady || !availableKeys.includes(key)}
              useHoverScale={false}
              borderAlways
              borderColor={active === key ? "transparent" : "border"}
              hoverBorderColor={active === key ? "transparent" : "border"}
            >
              {LABELS[key]}
            </Button>
          )
        )}

        <Button
          type="button"
          size="sm"
          variant={loudnessMatch ? "solid" : "ghost"}
          {...(loudnessMatch
            ? {
                bgColor: "accent/90",
                hoverBgColor: "accent/80",
                textColor: "accent-foreground",
                hoverTextColor: "accent-foreground",
              }
            : {})}
          onClick={toggleLoudnessMatch}
          disabled={!isReady}
          aria-label={loudnessMatch ? "Disable loudness matching" : "Enable loudness matching"}
          title={loudnessMatch ? "Loudness matching ON" : "Loudness matching OFF"}
          useHoverScale={false}
          borderAlways
          borderColor={loudnessMatch ? "transparent" : "border"}
          hoverBorderColor={loudnessMatch ? "transparent" : "border"}
        >
          <AudioWaveform className="size-4" />
        </Button>
      </div>

      <div
        ref={waveformRef}
        className="mt-4 rounded overflow-hidden cursor-pointer select-none"
      />

      {!isReady && (
        <p className="mt-3 text-sm text-muted-foreground">Loading audio…</p>
      )}

      {isReady && !hasAnySampleUrl && (
        <p className="mt-3 text-sm text-muted-foreground">No audio samples provided.</p>
      )}
    </div>
  );
}
