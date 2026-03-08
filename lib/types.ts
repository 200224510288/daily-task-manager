export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "backlog" | "planned" | "in-progress" | "done";

export type Task = {
  id: string;
  uid: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedDate: string | null;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
};