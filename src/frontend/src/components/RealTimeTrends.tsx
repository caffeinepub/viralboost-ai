import { RefreshCw, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { type TrendItem, fetchTrending } from "../services/aiService";

const PLATFORM_TABS = [
  { id: "all", label: "All" },
  { id: "yt", label: "YT" },
  { id: "ig", label: "IG" },
  { id: "tt", label: "TikTok" },
  { id: "fb", label: "FB" },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export function RealTimeTrends() {
  const [platform, setPlatform] = useState("all");
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey is a trigger, not a value dependency
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTrending(platform).then((data) => {
      if (!cancelled) {
        setTrends(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [platform, refreshKey]);

  const filtered = trends
    .filter(
      (t) =>
        platform === "all" || t.platform === platform || t.platform === "all",
    )
    .slice(0, 8);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div
      className="relative glass-card rounded-2xl p-6 glow-mixed flex flex-col gap-5"
      style={{ border: "1px solid rgba(139,44,255,0.25)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/25 to-cyan-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">
              Real-time Trends
            </h3>
            <p className="text-white/40 text-xs">
              Live trending hashtags right now
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          data-ocid="trends.refresh.button"
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 text-white/50 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
        {PLATFORM_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPlatform(tab.id)}
            data-ocid={`trends.platform.${tab.id}.tab`}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              platform === tab.id
                ? "gradient-btn text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && filtered.length === 0 ? (
        <div className="flex flex-col gap-2.5" data-ocid="trends.loading_state">
          {SKELETON_KEYS.map((k) => (
            <div key={k} className="flex items-center gap-3 animate-pulse">
              <div className="w-4 h-3 bg-white/10 rounded" />
              <div className="flex-1 h-3 bg-white/10 rounded" />
              <div className="w-16 h-1.5 bg-white/10 rounded-full" />
              <div className="w-7 h-3 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div key={refreshKey} className="flex flex-col gap-2.5">
          {filtered.map((trend, i) => (
            <motion.div
              key={trend.tag}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
              data-ocid={`trends.item.${i + 1}`}
            >
              <span className="text-white/20 text-xs font-mono w-4 text-right">
                {i + 1}
              </span>
              <span className="text-white/80 text-sm font-medium flex-1 truncate hover:text-white transition-colors cursor-pointer">
                {trend.tag}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trend.score}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.6 }}
                    className="h-full rounded-full trend-bar"
                  />
                </div>
                <span className="text-white/30 text-xs w-7 text-right">
                  {trend.score}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
