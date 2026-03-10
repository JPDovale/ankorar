import { Can } from "@/components/auth/Can";
import { NotesPageHeader } from "@/pages/notes/components/NotesPageHeader";
import { NotesPageHeaderSkeleton } from "@/pages/notes/components/NotesPageHeaderSkeleton";
import { NotesSection } from "@/pages/notes/components/NotesSection";
import { NotesSectionSkeleton } from "@/pages/notes/components/NotesSectionSkeleton";
import { Suspense } from "react";

export function NotesPage() {
  return (
    <section className="space-y-6">
      <Can feature="read:note">
        <Suspense fallback={<NotesPageHeaderSkeleton />}>
          <NotesPageHeader />
        </Suspense>

        <Suspense fallback={<NotesSectionSkeleton />}>
          <NotesSection />
        </Suspense>
      </Can>
    </section>
  );
}
