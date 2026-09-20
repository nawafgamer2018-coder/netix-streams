import { createFileRoute } from "@tanstack/react-router";
import BrowseGrid from "@/components/BrowseGrid";

export const Route = createFileRoute("/movies")({
  component: () => (
    <div className="pt-24">
      <BrowseGrid mediaType="movie" heading="Movies" />
    </div>
  ),
});