import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState } from "react";

import PosterCard from "./PosterCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { MediaItem } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export default function MediaRow({
  title,
  items,
  loading,
}: {
  title: string;
  items: MediaItem[];
  loading?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scroller.current;

    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < maxScroll - 10);
  };

  const scrollBy = (direction: -1 | 1) => {
    const el = scroller.current;

    if (!el) return;

    el.scrollBy({
      left: direction * Math.round(el.clientWidth * 0.82),
      behavior: "smooth",
    });

    window.setTimeout(updateScrollState, 350);
  };

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="group/row relative py-8 md:py-10">
      {/* Section heading */}
      <div className="mb-5 flex items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-6 w-1 shrink-0 rounded-full bg-primary shadow-[0_0_14px_var(--color-primary)]" />

          <h2 className="min-w-0 truncate font-display text-2xl tracking-wide text-white md:text-3xl">
            {title}
          </h2>
        </div>

        {/* Desktop arrows */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full",
              "border border-white/10 bg-white/[0.06]",
              "text-white/70 backdrop-blur-md",
              "transition-all duration-200",
              "hover:border-white/20 hover:bg-white/10 hover:text-white",
              "disabled:pointer-events-none disabled:opacity-25",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full",
              "border border-white/10 bg-white/[0.06]",
              "text-white/70 backdrop-blur-md",
              "transition-all duration-200",
              "hover:border-white/20 hover:bg-white/10 hover:text-white",
              "disabled:pointer-events-none disabled:opacity-25",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Poster rail */}
      <div className="relative">
        {/* Left fade */}
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-20",
            "bg-gradient-to-r from-background to-transparent",
            "transition-opacity duration-300 md:block",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Right fade */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-24",
            "bg-gradient-to-l from-background to-transparent",
            "transition-opacity duration-300 md:block",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={scroller}
          onScroll={updateScrollState}
          className={cn(
            "no-scrollbar flex snap-x snap-mandatory",
            "gap-4 overflow-x-auto px-4 pb-5",
            "md:gap-5 md:px-8",
            "scroll-smooth",
          )}
        >
          {loading
            ? Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-[46vw] shrink-0",
                    "sm:w-48",
                    "md:w-56",
                    "lg:w-60",
                    "xl:w-64",
                  )}
                >
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                </div>
              ))
            : items.map((item) => (
                <PosterCard
                  key={`${item.id}-${item.media_type ?? ""}`}
                  item={item}
                  className={cn(
                    "w-[46vw] shrink-0 snap-start",
                    "sm:w-48",
                    "md:w-56",
                    "lg:w-60",
                    "xl:w-64",
                  )}
                />
              ))}
        </div>
      </div>
    </section>
  );
}