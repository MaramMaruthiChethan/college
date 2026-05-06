import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">College Decision Platform</p>
            <p className="text-sm text-ink/65">Discover faster. Decide better.</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-ink/75">
          <Link href="/colleges" className="rounded-full px-4 py-2 hover:bg-moss">
            Explore
          </Link>
          <Link href="/compare" className="rounded-full px-4 py-2 hover:bg-moss">
            Compare
          </Link>
          <Link href="/saved" className="rounded-full px-4 py-2 hover:bg-moss">
            Saved
          </Link>
        </nav>
      </div>
    </header>
  );
}
