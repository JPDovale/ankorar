import { MapLikeButton } from "@/components/maps/MapLikeButton";
import { buildMapLastActivityLabel } from "@/utils/buildMapLastActivityLabel";
import { CalendarClock, Heart, Map, Sparkles, UserPen } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

type MapPreviewCardVariant = "default" | "embedded";
type MapPreviewCardDensity = "regular" | "compact";

interface MapPreviewCardMap {
  id: string;
  title: string;
  created_at: string;
  updated_at: string | null;
  preview?: string | null;
  generated_by_ai?: boolean;
}

interface MapPreviewCardProps {
  map: MapPreviewCardMap;
  href: string;
  actionLabel: string;
  variant?: MapPreviewCardVariant;
  density?: MapPreviewCardDensity;
  headerAction?: ReactNode;
  showLike?: boolean;
  likesCount?: number;
  likedByMe?: boolean;
}

export function MapPreviewCard({
  map,
  href,
  actionLabel,
  variant = "default",
  density = "regular",
  headerAction,
  showLike = false,
  likesCount = 0,
  likedByMe = false,
}: MapPreviewCardProps) {
  const navigate = useNavigate();
  const mapLastActivityLabel = buildMapLastActivityLabel(map);
  const hasHumanIntervention =
    map.updated_at != null &&
    map.created_at != null &&
    new Date(map.updated_at).getTime() > new Date(map.created_at).getTime();
  const generatedByAi = map.generated_by_ai ?? false;
  const isAiOnly = generatedByAi && !hasHumanIntervention;
  const isAiWithHumanIntervention = generatedByAi && hasHumanIntervention;
  const canShowLike =
    showLike &&
    typeof likesCount === "number" &&
    typeof likedByMe === "boolean";
  const showLikesCountOnly =
    !canShowLike && typeof likesCount === "number";

  const handleCardClick = () => navigate(href);
  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <article
      role="link"
      tabIndex={0}
      data-variant={variant}
      data-density={density}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-zinc-200/60 transition-all duration-200 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)] hover:ring-zinc-200/80 data-[variant=embedded]:rounded-xl data-[variant=embedded]:bg-zinc-50/80 data-[variant=embedded]:shadow-none data-[variant=embedded]:ring-0 data-[variant=embedded]:hover:bg-zinc-100/80"
      aria-label={`${map.title}, ${actionLabel}`}
    >
      {/* Preview area — snapshot do mapa sobre o fundo antigo, ou só o fundo */}
      <div className="relative h-24 overflow-hidden group-data-[density=compact]:h-20">
        {/* Fundo antigo (sempre): gradiente + pontos */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/90 via-zinc-50 to-amber-50/70" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(161 161 170 / 0.4) 1px, transparent 0)`,
            backgroundSize: "12px 12px",
          }}
        />
        {map.preview && (
          <img
            src={map.preview}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute left-4 top-4 flex gap-1.5 group-data-[density=compact]:left-3 group-data-[density=compact]:top-3">
          <span className="size-2 rounded-full bg-violet-400/80 shadow-sm" />
          <span className="size-2 rounded-full bg-amber-400/80 shadow-sm" />
          <span className="size-2 rounded-full bg-emerald-400/70 shadow-sm" />
        </div>
        <div
          className="absolute right-3 top-3 flex items-center justify-center gap-1.5"
          title={
            isAiOnly
              ? "Gerado por IA"
              : isAiWithHumanIntervention
                ? "Gerado por IA e editado"
                : "Editado com intervenção humana"
          }
          aria-hidden
        >
          {(isAiOnly || isAiWithHumanIntervention) && (
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-zinc-200/50">
              <Sparkles className="size-3.5 text-zinc-500" />
            </span>
          )}
          {(hasHumanIntervention || !generatedByAi) && (
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-zinc-200/50">
              <UserPen className="size-3.5 text-zinc-500" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3.5 group-data-[density=compact]:gap-2.5 group-data-[density=compact]:p-3">
        <header className="min-w-0 space-y-1">
          <p className="truncate text-sm font-semibold text-zinc-900 group-data-[density=compact]:text-xs">
            {map.title}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 group-data-[density=compact]:text-[10px]">
            <CalendarClock className="size-3 shrink-0" aria-hidden />
            {mapLastActivityLabel}
          </span>
        </header>

        <footer className="flex items-center justify-between gap-2">
          <span
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-500 ring-1 ring-zinc-200/50 group-data-[variant=embedded]:bg-white/90"
            aria-hidden
          >
            <Map className="size-3.5 shrink-0" />
          </span>

          <div
            className="flex min-w-0 items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {canShowLike && (
              <MapLikeButton
                mapId={map.id}
                likesCount={likesCount}
                likedByMe={likedByMe}
                aria-label={likedByMe ? "Desmarcar gostei" : "Marcar como gostei"}
              />
            )}
            {showLikesCountOnly && (
              <span
                className="inline-flex items-center gap-1 text-xs text-zinc-500 tabular-nums"
                aria-label={`${likesCount} like${likesCount === 1 ? "" : "s"}`}
              >
                <Heart className="size-3.5 shrink-0" fill="none" aria-hidden />
                {likesCount}
              </span>
            )}
            {headerAction && (
              <div className="inline-flex shrink-0 items-center">
                {headerAction}
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
