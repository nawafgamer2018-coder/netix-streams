import { createFileRoute } from "@tanstack/react-router";
import {
  Search as SearchIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import PosterCard from "@/components/PosterCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchList,
  type MediaItem,
} from "@/lib/tmdb";

export const Route = createFileRoute("/search")({
  validateSearch: (
    search: Record<string, unknown>,
  ) => ({
    q:
      typeof search["q"] === "string"
        ? search["q"]
        : "",
  }),

  head: () => ({
    meta: [
      { title: "Search — Netix" },
      {
        name: "description",
        content:
          "Search movies and TV shows across the Netix catalog.",
      },
    ],
  }),

  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [term, setTerm] = useState(q);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTerm(q);
  }, [q]);

  useEffect(() => {
    if (term === q) return;

    const timer = window.setTimeout(() => {
      navigate({
        search: {
          q: term,
        },
        replace: true,
      });
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [term, q, navigate]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let alive = true;

    setLoading(true);

    fetchList("/search/multi", {
      query: q,
      include_adult: "false",
    })
      .then((items) => {
        if (!alive) return;

        setResults(
          items.filter(
            (item) =>
              item.media_type !== "person",
          ),
        );
      })
      .catch(() => {
        if (!alive) return;
        setResults([]);
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [q]);

  const clearSearch = () => {
    setTerm("");

    navigate({
      search: {
        q: "",
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Search Header */}
      <section className="border-b border-white/[0.06] bg-background">
  <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
    <div className="mb-6 flex items-center justify-center gap-3">
      <div className="h-px w-8 bg-primary/50" />

      <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/45">
        Netix Search
      </span>

      <div className="h-px w-8 bg-primary/50" />
    </div>

    <div className="relative mx-auto max-w-3xl">
      <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-primary/10 opacity-50 blur-xl" />

      <div className="relative rounded-2xl border border-white/[0.10] bg-white/[0.045] p-1.5 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 focus-within:border-primary/30 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_30px_rgba(220,38,38,0.08)]">
        <div className="relative flex items-center">
          <SearchIcon className="pointer-events-none absolute left-5 h-5 w-5 text-white/40" />

          <Input
            autoFocus
            value={term}
            onChange={(event) =>
              setTerm(event.target.value)
            }
            placeholder="Search movies, series..."
            aria-label="Search query"
            className="h-14 border-0 bg-transparent pl-14 pr-14 text-base text-white shadow-none outline-none ring-0 placeholder:text-white/25 focus-visible:border-0 focus-visible:ring-0 md:h-16 md:text-[17px]"
          />

          {term ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 grid h-10 w-10 place-items-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/40 transition-all duration-200 hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  </div>
</section>

      <main className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">
        {loading ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map(
                (_, index) => (
                  <div key={index}>
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="mt-3 h-4 w-3/4" />
                    <Skeleton className="mt-2 h-3 w-1/3" />
                  </div>
                ),
              )}
            </div>
          </>
        ) : results.length ? (
          <>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Results for
                </p>

                <h2 className="mt-1 truncate text-lg font-semibold text-white">
                  {q}
                </h2>
              </div>

              <p className="shrink-0 text-sm text-white/40">
                {results.length}{" "}
                {results.length === 1
                  ? "result"
                  : "results"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((item) => (
                <div
                  key={`${item.media_type}-${item.id}`}
                >
                  <PosterCard item={item} />
                </div>
              ))}
            </div>
          </>
        ) : q ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="max-w-md text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg">
                <SearchIcon className="h-6 w-6 text-white/30" />
              </div>

              <h2 className="mt-5 font-display text-3xl text-white">
                No results
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Nothing matched{" "}
                <span className="text-white/70">
                  "{q}"
                </span>
                .
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <SearchIcon className="h-6 w-6 text-white/25" />
              </div>

              <p className="mt-5 text-sm text-white/35">
                Search for a movie or series
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}