const TMDB_BASE = "https://api.themoviedb.org/3";
const KEY_STORAGE = "netix_tmdb_key";
const HARDCODED_API_KEY = "70468f31e1be36c70290662aca6ff3f9";

export function getApiKey(): string {
  const envKey = import.meta.env["VITE_TMDB_API_KEY"] as string | undefined;
  if (envKey) return envKey;
  if (typeof window !== "undefined") {
    const localKey = window.localStorage.getItem(KEY_STORAGE);
    if (localKey) return localKey;
  }
  return HARDCODED_API_KEY;
}

export function setApiKey(key: string) {
  if (typeof window === "undefined") return;
  if (key) window.localStorage.setItem(KEY_STORAGE, key.trim());
  else window.localStorage.removeItem(KEY_STORAGE);
}

export function hasEnvKey() {
  return true; // Always treat key as present due to fallback
}

export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  media_type?: MediaType | string;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
}

export const img = (path?: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const titleOf = (m: MediaItem) => m.title ?? m.name ?? "Untitled";
export const yearOf = (m: MediaItem) =>
  (m.release_date ?? m.first_air_date ?? "").slice(0, 4);
export const typeOf = (m: MediaItem): MediaType =>
  (m.media_type === "tv" || m.first_air_date ? "tv" : "movie") as MediaType;

export async function tmdb<T = any>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const key = getApiKey();
  const url = new URL(TMDB_BASE + path);
  url.searchParams.set("api_key", key);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB_ERROR_${res.status}`);
  return (await res.json()) as T;
}

const FALLBACK = {
  movie: "https://vidrock.net/list/movie.json",
  tv: "https://vidrock.net/list/tv.json",
};

function normalizeFallback(raw: any, type: MediaType): MediaItem[] {
  const arr: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.results)
      ? raw.results
      : Array.isArray(raw?.data)
        ? raw.data
        : [];
  return arr
    .map((r) => ({
      id: Number(r.id ?? r.tmdb_id ?? r.tmdbId ?? 0),
      media_type: type,
      title: r.title ?? r.name,
      name: r.name ?? r.title,
      poster_path: r.poster_path ?? r.poster ?? null,
      backdrop_path: r.backdrop_path ?? r.backdrop ?? null,
      overview: r.overview ?? "",
      vote_average: Number(r.vote_average ?? 0),
      release_date: r.release_date ?? r.year ?? "",
      first_air_date: r.first_air_date ?? "",
    }))
    .filter((r) => r.id);
}

export async function fetchFallback(type: MediaType): Promise<MediaItem[]> {
  try {
    const res = await fetch(FALLBACK[type]);
    if (!res.ok) return [];
    return normalizeFallback(await res.json(), type);
  } catch {
    return [];
  }
}

/** TMDB list fetch with graceful fallback to the public vidrock lists. */
export async function fetchList(
  path: string,
  params: Record<string, string | number | undefined> = {},
  fallbackType: MediaType = "movie",
): Promise<MediaItem[]> {
  try {
    const data = await tmdb<{ results: MediaItem[] }>(path, params);
    return data.results ?? [];
  } catch {
    return fetchFallback(fallbackType);
  }
}

export const GENRES: Record<MediaType, { id: number; name: string }[]> = {
  movie: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 14, name: "Fantasy" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
  ],
  tv: [
    { id: 10759, name: "Action & Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 9648, name: "Mystery" },
  ],
};