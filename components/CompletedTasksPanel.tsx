"use client";

import { Task } from "@/lib/types";

export default function CompletedTasksPanel({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Completed Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">
            View tasks that have already been completed.
          </p>
        </div>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {tasks.length}
        </span>
      </div>

      <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-400">
            No completed tasks yet.
          </div>
        ) : (
          tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100"
            >
              <span className="truncate text-sm font-medium text-slate-700">
                {task.title}
              </span>
              <span className="ml-3 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Completed
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}