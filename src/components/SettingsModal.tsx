import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getApiKey, hasEnvKey, setApiKey } from "@/lib/tmdb";

export default function SettingsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue(hasEnvKey() ? "" : getApiKey());
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Settings / Developer</DialogTitle>
          <DialogDescription>
            {hasEnvKey()
              ? "A TMDB API key is provided by VITE_TMDB_API_KEY. You can override it locally below."
              : "No VITE_TMDB_API_KEY found. Paste a TMDB v3 API key to enable full browsing; otherwise Netix uses limited fallback lists."}
          </DialogDescription>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="TMDB v3 API key"
          aria-label="TMDB API key"
        />
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setApiKey("");
              setValue("");
              toast.success("Local key cleared");
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              setApiKey(value);
              onOpenChange(false);
              toast.success("API key saved");
              window.location.reload();
            }}
          >
            Save key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
