import { Suspense } from "react";
import { UserSettingsPageContent } from "./components/UserSettingsPageContent";
import { UserSettingsPageContentSkeleton } from "./components/UserSettingsPageContentSkeleton";

export function UserSettingsPage() {
  return (
    <Suspense fallback={<UserSettingsPageContentSkeleton />}>
      <UserSettingsPageContent />
    </Suspense>
  );
}
