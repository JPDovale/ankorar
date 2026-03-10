import { Skeleton } from "@/components/ui/skeleton";

export function NotesPageHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex sm:items-center sm:justify-end">
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </header>
  );
}
