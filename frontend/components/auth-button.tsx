"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export function AuthButton() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Link href="/login" className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white">
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-semibold text-ink">{user.name}</p>
        <p className="text-xs text-ink/55">{user.email}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          logout();
          router.refresh();
        }}
        className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink"
      >
        Logout
      </button>
    </div>
  );
}
