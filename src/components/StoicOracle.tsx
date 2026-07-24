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
  Volume2,
  Send,
  Globe,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DilemmaResult {
  id: string;
  title: string;
  category?: Pillar;
  situation: string;
  inControl: string[];
  outOfControl: string[];
  reframing: string;
  actionDirective: string;
  recommendedQuote: string;
  solutionEnglish?: string;
  solutionHinglish?: string;
  solutionHindi?: string;
}

const DILEMMA_PRESETS: DilemmaResult[] = [
  {
    id: "work_envy",
    title: "Workplace Provocation or Unfairness",
    category: Pillar.HumanNature,
    situation: "A colleague or competitor took credit for your work or acted deceitfully in public.",
    inControl: [
      "Your emotional response and immediate facial expression",
      "Documenting objective facts quietly without emotional outbursts",
      "Setting strict professional boundaries moving forward",
    ],
    outOfControl: [
      "Their character, insecurity, or malicious intentions",
      "Other people's immediate perceptions or rumors",
      "Past events that have already transpired",
    ],
    reframing:
      "Their deceitful behavior is a reflection of their internal insecurity, not a devaluation of your competence. Treat their provocation as a test of your emotional insulation.",
    actionDirective:
      "Maintain absolute calm. Speak in measured neutral tones. Do not defend yourself emotionally; present verified metrics calmly when appropriate.",
    recommendedQuote: "The best revenge is to be unlike him who performed the injury. — Marcus Aurelius",
    solutionEnglish:
      "Clinical Analysis: Deceit in professional arenas is a structural variable of human insecurity. By remaining emotionless and relying on verified logs, you deny the provoker their desired emotional reaction.",
    solutionHinglish:
      "Professional arena mein kisi ka dhokha unki security failure ka sign hai. React mat karo; chup-chaap proof collect karo aur neutral reh kar deal karo.",
    solutionHindi:
      "कार्यस्थल पर किसी का छल उनकी आंतरिक कमजोरी का प्रतीक है। प्रतिक्रिया देने के बजाय शांति से तथ्यों को संग्रहित करें और अपना संतुलन बनाए रखें।",
  },
  {
    id: "rejection_loss",
    title: "Heartbreak, Rejection, or Distance",
    category: Pillar.LoveLoss,
    situation: "Someone you valued pulled away, broke contact, or rejected your investment.",
    inControl: [
      "Accepting reality without pleading or demanding explanations",
      "Reclaiming your time and mental focus for your own growth",
      "Maintaining your self-dignity and silence",
    ],
    outOfControl: [
      "Their feelings, choices, or internal emotional shifts",
      "Their desire to remain connected to you",
      "How they evaluate your worth",
    ],
    reframing:
      "You cannot lose what was never truly yours to possess. The ending of an attachment frees up emotional bandwidth for self-sovereignty.",
    actionDirective:
      "Execute complete digital and emotional detachment. Do not send lingering texts. Channel the energy into disciplined physical or intellectual work.",
    recommendedQuote:
      "You have power over your mind - not outside events. Realize this, and you will find strength. — Marcus Aurelius",
    solutionEnglish:
      "Clinical Analysis: Rejection measures alignment, not personal value. Pleading erodes sovereignty. Complete detachment instantly restores dignity.",
    solutionHinglish:
      "Jab koi door jaaye toh piche mat bhago. Tumhara self-respect tumhare control mein hai, unka decision nahi.",
    solutionHindi:
      "जब कोई आपसे दूरी बनाए तो गिड़गिड़ाएं नहीं। आत्मसम्मान आपका अपना विषय है; पूर्ण वैराग्य ही सर्वोच्च शक्ति प्रदान करता है।",
  },
  {
    id: "future_anxiety",
    title: "Overwhelming Future Uncertainty",
    category: Pillar.ExpectationsConflict,
    situation: "You are paralyzed by anxiety about financial stability, career direction, or health outcomes.",
    inControl: [
      "The exact task you complete in the next 30 minutes",
      "Your daily sleep, movement, and focus habits",
      "Preparing contingency plans for realistic worst-case scenarios",
    ],
    outOfControl: [
      "Macro-economic shifts or future timeline variables",
      "Guarantees of certainty in an inherently volatile world",
      "How fast results manifest",
    ],
    reframing:
      "Anxiety is interest paid in advance on a debt that may never come due. Focus on the single step directly under your feet.",
    actionDirective:
      "Perform Premeditatio Malorum: Write down the absolute worst outcome. Realize you would survive it. Then outline 3 concrete actions for today.",
    recommendedQuote: "We suffer more often in imagination than in reality. — Seneca",
    solutionEnglish:
      "Clinical Analysis: The future is an unrendered reality. Anxiety stems from trying to solve unmanifested variables simultaneously. Focus purely on immediate execution.",
    solutionHinglish:
      "Aane wale kal ki chinta mein aaj ka waqt kharab mat karo. Sabse bura scenario likho, aur dekho ki tum usse bhi handle kar sakte ho.",
    solutionHindi:
      "भविष्य की अनिश्चितता केवल मस्तिष्क की कल्पना है। वर्तमान समय के एकमात्र संभव कर्तव्य पर ध्यान केंद्रित करें।",
  },
];

