import { useNavigate } from "react-router";
import type { PendingAiMap } from "@/pages/home/context/HomePendingAiMapContext";
import { CheckCircle2, LoaderCircle, Map, Sparkles } from "lucide-react";

interface HomePendingAiMapCardProps {
  pending: PendingAiMap;
}

export function HomePendingAiMapCard({ pending }: HomePendingAiMapCardProps) {
  const navigate = useNavigate();
  const isLoading = pending.status === "loading";
  const isFinished = pending.status === "finished";
  const href = isFinished ? `/maps/${pending.mapId}` : "#";
  const displayTitle =
    pending.title.trim().length > 0
      ? pending.title.slice(0, 80)
      : "Mapa gerado por IA";

  const handleClick = () => {
    if (isFinished) {
      navigate(href);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <article
      role={isFinished ? "link" : "status"}
      tabIndex={isFinished ? 0 : undefined}
      data-pending-ai
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="group relative overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-200/60 transition-all duration-200 data-[pending-ai]:ring-violet-200/70 data-[pending-ai]:ring-2 data-[pending-ai]:hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] data-[pending-ai]:hover:ring-violet-200/80"
      aria-label={
        isLoading
          ? "Gerando mapa com IA..."
          : `${displayTitle}, Finalizado. Abrir mapa.`
      }
      style={{ cursor: isFinished ? "pointer" : "default" }}
    >
      {/* Preview area — mesmo estilo do MapPreviewCard */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/90 via-zinc-50 to-amber-50/70" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(161 161 170 / 0.4) 1px, transparent 0)`,
            backgroundSize: "12px 12px",
          }}
        />
        <div className="absolute left-4 top-4 flex gap-1.5">
          <span className="size-2 rounded-full bg-violet-400/80 shadow-sm" />
          <span className="size-2 rounded-full bg-amber-400/80 shadow-sm" />
          <span className="size-2 rounded-full bg-emerald-400/70 shadow-sm" />
        </div>
        <div className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-zinc-200/50">
          {isLoading ? (
            <LoaderCircle
              className="size-3.5 text-violet-500 animate-spin"
              aria-hidden
            />
          ) : (
            <Sparkles className="size-3.5 text-violet-500" aria-hidden />
          )}
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <span className="text-xs font-medium text-zinc-600">
              Gerando mapa...
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-3.5">
        <header className="min-w-0 space-y-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {displayTitle}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
            {isLoading ? (
              <>
                <LoaderCircle className="size-3 shrink-0 animate-spin" aria-hidden />
                Gerando com IA...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3 shrink-0 text-emerald-500" aria-hidden />
                Finalizado
              </>
            )}
          </span>
        </header>

        <footer className="flex items-center justify-between gap-2">
          <span
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-500 ring-1 ring-zinc-200/50"
            aria-hidden
          >
            <Map className="size-3.5 shrink-0" />
          </span>
        </footer>
      </div>
    </article>
  );
}
