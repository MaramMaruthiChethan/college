export default function CollegesLoading() {
  return (
    <div className="grid gap-6">
      <div className="h-48 animate-pulse rounded-[2rem] bg-white" />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-72 animate-pulse rounded-[2rem] bg-white" />
        <div className="grid gap-4">
          <div className="h-56 animate-pulse rounded-[2rem] bg-white" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-white" />
        </div>
      </div>
    </div>
  );
}
