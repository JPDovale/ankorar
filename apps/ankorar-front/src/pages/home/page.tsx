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
        <Suspense fallback={<HomePageHeaderSkeleton />}>
          <HomePageHeader />
        </Suspense>

        <Suspense fallback={<HomeMapsSectionSkeleton />}>
          <HomeMapsSection />
        </Suspense>

        <Suspense fallback={<HomeOrganizationLibrariesSectionSkeleton />}>
          <HomeOrganizationLibrariesSection />
        </Suspense>
      </section>
    </HomePendingAiMapProvider>
  );
}
