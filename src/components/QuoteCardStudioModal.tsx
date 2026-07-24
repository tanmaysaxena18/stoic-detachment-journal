import React, { useState, useRef } from "react";
import { X, Download, Copy, Check, Sparkles, Image as ImageIcon, Type, RefreshCw } from "lucide-react";

interface QuoteCardStudioModalProps {
  quoteText: string;
  author?: string;
  category?: string;
  isOpen: boolean;
  onClose: () => void;
}

const CARD_THEMES = [
  {
    id: "obsidian",
    name: "Obsidian Slate",
    bg: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950",
    border: "border-zinc-800",
    text: "text-zinc-100",
    accent: "text-zinc-400",
    quoteColor: "text-zinc-200"
  },
  {
    id: "emerald",
    name: "Emerald Clarity",
    bg: "bg-gradient-to-br from-zinc-950 via-emerald-950/40 to-zinc-950",
    border: "border-emerald-900/50",
    text: "text-emerald-100",
    accent: "text-emerald-400",
    quoteColor: "text-emerald-200"
  },
  {
    id: "gold",
    name: "Gold Minimal",
    bg: "bg-gradient-to-br from-zinc-950 via-amber-950/30 to-zinc-950",
    border: "border-amber-900/40",
    text: "text-amber-100",
    accent: "text-amber-400",
    quoteColor: "text-amber-200"
  },
  {
    id: "indigo",
    name: "Midnight Logic",
    bg: "bg-gradient-to-br from-zinc-950 via-indigo-950/30 to-zinc-950",
    border: "border-indigo-900/40",
    text: "text-indigo-100",
    accent: "text-indigo-400",
    quoteColor: "text-indigo-200"
  }
];

export default function QuoteCardStudioModal({
  quoteText,
  author = "Stoic Observation",
  category = "Architecture of Detachment",
  isOpen,
  onClose
}: QuoteCardStudioModalProps) {
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [fontStyle, setFontStyle] = useState<"serif" | "sans" | "mono">("serif");
  const [showWatermark, setShowWatermark] = useState(true);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const fontClass =
    fontStyle === "serif" ? "font-serif italic" : fontStyle === "sans" ? "font-sans font-light" : "font-mono";

  const handleCopyFormattedCard = () => {
    const cardText = `┌──────────────────────────────────────────┐
│ THE ARCHITECTURE OF DETACHMENT           │
├──────────────────────────────────────────┤
│ "${quoteText}"
│
│ — ${author}
│ Category: ${category}
└──────────────────────────────────────────┘`;
    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Data URI Download Handler
  const handleDownloadSVG = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <rect width="800" height="450" fill="#09090b" rx="24"/>
      <rect x="20" y="20" width="760" height="410" fill="none" stroke="#27272a" stroke-width="2" rx="16"/>
      <text x="50" y="70" fill="#a1a1aa" font-family="monospace" font-size="14" letter-spacing="3">THE ARCHITECTURE OF DETACHMENT // ${category.toUpperCase()}</text>
      <foreignObject x="50" y="110" width="700" height="230">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color: #f4f4f5; font-family: Georgia, serif; font-size: 24px; font-style: italic; line-height: 1.5; text-align: left;">
          "${quoteText.replace(/"/g, '&quot;')}"
        </div>
      </foreignObject>
      <text x="50" y="380" fill="#71717a" font-family="monospace" font-size="16">— ${author}</text>
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `detachment-card-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-sans font-medium text-zinc-100">
              Visual Quote Card Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
          {/* Theme choices */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Theme:</span>
            {CARD_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`px-2.5 py-1 text-[10px] font-mono rounded-md transition ${
                  selectedTheme.id === theme.id
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>

          {/* Typography choices */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Font:</span>
            {(["serif", "sans", "mono"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFontStyle(f)}
                className={`px-2.5 py-1 text-[10px] font-mono capitalize rounded-md transition ${
                  fontStyle === f ? "bg-zinc-800 text-zinc-100 border border-zinc-700" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Card Canvas */}
        <div
          ref={cardRef}
          className={`${selectedTheme.bg} border ${selectedTheme.border} p-8 md:p-12 rounded-2xl relative overflow-hidden space-y-6 shadow-xl transition-all duration-300`}
        >
          {/* Top Watermark */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <span className={`text-[9px] font-mono uppercase tracking-[0.2em] ${selectedTheme.accent}`}>
              The Architecture of Detachment
            </span>
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              {category}
            </span>
          </div>

          {/* Quote Body */}
          <blockquote className={`text-base md:text-xl leading-relaxed ${selectedTheme.quoteColor} ${fontClass}`}>
            "{quoteText}"
          </blockquote>

          {/* Author */}
          <div className="pt-2 flex items-center justify-between">
            <span className={`text-xs font-mono tracking-wider ${selectedTheme.accent}`}>
              — {author}
            </span>
            {showWatermark && (
              <span className="text-[9px] font-mono text-zinc-600">
                // System Observation
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setShowWatermark(!showWatermark)}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5"
          >
            <Type className="w-3.5 h-3.5" />
            Toggle System Watermark
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFormattedCard}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono px-4 py-2 rounded-xl transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              Copy Formatted ASCII
            </button>

            <button
              onClick={handleDownloadSVG}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs px-4 py-2 rounded-xl transition shadow-lg"
            >
              <Download className="w-4 h-4" />
              Export Vector SVG Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
