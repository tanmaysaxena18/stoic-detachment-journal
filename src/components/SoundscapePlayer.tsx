import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Square, Sparkles, Music, Mic } from "lucide-react";

type SoundType = "none" | "rain" | "binaural" | "wind" | "zen";

export default function SoundscapePlayer() {
  const [activeSound, setActiveSound] = useState<SoundType>("none");
  const [volume, setVolume] = useState<number>(0.3);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);

  // Initialize Web Audio Context on user action
  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.value = volume;
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const stopAllSounds = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    activeNodesRef.current = [];
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    stopAllSounds();

    if (activeSound === "none") return;

    initAudioCtx();
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;

    if (!ctx || !masterGain) return;

    if (activeSound === "rain") {
      // Brown noise + filter for rain sound
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // gain boost
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1000;

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      activeNodesRef.current.push(noise, filter);

    } else if (activeSound === "binaural") {
      // Deep Theta binaural tone (200Hz left, 206Hz right -> 6Hz theta frequency)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      osc1.type = "sine";
      osc1.frequency.value = 200;

      osc2.type = "sine";
      osc2.frequency.value = 206; // 6Hz Theta deep meditative wave

      const subGain = ctx.createGain();
      subGain.gain.value = 0.2;

      osc1.connect(merger, 0, 0);
      osc2.connect(merger, 0, 1);
      merger.connect(subGain);
      subGain.connect(masterGain);

      osc1.start();
      osc2.start();
      activeNodesRef.current.push(osc1, osc2, subGain, merger);

    } else if (activeSound === "wind") {
      // Bandpass filtered noise for wind howl
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 400;
      filter.Q.value = 3.0;

      // LFO to modulate wind frequency
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15; // slow sweep
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 250;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(masterGain);

      noise.start();
      lfo.start();
      activeNodesRef.current.push(noise, filter, lfo, lfoGain);

    } else if (activeSound === "zen") {
      // Gentle repeating harmonic bell strike every 5 seconds
      let isStopped = false;
      const playZenChime = () => {
        if (isStopped) return;
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();

        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(432, ctx.currentTime); // 432Hz harmonic
        chimeOsc.frequency.exponentialRampToValueAtTime(108, ctx.currentTime + 3);

        chimeGain.gain.setValueAtTime(0.4, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(masterGain);

        chimeOsc.start();
        chimeOsc.stop(ctx.currentTime + 3.6);
      };

      playZenChime();
      const interval = setInterval(playZenChime, 6000);

      activeNodesRef.current.push({
        stop: () => {
          isStopped = true;
          clearInterval(interval);
        }
      });
    }

    return () => {
      stopAllSounds();
    };
  }, [activeSound]);

  // Global Speech Reader tool helper for quotes & posts
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <Music className="w-4 h-4 text-emerald-400" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
          Atmospheric Focus Audio
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            { id: "none", label: "Mute" },
            { id: "rain", label: "🌧️ Slate Rain" },
            { id: "binaural", label: "🧠 6Hz Theta" },
            { id: "wind", label: "💨 Pine Wind" },
            { id: "zen", label: "🔔 432Hz Zen" },
          ] as const
        ).map((s) => (
          <button
            key={s.id}
            onClick={() => {
              initAudioCtx();
              setActiveSound(s.id);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition ${
              activeSound === s.id
                ? "bg-zinc-100 text-zinc-950 font-bold shadow"
                : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            {s.label}
          </button>
        ))}

        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-zinc-800">
          <button
            onClick={() => setVolume(volume === 0 ? 0.3 : 0)}
            className="text-zinc-400 hover:text-zinc-200 p-1"
            title="Toggle Mute"
          >
            {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Universal Text-to-Speech Helper function
 */
export function speakQuoteOrPost(text: string) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Speech Synthesis is not supported in this browser.");
  }
}
