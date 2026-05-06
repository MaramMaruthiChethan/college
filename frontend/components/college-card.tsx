import Link from "next/link";
import { CompareToggle } from "./compare-toggle";
import { MetricPill } from "./metric-pill";
import { SaveButton } from "./save-button";
import {
  formatCurrency,
  formatPercentage,
  formatRating,
  getBestValueLabel,
  getDecisionScore
} from "@/lib/format";
import type { College } from "@/lib/types";

export function CollegeCard({ college }: { college: College }) {
  const decisionScore = getDecisionScore(college);

  return (
    <article className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink/55">
              {college.city}, {college.state}
            </p>
            <Link href={`/college/${college.id}`} className="mt-2 block">
              <h2 className="font-display text-2xl font-semibold text-ink">{college.name}</h2>
            </Link>
            <div className="mt-3 flex flex-wrap gap-2">
              <p className="inline-flex rounded-full bg-field px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pine">
                {getBestValueLabel(college)}
              </p>
              {college.decision_tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-ink/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <SaveButton collegeId={college.id} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricPill label="Fees" value={formatCurrency(college.fees_range, true)} />
          <MetricPill label="Rating" value={formatRating(college.rating)} highlight />
          <MetricPill label="Placement" value={formatPercentage(college.placement_percentage)} />
          <MetricPill label="Avg package" value={formatCurrency(college.avg_package, true)} />
        </div>

        <div className="grid gap-4 rounded-[1.5rem] bg-field p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Decision score</p>
            <p className="mt-1 text-lg font-semibold text-ink">{decisionScore}/100</p>
            <p className="mt-2 text-sm text-ink/65">
              {college.courses.length > 0
                ? `Popular courses: ${college.courses.join(", ")}`
                : "Course data is being expanded"}
            </p>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Ranking</p>
            <p className="mt-1 text-lg font-semibold text-ink">
              {college.ranking !== null ? `#${college.ranking}` : "NA"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <CompareToggle collegeId={college.id} />
          <Link href={`/college/${college.id}`} className="text-sm font-semibold text-pine">
            View decision details
          </Link>
        </div>
      </div>
    </article>
  );
}
