import { Check, Copy, Hash, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import * as aiService from "../services/aiService";
import type { HashtagResult } from "../services/aiService";
import type { UseUsageController } from "../types";
import { BlurOverlay } from "./BlurOverlay";

const PLATFORM_CHIPS = [
  { id: "yt", label: "YT", color: "#FF0000" },
  { id: "ig", label: "IG", color: "#bc1888" },
  { id: "fb", label: "FB", color: "#1877F2" },
  { id: "tt", label: "TikTok", color: "#333" },
  { id: "tw", label: "Twitter", color: "#1DA1F2" },
];

interface Props {
  usageCtrl: UseUsageController;
}

export function HashtagSearch({ usageCtrl }: Props) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("yt");
  const [results, setResults] = useState<HashtagResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiPowered, setAiPowered] = useState(false);

  const handleSearch = async () => {
    if (!topic.trim()) return;
    const ok = usageCtrl.tryGenerate();
    if (!ok) return;
    setLoading(true);
    setAiPowered(false);
    try {
      const data = await aiService.fetchHashtags(topic, platform);
      setResults(data);
      setAiPowered(true);
    } catch {
      toast.error("Failed to generate hashtags");
    } finally {
      setLoading(false);
    }
  };

  const copyTag = async (tag: string) => {
    await navigator.clipboard.writeText(tag);
    setCopied(tag);
    toast.success(`Copied ${tag}`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative glass-card rounded-2xl p-6 glow-purple neon-border-purple flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-600/25 flex items-center justify-center">
          <Hash className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-white text-lg">
            Viral Hashtag Search
          </h3>
          <p className="text-white/40 text-xs">
            Find hashtags that dominate your niche
          </p>
        </div>
        {aiPowered && results && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-600/20 border border-purple-500/30 text-purple-300">
            <Sparkles className="w-3 h-3" /> AI
          </span>
        )}
      </div>

      <input
        data-ocid="hashtag.input"
        type="text"
        placeholder="Enter a topic (e.g. fitness, travel)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleSearch();
        }}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-purple-500/60 transition-colors"
      />

      <div className="flex flex-wrap gap-2">
        {PLATFORM_CHIPS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlatform(p.id)}
            data-ocid={`hashtag.platform.${p.id}.toggle`}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              platform === p.id
                ? "text-white border"
                : "text-white/40 border border-white/10 hover:border-white/30"
            }`}
            style={
              platform === p.id
                ? { background: p.color, borderColor: p.color }
                : {}
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void handleSearch()}
        disabled={loading || !topic.trim()}
        data-ocid="hashtag.search.button"
        className="gradient-btn glow-btn py-2.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        {loading ? "Searching with AI..." : "Search Hashtags"}
      </button>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
            data-ocid="hashtag.results.panel"
          >
            {(
              [
                {
                  key: "high",
                  label: "\uD83D\uDD25 High Reach",
                  color: "text-orange-400",
                },
                {
                  key: "medium",
                  label: "\u26A1 Medium Reach",
                  color: "text-yellow-400",
                },
                {
                  key: "niche",
                  label: "\uD83C\uDFAF Niche",
                  color: "text-cyan-400",
                },
              ] as const
            ).map(({ key, label, color }) => (
              <div key={key}>
                <p className={`text-xs font-semibold mb-2 ${color}`}>{label}</p>
                <div className="flex flex-wrap gap-2">
                  {results[key].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => void copyTag(tag)}
                      className="pill-tag px-3 py-1 rounded-full text-xs text-white/80 flex items-center gap-1.5 transition-all hover:text-white"
                    >
                      {copied === tag ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-white/30" />
                      )}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {usageCtrl.isLocked && (
          <BlurOverlay
            unlockedBonus={usageCtrl.unlockedBonus}
            onDismiss={usageCtrl.dismissLock}
            onWatchAd={usageCtrl.onWatchAd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
