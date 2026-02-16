import { MapPreviewCard } from "@/components/maps/MapPreviewCard";
import type { LibraryMapPreview } from "@/services/libraries/listLibrariesRequest";
import { Link2 } from "lucide-react";

type LibraryMapsMosaicVariant = "default" | "embedded";

interface LibraryMapsMosaicProps {
  maps: LibraryMapPreview[];
  emptyText: string;
  getMapHref: (map: LibraryMapPreview) => string;
  getMapActionLabel: (map: LibraryMapPreview) => string;
  variant?: LibraryMapsMosaicVariant;
  getCanShowLike?: (map: LibraryMapPreview) => boolean;
}

export function LibraryMapsMosaic({
  maps,
  emptyText,
  getMapHref,
  getMapActionLabel,
  variant = "default",
  getCanShowLike,
}: LibraryMapsMosaicProps) {
  const hasMaps = maps.length > 0;
  const isEmbedded = variant === "embedded";
  const emptyContainerClassName = isEmbedded
    ? "inline-flex items-center gap-1.5 rounded-md bg-zinc-100/70 px-2.5 py-1.5 text-xs text-zinc-500"
    : "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-200/80 bg-zinc-50/60 px-3 py-2 text-xs text-zinc-500";

  return (
    <>
      {!hasMaps && (
        <div className={emptyContainerClassName}>
          <Link2 className="size-3.5" />
          {emptyText}
        </div>
      )}

      {hasMaps && (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {maps.map((map) => (
            <MapPreviewCard
              key={map.id}
              map={map}
              href={getMapHref(map)}
              actionLabel={getMapActionLabel(map)}
              variant={variant}
              density="compact"
              showLike={getCanShowLike?.(map) ?? false}
              likesCount={map.likes_count}
              likedByMe={map.liked_by_me}
            />
          ))}
        </div>
      )}
    </>
  );
}
