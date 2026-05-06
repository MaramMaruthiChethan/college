export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-line bg-white p-10 text-center">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-ink/65">{description}</p>
    </div>
  );
}
