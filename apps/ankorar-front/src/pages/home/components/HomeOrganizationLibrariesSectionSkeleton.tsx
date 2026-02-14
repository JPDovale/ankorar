import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeOrganizationLibrariesSectionSkeleton() {
  return (
    <Card className="border-zinc-200 bg-white">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-6 w-72" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
          <aside className="space-y-2 rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </aside>
          <section className="space-y-2 rounded-xl border border-zinc-200/80 p-4">
            <Skeleton className="h-5 w-48" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-lg" />
            ))}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
