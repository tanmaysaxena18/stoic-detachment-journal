import React, { useState, useEffect } from "react";
import { CATEGORY_INFO } from "../data";
import { Pillar, Quote } from "../types";
import { Search, Copy, Check, ArrowRight, Plus, Wind, Play, Pause, RefreshCw, PenTool, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AphorismVaultProps {
  onSelectQuote: (quote: string, category: Pillar) => void;
  quotes: Quote[];
  onAddQuote?: (quote: Quote) => void;
}

export default function AphorismVault({ onSelectQuote, quotes, onAddQuote }: AphorismVaultProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Pillar | "All">("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Quote Creator Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteAuthor, setNewQuoteAuthor] = useState("");
  const [newQuoteCategory, setNewQuoteCategory] = useState<Pillar>(Pillar.HumanNature);
  const [formSuccess, setFormSuccess] = useState(false);

  // Stoic Breath & Logic Calibrator states
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathStage, setBreathStage] = useState<"inhale" | "holdIn" | "exhale" | "holdOut">("inhale");
  const [breathTimer, setBreathTimer] = useState(4);
  const [contemplationQuote, setContemplationQuote] = useState("");
  const [breathFocusPillar, setBreathFocusPillar] = useState<Pillar | "All">("All");

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = quote.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || quote.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Breathing pacer cycle
  useEffect(() => {
    let interval: any = null;
    if (isBreathing) {
      // Pick initial contemplation quote based on focus pillar
      if (!contemplationQuote) {
        const pool = quotes.filter(q => breathFocusPillar === "All" || q.category === breathFocusPillar);
        if (pool.length > 0) {
          setContemplationQuote(pool[Math.floor(Math.random() * pool.length)].text);
        } else if (quotes.length > 0) {
          setContemplationQuote(quotes[Math.floor(Math.random() * quotes.length)].text);
        }
      }

      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Cycle stages: inhale (4s) -> holdIn (4s) -> exhale (4s) -> holdOut (4s)
            setBreathStage((currentStage) => {
              let nextStage: typeof breathStage = "inhale";
              if (currentStage === "inhale") {
                nextStage = "holdIn";
              } else if (currentStage === "holdIn") {
                nextStage = "exhale";
              } else if (currentStage === "exhale") {
                nextStage = "holdOut";
              } else {
                nextStage = "inhale";
                // Trigger a new stoic contemplation quote at the start of inhale
                const pool = quotes.filter(q => breathFocusPillar === "All" || q.category === breathFocusPillar);
                if (pool.length > 0) {
                  setContemplationQuote(pool[Math.floor(Math.random() * pool.length)].text);
                }
              }
              return nextStage;
            });
            return 4; // reset timer to 4s
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathTimer(4);
      setBreathStage("inhale");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing, quotes, contemplationQuote, breathFocusPillar]);

  // Handle custom quote submission
  const handleAddCustomQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    if (onAddQuote) {
      onAddQuote({
        id: "q_" + Date.now(),
        text: newQuoteText.trim(),
        category: newQuoteCategory,
        author: newQuoteAuthor.trim() || "User Observation",
      });
      setNewQuoteText("");
      setNewQuoteAuthor("");
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
    }
  };

  // Switch to another contemplation quote manually
  const cycleContemplationQuote = () => {
    const pool = quotes.filter(q => breathFocusPillar === "All" || q.category === breathFocusPillar);
    if (pool.length > 0) {
      setContemplationQuote(pool[Math.floor(Math.random() * pool.length)].text);
    } else if (quotes.length > 0) {
      setContemplationQuote(quotes[Math.floor(Math.random() * quotes.length)].text);
    }
  };

  // Synchronize initial focus quote if focus pillar changes
  useEffect(() => {
    if (isBreathing) {
      cycleContemplationQuote();
    }
  }, [breathFocusPillar]);

  return (
    <div id="aphorism-vault-container" className="space-y-6">
      {/* Intro section */}
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="font-serif text-9xl italic">“</span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-2">
          System Overview
        </span>
        <h2 className="text-xl font-sans font-light uppercase tracking-wider text-zinc-100 mb-2">
          The Aphorism Vault
        </h2>
        <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed font-sans">
          A static archive of critical, raw observations detailing psychological traps, relational physics, and emotional detachment. Choose any quote to dissect, reflect, or publish as a daily post in the Curator Workspace.
        </p>
      </div>

      {/* Interactive Bento Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1: Breath Calibrator Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsBreathing(!isBreathing);
            if (showAddForm) setShowAddForm(false);
          }}
          className={`flex items-start text-left gap-4 p-5 rounded-2xl border transition duration-300 relative overflow-hidden group ${
            isBreathing
              ? "bg-zinc-900/90 border-emerald-850/50 shadow-lg shadow-emerald-950/10"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div className={`p-3 rounded-xl transition ${
            isBreathing ? "bg-emerald-950/50 text-emerald-400" : "bg-zinc-950 text-zinc-400 group-hover:text-zinc-200"
          }`}>
            <Wind className={`w-5 h-5 ${isBreathing ? "animate-pulse" : ""}`} />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
              Contemplative Training
            </span>
            <h3 className="text-sm font-sans font-medium text-zinc-100 flex items-center gap-1.5">
              Stoic Breath & Logic Calibrator
              {isBreathing && (
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-sm">
              Practice strategic emotional detachment. Synchronize slow breathing with automated flows of critical observations.
            </p>
          </div>
          {/* Subtle background pacer glow */}
          {isBreathing && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/5 to-transparent pointer-events-none" />
          )}
        </button>

        {/* Banner 2: Add Custom Quote Toggle */}
        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (isBreathing) setIsBreathing(false);
          }}
          className={`flex items-start text-left gap-4 p-5 rounded-2xl border transition duration-300 ${
            showAddForm
              ? "bg-zinc-900/90 border-zinc-700 shadow-lg"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div className={`p-3 rounded-xl transition ${
            showAddForm ? "bg-zinc-800 text-zinc-100" : "bg-zinc-950 text-zinc-400 group-hover:text-zinc-200"
          }`}>
            <PenTool className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
              Intellectual Asset Creation
            </span>
            <h3 className="text-sm font-sans font-medium text-zinc-100">
              Log Your Own Aphorism
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-sm">
              Immortalize your own observations, harsh realities, or psychological laws into the persistent system archive.
            </p>
          </div>
        </button>
      </div>

      {/* Expandable Module 1: Stoic Breath Calibrator Panel */}
      <AnimatePresence>
        {isBreathing && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                    Active Calibration Mode
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-sans">
                    Relax your posture. Focus strictly on the geometric pulse below.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Contemplation Pillar:</span>
                    <select
                      id="breath-focus-pillar-select"
                      value={breathFocusPillar}
                      onChange={(e) => setBreathFocusPillar(e.target.value as Pillar | "All")}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-[10px] text-zinc-300 focus:outline-none focus:border-zinc-700"
                    >
                      <option value="All">All Themes</option>
                      {Object.values(Pillar).map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_INFO[cat].emoji} {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={cycleContemplationQuote}
                    className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Skip Quote
                  </button>
                </div>
              </div>

              {/* Main Visual Calibration Field */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4">
                {/* Visual circle col */}
                <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Pulsing ring outline */}
                    <motion.div
                      animate={{
                        scale:
                          breathStage === "inhale"
                            ? [1, 1.3]
                            : breathStage === "holdIn"
                            ? 1.3
                            : breathStage === "exhale"
                            ? [1.3, 1]
                            : 1,
                        opacity:
                          breathStage === "inhale"
                            ? [0.2, 0.7]
                            : breathStage === "holdIn"
                            ? 0.7
                            : breathStage === "exhale"
                            ? [0.7, 0.2]
                            : 0.2,
                      }}
                      transition={{
                        duration: 4,
                        ease: "easeInOut",
                        repeat: 0,
                      }}
                      key={breathStage}
                      className={`absolute inset-0 rounded-full border-2 border-dashed ${
                        breathStage === "inhale"
                          ? "border-emerald-500/60"
                          : breathStage === "holdIn"
                          ? "border-purple-500/60"
                          : breathStage === "exhale"
                          ? "border-blue-500/60"
                          : "border-zinc-700"
                      }`}
                    />

                    {/* Outer glowing pulsing fill */}
                    <motion.div
                      animate={{
                        scale:
                          breathStage === "inhale"
                            ? [1, 1.25]
                            : breathStage === "holdIn"
                            ? 1.25
                            : breathStage === "exhale"
                            ? [1.25, 1]
                            : 1,
                        boxShadow:
                          breathStage === "inhale"
                            ? "0 0 20px rgba(16, 185, 129, 0.2)"
                            : breathStage === "holdIn"
                            ? "0 0 30px rgba(168, 85, 247, 0.3)"
                            : breathStage === "exhale"
                            ? "0 0 20px rgba(59, 130, 246, 0.2)"
                            : "0 0 0px rgba(0,0,0,0)",
                      }}
                      transition={{
                        duration: 4,
                        ease: "easeInOut",
                        repeat: 0,
                      }}
                      key={`fill-${breathStage}`}
                      className={`w-32 h-32 rounded-full flex flex-col items-center justify-center relative transition-colors duration-1000 ${
                        breathStage === "inhale"
                          ? "bg-emerald-950/30 text-emerald-400"
                          : breathStage === "holdIn"
                          ? "bg-purple-950/30 text-purple-400"
                          : breathStage === "exhale"
                          ? "bg-blue-950/30 text-blue-400"
                          : "bg-zinc-950 text-zinc-500"
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] mb-1">
                        {breathStage === "inhale"
                          ? "Inhale"
                          : breathStage === "holdIn"
                          ? "Hold"
                          : breathStage === "exhale"
                          ? "Exhale"
                          : "Hold"}
                      </span>
                      <span className="text-3xl font-mono font-light tracking-tight">
                        {breathTimer}s
                      </span>
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500">
                      Rhythm: 4-4-4-4 Box Breathing
                    </span>
                  </div>
                </div>

                {/* Quote reflection text col */}
                <div className="md:col-span-7 space-y-4">
                  <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl relative min-h-36 flex flex-col justify-center">
                    <div className="absolute top-0 left-0 p-4 opacity-5">
                      <span className="font-serif text-6xl italic">“</span>
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                      Contemplation Point
                    </span>
                    <blockquote className="text-zinc-200 text-sm font-serif italic leading-relaxed font-light">
                      "{contemplationQuote || "Reflect on this moment of perfect insulation from external variables."}"
                    </blockquote>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 justify-end">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Focus on the thought. Allow the mind's reactivity to fade out.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Module 2: Add Custom Quote Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleAddCustomQuoteSubmit}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-200">
                    Create New Stoic Asset
                  </h3>
                </div>
                <span className="text-[9px] font-mono text-zinc-500">
                  // Saved to Local Archive
                </span>
              </div>

              {formSuccess && (
                <div className="bg-zinc-950 border border-emerald-900/30 text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Aphorism successfully compiled and stored in your Vault.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Thematic Pillar Category
                  </label>
                  <select
                    id="new-quote-category-select"
                    value={newQuoteCategory}
                    onChange={(e) => setNewQuoteCategory(e.target.value as Pillar)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition"
                  >
                    {Object.values(Pillar).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_INFO[cat].emoji} {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Observer or Author Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      id="new-quote-author-input"
                      type="text"
                      placeholder="e.g. Seneca, Marcus Aurelius, or My Observation"
                      value={newQuoteAuthor}
                      onChange={(e) => setNewQuoteAuthor(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Quote text */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  The Observation / Aphorism Text
                </label>
                <textarea
                  id="new-quote-text-textarea"
                  rows={3}
                  required
                  placeholder="Type the profound stoic raw quote or behavioral law..."
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition resize-none"
                />
                <span className="text-[9px] font-mono text-zinc-500 block pt-0.5">
                  // Compel yourself to formulate direct, sharp truths. Avoid wordy descriptions.
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                  Save Aphorism
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="search-quotes-input"
            type="text"
            placeholder="Search the core collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition"
          />
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Filter:</span>
          <select
            id="category-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as Pillar | "All")}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 transition"
          >
            <option value="All">All Thematic Pillars</option>
            {Object.values(Pillar).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_INFO[cat].emoji} {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Aphorisms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuotes.map((quote, idx) => {
          const info = CATEGORY_INFO[quote.category];
          return (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.3) }}
              className="flex flex-col justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700/60 transition duration-300 group relative"
            >
              <div className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                    <span>{info.emoji}</span>
                    <span>{quote.category}</span>
                  </span>
                  
                  {quote.author ? (
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      // {quote.author}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-600 tracking-wider">
                      // Observation {quote.id.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Quote Text */}
                <blockquote className="text-zinc-100 text-lg font-serif italic leading-relaxed pt-1 font-light">
                  "{quote.text}"
                </blockquote>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between border-t border-zinc-800/50 mt-6 pt-4">
                <button
                  id={`copy-quote-${quote.id}`}
                  onClick={() => copyToClipboard(quote.id, quote.text)}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                >
                  {copiedId === quote.id ? (
                    <>
                      <Check className="w-3 h-3 text-zinc-400" />
                      <span className="text-zinc-300 uppercase tracking-wider">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="uppercase tracking-wider">Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  id={`curate-quote-${quote.id}`}
                  onClick={() => onSelectQuote(quote.text, quote.category)}
                  className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition group-hover:translate-x-0.5 duration-200"
                >
                  <span>Curate</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredQuotes.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-sm font-mono">No matching aphorisms discovered in the archives.</p>
          </div>
        )}
      </div>
    </div>
  );
}
