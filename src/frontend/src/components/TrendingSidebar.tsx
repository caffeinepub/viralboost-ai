import { Flame, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type SidebarContent,
  fetchSidebarContent,
} from "../services/aiService";

const TOP_PLATFORMS = [
  { label: "YouTube", abbr: "YT", color: "#FF0000" },
  { label: "Instagram", abbr: "IG", color: "#bc1888" },
  { label: "TikTok", abbr: "TT", color: "#222" },
  { label: "Facebook", abbr: "FB", color: "#1877F2" },
];

const HASHTAG_SKELETON_KEYS = [
  "hs-1",
  "hs-2",
  "hs-3",
  "hs-4",
  "hs-5",
  "hs-6",
  "hs-7",
  "hs-8",
];
const TOPIC_SKELETON_KEYS = ["ts-1", "ts-2", "ts-3", "ts-4"];

const DEFAULT_CONTENT: SidebarContent = {
  hashtags: [
    "#Viral2025",
    "#AIContent",
    "#GrowthHacking",
    "#ContentMarketing",
    "#SocialMediaTips",
    "#DigitalCreator",
    "#TrendingNow",
    "#CreatorEconomy",
    "#VideoMarketing",
    "#InstagramTips",
  ],
  topics: [
    "AI-Generated Short Films",
    "Micro-Influencer Monetization",
    "Interactive Live Polls",
    "Faceless Content Strategy",
    "Vertical Video Storytelling",
  ],
};

export function TrendingSidebar() {
  const [content, setContent] = useState<SidebarContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSidebarContent().then((data) => {
      setContent(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="relative">
      {/* Animated gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl animated-border opacity-60" />
      <motion.aside
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative glass-card rounded-2xl p-6 flex flex-col gap-6"
        style={{ border: "none" }}
        data-ocid="sidebar.panel"
      >
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <h3 className="font-display font-bold text-white text-lg">
            Trending Now
          </h3>
          <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>

        <div>
          <p className="text-white/40 text-xs font-semibold mb-3 uppercase tracking-wider">
            Popular Hashtags
          </p>
          {loading ? (
            <div
              className="flex flex-wrap gap-2"
              data-ocid="sidebar.loading_state"
            >
              {HASHTAG_SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="h-6 w-20 rounded-full bg-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="pill-tag px-2.5 py-1 rounded-full text-xs text-white/70 cursor-pointer hover:text-white transition-colors"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-white/40 text-xs font-semibold mb-3 uppercase tracking-wider">
            Emerging Topics
          </p>
          {loading ? (
            <div className="flex flex-col gap-2">
              {TOPIC_SKELETON_KEYS.map((k) => (
                <div
                  key={k}
                  className="h-4 bg-white/10 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {content.topics.map((topic, i) => (
                <div
                  key={topic}
                  className="flex items-center gap-2"
                  data-ocid={`sidebar.topic.item.${i + 1}`}
                >
                  <Zap className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="text-white/65 text-xs hover:text-white transition-colors cursor-pointer">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-white/40 text-xs font-semibold mb-3 uppercase tracking-wider">
            Top Platforms
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TOP_PLATFORMS.map((p) => (
              <div
                key={p.label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/4 border border-white/8 hover:border-white/15 transition-all cursor-pointer"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    background:
                      p.label === "Instagram"
                        ? "linear-gradient(45deg,#f09433,#bc1888)"
                        : p.color,
                  }}
                >
                  {p.abbr}
                </div>
                <span className="text-white/60 text-xs">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
