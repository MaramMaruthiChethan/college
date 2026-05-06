"use client";

import { useCompare } from "./compare-provider";

export function CompareToggle({ collegeId }: { collegeId: number }) {
  const { isSelected, toggleCompare } = useCompare();
  const checked = isSelected(collegeId);

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => toggleCompare(collegeId)}
        className="h-4 w-4 rounded border-line text-pine focus:ring-pine"
      />
      Compare
    </label>
  );
}
