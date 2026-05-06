import { ErrorState } from "@/components/error-state";
import { MetricPill } from "@/components/metric-pill";
import { SaveButton } from "@/components/save-button";
import { fetchCollege } from "@/lib/api";
import { formatCurrency, formatPercentage, formatRating } from "@/lib/format";

export default async function CollegeDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const college = await fetchCollege(id);

    return (
      <div className="grid gap-8">
        <section className="rounded-[2.5rem] border border-line bg-white p-8 shadow-card">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-pine/70">
                {college.city}, {college.state}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{college.name}</h1>
              <p className="mt-4 inline-flex rounded-full bg-moss px-4 py-2 text-sm font-semibold text-pine">
                {college.decision_tag}
              </p>
            </div>
            <SaveButton collegeId={college.id} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricPill label="Rating" value={formatRating(college.rating)} highlight />
            <MetricPill label="Fees" value={formatCurrency(college.fees_range)} />
            <MetricPill label="Placement" value={formatPercentage(college.placement_percentage)} />
            <MetricPill label="Avg package" value={formatCurrency(college.avg_package)} />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <article className="rounded-[2rem] border border-line bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold text-ink">Decision snapshot</h2>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[1.5rem] bg-field p-5">
                <p className="text-sm font-semibold text-ink">Ranking</p>
                <p className="mt-2 text-lg text-ink/75">
                  {college.ranking !== null ? `#${college.ranking}` : "Data not available"}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-field p-5">
                <p className="text-sm font-semibold text-ink">Placement outlook</p>
                <p className="mt-2 text-lg text-ink/75">
                  {college.placement_percentage !== null
                    ? `${college.placement_percentage}% of students placed`
                    : "Data not available"}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-field p-5">
                <p className="text-sm font-semibold text-ink">Cost outlook</p>
                <p className="mt-2 text-lg text-ink/75">
                  Typical annual fees: {formatCurrency(college.fees_range)}
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-field p-5">
                <p className="text-sm font-semibold text-ink">Course spread</p>
                <p className="mt-2 text-lg text-ink/75">
                  {college.courses.length > 0 ? college.courses.join(", ") : "Data not available"}
                </p>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-line bg-pine p-8 text-white shadow-card">
            <p className="text-sm uppercase tracking-[0.18em] text-white/70">Quick take</p>
            <h2 className="mt-4 font-display text-3xl font-semibold">What stands out</h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Use the rating for overall confidence, fees for affordability, placement for job
              outcomes, and average package for salary potential. This view keeps the key decision
              inputs above the fold.
            </p>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-line bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold text-ink">Strengths</h2>
            <div className="mt-5 grid gap-3">
              {college.strengths.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-moss p-4 text-sm font-medium text-pine">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-line bg-white p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold text-ink">Caution points</h2>
            <div className="mt-5 grid gap-3">
              {college.caution_points.map((item) => (
                <div key={item} className="rounded-[1.4rem] bg-field p-4 text-sm font-medium text-ink/75">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[2rem] border border-line bg-white p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-ink">Course and fee snapshot</h2>
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-line">
            <table className="min-w-full divide-y divide-line">
              <thead className="bg-field">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-ink">Course</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-ink">Degree</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-ink">Duration</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-ink">Annual fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm text-ink/75">
                {college.courses_offered.map((course) => (
                  <tr key={course.id}>
                    <td className="px-5 py-4 font-medium text-ink">{course.name}</td>
                    <td className="px-5 py-4">{course.degree_type}</td>
                    <td className="px-5 py-4">{course.duration_years} years</td>
                    <td className="px-5 py-4">{formatCurrency(course.annual_fees)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Unable to load this college."}
      />
    );
  }
}
