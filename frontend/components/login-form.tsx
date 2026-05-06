"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { loginUser } from "@/lib/api";
import { useAuth } from "./auth-provider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: ""
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const user = await loginUser(form);
        setUser(user);
        router.push((searchParams.get("next") || "/saved") as Route);
        router.refresh();
      } catch (submissionError) {
        setError(
          submissionError instanceof Error ? submissionError.message : "Unable to login right now."
        );
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium text-ink">
        Full name
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="rounded-2xl border border-line px-4 py-3 outline-none"
          placeholder="Your name"
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-ink">
        Email
        <input
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          className="rounded-2xl border border-line px-4 py-3 outline-none"
          placeholder="you@example.com"
          required
          type="email"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
      >
        {isPending ? "Logging in..." : "Continue"}
      </button>
    </form>
  );
}
