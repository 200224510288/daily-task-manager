import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task, TaskPriority } from "@/lib/types";

const tasksRef = collection(db, "tasks");

export async function createTask(data: {
  uid: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
}) {
  const now = Date.now();

  const docRef = await addDoc(tasksRef, {
    uid: data.uid,
    title: data.title,
    description: data.description ?? "",
    priority: data.priority ?? "medium",
    status: "backlog",
    assignedDate: null,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: docRef.id,
    uid: data.uid,
    title: data.title,
    description: data.description ?? "",
    priority: data.priority ?? "medium",
    status: "backlog" as const,
    assignedDate: null,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getUserTasks(uid: string): Promise<Task[]> {
  const q = query(tasksRef, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Task, "id">),
  }));
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  await updateDoc(doc(db, "tasks", taskId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId));
}