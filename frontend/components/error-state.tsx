export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-amber/30 bg-white p-8 text-center shadow-card">
      <h2 className="font-display text-2xl font-semibold text-ink">Something went wrong</h2>
      <p className="mt-3 text-sm text-ink/65">{message}</p>
    </div>
  );
}
