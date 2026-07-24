import React, { useState } from "react";
import { Pillar, Post, Quote } from "../types";
import { CATEGORY_INFO } from "../data";
import { Sparkles, Save, Copy, Check, Download, AlertCircle, RefreshCw, PenTool, Layout } from "lucide-react";
import { motion } from "motion/react";

interface CuratorWorkspaceProps {
  selectedQuoteText: string;
  selectedQuoteCategory: Pillar | null;
  onPostSaved: (post: Post) => void;
  clearSelection: () => void;
  quotes: Quote[];
}

export default function CuratorWorkspace({
  selectedQuoteText,
  selectedQuoteCategory,
  onPostSaved,
  clearSelection,
  quotes,
}: CuratorWorkspaceProps) {
  // Input states
  const [quoteSource, setQuoteSource] = useState<"preset" | "custom" | "ai">(
    selectedQuoteText ? "custom" : "preset"
  );
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [customQuote, setCustomQuote] = useState(selectedQuoteText || "");
  const [selectedCategory, setSelectedCategory] = useState<Pillar>(
    selectedQuoteCategory || Pillar.HumanNature
  );
  
  // AI quote generation parameters
  const [aiTopic, setAiTopic] = useState("");

  // Generation status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Output states (editable after generation)
  const [generatedQuote, setGeneratedQuote] = useState("");
  const [generatedReflection, setGeneratedReflection] = useState("");
  const [generatedReflectionHinglish, setGeneratedReflectionHinglish] = useState("");
  const [generatedReflectionHindi, setGeneratedReflectionHindi] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeLang, setActiveLang] = useState<"en" | "hinglish" | "hi">("en");
  const [saveStatus, setSaveStatus] = useState<"Draft" | "Published" | "Scheduled">("Draft");
  const [scheduledDate, setScheduledDate] = useState("");

  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if selected from vault or quotes update
  React.useEffect(() => {
    if (selectedQuoteText) {
      setQuoteSource("custom");
      setCustomQuote(selectedQuoteText);
      if (selectedQuoteCategory) {
        setSelectedCategory(selectedQuoteCategory);
      }
    } else if (quotes && quotes.length > 0) {
      const currentValid = quotes.find((q) => q.id === selectedPresetId);
      if (!currentValid) {
        setSelectedPresetId(quotes[0].id);
        if (quoteSource === "preset") {
          setCustomQuote(quotes[0].text);
          setSelectedCategory(quotes[0].category);
        }
      }
    }
  }, [selectedQuoteText, selectedQuoteCategory, quotes]);

  const handleSelectSource = (source: "preset" | "custom" | "ai") => {
    setQuoteSource(source);
    setError(null);
    if (source === "preset") {
      const found = quotes.find((q) => q.id === selectedPresetId) || quotes[0];
      if (found) {
        setSelectedPresetId(found.id);
        setCustomQuote(found.text);
        setSelectedCategory(found.category);
      }
    }
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedPresetId(id);
    const found = quotes.find((q) => q.id === id);
    if (found) {
      setCustomQuote(found.text);
      setSelectedCategory(found.category);
    }
  };

  const generatePost = async () => {
    setIsGenerating(true);
    setError(null);
    setHasGenerated(false);
    setSavedSuccess(false);

    try {
      let activeQuote = "";
      let activeCategory = selectedCategory;

      if (quoteSource === "preset") {
        if (!selectedPresetId) {
          throw new Error("Please select an aphorism from the archive list.");
        }
        activeQuote = customQuote;
      } else if (quoteSource === "custom") {
        if (!customQuote.trim()) {
          throw new Error("Please enter a custom quote.");
        }
        activeQuote = customQuote;
      }

      let response;
      if (quoteSource === "ai") {
        // AI generates both quote + reflection + tags
        response = await fetch("/api/generate-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: activeCategory, topic: aiTopic }),
        });
      } else {
        // AI generates reflection + tags on the quote
        response = await fetch("/api/generate-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quote: activeQuote, category: activeCategory }),
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "An unexpected error occurred during analysis.");
      }

      const result = await response.json();
      if (result.success) {
        setGeneratedQuote(result.data.quote || "");
        setGeneratedReflection(result.data.reflection || "");
        setGeneratedReflectionHinglish(result.data.reflectionHinglish || "");
        setGeneratedReflectionHindi(result.data.reflectionHindi || "");
        setGeneratedTags(result.data.tags || []);
        setHasGenerated(true);
      } else {
        throw new Error("Failed to receive structured stoic content.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Compile final markdown output
  const formatMarkdown = () => {
    const info = CATEGORY_INFO[selectedCategory];
    const quoteToUse = quoteSource === "ai" ? generatedQuote : (quoteSource === "preset" ? customQuote : customQuote);
    
    return `Category: ${info.emoji} ${selectedCategory}

The Quote:

"${quoteToUse}"

The Reflection (English):
${generatedReflection}

The Reflection (Hinglish):
${generatedReflectionHinglish}

The Reflection (Hindi):
${generatedReflectionHindi}

Tags: ${generatedTags.map(t => t.startsWith("#") ? t : `#${t}`).join(" ")}`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(formatMarkdown());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleDownload = () => {
    const markdown = formatMarkdown();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stoic_post_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSavePost = () => {
    const post: Post = {
      id: `saved-post-${Date.now()}`,
      category: selectedCategory,
      quote: quoteSource === "ai" ? generatedQuote : customQuote,
      reflection: generatedReflection,
      reflectionHinglish: generatedReflectionHinglish,
      reflectionHindi: generatedReflectionHindi,
      tags: generatedTags,
      dateCreated: new Date().toISOString(),
      status: saveStatus,
      scheduledDate: saveStatus === "Scheduled" ? scheduledDate : undefined,
    };
    onPostSaved(post);
    clearSelection();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="curator-workspace-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Parameters Panel (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-zinc-500" />
              Parameter Controls
            </h3>
            {selectedQuoteText && (
              <button
                onClick={clearSelection}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Quote Source Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Quote Source</label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
              {(["preset", "custom", "ai"] as const).map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => handleSelectSource(source)}
                  className={`py-1.5 text-[10px] font-mono font-medium rounded-md transition capitalize ${
                    quoteSource === source
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {source === "ai" ? "AI Generated" : source}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Selector Dropdown */}
          {quoteSource === "preset" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Archived Aphorisms</label>
              <select
                id="preset-quote-select"
                value={selectedPresetId}
                onChange={handlePresetChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition"
              >
                <option value="">Select an aphorism to analyze...</option>
                {quotes.map((q) => (
                  <option key={q.id} value={q.id}>
                    ({CATEGORY_INFO[q.category].emoji}) {q.text.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Quote Text Area */}
          {(quoteSource === "custom" || quoteSource === "preset") && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                {quoteSource === "custom" ? "Custom Quote Text" : "Selected Quote Preview"}
              </label>
              <textarea
                id="custom-quote-textarea"
                rows={4}
                value={customQuote}
                onChange={(e) => setCustomQuote(e.target.value)}
                disabled={quoteSource === "preset"}
                placeholder="Type your own harsh truth or stoic commentary here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition resize-none disabled:opacity-60"
              />
            </div>
          )}

          {/* AI Generator Controls */}
          {quoteSource === "ai" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Focus Theme / Topic</label>
              <input
                id="ai-topic-input"
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., trust betrayal, decay, corporate futility..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition"
              />
              <span className="text-[9px] font-mono text-zinc-500 block pt-0.5 uppercase tracking-wide">
                // System will compile a raw stoic quote for this focus.
              </span>
            </div>
          )}

          {/* Pillar / Category Picker */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Stoic Pillar</label>
            <select
              id="workspace-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Pillar)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 transition"
            >
              {Object.values(Pillar).map((pillar) => (
                <option key={pillar} value={pillar}>
                  {CATEGORY_INFO[pillar].emoji} {pillar}
                </option>
              ))}
            </select>
          </div>

          {/* Action Trigger */}
          <button
            id="generate-post-button"
            onClick={generatePost}
            disabled={isGenerating}
            className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-sans font-medium text-xs py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4.5 h-4.5 animate-spin text-zinc-500" />
                <span>Removing Distortions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" />
                <span>
                  {quoteSource === "ai" ? "Generate Custom Curation" : "Analyze & Extract Insights"}
                </span>
              </>
            )}
          </button>

          {/* Error Alert Box */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-rose-400 leading-relaxed">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Output / Preview Panel (Right) */}
      <div className="lg:col-span-7 space-y-6">
        {isGenerating && (
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900 p-16 flex flex-col items-center justify-center text-center space-y-4">
            <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-zinc-200 text-sm font-medium">FORMULATING ANALYSIS</h4>
              <p className="text-zinc-500 text-xs font-mono max-w-sm uppercase tracking-wider">
                // stripped of optimistic baseline biases. compiling raw data.
              </p>
            </div>
          </div>
        )}

        {!isGenerating && !hasGenerated && (
          <div className="border border-dashed border-zinc-800 rounded-2xl p-16 text-center space-y-4 bg-zinc-900/10">
            <Layout className="w-8 h-8 text-zinc-600 mx-auto" />
            <div className="space-y-1.5">
              <h4 className="text-zinc-300 text-xs font-mono uppercase tracking-[0.2em]">Curator Workbench Draftsman</h4>
              <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed">
                Configure your parameters on the left and trigger analysis. The compiler will format your content exactly in accordance with the post architecture here.
              </p>
            </div>
          </div>
        )}

        {hasGenerated && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Split controls: Edit and Preview */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-800/80 pb-3">
                Curator Workbench Editor
              </h3>

              {/* Editable quote (if generated by AI) */}
              {quoteSource === "ai" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Generated Quote</label>
                  <textarea
                    id="edit-generated-quote"
                    rows={2}
                    value={generatedQuote}
                    onChange={(e) => setGeneratedQuote(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition resize-none"
                  />
                </div>
              )}

              {/* Editable Reflection commentary */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Philosophical Reflection (Commentary)</label>
                  <div className="flex gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                    {(["en", "hinglish", "hi"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        className={`px-2 py-0.5 text-[9px] font-mono rounded transition capitalize ${
                          activeLang === lang
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {lang === "en" ? "English" : lang === "hinglish" ? "Hinglish" : "Hindi"}
                      </button>
                    ))}
                  </div>
                </div>

                {activeLang === "en" && (
                  <textarea
                    id="edit-generated-reflection"
                    rows={4}
                    value={generatedReflection}
                    onChange={(e) => setGeneratedReflection(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition resize-none"
                    placeholder="Clinical English reflection..."
                  />
                )}
                {activeLang === "hinglish" && (
                  <textarea
                    id="edit-generated-reflection-hinglish"
                    rows={4}
                    value={generatedReflectionHinglish}
                    onChange={(e) => setGeneratedReflectionHinglish(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition resize-none"
                    placeholder="Sharp Hinglish (Hindi in English letters) reflection..."
                  />
                )}
                {activeLang === "hi" && (
                  <textarea
                    id="edit-generated-reflection-hindi"
                    rows={4}
                    value={generatedReflectionHindi}
                    onChange={(e) => setGeneratedReflectionHindi(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition resize-none"
                    placeholder="Deep Devanagari Hindi reflection..."
                  />
                )}
                <span className="text-[9px] font-mono text-zinc-500 block pt-0.5 uppercase tracking-wide">
                  // Keep reflection strictly between 2 to 4 sentences of high impact.
                </span>
              </div>

              {/* Editable Tags */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Index Hashtags (Comma-separated)</label>
                <input
                  id="edit-generated-tags"
                  type="text"
                  value={generatedTags.join(", ")}
                  onChange={(e) => setGeneratedTags(e.target.value.split(",").map(t => t.trim()))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 transition"
                />
              </div>

              {/* Saved Curation Controls */}
              <div className="border-t border-zinc-800 pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    id="save-status-select"
                    value={saveStatus}
                    onChange={(e) => setSaveStatus(e.target.value as any)}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="Draft">Save as Draft</option>
                    <option value="Published">Mark Published</option>
                    <option value="Scheduled">Schedule Post</option>
                  </select>

                  {saveStatus === "Scheduled" && (
                    <input
                      id="save-scheduled-date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1 text-xs text-zinc-300 focus:outline-none"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    id="save-curation-button"
                    onClick={handleSavePost}
                    className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-sans font-medium text-xs px-4 py-2 rounded-xl transition flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Store in Journal</span>
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div className="text-[10px] text-zinc-300 font-mono text-center pt-1 uppercase tracking-widest">
                  // saved successfully to local archives
                </div>
              )}
            </div>

            {/* Visual Web Post Preview (High-Fidelity Elegant Dark style) */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative">
              <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 border border-zinc-400 rotate-45" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Active Observation Preview</span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                  >
                    {copiedMarkdown ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-zinc-300 uppercase tracking-wider">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wider">Copy Markdown</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-wider">Download</span>
                  </button>
                </div>
              </div>

              {/* Rendered Post Content mirroring the exact mock styling */}
              <div className="p-10 relative space-y-6">
                {/* Huge quotation mark matching original design */}
                <div className="absolute top-4 left-6 text-[140px] leading-none text-zinc-900 font-serif font-light italic select-none pointer-events-none opacity-20">
                  “
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-px bg-zinc-800"></span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <span>{CATEGORY_INFO[selectedCategory].emoji}</span>
                      <span>{selectedCategory}</span>
                    </span>
                  </div>

                  {/* The Quote Section */}
                  <div className="space-y-1">
                    <h1 className="font-serif font-light text-3xl md:text-4xl text-zinc-100 leading-tight max-w-xl">
                      {quoteSource === "ai" ? generatedQuote : customQuote}
                    </h1>
                  </div>

                  {/* The Reflection Commentary */}
                  <div className="pt-4 border-t border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                        The Reflection ({activeLang === "en" ? "English" : activeLang === "hinglish" ? "Hinglish" : "Hindi"})
                      </span>
                    </div>
                    {activeLang === "en" && (
                      <p className="text-zinc-400 text-sm font-sans font-light leading-relaxed text-justify max-w-xl">
                        {generatedReflection}
                      </p>
                    )}
                    {activeLang === "hinglish" && (
                      <p className="text-zinc-300 text-sm font-sans font-light leading-relaxed text-justify max-w-xl">
                        {generatedReflectionHinglish || "Generar Hinglish response..."}
                      </p>
                    )}
                    {activeLang === "hi" && (
                      <p className="text-zinc-300 text-sm font-sans font-light leading-relaxed text-justify max-w-xl">
                        {generatedReflectionHindi || "Generar Hindi response..."}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 block">
                      Index Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {generatedTags.map((tag, idx) => {
                        const cleanTag = tag.trim();
                        const tagWithHash = cleanTag.startsWith("#") ? cleanTag : `#${cleanTag}`;
                        return (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2.5 py-1 border border-zinc-800 rounded-md text-zinc-500 uppercase tracking-wider"
                          >
                            {tagWithHash}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decorative Footer lines */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-900">
                    <div className="w-12 h-px bg-zinc-800"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full"></div>
                    <div className="w-12 h-px bg-zinc-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
