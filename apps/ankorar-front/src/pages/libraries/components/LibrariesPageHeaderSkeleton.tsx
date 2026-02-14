import { Skeleton } from "@/components/ui/skeleton";

export function LibrariesPageHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-56 rounded-lg" />
    </header>
  );
}
