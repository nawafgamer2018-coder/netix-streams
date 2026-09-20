import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import HeroBanner from "@/components/HeroBanner";
import MediaRow from "@/components/MediaRow";
import { fetchList, type MediaItem } from "@/lib/tmdb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Netix — Browse Movies & TV Shows" },
      {
        name: "description",
        content:
          "Netix is a personal streaming-style browser for movies and TV shows, with trending rows, search, and your own watchlist.",
      },
      {
        property: "og:title",
        content: "Netix — Browse Movies & TV Shows",
      },
      {
        property: "og:description",
        content:
          "Trending films, top-rated series, and a watchlist that lives in your browser.",
      },
    ],
  }),
  component: Home,
});

const ROWS: {
  key: string;
  title: string;
  path: string;
  params?: Record<string, string | number>;
  type: "movie" | "tv";
}[] = [
  {
    key: "trending",
    title: "Trending Now",
    path: "/trending/all/day",
    type: "movie",
  },
  {
    key: "pop-movie",
    title: "Popular Movies",
    path: "/movie/popular",
    type: "movie",
  },
  {
    key: "top-movie",
    title: "Top Rated Movies",
    path: "/movie/top_rated",
    type: "movie",
  },
  {
    key: "pop-tv",
    title: "Popular TV Shows",
    path: "/tv/popular",
    type: "tv",
  },
  {
    key: "top-tv",
    title: "Top Rated TV Shows",
    path: "/tv/top_rated",
    type: "tv",
  },
  {
    key: "action",
    title: "Action",
    path: "/discover/movie",
    params: {
      with_genres: 28,
      sort_by: "popularity.desc",
    },
    type: "movie",
  },
  {
    key: "comedy",
    title: "Comedy",
    path: "/discover/movie",
    params: {
      with_genres: 35,
      sort_by: "popularity.desc",
    },
    type: "movie",
  },
  {
    key: "scifi",
    title: "Sci-Fi",
    path: "/discover/movie",
    params: {
      with_genres: 878,
      sort_by: "popularity.desc",
    },
    type: "movie",
  },
];

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function Home() {
  const [heroItems, setHeroItems] = useState<MediaItem[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  const [rows, setRows] = useState<Record<string, MediaItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const trending = await fetchList(
        "/trending/all/week",
        {},
        "movie",
      );

      if (!alive) return;

      /*
       * Only use trending titles with usable backdrops.
       * We take the top 8 and shuffle them so the hero
       * feels different each time the Home page is opened.
       */
      const candidates = trending
        .filter((item) => item.backdrop_path)
        .slice(0, 8);

      const shuffled = shuffle(candidates);

      setHeroItems(shuffled);
      setHeroIndex(0);

      const results = await Promise.all(
        ROWS.map((row) =>
          fetchList(
            row.path,
            row.params ?? {},
            row.type,
          ),
        ),
      );

      if (!alive) return;

      const next: Record<string, MediaItem[]> = {};

      ROWS.forEach((row, index) => {
        next[row.key] = results[index] ?? [];
      });

      setRows(next);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  /*
   * Rotate the hero every 8 seconds.
   *
   * The timer only changes which already-loaded movie
   * is displayed. It does NOT make another TMDB request.
   */
  useEffect(() => {
    if (heroItems.length <= 1) return;

    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroItems.length);
    }, 8000);

    return () => {
      window.clearInterval(timer);
    };
  }, [heroItems.length]);

  const hero = heroItems[heroIndex] ?? null;

  const empty =
    !loading &&
    !hero &&
    Object.values(rows).every(
      (row) => row.length === 0,
    );

  if (empty) {
    return (
      <div className="px-4 pb-24 pt-32 md:px-8">
        <h1 className="font-display text-5xl text-primary">
          NETIX
        </h1>

        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          No catalog data could be loaded. Open Settings
          (top right) and add a TMDB API key to start
          browsing movies and TV shows.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <HeroBanner item={hero} />

      <div className="-mt-6 space-y-2">
        {ROWS.map((row) => (
          <MediaRow
            key={row.key}
            title={row.title}
            items={rows[row.key] ?? []}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}