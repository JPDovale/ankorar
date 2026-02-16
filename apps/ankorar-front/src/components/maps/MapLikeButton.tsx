import { useMapLike } from "@/hooks/useMapLike";
import { Heart } from "lucide-react";

interface MapLikeButtonProps {
  mapId: string;
  likesCount: number;
  likedByMe: boolean;
  "aria-label"?: string;
}

export function MapLikeButton({
  mapId,
  likesCount,
  likedByMe,
  "aria-label": ariaLabel,
}: MapLikeButtonProps) {
  const { likesCount: count, likedByMe: liked, isPending, toggle } = useMapLike({
    mapId,
    initialLikesCount: likesCount,
    initialLikedByMe: likedByMe,
  });

  const label =
    ariaLabel ??
    (liked ? "Desmarcar gostei" : "Marcar como gostei");

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        aria-label={label}
        aria-busy={isPending}
        data-liked={liked}
        disabled={isPending}
        onClick={toggle}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:pointer-events-none disabled:opacity-50 data-[liked=true]:text-red-500 data-[liked=true]:hover:bg-red-50 data-[liked=true]:hover:text-red-600"
      >
        <Heart
          className="size-4 shrink-0"
          fill={liked ? "currentColor" : "none"}
          aria-hidden
        />
      </button>
      <span
        className="min-w-[1.25rem] text-left text-xs tabular-nums text-zinc-600"
        aria-hidden
      >
        {count}
      </span>
    </div>
  );
}
