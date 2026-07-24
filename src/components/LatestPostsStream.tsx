import React, { useState } from "react";
import { Post, Pillar } from "../types";
import { CATEGORY_INFO } from "../data";
import { speakQuoteOrPost } from "./SoundscapePlayer";
import {
  FileText,
  Clock,
  Volume2,
  Copy,
  Check,
  Tag,
  Search,
  PenTool,
  Sparkles,
  ExternalLink,
  Share2,
  Image as ImageIcon
} from "lucide-react";
import { motion } from "motion/react";

interface LatestPostsStreamProps {
  posts: Post[];
  onSelectPostToEdit?: (post: Post) => void;
  onOpenCardStudio?: (quoteText: string, author?: string) => void;
  onNavigateToCurator?: () => void;
}

export default function LatestPostsStream({
  posts,
  onSelectPostToEdit,
  onOpenCardStudio,
  onNavigateToCurator
}: LatestPostsStreamProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.reflection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyPostText = (post: Post) => {
    const text = `"${post.quote}"\n\nReflection:\n${post.reflection}\n\nCategory: ${post.category}`;
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 block mb-1">
            Activity Stream & Posts Feed
          </span>
          <h3 className="text-base font-sans font-medium text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-300" />
            Your Latest Philosophical Posts ({posts.length})
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Your recent published works, reflections, and active drafts ready for review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToCurator && (
            <button
              onClick={onNavigateToCurator}
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-medium px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <PenTool className="w-3.5 h-3.5" />
              Compose New Post
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search your posts or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {(["All", "Published", "Draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-[11px] font-mono rounded-md transition ${
                statusFilter === status
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid / List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 text-center space-y-3">
          <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-xs font-mono text-zinc-400">
            {posts.length === 0 ? "No posts recorded yet." : "No posts matching your search filter."}
          </p>
          {posts.length === 0 && onNavigateToCurator && (
            <button
              onClick={onNavigateToCurator}
              className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono px-4 py-2 rounded-xl transition"
            >
              <PenTool className="w-3.5 h-3.5" />
              Create Your First Post in Curator Workspace
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => {
            const info = CATEGORY_INFO[post.category];
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition shadow-sm group"
              >
                <div className="space-y-3">
                  {/* Post Header Meta */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                      <span>{info?.emoji || "📜"}</span>
                      <span className="truncate max-w-[140px]">{post.category}</span>
                    </span>

                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        post.status === "Published"
                          ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400"
                          : "bg-amber-950/60 border-amber-800/60 text-amber-400"
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  {/* Quote Block */}
                  <div className="bg-zinc-900/60 border border-zinc-800/60 p-3.5 rounded-xl">
                    <p className="text-xs font-serif italic text-zinc-200 leading-relaxed">
                      "{post.quote}"
                    </p>
                  </div>

                  {/* Reflection Text */}
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-3">
                    {post.reflection}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md"
                        >
                          #{tag.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    {new Date(post.dateCreated).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Speech TTS */}
                    <button
                      onClick={() => speakQuoteOrPost(`${post.quote}. ${post.reflection}`)}
                      className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                      title="Read post aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Visual Card Studio */}
                    {onOpenCardStudio && (
                      <button
                        onClick={() => onOpenCardStudio(post.quote, "My Post Reflection")}
                        className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                        title="Export as Visual Quote Card"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Copy Text */}
                    <button
                      onClick={() => copyPostText(post)}
                      className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                      title="Copy text"
                    >
                      {copiedId === post.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
