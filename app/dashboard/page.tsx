"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddTaskForm from "@/components/AddTaskForm";
import TaskBoard from "@/components/TaskBoard";
import CompletedTasksPanel from "@/components/CompletedTasksPanel";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import { useAuth } from "@/context/AuthContext";
import {
  createTask,
  deleteTask,
  getUserTasks,
  updateTask,
} from "@/lib/firestore";
import { Task, TaskPriority } from "@/lib/types";
import { getTodayISODate } from "@/lib/dates";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayISODate());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

 async function loadTasks(uid: string) {
  try {
    setError("");
    const data = await getUserTasks(uid);
    setTasks(data);
  } catch (err: unknown) {
    console.error("Failed to load tasks:", err);
    setError(err instanceof Error ? err.message : "Failed to load tasks");
  } finally {
    setPageLoading(false);
  }
}

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    void loadTasks(user.uid);
  }, [user, loading, router]);

 async function handleAddTask(
  title: string,
  description: string,
  priority: TaskPriority
) {
  if (!user) return;

  const tempId = "temp-" + Date.now();

  const tempTask: Task = {
    id: tempId,
    uid: user.uid,
    title,
    description,
    priority,
    status: "backlog",
    assignedDate: null,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  setTasks((prev) => [tempTask, ...prev]);

  try {
    const savedTask = await createTask({
      uid: user.uid,
      title,
      description,
      priority,
    });

    setTasks((prev) =>
      prev.map((task) => (task.id === tempId ? savedTask : task))
    );
  } catch (err: unknown) {
    console.error("Failed to add task:", err);
    setError(err instanceof Error ? err.message : "Failed to add task");

    setTasks((prev) => prev.filter((task) => task.id !== tempId));
  }
}

 async function handleMoveTask(taskId: string, date: string | null) {
  if (!user) return;

  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? {
            ...task,
            assignedDate: date,
            status: date ? "planned" : "backlog",
          }
        : task
    )
  );

  if (taskId.startsWith("temp-")) return;

  try {
    await updateTask(taskId, {
      assignedDate: date,
      status: date ? "planned" : "backlog",
    });
  } catch (err: unknown) {
    console.error("Failed to move task:", err);
    setError(err instanceof Error ? err.message : "Failed to move task");
  }
}

 async function handleDeleteTask(taskId: string) {
  if (!user) return;

  const confirmed = window.confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  setTasks((prev) => prev.filter((task) => task.id !== taskId));
  setSelectedTask(null);

  if (taskId.startsWith("temp-")) return;

  try {
    await deleteTask(taskId);
  } catch (err: unknown) {
    console.error("Failed to delete task:", err);
    setError(err instanceof Error ? err.message : "Failed to delete task");
  }
}
 async function handleCompleteTask(taskId: string, completed: boolean) {
  if (!user) return;

  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed,
            status: completed ? "done" : "planned",
          }
        : task
    )
  );

  setSelectedTask(null);

  if (taskId.startsWith("temp-")) return;

  try {
    await updateTask(taskId, {
      completed,
      status: completed ? "done" : "planned",
    });
  } catch (err: unknown) {
    console.error("Failed to update completion:", err);
    setError(err instanceof Error ? err.message : "Failed to update completion");
  }
}

  const completedTasks = tasks.filter((task) => task.completed);

  if (loading || pageLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-700 shadow-sm">
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl bg-slate-900 px-6 py-6 text-white shadow-sm">
          <h1 className="text-3xl font-bold">Task & Schedule Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">
            Organize your work, schedule tasks by week, and track completed items separately.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <AddTaskForm onAdd={handleAddTask} />
        </div>

        <div className="space-y-6">
          <TaskBoard
            tasks={tasks}
            selectedDate={selectedDate}
            onWeekDateChange={setSelectedDate}
            onMoveTask={handleMoveTask}
            onOpenTask={setSelectedTask}
          />

          <CompletedTasksPanel
            tasks={completedTasks}
            onOpenTask={setSelectedTask}
          />
        </div>
      </div>

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onComplete={handleCompleteTask}
        onDelete={handleDeleteTask}
      />
    </main>
  );
}