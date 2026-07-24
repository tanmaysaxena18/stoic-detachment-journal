import React, { useState } from "react";
import { Pillar } from "../types";
import { CATEGORY_INFO } from "../data";
import { speakQuoteOrPost } from "./SoundscapePlayer";
import {
  Brain,
  Sparkles,
  Zap,
  ShieldAlert,
  Compass,
  ArrowRight,
  Check,
  RefreshCw,
  Copy,
  BookOpen,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DilemmaPreset {
  id: string;
  title: string;
  category: Pillar;
  situation: string;
  inControl: string[];
  outOfControl: string[];
  reframing: string;
  actionDirective: string;
  recommendedQuote: string;
}

const DILEMMA_PRESETS: DilemmaPreset[] = [
  {
    id: "work_envy",
    title: "Workplace Provocation or Unfairness",
    category: Pillar.HumanNature,
    situation: "A colleague or competitor took credit for your work or acted deceitfully in public.",
    inControl: [
      "Your emotional response and immediate facial expression",
      "Documenting objective facts quietly without emotional outbursts",
      "Setting strict professional boundaries moving forward"
    ],
    outOfControl: [
      "Their character, insecurity, or malicious intentions",
      "Other people's immediate perceptions or rumors",
      "Past events that have already transpired"
    ],
    reframing: "Their deceitful behavior is a reflection of their internal insecurity, not a devaluation of your competence. Treat their provocation as a test of your emotional insulation.",
    actionDirective: "Maintain absolute calm. Speak in measured neutral tones. Do not defend yourself emotionally; present verified metrics calmly when appropriate.",
    recommendedQuote: "The best revenge is to be unlike him who performed the injury. — Marcus Aurelius"
  },
  {
    id: "rejection_loss",
    title: "Heartbreak, Rejection, or Distance",
    category: Pillar.LoveLoss,
    situation: "Someone you valued pulled away, broke contact, or rejected your investment.",
    inControl: [
      "Accepting reality without pleading or demanding explanations",
      "Reclaiming your time and mental focus for your own growth",
      "Maintaining your self-dignity and silence"
    ],
    outOfControl: [
      "Their feelings, choices, or internal emotional shifts",
      "Their desire to remain connected to you",
      "How they evaluate your worth"
    ],
    reframing: "You cannot lose what was never truly yours to possess. The ending of an attachment frees up emotional bandwidth for self-sovereignty.",
    actionDirective: "Execute complete digital and emotional detachment. Do not send lingering texts. Channel the energy into disciplined physical or intellectual work.",
    recommendedQuote: "You have power over your mind - not outside events. Realize this, and you will find strength. — Marcus Aurelius"
  },
  {
    id: "future_anxiety",
    title: "Overwhelming Future Uncertainty",
    category: Pillar.ExpectationsConflict,
    situation: "You are paralyzed by anxiety about financial stability, career direction, or health outcomes.",
    inControl: [
      "The exact task you complete in the next 30 minutes",
      "Your daily sleep, movement, and focus habits",
      "Preparing contingency plans for realistic worst-case scenarios"
    ],
    outOfControl: [
      "Macro-economic shifts or future timeline variables",
      "Guarantees of certainty in an inherently volatile world",
      "How fast results manifest"
    ],
    reframing: "Anxiety is interest paid in advance on a debt that may never come due. Focus on the single step directly under your feet.",
    actionDirective: "Perform Premeditatio Malorum: Write down the absolute worst outcome. Realize you would survive it. Then outline 3 concrete actions for today.",
    recommendedQuote: "We suffer more often in imagination than in reality. — Seneca"
  }
];

export default function StoicOracle() {
  const [selectedDilemma, setSelectedDilemma] = useState<DilemmaPreset>(DILEMMA_PRESETS[0]);
  const [customSituation, setCustomSituation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const handleRunAnalysis = (preset?: DilemmaPreset) => {
    setIsAnalyzing(true);
    if (preset) setSelectedDilemma(preset);

    setTimeout(() => {
      setIsAnalyzing(false);
      setActiveStep(1);
    }, 800);
  };

  const copyAnalysis = () => {
    const text = `STOIC DECONSTRUCTION MATRIX
----------------------------------------
Situation: ${selectedDilemma.situation}

1. IN YOUR CONTROL:
${selectedDilemma.inControl.map((c) => ` • ${c}`).join("\n")}

2. OUTSIDE YOUR CONTROL:
${selectedDilemma.outOfControl.map((c) => ` • ${c}`).join("\n")}

3. REFRAMING DIRECTIVE:
${selectedDilemma.reframing}

4. ACTION DIRECTIVE:
${selectedDilemma.actionDirective}

5. ASSIGNED APHORISM:
"${selectedDilemma.recommendedQuote}"`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block mb-1">
            Interactive Logic Engine
          </span>
          <h3 className="text-base font-sans font-medium text-zinc-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            Stoic Dilemma Deconstruction Matrix
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Process real-life anxieties or conflicts through clinical Dichotomy of Control & Strategic Reframing.
          </p>
        </div>

        <button
          onClick={() => handleRunAnalysis()}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono px-4 py-2 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin text-emerald-400" : ""}`} />
          Recalibrate Matrix
        </button>
      </div>

      {/* Preset Selector Buttons */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
          Select or Simulate Stressor Profile
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DILEMMA_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleRunAnalysis(p)}
              className={`p-3.5 text-left rounded-xl border text-xs transition ${
                selectedDilemma.id === p.id
                  ? "bg-zinc-950 border-emerald-800/80 text-zinc-100 shadow-md"
                  : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <div className="font-sans font-medium mb-1 text-zinc-200">{p.title}</div>
              <p className="text-[10px] text-zinc-500 line-clamp-2">{p.situation}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Deconstruction Output Grid */}
      {isAnalyzing ? (
        <div className="py-12 text-center space-y-3 bg-zinc-950 rounded-2xl border border-zinc-800">
          <Zap className="w-8 h-8 text-emerald-400 animate-pulse mx-auto" />
          <p className="text-xs font-mono text-zinc-300">
            Deconstructing Emotional Inputs into Rational Vectors...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Situation Header Banner */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                Active Stressor Input
              </span>
              <p className="text-xs text-zinc-200 font-sans italic">
                "{selectedDilemma.situation}"
              </p>
            </div>
          </div>

          {/* 4-Stage Matrix Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Dichotomy of Control */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  In Your Power (100% Control)
                </span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {selectedDilemma.inControl.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-mono text-[10px] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 2: Outside Control */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                  <span className="text-red-400 font-mono text-xs">✕</span>
                  Outside Control (0% Influence)
                </span>
              </div>
              <ul className="space-y-2 text-xs text-zinc-400">
                {selectedDilemma.outOfControl.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-600 font-mono text-[10px] mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reframing & Tactical Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block">
                Reframing Directive
              </span>
              <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                {selectedDilemma.reframing}
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
                Tactical Action Protocol
              </span>
              <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                {selectedDilemma.actionDirective}
              </p>
            </div>
          </div>

          {/* Assigned Quote & Speech */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 block">
                Recommended Anchor Aphorism
              </span>
              <p className="text-xs font-serif italic text-zinc-100">
                "{selectedDilemma.recommendedQuote}"
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => speakQuoteOrPost(selectedDilemma.recommendedQuote)}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition"
                title="Read Quote Aloud"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={copyAnalysis}
                className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs px-3.5 py-2 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
