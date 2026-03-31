import { Lightbulb, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import * as aiService from "../services/aiService";
import type { TopicResult } from "../services/aiService";
import type { UseUsageController } from "../types";
import { BlurOverlay } from "./BlurOverlay";

const CATEGORIES = [
  "Entertainment",
  "Education",
  "Lifestyle",
  "Tech",
  "Fitness",
];
const PLATFORMS = ["YouTube", "Instagram", "Facebook", "TikTok"];

interface Props {
  usageCtrl: UseUsageController;
}

export function TopicGenerator({ usageCtrl }: Props) {
  const [category, setCategory] = useState("Tech");
  const [platform, setPlatform] = useState("YouTube");
  const [topics, setTopics] = useState<TopicResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiPowered, setAiPowered] = useState(false);

  const handleGenerate = async () => {
    const ok = usageCtrl.tryGenerate();
    if (!ok) return;
    setLoading(true);
    setAiPowered(false);
    try {
      const data = await aiService.fetchTopics(category, platform);
      setTopics(data);
      setAiPowered(true);
    } catch {
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative glass-card rounded-2xl p-6 glow-cyan neon-border-cyan flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-white text-lg">
            Content Topic Generator
          </h3>
          <p className="text-white/40 text-xs">
            Generate viral topic ideas instantly
          </p>
        </div>
        {aiPowered && topics.length > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
            <Sparkles className="w-3 h-3" /> AI
          </span>
        )}
      </div>

      <div>
        <p className="text-white/50 text-xs mb-2 font-medium">Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              data-ocid={`topics.category.${cat.toLowerCase()}.toggle`}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                category === cat
                  ? "gradient-btn text-white border-transparent"
                  : "border-white/10 text-white/50 hover:border-cyan-500/40 hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-white/50 text-xs mb-2 font-medium">Platform</p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              data-ocid={`topics.platform.${p.toLowerCase()}.toggle`}
              className={`px-3 py-1 rounded-full text-xs transition-all border ${
                platform === p
                  ? "border-cyan-500/60 text-cyan-400 bg-cyan-500/10"
                  : "border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={loading}
        data-ocid="topics.generate.button"
        className="gradient-btn glow-btn py-2.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {loading ? "Generating with AI..." : "Generate Topics"}
      </button>

      <AnimatePresence>
        {topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3"
            data-ocid="topics.results.panel"
          >
            {topics.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-xl bg-white/4 border border-white/8 hover:border-cyan-500/30 transition-all group"
                data-ocid={`topics.item.${i + 1}`}
              >
                <p className="text-white text-sm font-semibold group-hover:text-cyan-300 transition-colors">
                  {t.title}
                </p>
                <p className="text-white/45 text-xs mt-1">{t.desc}</p>
              </motion.div>
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
