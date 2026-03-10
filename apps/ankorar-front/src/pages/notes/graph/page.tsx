import { Can } from "@/components/auth/Can";
import { Suspense } from "react";
import { NotesGraphSkeleton } from "./components/NotesGraphSkeleton";
import { NotesGraphContent } from "./components/NotesGraphContent";

export function NotesGraphPage() {
  return (
    <Can feature="read:note">
      <div className="absolute inset-x-0 bottom-0 top-16">
        <Suspense fallback={<NotesGraphSkeleton />}>
          <NotesGraphContent />
        </Suspense>
      </div>
    </Can>
  );
}
