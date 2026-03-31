import {
  AlertTriangle,
  Check,
  Copy,
  Flame,
  Link2,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type ViralScoreResult,
  analyzeVideoViral,
  detectPlatform,
} from "../services/aiService";
import type { UseUsageController } from "../types";
import { BlurOverlay } from "./BlurOverlay";

interface ViralScoreAnalyzerProps {
  usageCtrl: UseUsageController;
}

interface PlatformBadge {
  emoji: string;
  name: string;
  color: string;
}

function getPlatformBadge(url: string): PlatformBadge | null {
  if (!url) return null;
  if (/youtube\.com|youtu\.be/.test(url))
    return {
      emoji: "\uD83C\uDFA5",
      name: "YouTube",
      color: "bg-red-900/30 text-red-300 border border-red-500/30",
    };
  if (/tiktok\.com/.test(url))
    return {
      emoji: "\uD83C\uDFB5",
      name: "TikTok",
      color: "bg-pink-900/30 text-pink-300 border border-pink-500/30",
    };
  if (/instagram\.com/.test(url))
    return {
      emoji: "\uD83D\uDCF7",
      name: "Instagram",
      color: "bg-purple-900/30 text-purple-300 border border-purple-500/30",
    };
  if (/facebook\.com/.test(url))
    return {
      emoji: "\uD83D\uDC64",
      name: "Facebook",
      color: "bg-blue-900/30 text-blue-300 border border-blue-500/30",
    };
  if (/twitter\.com|x\.com/.test(url))
    return {
      emoji: "\uD83D\uDC26",
      name: "Twitter / X",
      color: "bg-sky-900/30 text-sky-300 border border-sky-500/30",
    };
  return null;
}

function getScoreLabel(score: number): {
  label: string;
  colorClass: string;
  glowClass: string;
} {
  if (score <= 40)
    return { label: "Low Viral", colorClass: "text-red-400", glowClass: "" };
  if (score <= 60)
    return { label: "Moderate", colorClass: "text-yellow-400", glowClass: "" };
  if (score <= 80)
    return {
      label: "Good Potential",
      colorClass: "text-green-400",
      glowClass: "",
    };
  return {
    label: "Viral Ready!",
    colorClass: "text-cyan-400",
    glowClass: "glow-cyan",
  };
}

function getCategoryBarGradient(score: number): string {
  if (score < 50) return "linear-gradient(90deg, #ff4d4d, #ff7070)";
  if (score < 70) return "linear-gradient(90deg, #f59e0b, #fcd34d)";
  return "linear-gradient(90deg, #8b2cff, #16e0ff)";
}

function getCategoryScoreClass(score: number): string {
  if (score < 50) return "text-red-400";
  if (score < 70) return "text-yellow-400";
  return "text-cyan-400";
}

interface ScoreGaugeProps {
  score: number;
  animate: boolean;
}

function ScoreGauge({ score, animate }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(0);
      return;
    }
    const duration = 1100;
    const steps = 50;
    const increment = score / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [animate, score]);

  const r = 52;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const displayOffset = animate
    ? circumference * (1 - score / 100)
    : circumference;
  const { label, colorClass, glowClass } = getScoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative rounded-full ${glowClass}`}>
        <svg
          width="160"
          height="160"
          viewBox="0 0 120 120"
          role="img"
          aria-label={`Viral score: ${score} out of 100`}
        >
          <title>{`Viral score: ${score} out of 100`}</title>
          <defs>
            <linearGradient
              id="viralScoreGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8b2cff" />
              <stop offset="100%" stopColor="#16e0ff" />
            </linearGradient>
          </defs>
          {/* Track circle */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="9"
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="url(#viralScoreGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={displayOffset}
            transform="rotate(-90 60 60)"
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {/* Score text — animated counter */}
          <text
            x="60"
            y="55"
            textAnchor="middle"
            fill="white"
            fontSize="26"
            fontWeight="700"
          >
            {displayScore}
          </text>
          <text
            x="60"
            y="71"
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize="8.5"
          >
            OUT OF 100
          </text>
        </svg>
      </div>
      <span
        className={`font-display font-bold text-lg tracking-wide ${colorClass}`}
      >
        {label}
      </span>
    </div>
  );
}

// ── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
        bg-white/[0.06] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20
        active:scale-95"
      aria-label={`Copy ${label ?? "text"}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label ?? "Copy"}</span>
        </>
      )}
    </button>
  );
}

