import React, { useState } from "react";
import { Post, Pillar } from "../types";
import { CATEGORY_INFO } from "../data";
import { Calendar, Trash2, CheckCircle, FileText, Send, Clock, Copy, Check, Edit2, Save, X } from "lucide-react";
import { motion } from "motion/react";

interface DetachmentJournalProps {
  posts: Post[];
  onDeletePost: (id: string) => void;
  onUpdatePost: (post: Post) => void;
}

export default function DetachmentJournal({ posts, onDeletePost, onUpdatePost }: DetachmentJournalProps) {
  const [filter, setFilter] = useState<"All" | "Draft" | "Published" | "Scheduled">("All");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editReflection, setEditReflection] = useState("");
  const [editTags, setEditTags] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (filter === "All") return true;
    return post.status === filter;
  });

  const handleStartEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditReflection(post.reflection);
    setEditTags(post.tags.join(", "));
  };

  const handleSaveEdit = (post: Post) => {
    const updated: Post = {
      ...post,
      reflection: editReflection,
      tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    onUpdatePost(updated);
    setEditingPostId(null);
  };

  const copyPostMarkdown = (post: Post) => {
    const info = CATEGORY_INFO[post.category];
    const markdown = `Category: ${info.emoji} ${post.category}

The Quote:

"${post.quote}"

The Reflection:
${post.reflection}

Tags: ${post.tags.map(t => t.startsWith("#") ? t : `#${t}`).join(" ")}`;

    navigator.clipboard.writeText(markdown);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateStatus = (post: Post, status: "Draft" | "Published" | "Scheduled") => {
    onUpdatePost({
      ...post,
      status,
    });
  };

  return (
    <div id="journal-container" className="space-y-6">
      {/* Overview Block */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
            System Chronology
          </span>
          <h2 className="text-lg font-sans font-light uppercase tracking-wider text-zinc-100 mb-1">
            Detachment Journal & Timeline
          </h2>
          <p className="text-xs text-zinc-400 font-sans max-w-lg">
            Audit logs and publishing pipeline for your philosophical postings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
          {(["All", "Draft", "Published", "Scheduled"] as const).map((type) => (
            <button
              key={type}
              id={`filter-journal-${type}`}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md transition ${
                filter === type
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {type} ({type === "All" ? posts.length : posts.filter((p) => p.status === type).length})
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post, idx) => {
          const info = CATEGORY_INFO[post.category];
          const isEditing = editingPostId === post.id;
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700/50 transition relative overflow-hidden group"
            >
              {/* Status Indicator Bar */}
              <div className="absolute top-0 left-0 h-[3px] w-full bg-zinc-800" />
              {post.status === "Published" && (
                <div className="absolute top-0 left-0 h-[3px] w-full bg-zinc-400" />
              )}
              {post.status === "Scheduled" && (
                <div className="absolute top-0 left-0 h-[3px] w-full bg-zinc-600" />
              )}

              <div className="flex flex-col md:flex-row gap-6">
                {/* Meta block */}
                <div className="md:w-1/4 space-y-4 border-r border-zinc-800/80 pr-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-500 block">
                      pillar category
                    </span>
                    <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <span>{info.emoji}</span>
                      <span>{post.category}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-500 block">
                      date curated
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      {new Date(post.dateCreated).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-zinc-500 block">
                      status controller
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(post, "Draft")}
                        className={`px-2 py-1 rounded-md border text-[9px] font-mono uppercase tracking-wider ${
                          post.status === "Draft"
                            ? "bg-zinc-800 text-zinc-100 border-zinc-700"
                            : "bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300"
                        }`}
                        title="Set to Draft"
                      >
                        Draft
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(post, "Published")}
                        className={`px-2 py-1 rounded-md border text-[9px] font-mono uppercase tracking-wider ${
                          post.status === "Published"
                            ? "bg-zinc-200 text-zinc-900 border-zinc-300"
                            : "bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300"
                        }`}
                        title="Mark Published"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(post, "Scheduled")}
                        className={`px-2 py-1 rounded-md border text-[9px] font-mono uppercase tracking-wider ${
                          post.status === "Scheduled"
                            ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                            : "bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300"
                        }`}
                        title="Schedule Post"
                      >
                        Sched
                      </button>
                    </div>
                  </div>

                  {post.status === "Scheduled" && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider block">
                        scheduled execution
                      </span>
                      <span className="text-xs text-zinc-300 font-mono">
                        {post.scheduledDate || "unspecified"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Block */}
                <div className="flex-1 space-y-4">
                  {/* Quote block */}
                  <blockquote className="text-xl font-serif font-light text-zinc-100 italic border-l border-zinc-700 pl-4 py-0.5 leading-relaxed">
                    "{post.quote}"
                  </blockquote>

                  {/* Reflection Block (Editable / Static) */}
                  {isEditing ? (
                    <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Edit Reflection</label>
                        <textarea
                          rows={3}
                          value={editReflection}
                          onChange={(e) => setEditReflection(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Edit Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="px-2.5 py-1 text-[10px] font-mono text-zinc-400 border border-zinc-800 rounded-md hover:bg-zinc-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(post)}
                          className="px-2.5 py-1 text-[10px] font-mono bg-zinc-100 text-zinc-900 rounded-md hover:bg-zinc-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed text-justify">
                        {post.reflection}
                      </p>

                      {/* Rendered Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag, idx) => {
                          const tagWithHash = tag.startsWith("#") ? tag : `#${tag}`;
                          return (
                            <span key={idx} className="text-[9px] font-mono uppercase tracking-wider border border-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                              {tagWithHash}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  {!isEditing && (
                    <div className="flex items-center justify-between border-t border-zinc-800/40 mt-4 pt-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => copyPostMarkdown(post)}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                        >
                          {copiedId === post.id ? (
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
                          onClick={() => handleStartEdit(post)}
                          className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="uppercase tracking-wider">Edit</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wider">Discard</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-sm font-mono">No posts found matching this filter in your journal.</p>
          </div>
        )}
      </div>
    </div>
  );
}
