"use client";

import { Bookmark } from "lucide-react";
import { useTransition } from "react";
import { saveCollege } from "@/lib/api";

export function SaveButton({ collegeId }: { collegeId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await saveCollege(collegeId);
        })
      }
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-pine hover:text-pine disabled:opacity-60"
    >
      <Bookmark className="h-4 w-4" />
      {isPending ? "Saving..." : "Save"}
    </button>
  );
}
