import { Skeleton } from "@/components/ui/skeleton";

export function UsersPageContentSkeleton() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </header>
      <div className="space-y-4">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 bg-zinc-50/80 px-4 py-3">
            <div className="flex gap-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-zinc-100 px-4 py-3 last:border-b-0"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
