import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Heart,
  Play,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

import MediaRow from "@/components/MediaRow";
import PlayerSlot from "@/components/PlayerSlot";
import SeasonSelector from "@/components/SeasonSelector";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  img,
  tmdb,
  type MediaItem,
} from "@/lib/tmdb";
import {
  isInList,
  toggleMyList,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/title/$mediaType/$tmdbId",
)({
  head: () => ({
    meta: [
      {
        title: "Title details — Netix",
      },
      {
        name: "description",
        content:
          "Cast, seasons, ratings and your own player source for this title on Netix.",
      },
      {
        property: "og:title",
        content: "Title details — Netix",
      },
      {
        property: "og:description",
        content:
          "Full details, episodes and player slot for this title on Netix.",
      },
    ],
  }),
  component: TitlePage,
});

interface Detail extends MediaItem {
  genres?: {
    id: number;
    name: string;
  }[];
  runtime?: number;
  number_of_seasons?: number;
  seasons?: {
    season_number: number;
    name: string;
  }[];
}

interface Cast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

function TitlePage() {
  const { mediaType, tmdbId } = Route.useParams();

  const type = mediaType === "tv" ? "tv" : "movie";

  const [detail, setDetail] =
    useState<Detail | null>(null);

  const [cast, setCast] = useState<Cast[]>([]);
  const [recs, setRecs] = useState<MediaItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;

    setDetail(null);
    setError(false);

    tmdb<Detail>(`/${type}/${tmdbId}`)
      .then((data) => {
        if (alive) {
          setDetail(data);
        }
      })
      .catch(() => {
        if (alive) {
          setError(true);
        }
      });

    tmdb<{ results: MediaItem[] }>(
      `/${type}/${tmdbId}/recommendations`,
    )
      .then((data) => {
        if (!alive) return;

        setRecs(
          (data.results ?? []).map((item) => ({
            ...item,
            media_type: type,
          })),
        );
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [type, tmdbId]);

  useEffect(() => {
    if (!detail) return;

    let alive = true;

    tmdb<{ cast: Cast[] }>(
      `/${type}/${tmdbId}/credits`,
    )
      .then((data) => {
        if (!alive) return;

        let castList = data.cast ?? [];

        /*
         * Keep the existing Spider-Man custom cast behavior.
         */
        const titleLower = (
          detail.title ??
          detail.name ??
          ""
        ).toLowerCase();

        if (
          titleLower.includes("spider-man") ||
          titleLower.includes("spiderman")
        ) {
          castList = [
            {
              id: 999001,
              name: "Nawaf Al-M",
              character: "Spider-Man / Hero",
              profile_path: "/nawaf.png",
            },
            ...castList,
          ];
        }

        setCast(castList.slice(0, 12));
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [type, tmdbId, detail]);

  useEffect(() => {
    const sync = () => {
      setSaved(
        isInList(Number(tmdbId), type),
      );
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
  }, [tmdbId, type]);

  if (error) {
    return (
      <div className="px-4 pb-24 pt-32 md:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl">
            Details unavailable
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            We couldn't load this title. Add a TMDB API
            key in Settings and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="pb-24">
        <div className="relative h-[65vh] min-h-[480px]">
          <Skeleton className="h-full w-full rounded-none" />

          <div className="absolute inset-x-0 bottom-0 px-4 pb-12 md:px-8">
            <Skeleton className="h-12 w-2/3 max-w-xl" />
            <Skeleton className="mt-4 h-5 w-80 max-w-full" />
            <Skeleton className="mt-4 h-20 w-full max-w-2xl" />
          </div>
        </div>

        <div className="px-4 pt-10 md:px-8">
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  const title =
    detail.title ??
    detail.name ??
    "Untitled";

  const year = (
    detail.release_date ??
    detail.first_air_date ??
    ""
  ).slice(0, 4);

  const backdrop = img(
    detail.backdrop_path,
    "original",
  );

  const poster = img(
    detail.poster_path,
    "w500",
  );

  const handleMyList = () => {
    toggleMyList({
      id: Number(tmdbId),
      mediaType: type,
      title,
      poster_path:
        detail.poster_path ?? null,
      vote_average: detail.vote_average,
      year,
    });
  };

  return (
    <div className="pb-24">
      {/* Cinematic hero */}
      <section className="relative min-h-[680px] w-full overflow-hidden md:min-h-[720px]">
        {backdrop ? (
          <img
            src={backdrop}
            alt={`${title} backdrop`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-2" />
        )}

        {/* Image treatment */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute left-4 top-24 z-20 md:left-8 md:top-28">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-white/10 bg-black/30 text-white/80 backdrop-blur-md hover:bg-white/10 hover:text-white"
          >
            <Link
              to="/"
              preload={false}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Hero content */}
        <div className="relative flex min-h-[680px] items-end md:min-h-[720px]">
          <div className="w-full px-5 pb-14 md:px-8 md:pb-20">
            <div className="mx-auto flex max-w-7xl items-end gap-8">
              {/* Poster */}
              <div className="hidden w-52 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface-2 shadow-2xl shadow-black/50 lg:block xl:w-60">
                {poster ? (
                  <img
                    src={poster}
                    alt={`${title} poster`}
                    className="aspect-[2/3] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-surface-2" />
                )}
              </div>

              {/* Information */}
              <div className="min-w-0 max-w-4xl">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]" />

                  {type === "tv"
                    ? "Series"
                    : "Film"}

                  <span className="text-white/30">
                    •
                  </span>

                  Netix
                </div>

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

                  {detail.vote_average ? (
                    <span className="flex items-center gap-1.5 font-medium text-white/90">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      {detail.vote_average.toFixed(1)}
                    </span>
                  ) : null}

                  {type === "movie" &&
                  detail.runtime ? (
                    <span className="text-white/70">
                      {detail.runtime} min
                    </span>
                  ) : null}

                  {type === "tv" &&
                  detail.number_of_seasons ? (
                    <span className="text-white/70">
                      {detail.number_of_seasons}{" "}
                      {detail.number_of_seasons === 1
                        ? "season"
                        : "seasons"}
                    </span>
                  ) : null}

                  <span className="rounded border border-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/65">
                    {type === "tv"
                      ? "TV"
                      : "Movie"}
                  </span>
                </div>

                {/* Genres */}
                {detail.genres?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detail.genres
                      .slice(0, 4)
                      .map((genre) => (
                        <span
                          key={genre.id}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] text-white/65 backdrop-blur-md"
                        >
                          {genre.name}
                        </span>
                      ))}
                  </div>
                ) : null}

                {/* Description */}
                {detail.overview ? (
                  <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
                    {detail.overview}
                  </p>
                ) : null}

                {/* Actions */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => {
                      const player = document.getElementById(
                        "netix-player",
                      );

                      player?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    className="h-11 rounded-md px-6 font-semibold shadow-lg shadow-black/30"
                  >
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    {type === "movie"
                      ? "Watch"
                      : "Episodes"}
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
                      <Heart className="mr-2 h-4 w-4" />
                    )}

                    {saved
                      ? "In My List"
                      : "My List"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 pt-10 md:px-8 md:pt-14">
        {/* Player / seasons */}
        {type === "movie" ? (
          <section
            id="netix-player"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-primary shadow-[0_0_14px_var(--color-primary)]" />

              <h2 className="font-display text-2xl tracking-wide md:text-3xl">
                Player
              </h2>
            </div>

            <PlayerSlot
              mediaType="movie"
              tmdbId={tmdbId}
              label={title}
            />
          </section>
        ) : (
          <section id="netix-player">
            <SeasonSelector
              tmdbId={tmdbId}
              showTitle={title}
              seasons={detail.seasons ?? []}
            />
          </section>
        )}

        {/* Cast */}
        {cast.length ? (
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-primary shadow-[0_0_14px_var(--color-primary)]" />

              <h2 className="font-display text-2xl tracking-wide md:text-3xl">
                Cast
              </h2>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-3">
              {cast.map((person) => {
                const profile =
                  person.profile_path
                    ?.startsWith("/") &&
                  !person.profile_path.startsWith(
                    "/http",
                  ) &&
                  !person.profile_path.startsWith(
                    "/t/p",
                  ) &&
                  person.id === 999001
                    ? person.profile_path
                    : img(
                        person.profile_path,
                        "w185",
                      );

                return (
                  <div
                    key={person.id}
                    className="group/cast w-32 shrink-0 text-center"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-surface-2 shadow-lg transition-transform duration-300 group-hover/cast:scale-[1.03]">
                      {profile ? (
                        <img
                          src={profile}
                          alt={person.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl font-bold text-muted-foreground">
                          {person.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <p className="mt-2 truncate text-xs font-semibold">
                      {person.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {person.character}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      {/* Recommendations */}
      <div className="mt-4">
        <MediaRow
          title="More Like This"
          items={recs}
        />
      </div>
    </div>
  );
}