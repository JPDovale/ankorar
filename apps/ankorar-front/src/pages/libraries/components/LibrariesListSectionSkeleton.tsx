import { Skeleton } from "@/components/ui/skeleton";

export function LibrariesListSectionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <article
          key={index}
          className="space-y-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-3"
        >
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-36 w-full rounded-xl border border-zinc-200/80 bg-white shadow-sm" />
            <Skeleton className="h-36 w-full rounded-xl border border-zinc-200/80 bg-white shadow-sm" />
            <Skeleton className="h-36 w-full rounded-xl border border-zinc-200/80 bg-white shadow-sm" />
          </div>
        </article>
      ))}
    </div>
  );
}
