"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/lib/types";
import TaskCard from "./TaskCard";

export default function DayColumn({
  title,
  subtitle,
  dateValue,
  tasks,
  onOpenTask,
}: {
  title: string;
  subtitle?: string;
  dateValue: string;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: dateValue,
  });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`h-[420px] rounded-2xl border p-3 transition ${
          isOver
            ? "border-slate-400 bg-slate-100"
            : "border-dashed border-slate-200 bg-slate-50"
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="h-full space-y-2 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpen={onOpenTask} />
            ))}

            {tasks.length === 0 && (
              <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-slate-400">
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </section>
  );
}