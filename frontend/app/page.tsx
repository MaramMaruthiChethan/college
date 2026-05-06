import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { fetchCollegesMeta } from "@/lib/api";
import { formatCompactNumber, formatCurrency, formatPercentage } from "@/lib/format";

export default async function HomePage() {
  const meta = await fetchCollegesMeta().catch(() => ({
    filters: { cities: [], courses: [] },
    stats: {
      totalColleges: 0,
      averageRating: 0,
      averageFees: 0,
      highestPlacement: null
    }
  }));

  return (
    <div className="grid gap-10 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <section>
        <p className="inline-flex rounded-full border border-pine/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-pine">
          Decision-first college search
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-ink sm:text-6xl">
          Find the right college without drowning in tabs and spreadsheets.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/70">
          Search, filter, compare, and shortlist colleges in one workflow built for fast,
          clearer decisions.
        </p>

        <div className="mt-8 max-w-2xl">
          <SearchForm />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/colleges" className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white">
            Explore colleges
          </Link>
          <Link href="/saved" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink">
            View shortlist
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.6rem] border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Colleges tracked</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {formatCompactNumber(meta.stats.totalColleges)}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Average rating</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {meta.stats.averageRating.toFixed(1)}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Best placement</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              {formatPercentage(meta.stats.highestPlacement)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-line bg-white p-8 shadow-card">
        <div className="grid gap-4">
          <div className="rounded-[1.8rem] bg-moss p-5">
            <p className="text-sm text-pine/70">Step 1</p>
            <p className="mt-2 font-display text-2xl font-semibold text-pine">Discover</p>
            <p className="mt-2 text-sm leading-6 text-pine/75">Search by name and narrow by city, fee range, and rating.</p>
          </div>
          <div className="rounded-[1.8rem] bg-field p-5">
            <p className="text-sm text-ink/55">Step 2</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">Compare</p>
            <p className="mt-2 text-sm leading-6 text-ink/70">Line up 2 to 3 colleges and see the strongest outcomes instantly.</p>
          </div>
          <div className="rounded-[1.8rem] bg-white p-5 ring-1 ring-line">
            <p className="text-sm text-ink/55">Step 3</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">Shortlist</p>
            <p className="mt-2 text-sm leading-6 text-ink/70">Save your best options and move toward a final decision faster.</p>
          </div>
          <div className="rounded-[1.8rem] bg-field p-5">
            <p className="text-sm text-ink/55">Cost benchmark</p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {formatCurrency(meta.stats.averageFees)}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Current average annual fees across the seeded colleges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
