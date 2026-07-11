import React, { useState } from "react";
import { CATEGORY_INFO } from "../data";
import { Pillar, Quote } from "../types";
import { Search, Copy, Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AphorismVaultProps {
  onSelectQuote: (quote: string, category: Pillar) => void;
  quotes: Quote[];
}

export default function AphorismVault({ onSelectQuote, quotes }: AphorismVaultProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Pillar | "All">("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
