import { CollegeCard } from "@/components/college-card";
import { CompareBar } from "@/components/compare-bar";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Filters } from "@/components/filters";
import { Pagination } from "@/components/pagination";
import { SearchForm } from "@/components/search-form";
import { fetchColleges, fetchCollegesMeta } from "@/lib/api";

export default async function CollegesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const paramsObject = await searchParams;
  const params = new URLSearchParams();

  Object.entries(paramsObject).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
      return;
    }

    params.set(key, value);
  });

  try {
    const [result, meta] = await Promise.all([fetchColleges(params), fetchCollegesMeta()]);

    return (
      <div className="grid gap-8">
        <section className="rounded-[2.5rem] border border-line bg-white p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.18em] text-pine/70">College listing</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Find colleges that fit your decision criteria</h1>
          <div className="mt-6">
            <SearchForm initialValue={result.filters.search} baseParams={paramsObject} />
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Filters cityOptions={meta.filters.cities} courseOptions={meta.filters.courses} />

          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-ink/55">{result.pagination.total} colleges found</p>
                <h2 className="font-display text-3xl font-semibold text-ink">Results</h2>
                <p className="mt-2 text-sm text-ink/65">
                  Filter by city, course, fees, and rating to tighten the decision set quickly.
                </p>
              </div>
            </div>

            {result.items.length === 0 ? (
              <EmptyState
                title="No colleges found"
                description="Try reducing the filters or search with a broader college name."
              />
            ) : (
              <div className="grid gap-5">
                {result.items.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={result.pagination.page}
              totalPages={result.pagination.totalPages}
              searchParams={paramsObject}
            />
          </section>
        </div>

        <CompareBar />
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Unable to load colleges right now."}
      />
    );
  }
}
