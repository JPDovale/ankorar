import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { LibraryPreview } from "@/services/libraries/listLibrariesRequest";
import { buildLibraryLastActivityLabel } from "@/utils/buildLibraryLastActivityLabel";
import { CalendarClock, LibraryBig } from "lucide-react";

interface LibraryCardProps {
  library: LibraryPreview;
}

export function LibraryCard({ library }: LibraryCardProps) {
  const libraryLastActivityLabel = buildLibraryLastActivityLabel(library);

  return (
    <Card className="rounded-xl border border-zinc-200/80 bg-white shadow-sm transition-colors hover:border-zinc-300/80">
      <CardHeader className="space-y-3 p-4 pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Biblioteca
        </p>

        <div className="flex items-center justify-center py-2">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-600">
            <LibraryBig className="size-7" />
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="border-t border-zinc-100 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
            <CalendarClock className="size-3.5 shrink-0" />
            {libraryLastActivityLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