export function ViralScoreAnalyzer({ usageCtrl }: ViralScoreAnalyzerProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralScoreResult | null>(null);
  const [gaugeAnimate, setGaugeAnimate] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);

  const detectedPlatform = detectPlatform(url);
  const platformBadge = getPlatformBadge(url);

  // Trigger gauge animation shortly after results appear
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => setGaugeAnimate(true), 120);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    // Basic URL validation
    try {
      new URL(url.trim());
    } catch {
      setUrlError(true);
      setTimeout(() => setUrlError(false), 2500);
      return;
    }
    setUrlError(false);
    if (!usageCtrl.tryGenerate()) return;
    setLoading(true);
    setResult(null);
    setGaugeAnimate(false);
    try {
      const res = await analyzeVideoViral(url.trim());
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="glass-card rounded-2xl p-6 neon-border-purple glow-purple">
        {/* ── Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-white text-lg leading-tight">
              Video Viral Score Analyzer
            </h3>
            <p className="text-white/40 text-xs mt-0.5">
              Paste your video URL and get an AI-powered virality score
            </p>
          </div>
          <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold gradient-btn text-white">
            AI-Powered
          </span>
        </div>

        {/* ── URL Input */}
        <div className="mb-4 flex flex-col gap-2.5">
          <div className="relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleAnalyze();
              }}
              placeholder="Paste YouTube, TikTok, Instagram, Facebook or Twitter link\u2026"
              aria-label="Video URL for viral score analysis"
              className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                urlError
                  ? "border-red-500/60 focus:border-red-500/80"
                  : "border-white/10 focus:border-purple-500/60 focus:bg-white/[0.07]"
              }`}
              data-ocid="viral_score.input"
            />
          </div>

          {/* URL error message */}
          <AnimatePresence>
            {urlError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-red-400 text-xs px-1"
                data-ocid="viral_score.error_state"
              >
                Please enter a valid video URL (e.g.
                https://youtube.com/watch?v=…)
              </motion.p>
            )}
          </AnimatePresence>

          {/* Platform detection badge */}
          <AnimatePresence>
            {platformBadge && !urlError && (
              <motion.div
                key={detectedPlatform}
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold w-fit ${platformBadge.color}`}
              >
                <span>{platformBadge.emoji}</span>
                <span>{platformBadge.name} detected</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Analyze Button */}
        <button
          type="button"
          onClick={() => void handleAnalyze()}
          disabled={!url.trim() || loading}
          data-ocid="viral_score.submit_button"
          className="gradient-btn glow-btn w-full py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing\u2026
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Analyze Viral Score
            </>
          )}
        </button>

        {/* Loading state */}
        {loading && (
          <div className="mt-6" data-ocid="viral_score.loading_state">
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-14 h-14 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
              <p className="text-white/40 text-sm">
                AI is analyzing virality factors\u2026
              </p>
            </div>
          </div>
        )}

        {/* ── Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-8"
              data-ocid="viral_score.success_state"
            >
              {/* Platform + title strip */}
              <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
                  {result.platform}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/60 text-sm truncate flex-1">
                  {result.videoTitle !== "Video Analysis"
                    ? result.videoTitle
                    : url}
                </span>
              </div>

              {/* Overall Score Gauge */}
              <div className="flex justify-center mb-8">
                <ScoreGauge score={result.overall} animate={gaugeAnimate} />
              </div>

              {/* ── Category Breakdown */}
              <div className="mb-8">
                <h4 className="font-display font-semibold text-white text-base mb-5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Score Breakdown
                </h4>
                <div className="flex flex-col gap-5">
                  {result.categories.map((cat, i) => (
                    <div key={cat.name} data-ocid={`viral_score.item.${i + 1}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white/80 text-sm font-medium">
                          {cat.name}
                        </span>
                        <span
                          className={`text-sm font-bold tabular-nums ${getCategoryScoreClass(cat.score)}`}
                        >
                          {cat.score}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-[5px] rounded-full bg-white/[0.08] overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.score}%` }}
                          transition={{
                            duration: 0.9,
                            delay: i * 0.07,
                            ease: "easeOut",
                          }}
                          style={{
                            height: "100%",
                            borderRadius: "9999px",
                            background: getCategoryBarGradient(cat.score),
                          }}
                        />
                      </div>
                      {/* Recommendation */}
                      <p className="text-white/35 text-xs leading-relaxed">
                        {cat.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Top Fixes */}
              <div className="mb-8">
                <h4 className="font-display font-semibold text-white text-base mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Fix These First
                </h4>
                <div className="flex flex-col gap-3">
                  {result.topFixes.map((fix, i) => (
                    <div
                      key={fix}
                      data-ocid={`viral_score.fix.item.${i + 1}`}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.07] border-l-2 border-amber-500/60"
                    >
                      <div className="w-5 h-5 rounded-full bg-amber-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-400 text-xs font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-white/65 text-sm leading-relaxed">
                        {fix}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Exact Solutions */}
              {result.exactSolutions && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  data-ocid="viral_score.exact_solutions"
                >
                  {/* Section header */}
                  <div className="flex items-center gap-2 mb-5 pt-2 border-t border-white/[0.06]">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <h4 className="font-display font-semibold text-white text-base">
                      Exact Solutions
                    </h4>
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 tracking-wide uppercase">
                      Copy & Use
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Optimized Title */}
                    <div
                      className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden"
                      data-ocid="viral_score.exact_title"
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                          Optimized Title
                        </span>
                        <CopyButton
                          text={result.exactSolutions.title}
                          label="Copy Title"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-white text-sm font-medium leading-snug">
                          {result.exactSolutions.title}
                        </p>
                      </div>
                    </div>

                    {/* Optimized Description */}
                    <div
                      className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden"
                      data-ocid="viral_score.exact_description"
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                          Optimized Description
                        </span>
                        <CopyButton
                          text={result.exactSolutions.description}
                          label="Copy Desc"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <pre className="text-white/70 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                          {result.exactSolutions.description}
                        </pre>
                      </div>
                    </div>

                    {/* Optimized Hashtags */}
                    <div
                      className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden"
                      data-ocid="viral_score.exact_hashtags"
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                        <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                          Optimized Hashtags
                        </span>
                        <CopyButton
                          text={result.exactSolutions.hashtags.join(" ")}
                          label="Copy All"
                        />
                      </div>
                      <div className="px-4 py-3 flex flex-wrap gap-2">
                        {result.exactSolutions.hashtags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              void navigator.clipboard
                                .writeText(tag)
                                .then(() => {
                                  setCopiedHashtag(tag);
                                  setTimeout(
                                    () => setCopiedHashtag(null),
                                    1800,
                                  );
                                });
                            }}
                            title={`Copy ${tag}`}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                              copiedHashtag === tag
                                ? "bg-green-500/20 border-green-500/40 text-green-300"
                                : "bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25 hover:text-white"
                            }`}
                          >
                            {copiedHashtag === tag ? "✓ " : ""}
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Usage Gate Overlay */}
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
