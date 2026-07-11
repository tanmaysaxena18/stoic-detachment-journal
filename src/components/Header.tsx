import React, { useState, useEffect } from "react";
import { Shield, BookOpen, Brain, MessageSquare, Terminal, Key } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminVisible: boolean;
  onToggleAdmin: () => void;
}

export default function Header({ activeTab, setActiveTab, isAdminVisible, onToggleAdmin }: HeaderProps) {
  const [clickCount, setClickCount] = useState(0);

  // Hidden keyboard trigger helper
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A (case insensitive)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        onToggleAdmin();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onToggleAdmin]);

  const handleLogoClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 5) {
      onToggleAdmin();
      setClickCount(0);
    } else {
      setClickCount(nextCount);
      // Reset counter after 3 seconds of inactivity
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const navItems = [
    { id: "vault", name: "Aphorism Vault", icon: BookOpen },
    { id: "curator", name: "Curator Workspace", icon: Brain },
    { id: "journal", name: "Detachment Journal", icon: Terminal },
    { id: "shield", name: "The Shield Chamber", icon: Shield },
    { id: "dialogue", name: "Dialogue Studio", icon: MessageSquare },
    ...(isAdminVisible ? [{ id: "admin", name: "Admin Override", icon: Key }] : []),
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={handleLogoClick} 
          className="flex items-center gap-4 cursor-pointer select-none"
          title="Internal Protocol"
        >
          <div className="w-6 h-6 border border-zinc-200 rotate-45 flex-shrink-0 transition-transform duration-700 hover:rotate-225"></div>
          <div>
            <h1 className="font-sans font-light text-sm uppercase tracking-[0.2em] text-zinc-100">
              The Architecture of Detachment
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">
              Cycle 04 // Observation 112
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center flex-wrap justify-center gap-1.5 p-1 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
