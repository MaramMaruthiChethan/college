import clsx from "clsx";

export function MetricPill({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-3xl border px-4 py-3",
        highlight ? "border-pine bg-moss text-pine" : "border-line bg-white text-ink"
      )}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-current/65">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}
