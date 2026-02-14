import { buildMapLastActivityLabel } from "@/utils/buildMapLastActivityLabel";
import { ArrowUpRight, CalendarClock, Map, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

type MapPreviewCardVariant = "default" | "embedded";
type MapPreviewCardDensity = "regular" | "compact";

interface MapPreviewCardMap {
  id: string;
  title: string;
  created_at: string;
  updated_at: string | null;
}

interface MapPreviewCardProps {
  map: MapPreviewCardMap;
  href: string;
  actionLabel: string;
  variant?: MapPreviewCardVariant;
  density?: MapPreviewCardDensity;
  headerAction?: ReactNode;
}

export function MapPreviewCard({
  map,
  href,
  actionLabel,
  variant = "default",
  density = "regular",
  headerAction,
}: MapPreviewCardProps) {
  const mapLastActivityLabel = buildMapLastActivityLabel(map);

  return (
    <article
      data-variant={variant}
      data-density={density}
      className="group overflow-hidden rounded-xl border border-zinc-200/80 bg-white transition-colors hover:border-zinc-300/80 data-[variant=embedded]:rounded-lg data-[variant=embedded]:border-transparent data-[variant=embedded]:bg-zinc-100/70 data-[variant=embedded]:hover:bg-zinc-100"
    >
      <div className="relative h-28 bg-gradient-to-br from-zinc-100 to-zinc-200/80 group-data-[density=compact]:h-24 group-data-[variant=embedded]:bg-zinc-100/90">
        <span className="pointer-events-none absolute left-3 top-3 size-4 rounded-[4px] border border-zinc-300/90 bg-white/90" />
        <span className="pointer-events-none absolute right-3 top-3 inline-flex size-5 items-center justify-center rounded-full bg-white/85 text-zinc-500">
          <Sparkles className="size-3 shrink-0" />
        </span>

        <div className="pointer-events-none absolute inset-x-3 bottom-4 space-y-1.5 group-data-[density=compact]:bottom-3">
          <span className="block h-2.5 w-20 rounded-full bg-white/90 group-data-[density=compact]:w-16" />
          <span className="block h-2.5 w-28 rounded-full bg-zinc-900/80 group-data-[density=compact]:w-24" />
          <span className="block h-2.5 w-24 rounded-full bg-white/90 group-data-[density=compact]:w-20" />
        </div>
      </div>

      <div className="space-y-2 p-3.5 group-data-[density=compact]:p-3">
        <header className="space-y-0.5">
          <p className="truncate text-sm font-semibold text-zinc-900 group-data-[density=compact]:text-xs">
            {map.title}
          </p>

          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 group-data-[density=compact]:text-[10px]">
            <CalendarClock className="size-3.5 shrink-0" />
            {mapLastActivityLabel}
          </span>
        </header>

        <footer className="flex items-center justify-between pt-1">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 group-data-[variant=embedded]:bg-white/80">
            <Map className="size-3.5 shrink-0" />
          </span>

          <div className="flex items-center gap-1.5">
            <Link
              to={href}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
            >
              {actionLabel}
              <ArrowUpRight className="size-3.5 shrink-0" />
            </Link>

            {headerAction && (
              <div className="inline-flex shrink-0 items-center">{headerAction}</div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
