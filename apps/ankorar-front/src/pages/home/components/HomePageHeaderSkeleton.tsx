import { Skeleton } from "@/components/ui/skeleton";

export function HomePageHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-10 w-56 rounded-full" />
      </div>
    </header>
  );
}
