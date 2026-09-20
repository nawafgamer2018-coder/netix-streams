import { createFileRoute } from "@tanstack/react-router";
import BrowseGrid from "@/components/BrowseGrid";

export const Route = createFileRoute("/tv-shows")({
  head: () => ({
    meta: [
      { title: "TV Shows — Netix" },
      {
        name: "description",
        content: "Browse popular TV series on Netix with genre filters and paginated results.",
      },
      { property: "og:title", content: "TV Shows — Netix" },
      { property: "og:description", content: "Browse series by genre and popularity on Netix." },
    ],
  }),
  component: () => <BrowseGrid mediaType="tv" heading="TV Shows" />,
});
