import React, { useState } from "react";
import { DialogueItem } from "../types";
import { MessageSquare, Sparkles, Send, Trash2, ArrowRight, Check, Copy } from "lucide-react";
import { motion } from "motion/react";

interface DialogueStudioProps {
  dialogues: DialogueItem[];
  onAddDialogue: (item: DialogueItem) => void;
  onClearDialogues: () => void;
}

export default function DialogueStudio({ dialogues, onAddDialogue, onClearDialogues }: DialogueStudioProps) {
  const [externalPrompt, setExternalPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Latest generated result
  const [latestInternal, setLatestInternal] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const preloadedExamples = [
    {
      external: "Why can't you just stop thinking about her?",
      internal: "How can I, being a human, see her in anguish and pain because of a misunderstanding created by me?"
    },
    {
      external: "Why are you so serious?",
      internal: "Wasn't she serious back then when she said, 'You'll regret it'?"
    },
    {
      external: "Why are you laughing?",
      internal: "Isn't laughing better than crying? Why are you laughing like a fool? Look, it just made you think I'm a fool, hahahaha."
    },
    {
      external: "Why are you so silent?",
      internal: "When did you ever see a tsunami coming from turbulent waters?"
    }
  ];

  const handleReveal = async () => {
    if (!externalPrompt.trim()) {
      setError("Please input an external perspective question or statement.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/dialogue-mask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ external: externalPrompt }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to reveal the internal mask.");
      }

      const result = await res.json();
      if (result.success) {
        const generatedInternal = result.data.internal;
        const generatedInternalHinglish = result.data.internalHinglish;
        const generatedInternalHindi = result.data.internalHindi;
        setLatestInternal(generatedInternal);

        const newItem: DialogueItem = {
          id: `dialogue-${Date.now()}`,
          external: externalPrompt,
          internal: generatedInternal,
          internalHinglish: generatedInternalHinglish,
          internalHindi: generatedInternalHindi,
          timestamp: new Date().toISOString(),
        };
        onAddDialogue(newItem);
        setExternalPrompt("");
      } else {
        throw new Error("Invalid format returned by mask processor.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDialogue = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="dialogue-mask-studio" className="space-y-6">
      {/* Intro branding */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
          Identity Disparity Study
        </span>
        <h2 className="text-lg font-sans font-light uppercase tracking-wider text-zinc-100 mb-1.5">
          Dialogue of the Mask
        </h2>
        <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
          Social interactions demand a surface layer (the Mask), but sanity requires an unyielding, detached internal reality. Input any trivial social prompt or probing question to extract the sharp, stoic internal counter-weight.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input workspace (Left) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-800/60 pb-3">
              Contrast Compiler
            </h3>

            {/* External perspective input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                External Perspective (The Social Mask / Query)
              </label>
              <input
                id="external-prompt-input"
                type="text"
                value={externalPrompt}
                onChange={(e) => {
                  setExternalPrompt(e.target.value);
                  setError(null);
                }}
                placeholder="e.g., Why are you so silent? or Why are you so serious?"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition"
              />
            </div>

            {/* Actions */}
            <button
              id="reveal-internal-button"
              onClick={handleReveal}
              disabled={isGenerating}
              className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-sans font-medium text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isGenerating ? (
                <span className="font-mono uppercase tracking-wider text-zinc-500">// Stripping Masks...</span>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>Compute Internal Reality</span>
                </>
              )}
            </button>

            {error && (
              <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-3">
                <p className="text-[11px] font-mono text-rose-400">{error}</p>
              </div>
            )}
          </div>

          {/* Core preloaded templates study guide */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-800/60 pb-3">
              Classic Dialogue Archetypes
            </h4>

            <div className="space-y-3">
              {preloadedExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-2 text-left"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <span className="text-zinc-400">External Persona:</span>
                    <span className="text-zinc-300">"{ex.external}"</span>
                  </div>
                  <div className="text-xs font-serif font-light text-zinc-200 border-l border-zinc-800 pl-3 leading-relaxed flex items-center gap-1.5 pt-0.5">
                    <span className="text-zinc-400 font-mono uppercase tracking-wider text-[9px]">Internal Anchor:</span>
                    <span>"{ex.internal}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results log (Right) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                Dialogue Stream Logs
              </span>

              {dialogues.length > 0 && (
                <button
                  onClick={onClearDialogues}
                  className="text-[10px] font-mono text-zinc-600 hover:text-rose-400 transition uppercase tracking-wider"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {dialogues.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3 text-left group"
                >
                  <div className="space-y-2">
                    <div className="text-xs font-sans text-zinc-400 flex gap-1.5 items-start">
                      <span className="text-zinc-500 font-mono uppercase tracking-wider text-[9px] select-none shrink-0 mt-0.5">External:</span>
                      <span>"{item.external}"</span>
                    </div>

                    <div className="text-xs font-serif font-light text-zinc-200 border-l border-zinc-800 pl-3 leading-relaxed flex flex-col gap-1.5 pt-0.5">
                      <div className="flex gap-1.5 items-start">
                        <span className="text-zinc-500 font-mono uppercase tracking-wider text-[8px] select-none shrink-0 mt-0.5">EN:</span>
                        <span>"{item.internal}"</span>
                      </div>
                      {item.internalHinglish && (
                        <div className="flex gap-1.5 items-start text-zinc-300">
                          <span className="text-zinc-500 font-mono uppercase tracking-wider text-[8px] select-none shrink-0 mt-0.5">Hinglish:</span>
                          <span>"{item.internalHinglish}"</span>
                        </div>
                      )}
                      {item.internalHindi && (
                        <div className="flex gap-1.5 items-start text-zinc-300">
                          <span className="text-zinc-500 font-mono uppercase tracking-wider text-[8px] select-none shrink-0 mt-0.5">Hindi:</span>
                          <span>"{item.internalHindi}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-900 pt-2 text-[9px] font-mono text-zinc-600">
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>

                    <button
                      onClick={() => {
                        const copyText = `External: "${item.external}"\nInternal (EN): "${item.internal}"` + 
                          (item.internalHinglish ? `\nInternal (Hinglish): "${item.internalHinglish}"` : "") +
                          (item.internalHindi ? `\nInternal (Hindi): "${item.internalHindi}"` : "");
                        copyDialogue(item.id, copyText);
                      }}
                      className="text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1 uppercase tracking-wider"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-zinc-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === item.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              ))}

              {dialogues.length === 0 && (
                <p className="text-zinc-600 text-xs font-mono text-center py-12 uppercase tracking-wide">
                  // Dialogue feed is empty. Compute a contrast above.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
