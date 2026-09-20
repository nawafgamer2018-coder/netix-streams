import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allSources, removeSource, writeSource, parseSourceInput, type SavedSource } from "@/lib/storage";

export const Route = createFileRoute("/manage-sources")({
  head: () => ({
    meta: [
      { title: "Manage Sources — Netix" },
      {
        name: "description",
        content: "Review, edit and delete every player source saved in your Netix browser storage.",
      },
      { property: "og:title", content: "Manage Sources — Netix" },
      {
        property: "og:description",
        content: "One place to edit or remove all of your saved Netix player sources.",
      },
    ],
  }),
  component: ManageSources,
});

function ManageSources() {
  const [sources, setSources] = useState<SavedSource[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => setSources(allSources()), []);

  const save = (s: SavedSource) => {
    const parsed = parseSourceInput(draft);
    if (!parsed) {
      toast.error("Enter a valid URL, iframe snippet, or video file link.");
      return;
    }
    writeSource({ ...s, ...parsed, savedAt: Date.now() });
    setSources(allSources());
    setEditing(null);
    toast.success("Source updated");
  };

  return (
    <div className="px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <h1 className="font-display text-4xl md:text-5xl">Manage Sources</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every saved source lives in this browser only. {sources.length} saved.
      </p>

      {sources.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No sources saved yet. Open any title and use the player slot to add one.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {sources.map((s) => (
            <li key={s.key} className="rounded-xl border border-border bg-surface p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {s.label ??
                      (s.mediaType === "movie"
                        ? `Movie #${s.tmdbId}`
                        : `TV #${s.tmdbId} · S${s.season}E${s.episode}`)}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{s.url}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-primary">{s.kind}</p>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild aria-label="Open title">
                    <Link
                      to="/title/$mediaType/$tmdbId"
                      params={{ mediaType: s.mediaType, tmdbId: s.tmdbId }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(s.key);
                      setDraft(s.url);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Delete source"
                    onClick={() => {
                      removeSource(s.key);
                      setSources(allSources());
                      toast.success("Source removed");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {editing === s.key ? (
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    aria-label="Source URL"
                  />
                  <Button onClick={() => save(s)}>Save</Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
