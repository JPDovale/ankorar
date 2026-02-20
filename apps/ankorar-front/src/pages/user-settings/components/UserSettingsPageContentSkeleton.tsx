import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function UserSettingsPageContentSkeleton() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </header>

      <div className="space-y-10">
        <section>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="mt-4 max-w-md space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </section>

        <Separator />

        <section>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="mt-4 max-w-md space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </section>
      </div>
    </section>
  );
}
