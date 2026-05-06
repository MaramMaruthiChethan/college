import clsx from "clsx";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { fetchComparedColleges } from "@/lib/api";
import { formatCurrency, formatPercentage, formatRating, getDecisionScore } from "@/lib/format";
import type { College } from "@/lib/types";

function getWinners(colleges: College[]) {
  const fees = Math.min(...colleges.map((college) => college.fees_range));
  const rating = Math.max(...colleges.map((college) => college.rating));
  const placementValues = colleges
    .map((college) => college.placement_percentage)
    .filter((value): value is number => value !== null);
  const placement = placementValues.length > 0 ? Math.max(...placementValues) : null;

  return { fees, rating, placement };
}

function getOverallWinner(colleges: College[]) {
  return [...colleges].sort((left, right) => getDecisionScore(right) - getDecisionScore(left))[0];
}

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ids = typeof params.ids === "string" ? params.ids : "";

  if (!ids) {
    return (
      <EmptyState
        title="Pick colleges to compare"
        description="Select 2 or 3 colleges from the listing page and open compare when you are ready."
      />
    );
  }

  try {
    const colleges = await fetchComparedColleges(ids);
    const winners = getWinners(colleges);
    const overallWinner = getOverallWinner(colleges);

    return (
      <div className="grid gap-8">
        <section className="rounded-[2.5rem] border border-line bg-white p-8 shadow-card">
          <p className="text-sm uppercase tracking-[0.18em] text-pine/70">Compare colleges</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Decision table</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/65">
            Best values are highlighted so you can quickly spot the stronger option on cost,
            placement, and rating.
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-moss p-5 text-pine">
            <p className="text-xs uppercase tracking-[0.18em] text-pine/70">Best overall fit</p>
            <p className="mt-2 font-display text-2xl font-semibold">{overallWinner.name}</p>
            <p className="mt-2 text-sm">
              Highest blended decision score based on rating, affordability, placement, and package.
            </p>
          </div>
        </section>

        <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-card">
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-field">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Metric</th>
                {colleges.map((college) => (
                  <th key={college.id} className="px-6 py-4 text-left text-sm font-semibold text-ink">
                    {college.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm text-ink/80">
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">City</td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    {college.city}, {college.state}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">Fees</td>
                {colleges.map((college) => (
                  <td
                    key={college.id}
                    className={clsx("px-6 py-4", college.fees_range === winners.fees && "bg-moss font-semibold text-pine")}
                  >
                    {formatCurrency(college.fees_range)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">Placement</td>
                {colleges.map((college) => (
                  <td
                    key={college.id}
                    className={clsx(
                      "px-6 py-4",
                      winners.placement !== null &&
                        college.placement_percentage === winners.placement &&
                        "bg-moss font-semibold text-pine"
                    )}
                  >
                    {formatPercentage(college.placement_percentage)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">Rating</td>
                {colleges.map((college) => (
                  <td
                    key={college.id}
                    className={clsx("px-6 py-4", college.rating === winners.rating && "bg-moss font-semibold text-pine")}
                  >
                    {formatRating(college.rating)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">Avg package</td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    {formatCurrency(college.avg_package)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">Courses</td>
                {colleges.map((college) => (
                  <td key={college.id} className="px-6 py-4">
                    {college.courses.length > 0 ? college.courses.join(", ") : "Data not available"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-ink">Decision score</td>
                {colleges.map((college) => (
                  <td
                    key={college.id}
                    className={clsx(
                      "px-6 py-4",
                      college.id === overallWinner.id && "bg-moss font-semibold text-pine"
                    )}
                  >
                    {getDecisionScore(college)}/100
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Unable to compare these colleges."}
      />
    );
  }
}
