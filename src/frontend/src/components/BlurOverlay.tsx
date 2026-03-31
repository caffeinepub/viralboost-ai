import { Lock, Play, SkipForward, Unlock, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface BlurOverlayProps {
  unlockedBonus: boolean;
  onDismiss: () => void;
  onWatchAd: () => void;
}

type AdState = "idle" | "watching" | "done";

const AD_DURATION = 15;
const SKIP_AFTER = 5;

const ADS = [
  {
    brand: "ProCreator Studio",
    tagline: "Level up your content game",
    cta: "Try Free for 30 Days",
    bg: "from-purple-900/80 to-indigo-900/80",
    accent: "text-purple-300",
    bar: "bg-purple-500",
  },
  {
    brand: "ViralEdge Pro",
    tagline: "10x your reach with AI hashtags",
    cta: "Get Started Now",
    bg: "from-cyan-900/80 to-blue-900/80",
    accent: "text-cyan-300",
    bar: "bg-cyan-500",
  },
  {
    brand: "ContentOS",
    tagline: "Auto-schedule posts that go viral",
    cta: "Start Your Free Trial",
    bg: "from-pink-900/80 to-rose-900/80",
    accent: "text-pink-300",
    bar: "bg-pink-500",
  },
];

export function BlurOverlay({
  unlockedBonus,
  onDismiss,
  onWatchAd,
}: BlurOverlayProps) {
  const [adState, setAdState] = useState<AdState>("idle");
  const [timeLeft, setTimeLeft] = useState(AD_DURATION);
  const [canSkip, setCanSkip] = useState(false);
  const [adIndex] = useState(() => Math.floor(Math.random() * ADS.length));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ad = ADS[adIndex];

  useEffect(() => {
    if (adState === "watching") {
      setTimeLeft(AD_DURATION);
      setCanSkip(false);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setAdState("done");
            onWatchAd();
            return 0;
          }
          if (prev === AD_DURATION - SKIP_AFTER + 1) setCanSkip(true);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [adState, onWatchAd]);

  const handleSkip = () => {
    if (!canSkip) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAdState("done");
    onWatchAd();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl overflow-hidden"
      data-ocid="usage.modal"
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/80 rounded-2xl" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className="relative z-10 text-center px-8 py-8 max-w-sm w-full"
      >
        <AnimatePresence mode="wait">
          {unlockedBonus ? (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Unlock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">
                Unlocked! 🎉
              </h3>
              <p className="text-white/60 text-sm mb-6">
                You have 1 more free generation.
              </p>
              <button
                type="button"
                onClick={onDismiss}
                data-ocid="usage.continue.button"
                className="gradient-btn glow-btn px-6 py-2.5 rounded-full font-semibold text-white text-sm w-full transition-all hover:scale-105"
              >
                Continue
              </button>
            </motion.div>
          ) : adState === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center animate-pulse">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">
                🔒 Daily Limit Reached
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Watch a short ad to unlock 1 more free generation.
              </p>
              <button
                type="button"
                onClick={() => setAdState("watching")}
                data-ocid="usage.watch_ad.button"
                className="gradient-btn glow-btn px-6 py-2.5 rounded-full font-semibold text-white text-sm w-full mb-3 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4" />
                Watch Ad to Unlock
              </button>
              <p className="text-white/25 text-xs">
                Only {AD_DURATION} seconds — then you're back!
              </p>
            </motion.div>
          ) : adState === "watching" ? (
            <motion.div
              key="watching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div
                className={`rounded-xl bg-gradient-to-br ${ad.bg} border border-white/10 p-5 mb-4 text-left`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
                    Sponsored
                  </span>
                  <span className={`text-[10px] font-bold ${ad.accent}`}>
                    {ad.brand}
                  </span>
                </div>
                <p className="text-white font-display font-bold text-lg leading-tight mb-3">
                  {ad.tagline}
                </p>
                <div className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-white/15 border border-white/20">
                  {ad.cta}
                </div>
              </div>

              <div className="mb-3">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${ad.bar} rounded-full`}
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / AD_DURATION) * 100}%` }}
                    transition={{ duration: 0.9, ease: "linear" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs">
                  Ad ends in{" "}
                  <span className="text-white font-bold font-mono">
                    {timeLeft}s
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={!canSkip}
                  data-ocid="usage.skip_ad.button"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    canSkip
                      ? "border-white/30 text-white hover:bg-white/10 cursor-pointer"
                      : "border-white/10 text-white/25 cursor-not-allowed"
                  }`}
                >
                  <SkipForward className="w-3 h-3" />
                  {canSkip
                    ? "Skip Ad"
                    : `Skip in ${Math.max(0, SKIP_AFTER - (AD_DURATION - timeLeft))}s`}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Unlock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">
                Access Unlocked! 🎉
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Thanks for watching. You have 1 extra generation.
              </p>
              <button
                type="button"
                onClick={onDismiss}
                data-ocid="usage.continue.button"
                className="gradient-btn glow-btn px-6 py-2.5 rounded-full font-semibold text-white text-sm w-full flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <X className="w-4 h-4" />
                Continue
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
