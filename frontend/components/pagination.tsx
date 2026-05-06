import type { Route } from "next";
import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  searchParams
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function pageHref(page: number): Route {
    const params = new URLSearchParams();

    // Preserve the active filter state while switching only the page number.
    Object.entries(searchParams).forEach(([key, value]) => {
      if (!value || key === "page") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((entry) => params.append(key, entry));
        return;
      }

      params.set(key, value);
    });

    params.set("page", String(page));
    return `/colleges?${params.toString()}` as Route;
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink"
      >
        Previous
      </Link>
      <span className="text-sm text-ink/60">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink"
      >
        Next
      </Link>
    </div>
  );
}
