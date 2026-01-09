import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type SampleKey = "beforeMix" | "beforeMaster" | "after";

type Props = {
  title: string;
  description?: string;
  samples: Record<SampleKey, string>;
};

export default function AudioComparison({ title, description, samples }: Props) {
  const [active, setActive] = useState<SampleKey>("beforeMix");
  const [ctx, setCtx] = useState<AudioContext | null>(null);
  const buffers = useRef<Partial<Record<SampleKey, AudioBuffer>>>({});
  const gains = useRef<Partial<Record<SampleKey, GainNode>>>({});
  const sources = useRef<Partial<Record<SampleKey, AudioBufferSourceNode>>>({});

  // --- RMS loudness estimation ---
  const rms = (buffer: AudioBuffer) => {
    const data = buffer.getChannelData(0);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] ** 2;
    return Math.sqrt(sum / data.length);
  };

  // --- Load & normalize ---
  useEffect(() => {
    const audioCtx = new AudioContext();
    setCtx(audioCtx);

    const load = async () => {
      const entries = Object.entries(samples) as [SampleKey, string][];
      const decoded: Partial<Record<SampleKey, AudioBuffer>> = {};

      for (const [key, url] of entries) {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        decoded[key] = await audioCtx.decodeAudioData(arr);
      }

      // Compute loudness & normalize
      const rmsValues = Object.values(decoded).map(b => rms(b!));
      const target = Math.max(...rmsValues);

      entries.forEach(([key]) => {
        const gain = audioCtx.createGain();
        gain.gain.value = target / rms(decoded[key]!);
        gains.current[key] = gain;
      });

      buffers.current = decoded;
    };

    load();
    return () => audioCtx.close();
  }, []);

  // --- WaveSurfer visual waveform ---
  const waveformRef = useRef<HTMLDivElement>(null);
  const wave = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!waveformRef.current) return;

    wave.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#888",
      progressColor: "#6366f1",
      height: 64,
      normalize: true,
    });

    wave.current.load(samples[active]);

    return () => wave.current?.destroy();
  }, [active]);


  const play = () => {
    if (!ctx) return;

    // Stop previous
    Object.values(sources.current).forEach(src => src?.stop());

    const startTime = ctx.currentTime + 0.05;

    (Object.keys(buffers.current) as SampleKey[]).forEach(key => {
      const source = ctx.createBufferSource();
      source.buffer = buffers.current[key]!;
      source.connect(gains.current[key]!);
      gains.current[key]!.connect(ctx.destination);

      if (key === active) {
        source.start(startTime);
      }

      sources.current[key] = source;
    });
  };

  return (
    <div className="p-6 border rounded-lg bg-background">
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      <div className="flex gap-2 mb-4">
        {(["beforeMix", "beforeMaster", "after"] as SampleKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-3 py-1 rounded text-sm ${
              active === key
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <button
        onClick={play}
        className="px-4 py-2 rounded bg-secondary text-secondary-foreground"
      >
        Play (Gain-Matched)
      </button>

      <div ref={waveformRef} className="mb-4 rounded overflow-hidden" />

    </div>
  );
}
