import React, { useState } from "react";
import { Pillar, Quote } from "../types";
import { CATEGORY_INFO } from "../data";
import { Plus, Check, FileText, Upload, Sparkles, Layers, ArrowRight, Trash2, BookOpen } from "lucide-react";

interface MultiQuoteImporterProps {
  onAddQuotes: (quotes: Quote[]) => void;
  onClose?: () => void;
}

// Preset Curated Batch Packs for 1-click bulk import
const PRESET_PACKS: { name: string; icon: string; category: Pillar; quotes: { text: string; author: string }[] }[] = [
  {
    name: "Marcus Aurelius - Meditations Essentials",
    icon: "🏛️",
    category: Pillar.HumanNature,
    quotes: [
      { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
      { text: "The best revenge is to be unlike him who performed the injury.", author: "Marcus Aurelius" },
      { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
      { text: "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest.", author: "Marcus Aurelius" },
      { text: "Look back over the past, with its changing empires that rose and fell, and you can foresee the future, too.", author: "Marcus Aurelius" }
    ]
  },
  {
    name: "Epictetus - Enchiridion & Shield Mastery",
    icon: "⚡",
    category: Pillar.IsolationShield,
    quotes: [
      { text: "Some things are in our control and others not in our control.", author: "Epictetus" },
      { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
      { text: "If anyone tells you that a certain person speaks ill of you, do not make excuses... say: 'He did not know my other faults, else he would not have mentioned these alone.'", author: "Epictetus" },
      { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
      { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus" }
    ]
  },
  {
    name: "Seneca - Letters & Time Sovereignty",
    icon: "📜",
    category: Pillar.ExpectationsConflict,
    quotes: [
      { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
      { text: "Life is long if you know how to use it.", author: "Seneca" },
      { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
      { text: "Associate with people who are likely to improve you.", author: "Seneca" },
      { text: "If a man knows not which port he sails on, no wind is favorable.", author: "Seneca" }
    ]
  },
  {
    name: "Modern Strategic Detachment & Systems",
    icon: "🛡️",
    category: Pillar.SystemsLogic,
    quotes: [
      { text: "Do not react to provocative inputs immediately; build a 10-second processing buffer between impulse and response.", author: "Systems Logic Protocol" },
      { text: "Detach your self-worth from outcome metrics; focus exclusively on operational execution consistency.", author: "Mind Sovereignty Matrix" },
      { text: "Expectations are unwritten contracts made with parties who never agreed to sign them.", author: "Strategic Observation" },
      { text: "Emotional volatility is an operational vulnerability that external actors can exploit at zero cost.", author: "Clinical Detachment Law" },
      { text: "Silence is the highest form of emotional insulation when dealing with bad faith actors.", author: "The Inner Shield" }
    ]
  }
];

export default function MultiQuoteImporter({ onAddQuotes, onClose }: MultiQuoteImporterProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "paste" | "upload">("presets");
  const [rawText, setRawText] = useState("");
  const [defaultCategory, setDefaultCategory] = useState<Pillar>(Pillar.HumanNature);
  const [defaultAuthor, setDefaultAuthor] = useState("");
  const [parsedQuotes, setParsedQuotes] = useState<Quote[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Parse raw text into structured Quote items
  const handleParseText = () => {
    if (!rawText.trim()) return;

    // Split by newlines or double newlines
    const lines = rawText.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const newQuotes: Quote[] = [];

    lines.forEach((line, index) => {
      // Check if line contains pipe separator: "Quote Text | Author | Category"
      if (line.includes("|")) {
        const parts = line.split("|").map(p => p.trim());
        const quoteText = parts[0];
        const author = parts[1] || defaultAuthor || "Observation";
        let category: Pillar = defaultCategory;

        // Try to match category name if provided
        if (parts[2]) {
          const matchedPillar = Object.values(Pillar).find(p =>
            p.toLowerCase().includes(parts[2].toLowerCase())
          );
          if (matchedPillar) category = matchedPillar;
        }

        if (quoteText) {
          newQuotes.push({
            id: `q_batch_${Date.now()}_${index}`,
            text: quoteText,
            author,
            category
          });
        }
      } else {
        // Simple line as quote text
        newQuotes.push({
          id: `q_batch_${Date.now()}_${index}`,
          text: line.replace(/^["'“]|["'”]$/g, ""), // strip surrounding quotes if any
          author: defaultAuthor || "User Observation",
          category: defaultCategory
        });
      }
    });

    setParsedQuotes(newQuotes);
  };

  // Import parsed or preset quotes
  const handleCommitImport = (quotesToImport: Quote[]) => {
    if (quotesToImport.length === 0) return;

    onAddQuotes(quotesToImport);
    setSuccessCount(quotesToImport.length);
    setParsedQuotes([]);
    setRawText("");

    setTimeout(() => {
      setSuccessCount(null);
      if (onClose) onClose();
    }, 2000);
  };

  // Import a Preset Pack directly
  const handleImportPresetPack = (pack: typeof PRESET_PACKS[0]) => {
    const formatted: Quote[] = pack.quotes.map((q, idx) => ({
      id: `q_preset_${Date.now()}_${idx}`,
      text: q.text,
      author: q.author,
      category: pack.category
    }));
    handleCommitImport(formatted);
  };

  // JSON/CSV File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      try {
        // Try JSON format
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            const formatted: Quote[] = parsed.map((item, idx) => ({
              id: `q_json_${Date.now()}_${idx}`,
              text: item.text || item.quote || String(item),
              author: item.author || defaultAuthor || "Imported Source",
              category: (item.category && Object.values(Pillar).includes(item.category)) ? item.category : defaultCategory
            }));
            setParsedQuotes(formatted);
          }
        } else {
          // CSV / Text format
          setRawText(content);
          setActiveTab("paste");
        }
      } catch (err) {
        alert("Failed to parse file. Make sure it's valid JSON or plain text with one quote per line.");
      }
    };
    reader.readAsText(file);
  };

  const removeParsedQuote = (id: string) => {
    setParsedQuotes(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block mb-1">
            Bulk Batch Import Engine
          </span>
          <h3 className="text-base font-sans font-medium text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-zinc-300" />
            Add Multiple Quotes & Curated Packs
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Load multiple aphorisms at once via curated packs, multi-line text paste, or CSV/JSON uploads.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === "presets" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🏛️ Curated Packs
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === "paste" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            📝 Paste Multiple
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition ${
              activeTab === "upload" ? "bg-zinc-800 text-zinc-100 font-medium" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            📁 File Import
          </button>
        </div>
      </div>

      {successCount !== null && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span><strong>Success!</strong> Imported {successCount} quotes into your Vault archive.</span>
          </div>
        </div>
      )}

      {/* TAB 1: CURATED PRESET PACKS */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_PACKS.map((pack, i) => (
            <div
              key={i}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{pack.icon}</span>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                    5 Quotes Pack
                  </span>
                </div>
                <h4 className="text-sm font-sans font-medium text-zinc-200">
                  {pack.name}
                </h4>
                <p className="text-[11px] text-zinc-400 font-sans italic line-clamp-2">
                  "{pack.quotes[0].text}"
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">
                  Category: {pack.category}
                </span>
                <button
                  onClick={() => handleImportPresetPack(pack)}
                  className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-medium px-3.5 py-1.5 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add All 5 Quotes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PASTE MULTIPLE TEXT */}
      {activeTab === "paste" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Default Category for Batch
              </label>
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value as Pillar)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              >
                {Object.values(Pillar).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_INFO[cat].emoji} {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                Default Author / Source
              </label>
              <input
                type="text"
                placeholder="e.g. Marcus Aurelius, Naval, or My Notes"
                value={defaultAuthor}
                onChange={(e) => setDefaultAuthor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                Paste Multiple Quotes (One quote per line, or "Quote | Author | Category")
              </label>
            </div>
            <textarea
              rows={6}
              placeholder={`Paste your quotes here line by line, e.g.:\nYou have power over your mind - not outside events. | Marcus Aurelius | Human Nature\nWe suffer more often in imagination than in reality. | Seneca\nSilence is the highest form of emotional insulation.`}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleParseText}
              disabled={!rawText.trim()}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 font-mono text-xs px-4 py-2 rounded-xl transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Parse & Preview Batch
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FILE UPLOAD */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 text-center space-y-3 bg-zinc-950/50 transition">
            <Upload className="w-8 h-8 text-zinc-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-mono text-zinc-300">
                Upload JSON, CSV, or Plain Text Quote File
              </p>
              <p className="text-[10px] font-sans text-zinc-500">
                Supports Array of JSON objects <code>[&#123;"text": "...", "author": "..."&#125;]</code> or line-by-line text files.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs px-4 py-2 rounded-xl cursor-pointer transition">
              <FileText className="w-4 h-4" />
              Select File to Upload
              <input
                type="file"
                accept=".json,.csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* PREVIEW & COMMIT QUEUE */}
      {parsedQuotes.length > 0 && (
        <div className="border-t border-zinc-800 pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Batch Preview Queue ({parsedQuotes.length} Quotes Ready)
            </span>
            <button
              onClick={() => setParsedQuotes([])}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300"
            >
              Clear Queue
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {parsedQuotes.map((q) => (
              <div
                key={q.id}
                className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <p className="text-zinc-200 italic font-serif">"{q.text}"</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                    <span>Author: {q.author}</span>
                    <span>&middot;</span>
                    <span>Category: {q.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeParsedQuote(q.id)}
                  className="text-zinc-500 hover:text-red-400 p-1"
                  title="Remove quote"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleCommitImport(parsedQuotes)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/20"
            >
              <Check className="w-4 h-4" />
              Confirm & Save {parsedQuotes.length} Quotes to Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
