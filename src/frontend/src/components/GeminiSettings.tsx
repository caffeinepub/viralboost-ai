import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getStoredGeminiKey, saveGeminiKey } from "../services/aiService";

const GEMINI_KEY_STORAGE = "viralboost_gemini_key";

export function GeminiSettings() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);
  // Always true since a default key is built-in
  const [hasCustomKey, setHasCustomKey] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — re-sync when dialog opens
  useEffect(() => {
    const stored = localStorage.getItem(GEMINI_KEY_STORAGE) || "";
    setKey(stored);
    setHasCustomKey(!!stored);
  }, [open]);

  const handleSave = async () => {
    if (!key.trim()) return;
    setSaving(true);
    try {
      await saveGeminiKey(key.trim());
      setHasCustomKey(true);
      toast.success("Custom Gemini API key saved!");
      setOpen(false);
    } catch {
      toast.error("Failed to save API key.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    await saveGeminiKey("");
    setKey("");
    setHasCustomKey(false);
    toast.success("Reverted to default Gemini AI.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="settings.open_modal_button"
          title="Using Gemini AI"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border hover:scale-105"
          style={{
            background: "rgba(139,92,246,0.15)",
            borderColor: "rgba(139,92,246,0.4)",
            color: "#c4b5fd",
          }}
        >
          <Sparkles className="w-3 h-3" />
          Gemini AI
          <Settings className="w-3 h-3 opacity-60" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "rgba(8,8,16,0.97)",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
        data-ocid="settings.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Engine Settings
          </DialogTitle>
          <DialogDescription className="text-white/40">
            Gemini AI is active. You can override with your own API key for a
            dedicated quota.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-300">
              {hasCustomKey
                ? "Using your custom Gemini API key"
                : "Using built-in Gemini AI (shared quota)"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-white/60 text-xs font-medium"
              htmlFor="gemini-key-input"
            >
              Override with your own Gemini API Key (optional)
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-purple-400 hover:text-purple-300 underline"
              >
                Get free key →
              </a>
            </label>
            <input
              id="gemini-key-input"
              data-ocid="settings.input"
              type="password"
              placeholder="AIza... (leave blank to use default)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/60 transition-colors font-mono"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !key.trim()}
              data-ocid="settings.save.button"
              className="flex-1 gradient-btn glow-btn py-2.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Custom Key"}
            </button>
            {hasCustomKey && (
              <button
                type="button"
                onClick={handleClear}
                data-ocid="settings.clear.button"
                className="px-4 py-2.5 rounded-xl text-sm text-white/50 border border-white/10 hover:border-white/25 hover:text-white/80 transition-all"
              >
                Use Default
              </button>
            )}
          </div>

          <p className="text-white/25 text-xs text-center">
            Your key is stored locally and only used for AI generation calls.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
