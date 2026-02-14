import { LibrariesPageContent } from "@/pages/libraries/components/LibrariesPageContent";
import { LibrariesPageContentSkeleton } from "@/pages/libraries/components/LibrariesPageContentSkeleton";
import { Suspense } from "react";

export function LibrariesPage() {
  return (
    <Suspense fallback={<LibrariesPageContentSkeleton />}>
      <LibrariesPageContent />
    </Suspense>
  );
}
