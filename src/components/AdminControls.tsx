import React, { useState } from "react";
import { Pillar, Quote, ShieldScenario } from "../types";
import { CATEGORY_INFO } from "../data";
import {
  Shield,
  BookOpen,
  Key,
  Plus,
  Trash2,
  Edit3,
  Lock,
  Unlock,
  Check,
  AlertCircle,
  RefreshCw,
  X,
  Layers,
  ListPlus,
  Sparkles,
  Upload,
  FileText,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

interface AdminControlsProps {
  quotes: Quote[];
  onAddQuote: (quote: Quote) => void;
  onAddQuotes?: (quotes: Quote[]) => void;
  onDeleteQuote: (id: string) => void;
  onUpdateQuote: (quote: Quote) => void;
  scenarios: ShieldScenario[];
  onAddScenario: (scenario: ShieldScenario) => void;
  onDeleteScenario: (id: string) => void;
  onUpdateScenario: (scenario: ShieldScenario) => void;
}

interface MultiQuoteRow {
  rowId: string;
  text: string;
  author: string;
  category: Pillar;
}

export default function AdminControls({
  quotes,
  onAddQuote,
  onAddQuotes,
  onDeleteQuote,
  onUpdateQuote,
  scenarios,
  onAddScenario,
  onDeleteScenario,
  onUpdateScenario,
}: AdminControlsProps) {
  // Authentication states
  const [accessKey, setAccessKey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sub-navigation tabs
  const [adminTab, setAdminTab] = useState<"quotes" | "scenarios">("quotes");

  // Quote Entry Mode: "single" | "multi_batch" | "multi_rows" | "preset_packs"
  const [quoteInputMode, setQuoteInputMode] = useState<
    "single" | "multi_batch" | "multi_rows" | "preset_packs"
  >("single");

  // Single Quote State
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteCategory, setQuoteCategory] = useState<Pillar>(Pillar.HumanNature);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  // Multi-Quote Batch State (Raw Paste)
  const [bulkText, setBulkText] = useState("");
  const [bulkDefaultCategory, setBulkDefaultCategory] = useState<Pillar>(Pillar.HumanNature);
  const [bulkDefaultAuthor, setBulkDefaultAuthor] = useState("");
  const [bulkFormat, setBulkFormat] = useState<"line" | "paragraph" | "pipe">("pipe");

  // Multi-Row Builder State
  const [multiRows, setMultiRows] = useState<MultiQuoteRow[]>([
    { rowId: "1", text: "", author: "", category: Pillar.HumanNature },
    { rowId: "2", text: "", author: "", category: Pillar.IsolationShield },
  ]);

  // Edit / Add state for Scenarios
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [scenarioTextState, setScenarioTextState] = useState("");
  const [vulnerabilityTextState, setVulnerabilityTextState] = useState("");
  const [scenarioSuccessMsg, setScenarioSuccessMsg] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const keyLower = accessKey.trim().toLowerCase();
    if (keyLower === "admin" || keyLower === "stoic" || keyLower === "detachment") {
      setIsUnlocked(true);
      setAuthError(null);
      setAccessKey("");
    } else {
      setAuthError("Administrative key verification failed. Intrusions are audited.");
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setAccessKey("");
  };

  // Helper to commit batch quote additions
  const handleBatchInject = (quotesToAdd: Quote[]) => {
    if (quotesToAdd.length === 0) return;
    if (onAddQuotes) {
      onAddQuotes(quotesToAdd);
    } else {
      quotesToAdd.forEach((q) => onAddQuote(q));
    }
    setQuoteSuccessMsg(`// Batch operation complete: ${quotesToAdd.length} observations injected into Vault`);
    setTimeout(() => setQuoteSuccessMsg(null), 4000);
  };

  // Single Quote Save
  const handleSaveQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteText.trim()) return;

    if (quoteId) {
      // Editing
      onUpdateQuote({
        id: quoteId,
        text: quoteText.trim(),
        author: quoteAuthor.trim() || undefined,
        category: quoteCategory,
      });
      setQuoteSuccessMsg("// observation modified successfully");
    } else {
      // Adding new single quote
      onAddQuote({
        id: `custom-quote-${Date.now()}`,
        text: quoteText.trim(),
        author: quoteAuthor.trim() || undefined,
        category: quoteCategory,
      });
      setQuoteSuccessMsg("// new observation registered in vault");
    }

    // Reset Quote Form
    setQuoteId(null);
    setQuoteText("");
    setQuoteAuthor("");
    setQuoteCategory(Pillar.HumanNature);

    setTimeout(() => setQuoteSuccessMsg(null), 3000);
  };

  const handleEditQuoteClick = (q: Quote) => {
    setQuoteInputMode("single");
    setQuoteId(q.id);
    setQuoteText(q.text);
    setQuoteAuthor(q.author || "");
    setQuoteCategory(q.category);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleCancelEditQuote = () => {
    setQuoteId(null);
    setQuoteText("");
    setQuoteAuthor("");
    setQuoteCategory(Pillar.HumanNature);
  };

  // Handle Bulk Raw Text Paste Import
  const parseBulkQuotes = (): Quote[] => {
    if (!bulkText.trim()) return [];
    const results: Quote[] = [];

    let chunks: string[] = [];
    if (bulkFormat === "paragraph") {
      chunks = bulkText.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
    } else {
      chunks = bulkText.split("\n").map((c) => c.trim()).filter(Boolean);
    }

    chunks.forEach((chunk, index) => {
      let quoteStr = chunk;
      let authorStr = bulkDefaultAuthor.trim();

      if (bulkFormat === "pipe" && chunk.includes("|")) {
        const parts = chunk.split("|");
        quoteStr = parts[0].trim();
        authorStr = parts[1].trim() || authorStr;
      }

      if (quoteStr) {
        results.push({
          id: `bulk-admin-${Date.now()}-${index}`,
          text: quoteStr,
          author: authorStr || undefined,
          category: bulkDefaultCategory,
        });
      }
    });

    return results;
  };

  const handleBulkTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseBulkQuotes();
    if (parsed.length === 0) return;
    handleBatchInject(parsed);
    setBulkText("");
  };

  // Handle Multi-Row Builder Submit
  const handleAddRow = () => {
    setMultiRows((prev) => [
      ...prev,
      {
        rowId: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        text: "",
        author: "",
        category: Pillar.HumanNature,
      },
    ]);
  };

  const handleRemoveRow = (rowId: string) => {
    if (multiRows.length <= 1) return;
    setMultiRows((prev) => prev.filter((r) => r.rowId !== rowId));
  };

  const handleRowChange = (rowId: string, field: "text" | "author" | "category", value: string) => {
    setMultiRows((prev) =>
      prev.map((r) => (r.rowId === rowId ? { ...r, [field]: value } : r))
    );
  };

  const handleMultiRowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validQuotes: Quote[] = multiRows
      .filter((r) => r.text.trim().length > 0)
      .map((r, index) => ({
        id: `multirow-admin-${Date.now()}-${index}`,
        text: r.text.trim(),
        author: r.author.trim() || undefined,
        category: r.category,
      }));

    if (validQuotes.length === 0) return;
    handleBatchInject(validQuotes);
    setMultiRows([
      { rowId: "1", text: "", author: "", category: Pillar.HumanNature },
      { rowId: "2", text: "", author: "", category: Pillar.IsolationShield },
    ]);
  };

  // Preset Quote Packs
  const PRESET_PACKS: { name: string; author: string; pillar: Pillar; quotes: string[] }[] = [
    {
      name: "Seneca: Letters on Time & Grief",
      author: "Seneca",
      pillar: Pillar.ImpermanenceGrowth,
      quotes: [
        "We suffer more often in imagination than in reality.",
        "True happiness is to enjoy the present, without anxious dependence upon the future.",
        "It is not that we have a short time to live, but that we waste a lot of it.",
        "A man who suffers before it is necessary, suffers more than is necessary.",
      ],
    },
    {
      name: "Marcus Aurelius: Meditations on Control",
      author: "Marcus Aurelius",
      pillar: Pillar.IsolationShield,
      quotes: [
        "You have power over your mind - not outside events. Realize this, and you will find strength.",
        "The best revenge is to be unlike him who performed the injury.",
        "If you are pained by external things, it is not they that disturb you, but your own judgment upon them.",
        "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason.",
      ],
    },
    {
      name: "Machiavellian & Power Realism",
      author: "Observation",
      pillar: Pillar.HumanNature,
      quotes: [
        "People judge more by the eye than by the hand, for everyone can see, but few can feel.",
        "Men are so simple and so subject to present necessities that he who seeks to deceive will always find someone who will be deceived.",
        "When you show emotional reliance, you hand over your leverage without compensation.",
        "In transactional spaces, kindness without boundaries is interpreted as weakness to be harvested.",
      ],
    },
    {
      name: "Epictetus: The Enchiridion",
      author: "Epictetus",
      pillar: Pillar.SystemsLogic,
      quotes: [
        "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control.",
        "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.",
        "Attach yourself to what is spiritually superior, regardless of what other people think or do.",
      ],
    },
  ];

  const handleInjectPresetPack = (packIndex: number) => {
    const pack = PRESET_PACKS[packIndex];
    if (!pack) return;
    const generated: Quote[] = pack.quotes.map((txt, idx) => ({
      id: `pack-${packIndex}-${Date.now()}-${idx}`,
      text: txt,
      author: pack.author,
      category: pack.pillar,
    }));
    handleBatchInject(generated);
  };

  // Scenario CRUD
  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioTextState.trim() || !vulnerabilityTextState.trim()) return;

    if (scenarioId) {
      // Editing
      onUpdateScenario({
        id: scenarioId,
        scenario: scenarioTextState.trim(),
        vulnerabilityText: vulnerabilityTextState.trim(),
      });
      setScenarioSuccessMsg("// shock scenario parameters updated");
    } else {
      // Adding new
      onAddScenario({
        id: `custom-scenario-${Date.now()}`,
        scenario: scenarioTextState.trim(),
        vulnerabilityText: vulnerabilityTextState.trim(),
      });
      setScenarioSuccessMsg("// new shock vector deployed to chambers");
    }

    // Reset Form
    setScenarioId(null);
    setScenarioTextState("");
    setVulnerabilityTextState("");

    setTimeout(() => setScenarioSuccessMsg(null), 3000);
  };

  const handleEditScenarioClick = (s: ShieldScenario) => {
    setScenarioId(s.id);
    setScenarioTextState(s.scenario);
    setVulnerabilityTextState(s.vulnerabilityText);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleCancelEditScenario = () => {
    setScenarioId(null);
    setScenarioTextState("");
    setVulnerabilityTextState("");
  };

  return (
    <div id="admin-controls-container" className="space-y-6">
      {/* Lock Portal view */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto mt-12 border border-zinc-800 bg-zinc-900 rounded-2xl p-8 space-y-6 text-center">
          <div className="w-12 h-12 rounded-full border border-zinc-700/60 flex items-center justify-center mx-auto bg-zinc-950 text-zinc-400">
            <Lock className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.25em] block">
              Administrative Console
            </span>
            <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-100">
              Decrypt Override Terminal
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto font-sans">
              Please insert your master decrypt code to authorize live alterations and multi-quote batch additions.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1">
              <input
                id="admin-access-key-input"
                type="password"
                placeholder="Enter admin passcode"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-center text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition font-mono tracking-widest"
              />
              <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-wide">
                // Default access passcode: admin
              </span>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-[10px] font-mono text-rose-400 flex items-center justify-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="authorize-admin-button"
              type="submit"
              className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-sans font-medium text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Verify Signature</span>
            </button>
          </form>
        </div>
      ) : (
        /* Authorized Override Dashboard */
        <div className="space-y-6">
          {/* Dashboard Header banner */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block mb-1">
                Security clearance level: admin
              </span>
              <h2 className="text-lg font-sans font-light uppercase tracking-wider text-zinc-100 mb-1">
                System Customization & Multi-Quote Manager
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                Full administrative access to manage, edit, batch-import quotes, or populate preset philosophical packs into the Vault.
              </p>
            </div>

            <button
              id="admin-terminal-lock-button"
              onClick={handleLock}
              className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-zinc-950 rounded-xl text-[10px] font-mono uppercase tracking-wider text-zinc-500 hover:text-rose-400 hover:border-rose-950/40 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Terminal</span>
            </button>
          </div>

          {/* Controls subnavigation tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setAdminTab("quotes")}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-center rounded-lg transition ${
                  adminTab === "quotes"
                    ? "bg-zinc-800 text-zinc-100 font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
                Aphorism Vault ({quotes.length})
              </button>
              <button
                onClick={() => setAdminTab("scenarios")}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-center rounded-lg transition ${
                  adminTab === "scenarios"
                    ? "bg-zinc-800 text-zinc-100 font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Shield className="w-3.5 h-3.5 inline mr-1.5" />
                Shock Vectors ({scenarios.length})
              </button>
            </div>

            {adminTab === "quotes" && (
              <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 border border-zinc-800/80 p-1 rounded-xl">
                <button
                  onClick={() => setQuoteInputMode("single")}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition flex items-center gap-1.5 ${
                    quoteInputMode === "single"
                      ? "bg-zinc-200 text-zinc-950 font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Single
                </button>
                <button
                  onClick={() => setQuoteInputMode("multi_rows")}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition flex items-center gap-1.5 ${
                    quoteInputMode === "multi_rows"
                      ? "bg-zinc-200 text-zinc-950 font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ListPlus className="w-3 h-3" />
                  Multi-Row Builder
                </button>
                <button
                  onClick={() => setQuoteInputMode("multi_batch")}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition flex items-center gap-1.5 ${
                    quoteInputMode === "multi_batch"
                      ? "bg-zinc-200 text-zinc-950 font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  Batch Paste
                </button>
                <button
                  onClick={() => setQuoteInputMode("preset_packs")}
                  className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition flex items-center gap-1.5 ${
                    quoteInputMode === "preset_packs"
                      ? "bg-zinc-200 text-zinc-950 font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Preset Packs
                </button>
              </div>
            )}
          </div>

          {/* Success Banner */}
          {quoteSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{quoteSuccessMsg}</span>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (Left) */}
            <div className="lg:col-span-5 space-y-6">
              {adminTab === "quotes" && (
                <>
                  {/* MODE 1: Single Quote Entry */}
                  {quoteInputMode === "single" && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                        <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                          <Plus className="w-4 h-4 text-zinc-500" />
                          {quoteId ? "Modify Observation" : "Register Single Observation"}
                        </h3>
                        {quoteId && (
                          <button
                            onClick={handleCancelEditQuote}
                            className="text-[9px] font-mono text-rose-400 hover:text-rose-300 transition flex items-center gap-1 uppercase"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveQuote} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Observation Text
                          </label>
                          <textarea
                            rows={4}
                            required
                            value={quoteText}
                            onChange={(e) => setQuoteText(e.target.value)}
                            placeholder="e.g., Expecting fidelity from the transactional is the hallmark of structural delusion..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Author Attribution (Optional)
                          </label>
                          <input
                            type="text"
                            value={quoteAuthor}
                            onChange={(e) => setQuoteAuthor(e.target.value)}
                            placeholder="e.g. Seneca, Marcus Aurelius, or Clinical Archives"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                            Thematic Pillar Categorization
                          </label>
                          <select
                            value={quoteCategory}
                            onChange={(e) => setQuoteCategory(e.target.value as Pillar)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 transition"
                          >
                            {Object.values(Pillar).map((cat) => (
                              <option key={cat} value={cat}>
                                {CATEGORY_INFO[cat].emoji} {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-sans font-medium text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          {quoteId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{quoteId ? "Publish Alteration" : "Inject Into Vault"}</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* MODE 2: Multi-Row Builder Mode */}
                  {quoteInputMode === "multi_rows" && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                        <div className="space-y-0.5">
                          <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2">
                            <ListPlus className="w-4 h-4 text-emerald-400" />
                            Multi-Row Quote Builder
                          </h3>
                          <p className="text-[10px] font-sans text-zinc-500">
                            Fill in multiple quotes simultaneously with individual authors and categories.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleMultiRowSubmit} className="space-y-4">
                        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                          {multiRows.map((row, idx) => (
                            <div
                              key={row.rowId}
                              className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl space-y-2.5 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                  // Quote Row #{idx + 1}
                                </span>
                                {multiRows.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveRow(row.rowId)}
                                    className="text-[9px] font-mono text-zinc-600 hover:text-rose-400 transition flex items-center gap-1"
                                  >
                                    <X className="w-3 h-3" />
                                    Remove
                                  </button>
                                )}
                              </div>

                              <textarea
                                rows={2}
                                required
                                value={row.text}
                                onChange={(e) => handleRowChange(row.rowId, "text", e.target.value)}
                                placeholder="Type aphorism or observation..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition resize-none font-sans"
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <input
                                    type="text"
                                    value={row.author}
                                    onChange={(e) => handleRowChange(row.rowId, "author", e.target.value)}
                                    placeholder="Author (optional)"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                                  />
                                </div>
                                <div>
                                  <select
                                    value={row.category}
                                    onChange={(e) =>
                                      handleRowChange(row.rowId, "category", e.target.value as Pillar)
                                    }
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-zinc-700"
                                  >
                                    {Object.values(Pillar).map((cat) => (
                                      <option key={cat} value={cat}>
                                        {cat}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                          <button
                            type="button"
                            onClick={handleAddRow}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-xs font-mono transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Another Row
                          </button>

                          <button
                            type="submit"
                            disabled={multiRows.every((r) => !r.text.trim())}
                            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 text-zinc-950 font-mono text-xs uppercase tracking-wider rounded-xl transition"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Inject {multiRows.filter((r) => r.text.trim()).length} Quotes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* MODE 3: Batch Raw Text Importer Mode */}
                  {quoteInputMode === "multi_batch" && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                      <div className="space-y-1 border-b border-zinc-800/60 pb-3">
                        <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          Batch Text Importer
                        </h3>
                        <p className="text-[10px] font-sans text-zinc-500">
                          Paste multiple lines or quotes separated by pipes (e.g. <span className="font-mono text-zinc-400">Quote text | Author</span>).
                        </p>
                      </div>

                      <form onSubmit={handleBulkTextSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">
                              Format Parsing
                            </label>
                            <select
                              value={bulkFormat}
                              onChange={(e) => setBulkFormat(e.target.value as any)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200"
                            >
                              <option value="pipe">Quote | Author (1 per line)</option>
                              <option value="line">1 Quote per line</option>
                              <option value="paragraph">Paragraph blocks (Blank line separated)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">
                              Default Pillar
                            </label>
                            <select
                              value={bulkDefaultCategory}
                              onChange={(e) => setBulkDefaultCategory(e.target.value as Pillar)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200"
                            >
                              {Object.values(Pillar).map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">
                            Default Author Override (Optional)
                          </label>
                          <input
                            type="text"
                            value={bulkDefaultAuthor}
                            onChange={(e) => setBulkDefaultAuthor(e.target.value)}
                            placeholder="e.g. Seneca"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-mono uppercase text-zinc-500 block mb-1">
                            Paste Multiple Quotes Text
                          </label>
                          <textarea
                            rows={6}
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            placeholder={
                              bulkFormat === "pipe"
                                ? "We suffer more often in imagination than in reality. | Seneca\nHe who fears death will never do anything worthy. | Seneca"
                                : bulkFormat === "line"
                                ? "Paste your quotes here line by line..."
                                : "Paste paragraph blocks separated by double line breaks..."
                            }
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none font-sans"
                          />
                        </div>

                        {/* Live Parser Counter */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                          <span>Detected Items:</span>
                          <span className="font-bold text-emerald-400">
                            {parseBulkQuotes().length} valid quote(s)
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={parseBulkQuotes().length === 0}
                          className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 font-mono text-xs uppercase tracking-wider py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Batch Inject ({parseBulkQuotes().length}) Quotes</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* MODE 4: Preset Packs */}
                  {quoteInputMode === "preset_packs" && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                      <div className="space-y-1 border-b border-zinc-800/60 pb-3">
                        <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          Curated Philosophical Packs
                        </h3>
                        <p className="text-[10px] font-sans text-zinc-500">
                          Inject curated classic Stoic & Psychological observation batches directly into your Vault.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {PRESET_PACKS.map((pack, idx) => (
                          <div
                            key={pack.name}
                            className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl space-y-2.5 hover:border-zinc-700 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans font-medium text-zinc-200">
                                {pack.name}
                              </span>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase">
                                {pack.quotes.length} Quotes
                              </span>
                            </div>

                            <p className="text-[10px] font-serif italic text-zinc-400 line-clamp-2">
                              "{pack.quotes[0]}"
                            </p>

                            <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                              <span className="text-[9px] font-mono text-zinc-500">
                                Category: {pack.pillar}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleInjectPresetPack(idx)}
                                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-[10px] font-mono uppercase rounded-lg transition"
                              >
                                <Plus className="w-3 h-3 text-emerald-400" />
                                Inject Pack
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {adminTab === "scenarios" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-zinc-500" />
                      {scenarioId ? "Modify Shock Scenario" : "Register Shock Scenario"}
                    </h3>
                    {scenarioId && (
                      <button
                        onClick={handleCancelEditScenario}
                        className="text-[9px] font-mono text-rose-400 hover:text-rose-300 transition flex items-center gap-1 uppercase"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveScenario} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Shock Scenario Text
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={scenarioTextState}
                        onChange={(e) => setScenarioTextState(e.target.value)}
                        placeholder="Describe the clinical external shock vector..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Vulnerability Trigger Text
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={vulnerabilityTextState}
                        onChange={(e) => setVulnerabilityTextState(e.target.value)}
                        placeholder="Describe the common uncalibrated reactive failure..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none font-sans"
                      />
                    </div>

                    {scenarioSuccessMsg && (
                      <div className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest text-center animate-pulse">
                        {scenarioSuccessMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-sans font-medium text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {scenarioId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{scenarioId ? "Publish Alteration" : "Deploy to Chamber"}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* List Column (Right) */}
            <div className="lg:col-span-7 space-y-6">
              {adminTab === "quotes" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                    <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                      Active Archives Inventory ({quotes.length})
                    </h4>
                  </div>

                  <div className="space-y-3 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
                    {quotes.map((q) => (
                      <div
                        key={q.id}
                        className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-3 hover:border-zinc-700/60 transition group"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                            {CATEGORY_INFO[q.category]?.emoji} {q.category}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-600">
                            ID: {q.id.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs font-serif font-light text-zinc-200 italic leading-relaxed">
                          "{q.text}"
                        </p>

                        {q.author && (
                          <p className="text-[10px] font-mono text-zinc-500">
                            &mdash; {q.author}
                          </p>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-900">
                          <button
                            onClick={() => handleEditQuoteClick(q)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>EDIT</span>
                          </button>
                          <button
                            onClick={() => onDeleteQuote(q.id)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === "scenarios" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="border-b border-zinc-800/80 pb-3 flex items-center justify-between">
                    <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                      Deployed Shock Vector Records ({scenarios.length})
                    </h4>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {scenarios.map((s, idx) => (
                      <div
                        key={s.id}
                        className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-3 hover:border-zinc-700/60 transition"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                            Shock Vector {idx + 1}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-600">
                            ID: {s.id.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="text-[11px] font-sans text-zinc-300 leading-relaxed">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Scenario:</span>
                            {s.scenario}
                          </div>
                          <div className="text-[11px] font-sans text-zinc-400 leading-relaxed border-l border-zinc-900 pl-3">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">Vulnerability Default:</span>
                            {s.vulnerabilityText}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-900">
                          <button
                            onClick={() => handleEditScenarioClick(s)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>EDIT</span>
                          </button>
                          <button
                            onClick={() => onDeleteScenario(s.id)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>DELETE</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

