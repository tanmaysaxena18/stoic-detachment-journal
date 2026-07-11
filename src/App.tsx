/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AphorismVault from "./components/AphorismVault";
import CuratorWorkspace from "./components/CuratorWorkspace";
import DetachmentJournal from "./components/DetachmentJournal";
import ShieldChamber from "./components/ShieldChamber";
import DialogueStudio from "./components/DialogueStudio";
import AdminControls from "./components/AdminControls";
import { Post, Pillar, ShieldLog, DialogueItem, Quote, ShieldScenario } from "./types";
import { INITIAL_QUOTES, SHIELD_SCENARIOS } from "./data";
import { BookOpen, Terminal, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState("vault");

  // Selection state from Vault to Curator
  const [selectedQuoteText, setSelectedQuoteText] = useState("");
  const [selectedQuoteCategory, setSelectedQuoteCategory] = useState<Pillar | null>(null);

  // Persistent States in LocalStorage
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [shieldLogs, setShieldLogs] = useState<ShieldLog[]>([]);
  const [dialogueLogs, setDialogueLogs] = useState<DialogueItem[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [scenarios, setScenarios] = useState<ShieldScenario[]>([]);
  const [isAdminVisible, setIsAdminVisible] = useState(false);

  // Hydrate states on mount
  useEffect(() => {
    const posts = localStorage.getItem("detachment_saved_posts");
    if (posts) {
      try {
        setSavedPosts(JSON.parse(posts));
      } catch (e) {
        console.error(e);
      }
    }

    const logs = localStorage.getItem("detachment_shield_logs");
    if (logs) {
      try {
        setShieldLogs(JSON.parse(logs));
      } catch (e) {
        console.error(e);
      }
    }

    const dialogues = localStorage.getItem("detachment_dialogue_logs");
    if (dialogues) {
      try {
        setDialogueLogs(JSON.parse(dialogues));
      } catch (e) {
        console.error(e);
      }
    }

    const storedQuotes = localStorage.getItem("detachment_quotes");
    if (storedQuotes) {
      try {
        setQuotes(JSON.parse(storedQuotes));
      } catch (e) {
        setQuotes(INITIAL_QUOTES);
      }
    } else {
      setQuotes(INITIAL_QUOTES);
    }

    const storedScenarios = localStorage.getItem("detachment_scenarios");
    if (storedScenarios) {
      try {
        setScenarios(JSON.parse(storedScenarios));
      } catch (e) {
        setScenarios(SHIELD_SCENARIOS);
      }
    } else {
      setScenarios(SHIELD_SCENARIOS);
    }

    const storedAdminVisible = localStorage.getItem("detachment_admin_visible") === "true";
    setIsAdminVisible(storedAdminVisible);
  }, []);

  // Sync state functions
  const handleAddPost = (post: Post) => {
    const updated = [post, ...savedPosts];
    setSavedPosts(updated);
    localStorage.setItem("detachment_saved_posts", JSON.stringify(updated));
  };

  const handleDeletePost = (id: string) => {
    const updated = savedPosts.filter((p) => p.id !== id);
    setSavedPosts(updated);
    localStorage.setItem("detachment_saved_posts", JSON.stringify(updated));
  };

  const handleUpdatePost = (updatedPost: Post) => {
    const updated = savedPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p));
    setSavedPosts(updated);
    localStorage.setItem("detachment_saved_posts", JSON.stringify(updated));
  };

  const handleAddShieldLog = (log: ShieldLog) => {
    const updated = [log, ...shieldLogs];
    setShieldLogs(updated);
    localStorage.setItem("detachment_shield_logs", JSON.stringify(updated));
  };

  const handleClearShieldLogs = () => {
    setShieldLogs([]);
    localStorage.removeItem("detachment_shield_logs");
  };

  const handleAddDialogue = (item: DialogueItem) => {
    const updated = [item, ...dialogueLogs];
    setDialogueLogs(updated);
    localStorage.setItem("detachment_dialogue_logs", JSON.stringify(updated));
  };

  const handleClearDialogues = () => {
    setDialogueLogs([]);
    localStorage.removeItem("detachment_dialogue_logs");
  };

  // Cross-tab interaction: Send quote from Vault to Curator
  const handleSelectQuoteForCurator = (text: string, category: Pillar) => {
    setSelectedQuoteText(text);
    setSelectedQuoteCategory(category);
    setActiveTab("curator");
  };

  const handleClearVaultSelection = () => {
    setSelectedQuoteText("");
    setSelectedQuoteCategory(null);
  };

  // Dynamic Quote updates
  const handleAddQuote = (newQuote: Quote) => {
    const updated = [...quotes, newQuote];
    setQuotes(updated);
    localStorage.setItem("detachment_quotes", JSON.stringify(updated));
  };

  const handleDeleteQuote = (id: string) => {
    const updated = quotes.filter((q) => q.id !== id);
    setQuotes(updated);
    localStorage.setItem("detachment_quotes", JSON.stringify(updated));
  };

  const handleUpdateQuote = (updatedQuote: Quote) => {
    const updated = quotes.map((q) => (q.id === updatedQuote.id ? updatedQuote : q));
    setQuotes(updated);
    localStorage.setItem("detachment_quotes", JSON.stringify(updated));
  };

  // Dynamic Scenario updates
  const handleAddScenario = (newScenario: ShieldScenario) => {
    const updated = [...scenarios, newScenario];
    setScenarios(updated);
    localStorage.setItem("detachment_scenarios", JSON.stringify(updated));
  };

  const handleDeleteScenario = (id: string) => {
    const updated = scenarios.filter((s) => s.id !== id);
    setScenarios(updated);
    localStorage.setItem("detachment_scenarios", JSON.stringify(updated));
  };

  const handleUpdateScenario = (updatedScenario: ShieldScenario) => {
    const updated = scenarios.map((s) => (s.id === updatedScenario.id ? updatedScenario : s));
    setScenarios(updated);
    localStorage.setItem("detachment_scenarios", JSON.stringify(updated));
  };

  const handleToggleAdminVisibility = () => {
    const nextVal = !isAdminVisible;
    setIsAdminVisible(nextVal);
    localStorage.setItem("detachment_admin_visible", String(nextVal));
    if (!nextVal && activeTab === "admin") {
      setActiveTab("vault");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Global Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdminVisible={isAdminVisible} 
        onToggleAdmin={handleToggleAdminVisibility} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "vault" && (
              <AphorismVault onSelectQuote={handleSelectQuoteForCurator} quotes={quotes} />
            )}

            {activeTab === "curator" && (
              <CuratorWorkspace
                selectedQuoteText={selectedQuoteText}
                selectedQuoteCategory={selectedQuoteCategory}
                onPostSaved={handleAddPost}
                clearSelection={handleClearVaultSelection}
                quotes={quotes}
              />
            )}

            {activeTab === "journal" && (
              <DetachmentJournal
                posts={savedPosts}
                onDeletePost={handleDeletePost}
                onUpdatePost={handleUpdatePost}
              />
            )}

            {activeTab === "shield" && (
              <ShieldChamber
                logs={shieldLogs}
                onAddLog={handleAddShieldLog}
                onClearLogs={handleClearShieldLogs}
                scenarios={scenarios}
              />
            )}

            {activeTab === "dialogue" && (
              <DialogueStudio
                dialogues={dialogueLogs}
                onAddDialogue={handleAddDialogue}
                onClearDialogues={handleClearDialogues}
              />
            )}

            {activeTab === "admin" && (
              <AdminControls
                quotes={quotes}
                onAddQuote={handleAddQuote}
                onDeleteQuote={handleDeleteQuote}
                onUpdateQuote={handleUpdateQuote}
                scenarios={scenarios}
                onAddScenario={handleAddScenario}
                onDeleteScenario={handleDeleteScenario}
                onUpdateScenario={handleUpdateScenario}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-600">
          <div>
            &copy; 2026 The Architecture of Detachment. All connections are transactional.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-400 transition cursor-help">
              Built with Stoic Logic
            </span>
            <span>&middot;</span>
            <span className="hover:text-zinc-400 transition cursor-help">
              Clinical Psychology Engine
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

