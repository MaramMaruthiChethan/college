"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchForm({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialValue);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    router.push(`/colleges?${params.toString()}`);
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
        className="rounded-3xl bg-pine px-6 py-4 text-sm font-semibold text-white transition hover:bg-pine/90"
      >
        Find colleges
      </button>
    </form>
  );
}