export default function StoicOracle() {
  const [selectedDilemma, setSelectedDilemma] = useState<DilemmaResult>(DILEMMA_PRESETS[0]);
  const [customInput, setCustomInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solLang, setSolLang] = useState<"en" | "hinglish" | "hi">("en");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Preset or Custom Deconstruction Analysis
  const handleRunAnalysis = async (preset?: DilemmaResult) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    if (preset) {
      setTimeout(() => {
        setSelectedDilemma(preset);
        setIsAnalyzing(false);
      }, 500);
      return;
    }

    const queryToAnalyze = customInput.trim() || "Select or Simulate Stressor Profile";

    try {
      const res = await fetch("/api/deconstruct-dilemma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: queryToAnalyze }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSelectedDilemma(json.data);
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (e) {
      console.warn("API deconstruction unavailable, utilizing fallback solver...");
    }

    // Fallback algorithmic solver for custom queries or "Select or Simulate Stressor Profile"
    const fallbackResult: DilemmaResult = {
      id: `custom-${Date.now()}`,
      title: queryToAnalyze === "Select or Simulate Stressor Profile"
        ? "Stressor Profile Simulation Matrix"
        : `Custom Analysis: ${queryToAnalyze.substring(0, 32)}...`,
      situation: queryToAnalyze,
      inControl: [
        "Your immediate internal reaction and breath cadence",
        "Formulating a disciplined, non-reactive strategy",
        "Determining how much energy and time you dedicate to this problem",
      ],
      outOfControl: [
        "The external trigger or person that caused this situation",
        "How quickly the external circumstances resolve themselves",
        "The opinions, judgment, or noise of surrounding observers",
      ],
      reframing:
        "Every stressor profile is merely raw data until your judgment assigns it a negative value. Strip away the story and deal purely with the physical event.",
      actionDirective:
        "Pause for 60 seconds. Do not reply or react instantly. Categorize all elements into 'In My Power' vs 'Outside My Power'. Execute only what lies in your power.",
      recommendedQuote:
        "Choose not to be harmed—and you won't feel harmed. Don't feel harmed—and you haven't been. — Marcus Aurelius",
      solutionEnglish:
        `Clinical Solution Strategy for "${queryToAnalyze}":\n\n1. Isolation of Variables: Recognize that this stressor derives its power entirely from your cognitive appraisal. The moment you stop projecting fear or anger onto it, the event loses its leverage.\n\n2. Dichotomy Protocol: Separate what you can change today from what depends on external forces. Give 100% effort to your actions and 0% anxiety to the outcome.\n\n3. Strategic Detachment: Treat this scenario not as a personal crisis, but as an objective laboratory test of your emotional immunity.`,
      solutionHinglish:
        `Pura Solution & Guide for "${queryToAnalyze}":\n\n1. Problem ko personal mat banao. Yeh situation ek test hai tumhari mental strength ka.\n\n2. Jo tumhare bas mein hai (tumhara reaction, tumhara hard work), sirf uspar dhyan do. Baki sab external hai.\n\n3. Shaant raho, deep breath lo, aur reactive hone ke bajaye strategic action lo.`,
      solutionHindi:
        `"${queryToAnalyze}" का पूर्ण दार्शनिक समाधान:\n\n1. इस परिस्थिति को व्यक्तिगत संकट मानने के बजाय अपनी आंतरिक शक्ति की परीक्षा के रूप में देखें।\n\n2. जो आपके नियंत्रण में है (आपकी सोच, आपका कार्य), केवल उसी पर ध्यान केंद्रित करें। बाह्य कारकों पर चिंता व्यर्थ है।\n\n3. पूर्ण शांति से निर्णय लें और भावनाओं के अधीन होने के बजाय तर्कसंगत कदम उठाएं।`,
    };

    setSelectedDilemma(fallbackResult);
    setIsAnalyzing(false);
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
"${selectedDilemma.recommendedQuote}"

6. COMPREHENSIVE SOLUTION:
${selectedDilemma.solutionEnglish || selectedDilemma.reframing}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header */}
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
            Process real-life anxieties, custom stressor inputs, or simulated profiles through clinical Dichotomy of Control.
          </p>
        </div>

        <button
          onClick={() => handleRunAnalysis()}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono px-4 py-2 rounded-xl transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin text-emerald-400" : ""}`} />
          Recalibrate Matrix
        </button>
      </div>

      {/* Preset Selector & Custom Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
            Select or Simulate Stressor Profile
          </label>
          <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
            // Live AI Custom Input Enabled
          </span>
        </div>

        {/* Preset Cards */}
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

        {/* Custom Input Field directly from User Side */}
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Provide Custom Input / Stressor Query
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomInput("Select or Simulate Stressor Profile");
              }}
              className="text-[9px] font-mono text-zinc-500 hover:text-emerald-400 transition underline uppercase"
            >
              Fill: "Select or Simulate Stressor Profile"
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Select or Simulate Stressor Profile, or type any custom dilemma..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-700/80 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRunAnalysis();
              }}
            />

            <button
              onClick={() => handleRunAnalysis()}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition shrink-0"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Solve Query</span>
            </button>
          </div>
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
                Active Stressor Profile / Query
              </span>
              <p className="text-xs text-zinc-200 font-sans italic font-medium">
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

          {/* Comprehensive Solution Strategy with Multilingual Tabs */}
          {(selectedDilemma.solutionEnglish || selectedDilemma.solutionHinglish) && (
            <div className="bg-zinc-950 border border-emerald-900/60 p-5 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Solution Strategy for Stressor Profile
                </span>

                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setSolLang("en")}
                    className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded transition ${
                      solLang === "en" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setSolLang("hinglish")}
                    className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded transition ${
                      solLang === "hinglish" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Hinglish
                  </button>
                  <button
                    onClick={() => setSolLang("hi")}
                    className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded transition ${
                      solLang === "hi" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Hindi
                  </button>
                </div>
              </div>

              <div className="text-xs font-sans text-zinc-200 leading-relaxed whitespace-pre-line bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/60">
                {solLang === "en" && (selectedDilemma.solutionEnglish || selectedDilemma.reframing)}
                {solLang === "hinglish" && (selectedDilemma.solutionHinglish || selectedDilemma.solutionEnglish || selectedDilemma.reframing)}
                {solLang === "hi" && (selectedDilemma.solutionHindi || selectedDilemma.solutionEnglish || selectedDilemma.reframing)}
              </div>
            </div>
          )}

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
                Copy Solution & Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
