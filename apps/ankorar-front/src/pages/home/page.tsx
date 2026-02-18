import { Can } from "@/components/auth/Can";
import { HomeMapsSection } from "@/pages/home/components/HomeMapsSection";
import { HomeMapsSectionSkeleton } from "@/pages/home/components/HomeMapsSectionSkeleton";
import { HomeOrganizationLibrariesSection } from "@/pages/home/components/HomeOrganizationLibrariesSection";
import { HomeOrganizationLibrariesSectionSkeleton } from "@/pages/home/components/HomeOrganizationLibrariesSectionSkeleton";
import { HomePageHeader } from "@/pages/home/components/HomePageHeader";
import { HomePageHeaderSkeleton } from "@/pages/home/components/HomePageHeaderSkeleton";
import { HomePendingAiMapProvider } from "@/pages/home/context/HomePendingAiMapContext";
import { Suspense } from "react";

export function HomePage() {
  return (
    <HomePendingAiMapProvider>
      <section className="space-y-6">
        <Can feature="read:map">
          <Suspense fallback={<HomePageHeaderSkeleton />}>
            <HomePageHeader />
          </Suspense>

          <Suspense fallback={<HomeMapsSectionSkeleton />}>
            <HomeMapsSection />
          </Suspense>
        </Can>

        <Can feature="read:library">
          <Suspense fallback={<HomeOrganizationLibrariesSectionSkeleton />}>
            <HomeOrganizationLibrariesSection />
          </Suspense>
        </Can>
      </section>
    </HomePendingAiMapProvider>
  );
}
