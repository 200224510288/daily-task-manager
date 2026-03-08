"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

 async function handleLogin() {
  if (!auth) {
    setError("Authentication service not initialized.");
    return;
  }

  setError("");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.replace("/dashboard");
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Login failed");
  }
}
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Task Manager</h1>
        <p className="text-sm text-slate-600 mb-6">Sign in to continue</p>

        <div className="space-y-4">
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-slate-900 text-white py-3 font-medium hover:bg-slate-800"
          >
            Login
          </button>
        </div>
      </div>
    </main>
  );
}