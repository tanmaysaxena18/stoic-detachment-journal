import React, { useState } from "react";
import { ShieldLog, ShieldScenario } from "../types";
import { Shield, Brain, Send, HelpCircle, Activity, Award, Trash2, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface ShieldChamberProps {
  logs: ShieldLog[];
  onAddLog: (log: ShieldLog) => void;
  onClearLogs: () => void;
  scenarios: ShieldScenario[];
}

export default function ShieldChamber({ logs, onAddLog, onClearLogs, scenarios }: ShieldChamberProps) {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Latest audit result display
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState("");
  const [completedAudit, setCompletedAudit] = useState(false);

  const activeScenario = scenarios[selectedScenarioIdx] || scenarios[0];

  const handleAudit = async () => {
    if (!userResponse.trim()) {
      setError("Please input your drafted reaction before initiating the audit.");
      return;
    }

    setIsAuditing(true);
    setError(null);
    setCompletedAudit(false);

    try {
      const res = await fetch("/api/analyze-shield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenario.scenario,
          userResponse: userResponse,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Auditing node failed to compute score.");
      }

      const result = await res.json();
      if (result.success) {
        const { detachmentScore, analysis } = result.data;
        setLatestScore(detachmentScore);
        setLatestAnalysis(analysis);
        setCompletedAudit(true);

        // Add to permanent local logs
        const newLog: ShieldLog = {
          id: `shield-log-${Date.now()}`,
          scenarioId: activeScenario.id,
          scenarioText: activeScenario.scenario,
          userResponse: userResponse,
          detachmentScore: detachmentScore,
          analysis: analysis,
          timestamp: new Date().toISOString(),
        };
        onAddLog(newLog);
      } else {
        throw new Error("Invalid output received from the analytical auditor.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  // Score description mapping
  const getScoreDescription = (score: number) => {
    if (score >= 85) return { label: "Unassailable Containment", color: "text-emerald-400 border-emerald-900 bg-emerald-950/20" };
    if (score >= 60) return { label: "Rationally Anchored", color: "text-zinc-300 border-zinc-800 bg-zinc-900/40" };
    if (score >= 35) return { label: "Fragile Containment", color: "text-amber-400 border-amber-900 bg-amber-950/20" };
    return { label: "High Vulnerability Vector", color: "text-rose-400 border-rose-900 bg-rose-950/20" };
  };

  return (
    <div id="shield-chamber-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left panel: Simulator & Input */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-4">
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl">
              <Shield className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-0.5">
                Stress Assessment Engine
              </span>
              <h3 className="text-lg font-sans font-light uppercase tracking-wider text-zinc-100">
                Stoic Resilience Simulator
              </h3>
            </div>
          </div>

          {/* Scenario Picker buttons */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Select Shock Scenario</label>
            <div className="grid grid-cols-4 gap-2">
              {scenarios.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setSelectedScenarioIdx(idx);
                    setUserResponse("");
                    setCompletedAudit(false);
                    setError(null);
                  }}
                  className={`py-2 text-[10px] font-mono uppercase tracking-wider rounded-lg border transition ${
                    selectedScenarioIdx === idx
                      ? "bg-zinc-100 text-zinc-950 border-zinc-200 shadow-sm"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700/50"
                  }`}
                >
                  Shock {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Current Active Scenario Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">
                active variable variable-shock
              </span>
              <p className="text-xs font-sans text-zinc-200 leading-relaxed text-justify">
                {activeScenario.scenario}
              </p>
            </div>

            <div className="border-t border-zinc-900 pt-3 space-y-1.5">
              <span className="text-[9px] font-mono text-rose-500 uppercase tracking-widest block">
                baseline vulnerable reaction (Default)
              </span>
              <p className="text-xs font-sans text-zinc-500 italic leading-relaxed">
                "{activeScenario.vulnerabilityText}"
              </p>
            </div>
          </div>

          {/* User's response formulation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Draft Your Stoic Response Plan
              </label>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                Min 20 chars
              </span>
            </div>
            <textarea
              id="shield-response-textarea"
              rows={5}
              value={userResponse}
              onChange={(e) => {
                setUserResponse(e.target.value);
                setError(null);
              }}
              placeholder="How do you rationally isolate your core attention? Detail your psychological defense, detachment steps, and why this event fails to disrupt your internal equilibrium..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition resize-none"
            />
          </div>

          {/* Trigger Audit */}
          <button
            id="audit-shield-button"
            onClick={handleAudit}
            disabled={isAuditing}
            className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 font-sans font-medium text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            {isAuditing ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-zinc-500" />
                <span>Auditing Psychological Vectors...</span>
              </>
            ) : (
              <>
                <Award className="w-4.5 h-4.5" />
                <span>Audit Resilience & Outer Shield</span>
              </>
            )}
          </button>

          {error && (
            <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 flex gap-2.5 items-start">
              <HelpCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-mono text-rose-400 leading-relaxed">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Live audit result & History log */}
      <div className="lg:col-span-5 space-y-6">
        {/* Latest Audit Result display */}
        {isAuditing && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4">
            <Activity className="w-7 h-7 text-zinc-500 animate-spin" />
            <div className="space-y-1">
              <h4 className="text-zinc-300 text-xs font-mono uppercase tracking-[0.2em]">Running Simulation</h4>
              <p className="text-zinc-500 text-[10px] font-mono max-w-xs uppercase tracking-wider">
                // checking containment layers and vulnerable parameters...
              </p>
            </div>
          </div>
        )}

        {completedAudit && latestScore !== null && !isAuditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Shield Assessment Log</span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">Calculated Live</span>
            </div>

            {/* Score circle / indicator */}
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-2 border-zinc-800 bg-zinc-900/40">
                <span className="text-3xl font-sans font-semibold text-zinc-100">
                  {latestScore}
                </span>
                <span className="absolute bottom-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  score
                </span>
              </div>

              {/* Tag descriptor */}
              <span
                className={`inline-flex px-3 py-1 rounded-full border text-[9px] font-mono uppercase tracking-wider font-medium ${
                  getScoreDescription(latestScore).color
                }`}
              >
                {getScoreDescription(latestScore).label}
              </span>
            </div>

            {/* Deep Critique */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Clinical Critique & Stoic Counsel
              </span>
              <p className="text-zinc-300 text-xs leading-relaxed text-justify font-sans font-light">
                {latestAnalysis}
              </p>
            </div>
          </motion.div>
        )}

        {/* Audit History Logs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
              Assessment History
            </span>

            {logs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="text-[10px] font-mono text-zinc-600 hover:text-rose-400 transition flex items-center gap-1 uppercase tracking-wider"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Logs</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                      getScoreDescription(log.detachmentScore).color
                    }`}
                  >
                    Score: {log.detachmentScore}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-zinc-300 line-clamp-2">
                  <strong className="text-zinc-400 font-mono uppercase text-[9px] tracking-wider block mb-0.5">Shock Parameter:</strong>
                  {log.scenarioText}
                </p>

                <p className="text-[11px] font-mono text-zinc-500 line-clamp-2 italic">
                  <strong className="text-zinc-400 font-mono uppercase text-[9px] tracking-wider block mb-0.5">Your Response Plan:</strong>
                  "{log.userResponse}"
                </p>
              </div>
            ))}

            {logs.length === 0 && (
              <p className="text-zinc-600 text-xs font-mono text-center py-6">
                No past resilience audits logged.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
