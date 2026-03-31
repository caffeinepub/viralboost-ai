import { Toaster } from "@/components/ui/sonner";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { AdBanner } from "./components/AdBanner";
import { Footer } from "./components/Footer";
import { HashtagSearch } from "./components/HashtagSearch";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { RealTimeTrends } from "./components/RealTimeTrends";
import { TopicGenerator } from "./components/TopicGenerator";
import { TrendingSidebar } from "./components/TrendingSidebar";
import { ViralScoreAnalyzer } from "./components/ViralScoreAnalyzer";
import { useUsageController } from "./hooks/useUsageController";
import { initGeminiKey } from "./services/aiService";

export default function App() {
  const usageCtrl = useUsageController();

  useEffect(() => {
    initGeminiKey();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster theme="dark" position="top-right" />

      {/* Cinematic background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="animate-orb absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="animate-orb-slow absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-400/6 blur-[140px]" />
        <div
          className="animate-orb absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]"
          style={{ animationDelay: "-8s" }}
        />
        <div
          className="animate-orb-slow absolute top-[60%] left-[20%] w-[250px] h-[250px] rounded-full bg-cyan-300/4 blur-[60px]"
          style={{ animationDelay: "-14s" }}
        />
      </div>

      <Navbar />

      <div className="relative z-10">
        <header>
          <Hero />
        </header>

        <AdBanner slot="1234567890" format="horizontal" />

        <main>
          <section
            id="toolkit"
            aria-label="Content creation toolkit"
            className="py-24 px-4"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-14"
              >
                {/* FIX #1 — Eyebrow with more breath */}
                <motion.p
                  initial={{ opacity: 0, scaleX: 0.9 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="gradient-text text-sm font-semibold uppercase tracking-widest mb-4"
                >
                  AI-Powered Tools
                </motion.p>
                {/* FIX #1 — text-5xl with tight tracking for cinematic weight */}
                <h2 className="font-display font-bold text-white text-5xl section-heading">
                  Your Content Toolkit
                </h2>
                <p className="text-white/50 mt-4 text-base max-w-xl mx-auto leading-relaxed">
                  Everything you need to find viral hashtags, generate
                  compelling topics, and stay ahead of trends.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full pill-tag">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-white/55 text-xs">
                    {usageCtrl.remaining > 0
                      ? `${usageCtrl.remaining} free generation${
                          usageCtrl.remaining !== 1 ? "s" : ""
                        } remaining`
                      : usageCtrl.unlockedBonus
                        ? "Bonus generation unlocked!"
                        : "Upgrade for unlimited generations"}
                  </span>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
                <div className="flex flex-col gap-6">
                  {/* Video Viral Score Analyzer — first in the toolkit */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ViralScoreAnalyzer usageCtrl={usageCtrl} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <HashtagSearch usageCtrl={usageCtrl} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <TopicGenerator usageCtrl={usageCtrl} />
                  </motion.div>
                  <AdBanner slot="0987654321" format="rectangle" />
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.55,
                      delay: 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <RealTimeTrends />
                  </motion.div>
                </div>
                <div className="lg:sticky lg:top-20">
                  <TrendingSidebar />
                </div>
              </div>
            </div>
          </section>
          <HowItWorks />
        </main>

        <Footer />
      </div>
    </div>
  );
}
