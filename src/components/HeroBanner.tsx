import { Link } from "@tanstack/react-router";
import {
  Check,
  Info,
  Play,
  Plus,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  img,
  titleOf,
  typeOf,
  yearOf,
  type MediaItem,
} from "@/lib/tmdb";
import { isInList, toggleMyList } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function HeroBanner({
  item,
}: {
  item?: MediaItem | null;
}) {
  const [saved, setSaved] = useState(false);

  const mediaType = item ? typeOf(item) : "movie";

  useEffect(() => {
    if (!item) return;

    const sync = () => {
      setSaved(isInList(item.id, mediaType));
    };

    sync();

    window.addEventListener("netix-list-change", sync);

    return () => {
      window.removeEventListener("netix-list-change", sync);
    };
  }, [item, mediaType]);

  if (!item) {
    return (
      <div className="relative h-[68vh] min-h-[480px] w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    );
  }

  const backdrop = img(
    item.backdrop_path ?? item.poster_path,
    "original",
  );

  const title = titleOf(item);
  const year = yearOf(item);

  const handleMyList = () => {
    toggleMyList({
      id: item.id,
      mediaType,
      title,
      poster_path: item.poster_path ?? null,
      vote_average: item.vote_average,
      year,
    });
  };

  return (
    <section className="group/hero relative h-[72vh] min-h-[540px] w-full overflow-hidden bg-background md:h-[78vh]">
      {/* Backdrop */}
      {backdrop ? (
        <img
          src={backdrop}
          alt={`${title} backdrop`}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[12000ms] ease-out group-hover/hero:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-2" />
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative flex h-full items-end">
        <div className="w-full px-5 pb-16 md:px-8 md:pb-24 lg:pb-28">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />
              {mediaType === "tv" ? "Series" : "Film"}
              <span className="text-white/35">•</span>
              Trending this week
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl leading-[0.9] tracking-wide text-white drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl">
              {title}
            </h1>

            {/* Metadata */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {year ? (
                <span className="font-medium text-white/85">
                  {year}
                </span>
              ) : null}

              {item.vote_average ? (
                <span className="flex items-center gap-1.5 font-medium text-white/90">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {item.vote_average.toFixed(1)}
                </span>
              ) : null}

              <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {mediaType === "tv" ? "TV" : "Movie"}
              </span>
            </div>

            {/* Description */}
            {item.overview ? (
              <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                {item.overview}
              </p>
            ) : null}

            {/* Actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 rounded-md px-6 font-semibold shadow-lg shadow-black/20"
              >
                <Link
                  to="/title/$mediaType/$tmdbId"
                  params={{
                    mediaType,
                    tmdbId: String(item.id),
                  }}
                  preload={false}
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  View Details
                </Link>
              </Button>

              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={handleMyList}
                className={cn(
                  "h-11 rounded-md border border-white/10 bg-white/10 px-5 text-white backdrop-blur-md hover:bg-white/20",
                  saved && "bg-white/15",
                )}
              >
                {saved ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {saved ? "In My List" : "My List"}
              </Button>

              <Button
                asChild
                size="icon"
                variant="ghost"
                className="h-11 w-11 border border-white/10 bg-black/20 text-white/80 backdrop-blur-md hover:bg-white/10 hover:text-white"
                aria-label={`More information about ${title}`}
              >
                <Link
                  to="/title/$mediaType/$tmdbId"
                  params={{
                    mediaType,
                    tmdbId: String(item.id),
                  }}
                  preload={false}
                >
                  <Info className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom cinematic fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}