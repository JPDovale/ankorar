import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationSettingsPageContentSkeleton() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72" />
      </header>

      <div className="space-y-10">
        <section>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mt-4 max-w-md space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
            <div className="border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5">
              <div className="flex gap-16">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="hidden h-3 w-14 sm:block" />
                <Skeleton className="hidden h-3 w-16 md:block" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="divide-y divide-zinc-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-16 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-16 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
            <div className="border-b border-zinc-200 bg-zinc-50/80 px-4 py-2.5">
              <div className="flex gap-16">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="hidden h-3 w-12 sm:block" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="divide-y divide-zinc-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-20 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-20 rounded-lg" />
                  <Skeleton className="h-7 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
