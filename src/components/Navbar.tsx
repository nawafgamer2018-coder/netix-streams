import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Film,
  Heart,
  Home,
  Menu,
  Search,
  Settings,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import SettingsModal from "./SettingsModal";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/tv-shows", label: "TV Shows", icon: Tv },
  { to: "/my-list", label: "My List", icon: Heart },
] as const;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const isSearchPage = location.pathname === "/search";

  useEffect(() => {
    if (isSearchPage) {
      setSearchOpen(false);
      setQuery("");
    }
  }, [isSearchPage]);

  useEffect(() => {
    if (!isSearchPage) {
      setSearchOpen(false);
    }

    setOpenMenu(false);
  }, [location.pathname, isSearchPage]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const openSearch = () => {
    setSearchOpen(true);

    window.setTimeout(() => {
      document
        .getElementById("netix-navbar-search")
        ?.focus();
    }, 120);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    setSearchOpen(false);
    setQuery("");
    setOpenMenu(false);

    navigate({
      to: "/search",
      search: {
        q: trimmed,
      },
    });
  };

  /*
   * HOME:
   * Always cinematic/transparent.
   *
   * OTHER PAGES:
   * Transparent at the top,
   * dark glass after scrolling.
   */
  const darkHeader =
    !isHome && (scrolled || searchOpen);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          darkHeader
            ? "border-b border-white/[0.08] bg-black/[0.94] shadow-2xl shadow-black/40 backdrop-blur-2xl"
            : "border-b-0 bg-gradient-to-b from-black/80 via-black/35 to-transparent",
        )}
      >
        <div className="relative mx-auto flex h-[76px] max-w-[1600px] items-center px-4 sm:px-5 md:px-8">
          {/* =====================================================
              NETIX LOGO
              ===================================================== */}

          <Link
            to="/"
            preload={false}
            aria-label="Netix home"
            className="group relative z-30 flex h-11 shrink-0 items-center"
          >
            <span className="netix-logo block text-[32px] leading-none text-primary transition-transform duration-200 group-hover:scale-[1.04] sm:text-[35px] md:text-[39px]">
              NETIX
            </span>
          </Link>

          {/* =====================================================
              CENTERED NAV + SEARCH + SETTINGS
              ===================================================== */}

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:flex">
            {/* Main navigation */}

            <nav className="flex h-12 items-center gap-1 rounded-2xl border border-white/[0.08] bg-black/[0.35] p-1.5 shadow-xl shadow-black/25 backdrop-blur-xl">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  preload={false}
                  activeOptions={{
                    exact: item.to === "/",
                  }}
                  activeProps={{
                    className:
                      "bg-white/[0.11] text-white shadow-lg shadow-black/15 after:absolute after:bottom-1.5 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-primary after:shadow-[0_0_10px_rgba(229,9,20,0.75)]",
                  }}
                  inactiveProps={{
                    className:
                      "text-white/55 hover:bg-white/[0.07] hover:text-white",
                  }}
                  className="relative flex h-10 items-center gap-2 rounded-xl px-5 text-[14px] font-semibold transition-all duration-200"
                >
                  <item.icon className="h-[17px] w-[17px]" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search */}

            {!isSearchPage ? (
              <form
                onSubmit={submit}
                className={cn(
                  "relative flex h-12 items-center overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 ease-out",
                  searchOpen
                    ? "w-[250px] border-primary/35 bg-black/[0.45] shadow-[0_0_30px_rgba(229,9,20,0.12)] md:w-[290px]"
                    : "w-12 border-white/[0.08] bg-black/[0.35] hover:border-white/[0.14] hover:bg-black/[0.48]",
                )}
              >
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() =>
                    searchOpen
                      ? undefined
                      : openSearch()
                  }
                  className={cn(
                    "absolute left-0 z-10 grid h-12 w-12 shrink-0 place-items-center text-white/60 transition-all duration-200 hover:text-white",
                    searchOpen &&
                      "pointer-events-none",
                  )}
                >
                  <Search className="h-[19px] w-[19px]" />
                </button>

                <input
                  id="netix-navbar-search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search..."
                  aria-label="Search titles"
                  tabIndex={searchOpen ? 0 : -1}
                  className={cn(
                    "h-12 w-full bg-transparent pl-12 pr-11 text-sm text-white outline-none transition-opacity duration-200 placeholder:text-white/30",
                    searchOpen
                      ? "opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                />

                {searchOpen ? (
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={closeSearch}
                    className="absolute right-1.5 grid h-9 w-9 place-items-center rounded-xl text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </form>
            ) : (
              <Link
                to="/search"
                search={{ q: "" }}
                preload={false}
                aria-label="Search"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-black/[0.35] text-white/60 backdrop-blur-xl transition-all duration-200 hover:border-white/[0.14] hover:bg-black/[0.48] hover:text-white"
              >
                <Search className="h-[19px] w-[19px]" />
              </Link>
            )}

            {/* Settings */}

            <Button
              variant="ghost"
              size="icon"
              aria-label="Settings"
              onClick={() =>
                setOpenSettings(true)
              }
              className="h-12 w-12 shrink-0 rounded-2xl border border-white/[0.08] bg-black/[0.35] text-white/60 backdrop-blur-xl transition-all hover:border-white/[0.14] hover:bg-black/[0.48] hover:text-white active:scale-95"
            >
              <Settings className="h-[19px] w-[19px] transition-transform duration-300 hover:rotate-45" />
            </Button>
          </div>

          {/* =====================================================
              MOBILE RIGHT CONTROLS
              ===================================================== */}

          <div
            className={cn(
              "ml-auto flex h-11 min-w-0 items-center gap-1.5 sm:gap-2 lg:hidden",
              searchOpen && "max-w-[calc(100vw-120px)]",
            )}
          >
            {!isSearchPage ? (
              <form
                onSubmit={submit}
                className={cn(
                  "relative flex h-11 min-w-0 items-center overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-300 ease-out",
                  searchOpen
                    ? "w-[min(220px,calc(100vw-176px))] border-primary/35 bg-black/[0.55] shadow-[0_0_25px_rgba(229,9,20,0.1)] sm:w-[220px]"
                    : "w-11 border-transparent bg-white/[0.055]",
                )}
              >
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() =>
                    searchOpen
                      ? undefined
                      : openSearch()
                  }
                  className="absolute left-0 z-10 grid h-11 w-11 place-items-center text-white/60 transition-colors hover:text-white"
                >
                  <Search className="h-[19px] w-[19px]" />
                </button>

                <input
                  id="netix-navbar-search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search..."
                  aria-label="Search titles"
                  tabIndex={searchOpen ? 0 : -1}
                  className={cn(
                    "h-11 w-full bg-transparent pl-11 pr-10 text-sm text-white outline-none placeholder:text-white/30",
                    searchOpen
                      ? "opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                />

                {searchOpen ? (
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={closeSearch}
                    className="absolute right-1 grid h-8 w-8 place-items-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </form>
            ) : (
              <Link
                to="/search"
                search={{ q: "" }}
                preload={false}
                aria-label="Search"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-white/60 transition-colors hover:bg-white/[0.09] hover:text-white"
              >
                <Search className="h-[19px] w-[19px]" />
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              aria-label="Settings"
              onClick={() =>
                setOpenSettings(true)
              }
              className="h-11 w-11 shrink-0 rounded-xl border border-transparent bg-white/[0.055] text-white/55 transition-all hover:bg-white/[0.09] hover:text-white active:scale-95"
            >
              <Settings className="h-[19px] w-[19px]" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label={
                openMenu
                  ? "Close menu"
                  : "Open menu"
              }
              className="h-11 w-11 shrink-0 rounded-xl border border-transparent bg-white/[0.055] text-white/60 transition-all hover:bg-white/[0.09] hover:text-white active:scale-95"
              onClick={() =>
                setOpenMenu((value) => !value)
              }
            >
              {openMenu ? (
                <X className="h-[19px] w-[19px]" />
              ) : (
                <Menu className="h-[19px] w-[19px]" />
              )}
            </Button>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
            ===================================================== */}

        {openMenu ? (
          <nav className="border-t border-white/[0.07] bg-black/[0.97] px-4 py-3 shadow-2xl backdrop-blur-2xl sm:px-5 lg:hidden">
            <div className="mx-auto max-w-md space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    preload={false}
                    onClick={() =>
                      setOpenMenu(false)
                    }
                    activeOptions={{
                      exact: item.to === "/",
                    }}
                    activeProps={{
                      className:
                        "border-primary/25 bg-primary/10 text-white shadow-[inset_3px_0_0_#e50914]",
                    }}
                    className="flex min-h-12 items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-white/60 transition-all hover:bg-white/[0.05] hover:text-white active:scale-[0.99]"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </header>

      {/* =========================================================
          MOBILE BOTTOM NAV
          ========================================================= */}

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-white/[0.08] bg-black/[0.96] pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-2xl md:hidden">
        {NAV.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              preload={false}
              activeOptions={{
                exact: item.to === "/",
              }}
              activeProps={{
                className:
                  "bg-primary/[0.09] text-primary",
              }}
              inactiveProps={{
                className: "text-white/40",
              }}
              className="flex min-h-[64px] flex-col items-center justify-center gap-1.5 px-1 text-[10px] font-semibold transition-all duration-200 active:scale-95"
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <SettingsModal
        open={openSettings}
        onOpenChange={setOpenSettings}
      />
    </>
  );
}