export type SourceKind = "iframe" | "video";

export interface SavedSource {
  key: string;
  url: string;
  kind: SourceKind;
  mediaType: "movie" | "tv";
  tmdbId: string;
  season?: number | undefined;
  episode?: number | undefined;
  label?: string | undefined;
  savedAt: number;
}

const LIST_KEY = "netix_my_list";

export function sourceKey(
  mediaType: "movie" | "tv",
  tmdbId: string | number,
  season?: number,
  episode?: number,
) {
  return mediaType === "movie"
    ? `netix_source_movie_${tmdbId}`
    : `netix_source_tv_${tmdbId}_${season}_${episode}`;
}

/** Accepts a plain URL, a full <iframe> snippet, or a direct video file link. */
export function parseSourceInput(input: string): { url: string; kind: SourceKind } | null {
  const raw = input.trim();
  if (!raw) return null;
  let url = raw;
  if (raw.toLowerCase().includes("<iframe")) {
    const match = raw.match(/src\s*=\s*["']([^"']+)["']/i);
    if (!match) return null;
    url = match[1]!;
  }
  if (!/^https?:\/\//i.test(url)) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(url);
  } catch {
    return null;
  }
  const kind: SourceKind = /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(url) ? "video" : "iframe";
  return { url, kind };
}

export function readSource(key: string): SavedSource | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedSource;
  } catch {
    return null;
  }
}

export function writeSource(source: SavedSource) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(source.key, JSON.stringify(source));
}

export function removeSource(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function allSources(): SavedSource[] {
  if (typeof window === "undefined") return [];
  const out: SavedSource[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k || !k.startsWith("netix_source_")) continue;
    const s = readSource(k);
    if (s) out.push({ ...s, key: k });
  }
  return out.sort((a, b) => b.savedAt - a.savedAt);
}

export interface ListItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  poster_path?: string | null | undefined;
  vote_average?: number | undefined;
  year?: string | undefined;
}

export function getMyList(): ListItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LIST_KEY) ?? "[]") as ListItem[];
  } catch {
    return [];
  }
}

export function isInList(id: number, mediaType: string) {
  return getMyList().some((i) => i.id === id && i.mediaType === mediaType);
}

export function toggleMyList(item: ListItem): boolean {
  const list = getMyList();
  const idx = list.findIndex((i) => i.id === item.id && i.mediaType === item.mediaType);
  let added: boolean;
  if (idx >= 0) {
    list.splice(idx, 1);
    added = false;
  } else {
    list.unshift(item);
    added = true;
  }
  window.localStorage.setItem(LIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("netix-list-change"));
  return added;
}
