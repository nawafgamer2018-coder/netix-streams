import React, { useState } from "react";
import { readSource, sourceKey } from "@/lib/storage";

interface PlayerSlotProps {
tmdbId: string | number;
mediaType: "movie" | "tv";
season?: number;
episode?: number;
label?: string;
}

const DEFAULT_SERVERS = [
{
name: "VidFast",
getUrl: (type: "movie" | "tv", id: string | number, s = 1, e = 1) =>
  type === "movie"
    ? `https://vidfast.pro/movie/${id}`
    : `https://vidfast.pro/tv/${id}/${s}/${e}`,
},
{
name: "VidSrc",
getUrl: (type: "movie" | "tv", id: string | number, s = 1, e = 1) =>
  type === "movie"
    ? `https://vidsrc.cc/v2/embed/movie/${id}`
    : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
},
{
name: "Videasy",
getUrl: (type: "movie" | "tv", id: string | number, s = 1, e = 1) =>
  type === "movie"
    ? `https://player.videasy.net/movie/${id}`
    : `https://player.videasy.net/tv/${id}/${s}/${e}`,
},
{
name: "Embed.su",
getUrl: (type: "movie" | "tv", id: string | number, s = 1, e = 1) =>
  type === "movie"
    ? `https://embed.su/embed/movie/${id}`
    : `https://embed.su/embed/tv/${id}/${s}/${e}`,
},
{
name: "VidSrc.xyz",
getUrl: (type: "movie" | "tv", id: string | number, s = 1, e = 1) =>
  type === "movie"
    ? `https://vidsrc.xyz/embed/movie/${id}`
    : `https://vidsrc.xyz/embed/tv/${id}/${s}-${e}`,
},
];

export const PlayerSlot = ({
tmdbId,
mediaType,
season = 1,
episode = 1,
}: PlayerSlotProps) => {
const key = sourceKey(mediaType, tmdbId, season, episode);
const customSource = readSource(key);

const [selectedServerIndex, setSelectedServerIndex] = useState(0);

const activeUrl =
customSource?.url ||
DEFAULT_SERVERS[selectedServerIndex]?.getUrl(mediaType, tmdbId, season, episode);

return (
<div className="space-y-3">
  {!customSource ? (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Source Server:</span>
      {DEFAULT_SERVERS.map((server, idx) => (
        <button
          key={server.name}
          type="button"
          onClick={() => setSelectedServerIndex(idx)}
          className={`rounded px-3 py-1 text-xs transition-colors ${
            selectedServerIndex === idx
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-surface-2 hover:bg-surface-3 text-muted-foreground"
          }`}
        >
          {server.name}
        </button>
      ))}
    </div>
  ) : (
    <div className="text-xs text-muted-foreground">
      Using custom user source saved for this title.
    </div>
  )}

  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
    <iframe
      src={activeUrl}
      className="h-full w-full border-0"
      allowFullScreen
      allow="autoplay; encrypted-media; picture-in-picture"
      title="Video Player"
    />
  </div>
</div>
);
};

export default PlayerSlot;
