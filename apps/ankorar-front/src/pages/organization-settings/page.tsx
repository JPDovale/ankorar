import { Suspense } from "react";
import { OrganizationSettingsPageContent } from "./components/OrganizationSettingsPageContent";
import { OrganizationSettingsPageContentSkeleton } from "./components/OrganizationSettingsPageContentSkeleton";

export function OrganizationSettingsPage() {
  return (
    <Suspense fallback={<OrganizationSettingsPageContentSkeleton />}>
      <OrganizationSettingsPageContent />
    </Suspense>
  );
}
