import { LibrariesListSectionSkeleton } from "@/pages/libraries/components/LibrariesListSectionSkeleton";
import { LibrariesPageHeaderSkeleton } from "@/pages/libraries/components/LibrariesPageHeaderSkeleton";

export function LibrariesPageContentSkeleton() {
  return (
    <section className="space-y-6">
      <LibrariesPageHeaderSkeleton />
      <LibrariesListSectionSkeleton />
    </section>
  );
}
