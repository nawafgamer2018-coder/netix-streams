import { useEffect, useState } from "react";
import { img, tmdb } from "@/lib/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import PlayerSlot from "./PlayerSlot";
import { cn } from "@/lib/utils";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string | null;
}

export default function SeasonSelector({
  tmdbId,
  seasons,
  showTitle,
}: {
  tmdbId: string;
  seasons: { season_number: number; name: string }[];
  showTitle: string;
}) {
  const first = seasons.find((s) => s.season_number > 0) ?? seasons[0];
  const [active, setActive] = useState<number>(first?.season_number ?? 1);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [openEpisode, setOpenEpisode] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setEpisodes(null);
    tmdb<{ episodes: Episode[] }>(`/tv/${tmdbId}/season/${active}`)
      .then((d) => alive && setEpisodes(d.episodes ?? []))
      .catch(() => alive && setEpisodes([]));
    return () => {
      alive = false;
    };
  }, [tmdbId, active]);

  if (!seasons.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl md:text-3xl">Episodes</h2>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {seasons.map((s) => (
          <button
            key={s.season_number}
            type="button"
            onClick={() => {
              setActive(s.season_number);
              setOpenEpisode(null);
            }}
            className={cn(
              "shrink-0 rounded-full border border-border px-4 py-1.5 text-sm transition-colors",
              active === s.season_number
                ? "bg-primary text-primary-foreground"
                : "bg-surface-2 hover:bg-accent",
            )}
          >
            {s.name || `Season ${s.season_number}`}
          </button>
        ))}
      </div>

      {episodes === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No episodes found for this season.</p>
      ) : (
        <ul className="space-y-3">
          {episodes.map((ep) => {
            const still = img(ep.still_path, "w300");
            const isOpen = openEpisode === ep.episode_number;
            return (
              <li key={ep.id} className="rounded-xl border border-border bg-surface p-3">
                <button
                  type="button"
                  onClick={() => setOpenEpisode(isOpen ? null : ep.episode_number)}
                  className="grid w-full grid-cols-[minmax(0,1fr)] gap-3 text-left sm:grid-cols-[10rem_minmax(0,1fr)]"
                >
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-surface-2">
                    {still ? (
                      <img
                        src={still}
                        alt={`${ep.name} thumbnail`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{ep.overview}</p>
                    <p className="mt-2 text-xs text-primary">
                      {isOpen ? "Hide player" : "Open player"}
                    </p>
                  </div>
                </button>
                {isOpen ? (
                  <div className="mt-3">
                    <PlayerSlot
                      mediaType="tv"
                      tmdbId={tmdbId}
                      season={active}
                      episode={ep.episode_number}
                      label={`${showTitle} S${active}E${ep.episode_number}`}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
