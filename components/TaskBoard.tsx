"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Task } from "@/lib/types";
import { formatWeekRange, getWeekDays, shiftWeek } from "@/lib/dates";
import DayColumn from "./DayColumn";

export default function TaskBoard({
  tasks,
  selectedDate,
  onMoveTask,
  onWeekDateChange,
  onOpenTask,
}: {
  tasks: Task[];
  selectedDate: string;
  onMoveTask: (taskId: string, date: string | null) => Promise<void>;
  onWeekDateChange: (date: string) => void;
  onOpenTask: (task: Task) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTasks = tasks.filter((task) => task.completed !== true);
  const completedTasks = tasks.filter((task) => task.completed === true);

  const days = getWeekDays(selectedDate);
  const backlogTasks = activeTasks.filter((task) => !task.assignedDate);

  function getTasksForDate(date: string) {
    return activeTasks.filter((task) => task.assignedDate === date);
  }

  function isColumnId(id: string) {
    if (id === "backlog") return true;
    return days.some((day) => day.value === id);
  }

  function findContainer(id: string): string | null {
    if (isColumnId(id)) return id;

    const allActiveTasks = [...backlogTasks, ...days.flatMap((day) => getTasksForDate(day.value))];
    const foundTask = allActiveTasks.find((task) => task.id === id);

    if (!foundTask) return null;

    return foundTask.assignedDate ?? "backlog";
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const targetContainer = findContainer(overId);
    if (!targetContainer) return;

    if (targetContainer === "backlog") {
      await onMoveTask(activeTaskId, null);
      return;
    }

    await onMoveTask(activeTaskId, targetContainer);
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-10 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Weekly Planner</h2>
            <p className="mt-1 text-sm text-slate-500">{formatWeekRange(selectedDate)}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onWeekDateChange(shiftWeek(selectedDate, -1))}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => onWeekDateChange(shiftWeek(selectedDate, 0, true))}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => onWeekDateChange(shiftWeek(selectedDate, 1))}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Next
              </button>
            </div>

            <div className="w-full min-w-[220px]">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Select Week
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onWeekDateChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <DayColumn
            title="Backlog"
            subtitle="Unscheduled tasks"
            dateValue="backlog"
            tasks={backlogTasks}
            onOpenTask={onOpenTask}
          />

          <div className="xl:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {days.map((day) => (
              <DayColumn
                key={day.value}
                title={day.label}
                subtitle={day.fullLabel}
                dateValue={day.value}
                tasks={getTasksForDate(day.value)}
                onOpenTask={onOpenTask}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}