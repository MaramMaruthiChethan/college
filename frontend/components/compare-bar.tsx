"use client";

import Link from "next/link";
import { useCompare } from "./compare-provider";

export function CompareBar() {
  const { compareIds, clearCompare } = useCompare();

  if (compareIds.length < 2) {
    return null;
  }

  return (
    <div className="sticky bottom-5 z-20 mx-auto mt-8 flex max-w-4xl items-center justify-between gap-4 rounded-[2rem] border border-pine/20 bg-pine px-5 py-4 text-white shadow-card">
      <div>
        <p className="text-sm font-semibold">Ready to compare</p>
        <p className="text-sm text-white/75">{compareIds.length} colleges selected</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={clearCompare} className="text-sm font-medium text-white/80">
          Clear
        </button>
        <Link
          href={`/compare?ids=${compareIds.join(",")}`}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pine"
        >
          Compare now
        </Link>
      </div>
    </div>
  );
}
