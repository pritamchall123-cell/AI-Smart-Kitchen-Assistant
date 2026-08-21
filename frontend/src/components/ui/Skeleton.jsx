function Skeleton({
  className = "",
}) {
  return (
    <div
      className={`
        animate-pulse
        rounded-lg
        bg-stone-200
        ${className}
      `}
    />
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <Skeleton className="h-52 w-full rounded-none" />

      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />

        <Skeleton className="h-6 w-3/4" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex gap-3 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;