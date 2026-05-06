import { CollegeCard } from "@/components/college-card";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { fetchSavedColleges } from "@/lib/api";

export default async function SavedPage() {
  try {
    const colleges = await fetchSavedColleges();

    return (
      <div className="grid gap-8">
        <section className="rounded-[2.5rem] border border-line bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.18em] text-pine/70">Saved shortlist</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Your decision list</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/65">
            Saved colleges stay here so you can revisit them and make the final cut faster.
          </p>
        </section>

        {colleges.length === 0 ? (
          <EmptyState
            title="No saved colleges yet"
            description="Use the save action on any college card to build your shortlist."
          />
        ) : (
          <div className="grid gap-5">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Unable to load saved colleges."}
      />
    );
  }
}
