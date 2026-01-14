import * as React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SampleKey = "beforeMix" | "beforeMaster" | "after";

type Props = {
  title: string;
  description?: string;
  samples: Record<SampleKey, string>;
};

const LABELS: Record<SampleKey, string> = {
  beforeMix: "Before mix",
  beforeMaster: "Before master",
  after: "After mix and master",
};

export default function AudioComparison({ title, description, samples }: Props) {
  const [active, setActive] = React.useState<SampleKey>("beforeMix");
  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

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
    const pos = offsetRef.current + (ctx.currentTime - startedAtRef.current);
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
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        decoded[key] = await audioCtx.decodeAudioData(arr);
      }

      if (cancelled) return;

      const rmsValues = (Object.values(decoded) as AudioBuffer[]).map((b) => rms(b));
      const target = Math.min(...rmsValues.filter((v) => Number.isFinite(v) && v > 0));

      entries.forEach(([key]) => {
        const buffer = decoded[key];
        if (!buffer) return;
        const bufferRms = rms(buffer);
        const match = bufferRms > 0 ? target / bufferRms : 1;
        matchGainsRef.current[key] = match;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0;
        gainNode.connect(audioCtx.destination);
        trackGainsRef.current[key] = gainNode;
      });

      durationRef.current = Math.max(
        ...entries
          .map(([key]) => decoded[key]?.duration ?? 0)
          .filter((d) => Number.isFinite(d))
      );

      buffersRef.current = decoded;
      setIsReady(true);
    };

    load();

    return () => {
      cancelled = true;
      stopSources();
      audioCtx.close();
      audioCtxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- WaveSurfer visual waveform ---
  const waveformRef = React.useRef<HTMLDivElement>(null);
  const waveRef = React.useRef<WaveSurfer | null>(null);
  const ignoreWaveEventRef = React.useRef(false);

  React.useEffect(() => {
    if (!waveformRef.current) return;

    const wave = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#888",
      progressColor: "#6366f1",
      cursorColor: "#6366f1",
      cursorWidth: 2,
      height: 72,
      normalize: true,
      interact: true,
      dragToSeek: true,
    });

    waveRef.current = wave;
    // Use one stable file for waveform rendering; seeking controls playback for all.
    wave.load(samples.after);

    const onInteraction = (newTime: number) => {
      if (ignoreWaveEventRef.current) return;
      seekTo(newTime);
    };

    wave.on("interaction", onInteraction);

    return () => {
      wave.un("interaction", onInteraction);
      wave.destroy();
      waveRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncWaveToTime = React.useCallback((time: number) => {
    const wave = waveRef.current;
    if (!wave) return;
    ignoreWaveEventRef.current = true;
    wave.setTime(time);
    ignoreWaveEventRef.current = false;
  }, []);

  const startRaf = React.useCallback(() => {
    stopRaf();
    const tick = () => {
      const pos = getCurrentPosition();
      syncWaveToTime(pos);
      if (isPlaying) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [getCurrentPosition, isPlaying, stopRaf, syncWaveToTime]);

  const applyActiveGains = React.useCallback(
    (key: SampleKey) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      (Object.keys(trackGainsRef.current) as SampleKey[]).forEach((k) => {
        const gainNode = trackGainsRef.current[k];
        if (!gainNode) return;

        const target = k === key ? (matchGainsRef.current[k] ?? 1) : 0;
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

      applyActiveGains(active);
      setIsPlaying(true);
    },
    [active, applyActiveGains, isReady, stopSources]
  );

  const pause = React.useCallback(() => {
    const pos = getCurrentPosition();
    stopSources();
    offsetRef.current = pos;
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
    setIsPlaying(false);
    setActive("beforeMix");
    syncWaveToTime(0);
  }, [stopSources, syncWaveToTime]);

  const seekTo = React.useCallback(
    (timeSeconds: number) => {
      const t = Math.max(0, Math.min(durationRef.current || Infinity, timeSeconds));
      offsetRef.current = t;
      syncWaveToTime(t);
      if (isPlaying) {
        // Restart sources at the new offset (AudioBufferSourceNode cannot truly seek).
        void playFrom(t);
      }
    },
    [isPlaying, playFrom, syncWaveToTime]
  );

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
      setActive(key);
      applyActiveGains(key);
    },
    [applyActiveGains]
  );

  return (
    <div className="p-6 border rounded-lg bg-background">
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
            disabled={!isReady}
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
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["beforeMix", "beforeMaster", "after"] as SampleKey[]).map((key) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={active === key ? "solid" : "ghost"}
            onClick={() => handleSelectVersion(key)}
            disabled={!isReady}
            className={cn("h-8", active !== key && "border border-border")}
          >
            {LABELS[key]}
          </Button>
        ))}
      </div>

      <div
        ref={waveformRef}
        className="mt-4 rounded overflow-hidden cursor-pointer select-none"
      />

      {!isReady && (
        <p className="mt-3 text-sm text-muted-foreground">Loading audio…</p>
      )}
    </div>
  );
}
