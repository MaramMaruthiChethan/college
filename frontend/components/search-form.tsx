"use client";

import type { Route } from "next";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function SearchForm({
  initialValue = "",
  baseParams
}: {
  initialValue?: string;
  baseParams?: Record<string, string | string[] | undefined>;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    Object.entries(baseParams ?? {}).forEach(([key, value]) => {
      if (!value || key === "search" || key === "page") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
        return;
      }

      params.set(key, value);
    });

    const nextSearch = search.trim();
    if (nextSearch) {
      params.set("search", nextSearch);
    }

    const href = (params.toString() ? `/colleges?${params.toString()}` : "/colleges") as Route;

    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="flex flex-1 items-center gap-3 rounded-3xl border border-line bg-white px-5 py-4 shadow-card">
        <Search className="h-5 w-5 text-ink/45" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by college name"
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink/40"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-3xl bg-pine px-6 py-4 text-sm font-semibold text-white transition hover:bg-pine/90"
      >
        {isPending ? "Searching..." : "Find colleges"}
      </button>
    </form>
  );
}
