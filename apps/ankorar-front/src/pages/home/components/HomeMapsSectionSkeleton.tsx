import { Skeleton } from "@/components/ui/skeleton";

export function HomeMapsSectionSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <article key={index} className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <div className="flex justify-center py-2">
              <Skeleton className="size-16 rounded-2xl" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </article>
      ))}
    </div>
  );
}
