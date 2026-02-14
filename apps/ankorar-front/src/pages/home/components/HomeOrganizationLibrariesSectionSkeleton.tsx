import { Skeleton } from "@/components/ui/skeleton";

export function HomeOrganizationLibrariesSectionSkeleton() {
  return (
    <section className="space-y-3">
      <header className="space-y-1">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-4 w-80" />
      </header>

      <Skeleton className="h-4 w-64" />

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="space-y-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 px-3.5 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-36 w-full rounded-xl border border-zinc-200/80 bg-white shadow-sm" />
              <Skeleton className="h-36 w-full rounded-xl border border-zinc-200/80 bg-white shadow-sm" />
              <Skeleton className="h-36 w-full rounded-xl border border-zinc-200/80 bg-white shadow-sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
