import { Suspense } from "react";
import { UserDetailContent } from "./components/UserDetailContent";
import { UserDetailContentSkeleton } from "./components/UserDetailContentSkeleton";

export function UserDetailPage() {
  return (
    <Suspense fallback={<UserDetailContentSkeleton />}>
      <UserDetailContent />
    </Suspense>
  );
}
