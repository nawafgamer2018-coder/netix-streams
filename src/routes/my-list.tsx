import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getMyList,
  toggleMyList,
  type ListItem,
} from "@/lib/storage";
import { img } from "@/lib/tmdb";

export const Route = createFileRoute("/my-list")({
  head: () => ({
    meta: [
      { title: "My List — Netix" },
      {
        name: "description",
        content:
          "Your saved movies and TV shows on Netix, stored right in your browser.",
      },
      {
        property: "og:title",
        content: "My List — Netix",
      },
      {
        property: "og:description",
        content:
          "Everything you saved to watch later on Netix.",
      },
    ],
  }),

  component: MyList,
});

function MyList() {
  const [items, setItems] = useState<ListItem[]>([]);

  useEffect(() => {
    const sync = () => {
      setItems(getMyList());
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
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <section className="border-b border-white/[0.06] bg-background">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-px w-7 bg-primary/60" />

                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Your Collection
                </span>
              </div>

              <h1 className="font-display text-4xl tracking-wide text-white md:text-5xl">
                My List
              </h1>

              {items.length > 0 ? (
                <p className="mt-2 text-sm text-white/35">
                  {items.length}{" "}
                  {items.length === 1
                    ? "title"
                    : "titles"}{" "}
                  saved
                </p>
              ) : null}
            </div>

            {items.length > 0 ? (
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-xs text-white/40 sm:flex">
                <Heart className="h-3.5 w-3.5 fill-primary/60 text-primary/70" />
                Saved for later
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pt-8 md:px-8 md:pt-10">
        {items.length === 0 ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.035] shadow-2xl shadow-black/20">
                <Heart className="h-7 w-7 text-white/20" />
              </div>

              <h2 className="mt-6 font-display text-3xl tracking-wide text-white">
                Your list is empty
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Save movies and series you want to
                watch later by tapping the heart.
              </p>

              <Link
                to="/movies"
                preload={false}
                className="mt-6 inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
              >
                Browse Movies
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => {
              const poster = img(
                item.poster_path,
                "w342",
              );

              return (
                <div
                  key={`${item.mediaType}-${item.id}`}
                  className="group min-w-0"
                >
                  <div className="relative">
                    <Link
                      to="/title/$mediaType/$tmdbId"
                      params={{
                        mediaType: item.mediaType,
                        tmdbId: String(item.id),
                      }}
                      preload={false}
                      className="card-hover block overflow-hidden rounded-xl bg-surface-2 shadow-lg shadow-black/20"
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        {poster ? (
                          <img
                            src={poster}
                            alt={`${item.title} poster`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="grid h-full place-items-center bg-surface-2 p-4 text-center text-xs text-white/40">
                            {item.title}
                          </div>
                        )}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="absolute bottom-3 left-3 rounded-md border border-white/[0.08] bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/60 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                          {item.mediaType === "tv"
                            ? "Series"
                            : "Movie"}
                        </div>
                      </div>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${item.title}`}
                      onClick={() =>
                        toggleMyList(item)
                      }
                      className="absolute right-2.5 top-2.5 z-10 h-9 w-9 rounded-xl border border-white/[0.08] bg-black/60 text-white/60 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-black/80 hover:text-white group-hover:opacity-100 active:scale-90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 min-w-0">
                    <p className="truncate text-sm font-medium text-white/85">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/30">
                      {item.mediaType === "tv"
                        ? "TV Series"
                        : "Movie"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}