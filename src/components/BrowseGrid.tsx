import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import PosterCard from "@/components/PosterCard";
import { fetchList, type MediaItem } from "@/lib/tmdb";

type BrowseGridProps = {
  mediaType: "movie" | "tv";
  heading: string;
};

const MOVIE_GENRES = [
  { id: "", name: "All genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "18", name: "Drama" },
  { id: "27", name: "Horror" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "53", name: "Thriller" },
];

const TV_GENRES = [
  { id: "", name: "All genres" },
  { id: "10759", name: "Action & Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "9648", name: "Mystery" },
  { id: "10765", name: "Sci-Fi & Fantasy" },
];

const YEARS = [
  { value: "", label: "Any year" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2010", label: "2010s" },
  { value: "2000", label: "2000s" },
  { value: "1990", label: "1990s" },
];

const RATINGS = [
  { value: "", label: "Any rating" },
  { value: "8", label: "8+ rating" },
  { value: "7", label: "7+ rating" },
  { value: "6", label: "6+ rating" },
  { value: "5", label: "5+ rating" },
];

const SORT_OPTIONS = [
  {
    value: "popularity.desc",
    label: "Most Popular",
  },
  {
    value: "vote_average.desc",
    label: "Highest Rated",
  },
  {
    value: "primary_release_date.desc",
    label: "Newest",
  },
  {
    value: "primary_release_date.asc",
    label: "Oldest",
  },
];

export default function BrowseGrid({
  mediaType,
  heading,
}: BrowseGridProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] =
    useState("popularity.desc");

  const [page, setPage] = useState(1);

  const genres =
    mediaType === "movie"
      ? MOVIE_GENRES
      : TV_GENRES;

  const endpoint =
    mediaType === "movie"
      ? "/discover/movie"
      : "/discover/tv";

  const yearParam =
    mediaType === "movie"
      ? "primary_release_year"
      : "first_air_date_year";

  const params = useMemo(
    () => ({
      page,
      sort_by: sort,
      ...(genre
        ? { with_genres: genre }
        : {}),
      ...(year
        ? { [yearParam]: year }
        : {}),
      ...(rating
        ? { "vote_average.gte": rating }
        : {}),
      vote_count_gte: "50",
    }),
    [
      page,
      sort,
      genre,
      year,
      rating,
      yearParam,
    ],
  );

  useEffect(() => {
    let alive = true;

    setLoading(true);

    fetchList(endpoint, params, mediaType)
      .then((data) => {
        if (!alive) return;
        setItems(data);
      })
      .catch(() => {
        if (!alive) return;
        setItems([]);
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [
    endpoint,
    params,
    mediaType,
  ]);

  const activeFilters =
    Number(Boolean(genre)) +
    Number(Boolean(year)) +
    Number(Boolean(rating));

  const hasFilters =
    Boolean(genre) ||
    Boolean(year) ||
    Boolean(rating) ||
    sort !== "popularity.desc";

  const resetFilters = () => {
    setGenre("");
    setYear("");
    setRating("");
    setSort("popularity.desc");
    setPage(1);
  };

  const changeFilter = (
    setter: (value: string) => void,
    value: string,
  ) => {
    setter(value);
    setPage(1);
  };

  const selectedGenre =
    genres.find((item) => item.id === genre)
      ?.name ?? "All genres";

  const selectedYear =
    YEARS.find((item) => item.value === year)
      ?.label ?? "Any year";

  const selectedRating =
    RATINGS.find(
      (item) => item.value === rating,
    )?.label ?? "Any rating";

  const selectedSort =
    SORT_OPTIONS.find(
      (item) => item.value === sort,
    )?.label ?? "Most Popular";

  return (
    <div className="min-h-screen pb-24">
      {/* Page Header */}
      <section className="border-b border-white/[0.06] bg-background">
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-24 md:px-8 md:pb-8 md:pt-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-px w-7 bg-primary/60" />

                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
                  Netix /{" "}
                  {mediaType === "movie"
                    ? "Movies"
                    : "TV Shows"}
                </span>
              </div>

              <h1 className="font-display text-4xl tracking-wide text-white md:text-5xl">
                {heading}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
                Explore popular, highly rated, and
                newly released{" "}
                {mediaType === "movie"
                  ? "movies"
                  : "series"}{" "}
                across the Netix catalog.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-xs text-white/40 backdrop-blur-xl">
                <SlidersHorizontal className="h-3.5 w-3.5" />

                {activeFilters > 0
                  ? `${activeFilters} filter${
                      activeFilters === 1
                        ? ""
                        : "s"
                    }`
                  : "Browse all"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Filters */}
        <section className="sticky top-[76px] z-30 -mx-4 border-b border-white/[0.06] bg-background/90 px-4 py-4 backdrop-blur-2xl md:-mx-8 md:px-8">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <div className="mr-1 flex shrink-0 items-center gap-2 text-xs font-medium text-white/35">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </div>

              {/* Genre */}
              <FilterSelect
                label={selectedGenre}
                value={genre}
                onChange={(value) =>
                  changeFilter(
                    setGenre,
                    value,
                  )
                }
                options={genres.map(
                  (item) => ({
                    value: item.id,
                    label: item.name,
                  }),
                )}
              />

              {/* Year */}
              <FilterSelect
                label={selectedYear}
                value={year}
                onChange={(value) =>
                  changeFilter(
                    setYear,
                    value,
                  )
                }
                options={YEARS}
              />

              {/* Rating */}
              <FilterSelect
                label={selectedRating}
                value={rating}
                onChange={(value) =>
                  changeFilter(
                    setRating,
                    value,
                  )
                }
                options={RATINGS}
              />

              {/* Sort */}
              <FilterSelect
                label={selectedSort}
                value={sort}
                onChange={(value) =>
                  changeFilter(
                    setSort,
                    value,
                  )
                }
                options={SORT_OPTIONS}
                wide
              />

              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-1 flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs font-medium text-white/40 transition-all duration-200 hover:border-primary/20 hover:bg-primary/[0.06] hover:text-white active:scale-[0.97]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
            </div>

            <div className="hidden shrink-0 text-xs text-white/25 xl:block">
              {loading
                ? "Loading..."
                : items.length > 0
                  ? `Page ${page}`
                  : "No results"}
            </div>
          </div>
        </section>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 pt-8 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({
              length: 12,
            }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[2/3] animate-pulse rounded-xl border border-white/[0.04] bg-white/[0.045]" />

                <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-white/[0.045]" />

                <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/[0.035]" />
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 pt-8 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => (
              <PosterCard
                key={`${mediaType}-${item.id}`}
                item={{
                  ...item,
                  media_type: mediaType,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center pt-8">
            <div className="max-w-sm text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                <Filter className="h-6 w-6 text-white/20" />
              </div>

              <h2 className="mt-5 font-display text-3xl tracking-wide text-white">
                Nothing found
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/35">
                Try changing your filters to
                discover more titles.
              </p>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-medium text-white/65 transition-all hover:bg-white/[0.08] hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && items.length > 0 ? (
          <div className="flex items-center justify-center gap-3 py-10">
            <button
              type="button"
              disabled={
                page <= 1 || loading
              }
              onClick={() =>
                setPage((current) =>
                  Math.max(
                    1,
                    current - 1,
                  ),
                )
              }
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/45 transition-all hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white disabled:pointer-events-none disabled:opacity-25"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex h-10 min-w-20 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-xs font-medium text-white/55">
              Page {page}
            </div>

            <button
              type="button"
              disabled={
                loading ||
                items.length === 0
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1,
                )
              }
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-white/45 transition-all hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white disabled:pointer-events-none disabled:opacity-25"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  wide?: boolean;
}) {
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        aria-label={label}
        className={`h-10 appearance-none rounded-xl border border-white/[0.08] bg-white/[0.045] pl-3.5 pr-9 text-xs font-medium text-white/65 outline-none backdrop-blur-xl transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.07] focus:border-primary/35 focus:bg-white/[0.07] ${
          value
            ? "border-primary/25 bg-primary/[0.06] text-white"
            : ""
        } ${
          wide ? "min-w-[145px]" : "min-w-[118px]"
        }`}
      >
        {options.map((option) => (
          <option
            key={option.value || "all"}
            value={option.value}
            className="bg-[#171719] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
    </div>
  );
}