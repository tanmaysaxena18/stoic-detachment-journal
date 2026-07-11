import React, { useState } from "react";
import { Pillar, Quote, ShieldScenario } from "../types";
import { CATEGORY_INFO } from "../data";
import { Shield, BookOpen, Key, Plus, Trash2, Edit3, Lock, Unlock, Check, AlertCircle, RefreshCw, X } from "lucide-react";
import { motion } from "motion/react";

interface AdminControlsProps {
  quotes: Quote[];
  onAddQuote: (quote: Quote) => void;
  onDeleteQuote: (id: string) => void;
  onUpdateQuote: (quote: Quote) => void;
  scenarios: ShieldScenario[];
  onAddScenario: (scenario: ShieldScenario) => void;
  onDeleteScenario: (id: string) => void;
  onUpdateScenario: (scenario: ShieldScenario) => void;
}

export default function AdminControls({
  quotes,
  onAddQuote,
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

  // Edit / Add state for Quotes
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [quoteCategory, setQuoteCategory] = useState<Pillar>(Pillar.HumanNature);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

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

  // Quote CRUD
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
      // Adding new
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
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
              Please insert your master decrypt code to authorize live alterations to the active observation records.
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
                // System default access key is: admin
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
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                Security clearance level: admin
              </span>
              <h2 className="text-lg font-sans font-light uppercase tracking-wider text-zinc-100 mb-1">
                System Customization Suite
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                You possess full dynamic overrides to append, edit, or clear core observations and simulator shocks.
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
          <div className="flex gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-xl max-w-sm">
            <button
              onClick={() => setAdminTab("quotes")}
              className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider text-center rounded-lg transition ${
                adminTab === "quotes"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
              Aphorism Vault
            </button>
            <button
              onClick={() => setAdminTab("scenarios")}
              className={`flex-1 py-2 text-[10px] font-mono uppercase tracking-wider text-center rounded-lg transition ${
                adminTab === "scenarios"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Shield className="w-3.5 h-3.5 inline mr-1.5" />
              Shock Vectors
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (Left) */}
            <div className="lg:col-span-5 space-y-6">
              {adminTab === "quotes" && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                    <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-zinc-500" />
                      {quoteId ? "Modify Observation" : "Register Observation"}
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none"
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
                        placeholder="Leave blank for Clinical Archives"
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

                    {quoteSuccessMsg && (
                      <div className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest text-center animate-pulse">
                        {quoteSuccessMsg}
                      </div>
                    )}

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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none"
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
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 transition resize-none"
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

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {quotes.map((q) => (
                      <div
                        key={q.id}
                        className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-3 hover:border-zinc-700/60 transition"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                            {CATEGORY_INFO[q.category].emoji} {q.category}
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
