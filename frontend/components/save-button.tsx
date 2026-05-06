"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { saveCollege } from "@/lib/api";
import { useAuth } from "./auth-provider";

export function SaveButton({ collegeId }: { collegeId: number }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          if (!user) {
            router.push(`/login?next=/saved`);
            return;
          }

          await saveCollege(collegeId);
          router.refresh();
        })
      }
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-pine hover:text-pine disabled:opacity-60"
    >
      <Bookmark className="h-4 w-4" />
      {isPending ? "Saving..." : user ? "Save" : "Login to save"}
    </button>
  );
}
