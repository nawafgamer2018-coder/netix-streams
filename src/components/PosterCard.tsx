import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";

import {
  img,
  titleOf,
  typeOf,
  yearOf,
  type MediaItem,
} from "@/lib/tmdb";
import { isInList, toggleMyList } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function PosterCard({
  item,
  className,
}: {
  item: MediaItem;
  className?: string;
}) {
  const mediaType = typeOf(item);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSaved(isInList(item.id, mediaType));
    };

    sync();

    window.addEventListener(
      "netix-list-change",
      sync,
    );

    return () => {
      window.removeEventListener(
        "netix-list-change",
        sync,
      );
    };
  }, [item.id, mediaType]);

  const poster = img(item.poster_path, "w342");
  const year = yearOf(item);
  const title = titleOf(item);

  return (
    <div
      className={cn(
        "group relative min-w-0",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "lg:group-hover:-translate-y-1",
        className,
      )}
    >
      <Link
        to="/title/$mediaType/$tmdbId"
        params={{
          mediaType,
          tmdbId: String(item.id),
        }}
        preload={false}
        className={cn(
          "relative block overflow-hidden rounded-xl bg-surface-2",
          "shadow-lg shadow-black/20",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:shadow-2xl group-hover:shadow-black/50",
          "group-focus-visible:ring-2 group-focus-visible:ring-primary/70",
          "group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background",
          "active:scale-[0.985]",
        )}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={`${title} poster`}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover",
                "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:scale-[1.055]",
                "group-hover:brightness-[1.06]",
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-2 p-3 text-center text-xs text-muted-foreground">
              {title}
            </div>
          )}

          {/* Cinematic hover gradient */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0",
              "bg-gradient-to-t from-black/65 via-black/10 to-transparent",
              "opacity-0 transition-opacity duration-400",
              "group-hover:opacity-100",
            )}
          />

          {/* Soft edge highlight */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-xl",
              "ring-1 ring-inset ring-white/0",
              "transition-all duration-300",
              "group-hover:ring-white/[0.12]",
            )}
          />

          {/* Media type indicator */}
          <div
            className={cn(
              "pointer-events-none absolute bottom-3 left-3",
              "rounded-md border border-white/[0.08]",
              "bg-black/55 px-2 py-1",
              "text-[9px] font-medium uppercase tracking-[0.14em]",
              "text-white/70 opacity-0 backdrop-blur-md",
              "translate-y-1",
              "transition-all duration-300 ease-out",
              "group-hover:translate-y-0 group-hover:opacity-100",
            )}
          >
            {mediaType === "tv" ? "Series" : "Movie"}
          </div>
        </div>
      </Link>

      {/* My List */}
      <button
        type="button"
        aria-label={
          saved
            ? "Remove from My List"
            : "Add to My List"
        }
        onClick={() => {
          toggleMyList({
            id: item.id,
            mediaType,
            title,
            poster_path:
              item.poster_path ?? null,
            vote_average: item.vote_average,
            year,
          });
        }}
        className={cn(
          "absolute right-2.5 top-2.5 z-10",
          "grid h-9 w-9 place-items-center",
          "rounded-xl border border-white/[0.08]",
          "bg-black/60 text-white/60",
          "shadow-lg backdrop-blur-md",
          "opacity-0 scale-90",
          "transition-all duration-250 ease-out",
          "hover:bg-black/80 hover:text-white",
          "hover:scale-105",
          "active:scale-90",
          "focus-visible:scale-100 focus-visible:opacity-100",
          "group-hover:scale-100 group-hover:opacity-100",
          saved &&
            "opacity-100 scale-100 text-primary",
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-all duration-200",
            saved
              ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(229,9,20,0.45)]"
              : "text-white/80",
            saved && "scale-110",
          )}
        />
      </button>

      {/* Metadata */}
      <div
        className={cn(
          "mt-3 min-w-0",
          "transition-transform duration-300 ease-out",
          "lg:group-hover:translate-y-[-1px]",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-medium text-white/90 transition-colors duration-200 group-hover:text-white">
            {title}
          </p>

          {item.vote_average ? (
            <span className="flex shrink-0 items-center gap-1 text-xs text-white/40 transition-colors duration-200 group-hover:text-white/55">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {item.vote_average.toFixed(1)}
            </span>
          ) : null}
        </div>

        {year ? (
          <p className="mt-0.5 text-xs text-white/35 transition-colors duration-200 group-hover:text-white/45">
            {year}
          </p>
        ) : null}
      </div>
    </div>
  );
}