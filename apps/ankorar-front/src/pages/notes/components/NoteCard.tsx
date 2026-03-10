import type { NotePreview } from "@/services/notes/listNotesRequest";
import { buildMapLastActivityLabel } from "@/utils/buildMapLastActivityLabel";
import { CalendarClock, FileText, Heart } from "lucide-react";
import { useNavigate } from "react-router";

interface NoteCardProps {
  note: NotePreview;
}

export function NoteCard({ note }: NoteCardProps) {
  const navigate = useNavigate();
  const lastActivityLabel = buildMapLastActivityLabel(note);

  const handleCardClick = () => navigate(`/editor/${note.id}`);
  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/editor/${note.id}`);
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-200/60 transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:ring-zinc-200/80 dark:bg-navy-900 dark:ring-navy-700/70 dark:hover:ring-navy-600"
      aria-label={`${note.title}, Abrir nota`}
    >
      <div className="relative overflow-hidden p-4">
        <div className="absolute left-4 top-4 flex gap-1.5">
          <span className="size-2 rounded-full bg-violet-400/80 shadow-sm" />
          <span className="size-2 rounded-full bg-amber-400/80 shadow-sm" />
          <span className="size-2 rounded-full bg-emerald-400/70 shadow-sm" />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3.5">
        <header className="min-w-0 space-y-1">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-navy-100">
            {note.title}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-navy-300">
            <CalendarClock className="size-3 shrink-0" aria-hidden />
            {lastActivityLabel}
          </span>
        </header>

        <footer className="flex items-center justify-between gap-2">
          <span
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-500 ring-1 ring-zinc-200/50 dark:bg-navy-800/80 dark:text-navy-300 dark:ring-navy-700/60"
            aria-hidden
          >
            <FileText className="size-3.5 shrink-0" />
          </span>

          {note.likes_count > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-navy-300 tabular-nums"
              aria-label={`${note.likes_count} like${note.likes_count === 1 ? "" : "s"}`}
            >
              <Heart className="size-3.5 shrink-0" fill="none" aria-hidden />
              {note.likes_count}
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}
