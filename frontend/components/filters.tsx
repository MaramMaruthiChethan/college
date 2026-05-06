"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, type Dispatch, type SetStateAction } from "react";

interface FiltersProps {
  cityOptions: string[];
  courseOptions: string[];
}

export function Filters({ cityOptions, courseOptions }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedCities, setSelectedCities] = useState<string[]>(searchParams.getAll("city"));
  const [selectedCourses, setSelectedCourses] = useState<string[]>(searchParams.getAll("course"));
  const [maxFees, setMaxFees] = useState(searchParams.get("max_fees") ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") ?? "");

  function updateSelection(
    setter: Dispatch<SetStateAction<string[]>>,
    value: string
  ) {
    setter((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
    );
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("city");
    params.delete("course");
    params.delete("page");

    selectedCities.forEach((city) => params.append("city", city));
    selectedCourses.forEach((course) => params.append("course", course));

    if (maxFees) {
      params.set("max_fees", maxFees);
    } else {
      params.delete("max_fees");
    }

    if (minRating) {
      params.set("min_rating", minRating);
    } else {
      params.delete("min_rating");
    }

    startTransition(() => {
      router.push(`/colleges?${params.toString()}`);
    });
  }

  return (
    <aside className="rounded-[2rem] border border-line bg-white p-6 shadow-card">
      <h2 className="font-display text-xl font-semibold text-ink">Filters</h2>

      <div className="mt-6">
        <p className="text-sm font-semibold text-ink">Cities</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {cityOptions.map((city) => {
            const active = selectedCities.includes(city);
            return (
              <button
                key={city}
                type="button"
                onClick={() => updateSelection(setSelectedCities, city)}
                className={`rounded-full px-3 py-2 text-sm ${
                  active ? "bg-pine text-white" : "bg-field text-ink"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-ink">Courses</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {courseOptions.map((course) => {
            const active = selectedCourses.includes(course);
            return (
              <button
                key={course}
                type="button"
                onClick={() => updateSelection(setSelectedCourses, course)}
                className={`rounded-full px-3 py-2 text-sm ${
                  active ? "bg-amber text-white" : "bg-field text-ink"
                }`}
              >
                {course}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Max fees
          <input
            value={maxFees}
            onChange={(event) => setMaxFees(event.target.value)}
            placeholder="e.g. 250000"
            className="rounded-2xl border border-line px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Minimum rating
          <input
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
            placeholder="e.g. 4.2"
            className="rounded-2xl border border-line px-4 py-3 outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={applyFilters}
        disabled={isPending}
        className="mt-6 w-full rounded-2xl bg-pine px-4 py-3 text-sm font-semibold text-white"
      >
        {isPending ? "Applying..." : "Apply filters"}
      </button>
    </aside>
  );
}
