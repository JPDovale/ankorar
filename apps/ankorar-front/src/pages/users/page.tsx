import { Suspense } from "react";
import { UsersPageContent } from "./components/UsersPageContent";
import { UsersPageContentSkeleton } from "./components/UsersPageContentSkeleton";

export function UsersPage() {
  return (
    <Suspense fallback={<UsersPageContentSkeleton />}>
      <UsersPageContent />
    </Suspense>
  );
}
