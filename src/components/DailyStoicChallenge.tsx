import React, { useState, useEffect } from "react";
import { Sparkles, Trophy, Check, RefreshCw, Flame, Award, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pillar: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Silence Protocol: Speak 50% Less Today",
    description: "Do not offer unsolicited opinions. Before speaking, ask yourself: 'Is it necessary? Is it true? Is it timely?'",
    difficulty: "Medium",
    pillar: "Isolation & Silence"
  },
  {
    id: "c2",
    title: "Premeditatio Malorum (Negative Visualization)",
    description: "Spend 3 minutes visualizing losing your primary work device or internet connection today. Plan how you would calmly adapt.",
    difficulty: "Easy",
    pillar: "Impermanence & Growth"
  },
  {
    id: "c3",
    title: "The Zero-Complaint Audit",
    description: "Catch yourself if you complain about traffic, weather, or delays. Immediately reframe each frustration as neutral data.",
    difficulty: "Hard",
    pillar: "Human Nature & Manipulation"
  },
  {
    id: "c4",
    title: "Voluntary Discomfort Practice",
    description: "Take a cold shower or skip a luxury snack today to remind your mind that basic physical needs are easily met.",
    difficulty: "Medium",
    pillar: "Mind Sovereignty"
  },
  {
    id: "c5",
    title: "Instant Emotional Pause",
    description: "When triggered by a text or email today, wait at least 15 minutes before typing any reply.",
    difficulty: "Easy",
    pillar: "Expectations & Conflict"
  }
];

export default function DailyStoicChallenge() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  useEffect(() => {
    // Pick daily challenge based on day of year or stored challenge
    const todayStr = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("detachment_challenge_date");
    const storedStreak = localStorage.getItem("detachment_streak_count");
    const storedCompleted = localStorage.getItem("detachment_challenge_completed") === "true";

    if (storedStreak) {
      setStreakCount(parseInt(storedStreak, 10));
    }

    if (storedDate === todayStr) {
      setIsCompleted(storedCompleted);
      const storedId = localStorage.getItem("detachment_challenge_id");
      const matched = CHALLENGES.find((c) => c.id === storedId);
      if (matched) setCurrentChallenge(matched);
    } else {
      // Pick random challenge for new day
      const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      setCurrentChallenge(randomChallenge);
      setIsCompleted(false);
      localStorage.setItem("detachment_challenge_date", todayStr);
      localStorage.setItem("detachment_challenge_id", randomChallenge.id);
      localStorage.setItem("detachment_challenge_completed", "false");
    }
  }, []);

  const handleToggleComplete = () => {
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    localStorage.setItem("detachment_challenge_completed", String(nextVal));

    let newStreak = streakCount;
    if (nextVal) {
      newStreak = streakCount + 1;
    } else {
      newStreak = Math.max(0, streakCount - 1);
    }
    setStreakCount(newStreak);
    localStorage.setItem("detachment_streak_count", String(newStreak));
  };

  const handleDrawNewChallenge = () => {
    const remaining = CHALLENGES.filter((c) => c.id !== currentChallenge.id);
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    setCurrentChallenge(next);
    setIsCompleted(false);
    localStorage.setItem("detachment_challenge_id", next.id);
    localStorage.setItem("detachment_challenge_completed", "false");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block">
              Daily Micro-Practice
            </span>
            <h3 className="text-sm font-sans font-medium text-zinc-100">
              Stoic Discipline Challenge
            </h3>
          </div>
        </div>

        {/* Streak Counter Badge */}
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl font-mono text-xs">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-zinc-400">Streak:</span>
          <span className="text-amber-400 font-bold">{streakCount} Days</span>
        </div>
      </div>

      {/* Challenge Card */}
      <div
        className={`p-5 rounded-2xl border transition duration-300 space-y-3 ${
          isCompleted
            ? "bg-emerald-950/20 border-emerald-800/50 shadow-lg shadow-emerald-950/10"
            : "bg-zinc-950 border-zinc-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
            Pillar: {currentChallenge.pillar}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Difficulty: {currentChallenge.difficulty}
          </span>
        </div>

        <h4 className="text-sm font-sans font-medium text-zinc-100">
          {currentChallenge.title}
        </h4>

        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          {currentChallenge.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-900">
          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-medium transition ${
              isCompleted
                ? "bg-emerald-500 text-zinc-950 shadow-md"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            }`}
          >
            <Check className="w-4 h-4" />
            {isCompleted ? "Completed for Today!" : "Mark Challenge Completed"}
          </button>

          <button
            onClick={handleDrawNewChallenge}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Draw Another Challenge
          </button>
        </div>
      </div>
    </div>
  );
}
