"use client";

import { useRef, useState } from "react";
import type { TaskPriority } from "@/lib/types";

export default function AddTaskForm({
  onAdd,
}: {
  onAdd: (title: string, description: string, priority: TaskPriority) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [loading, setLoading] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!title.trim() || loading) return;

    try {
      setLoading(true);
      await onAdd(title.trim(), description.trim(), priority);
      setTitle("");
      setDescription("");
      setPriority("medium");
      titleRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      descriptionRef.current?.focus();
    }
  }

  function handleDescriptionKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Quick Add Task</h2>
        <p className="mt-1 text-sm text-slate-500">
          Press Enter to move to description. Press Ctrl + Enter to save.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            ref={titleRef}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
          />
        </div>

        <div className="xl:col-span-5">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            ref={descriptionRef}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Enter task description"
            rows={1}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleDescriptionKeyDown}
          />
        </div>

        <div className="xl:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-end xl:col-span-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "..." : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}