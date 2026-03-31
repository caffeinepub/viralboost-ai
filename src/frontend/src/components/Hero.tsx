import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";

const platforms = [
  { label: "YT", color: "#FF0000", name: "YouTube" },
  { label: "IG", color: "url(#ig-grad)", name: "Instagram" },
  { label: "FB", color: "#1877F2", name: "Facebook" },
  { label: "TT", color: "#000", name: "TikTok" },
];

const PARTICLES = [
  { id: "p01", top: 15, left: 8, delay: 0 },
  { id: "p02", top: 25, left: 85, delay: 0.8 },
  { id: "p03", top: 40, left: 20, delay: 1.5 },
  { id: "p04", top: 60, left: 70, delay: 0.3 },
  { id: "p05", top: 75, left: 35, delay: 2.1 },
  { id: "p06", top: 20, left: 55, delay: 1.2 },
  { id: "p07", top: 85, left: 90, delay: 0.6 },
  { id: "p08", top: 10, left: 70, delay: 1.9 },
  { id: "p09", top: 50, left: 5, delay: 0.4 },
  { id: "p10", top: 30, left: 95, delay: 2.5 },
  { id: "p11", top: 65, left: 45, delay: 1.1 },
  { id: "p12", top: 90, left: 15, delay: 0.9 },
  { id: "p13", top: 45, left: 80, delay: 1.7 },
  { id: "p14", top: 70, left: 60, delay: 2.3 },
  { id: "p15", top: 35, left: 12, delay: 0.2 },
  { id: "p16", top: 55, left: 92, delay: 1.4 },
  { id: "p17", top: 80, left: 25, delay: 0.7 },
  { id: "p18", top: 18, left: 40, delay: 2.0 },
  { id: "p19", top: 92, left: 55, delay: 1.6 },
  { id: "p20", top: 28, left: 78, delay: 0.5 },
  { id: "p21", top: 48, left: 33, delay: 2.2 },
  { id: "p22", top: 72, left: 8, delay: 1.3 },
  { id: "p23", top: 38, left: 68, delay: 0.1 },
  { id: "p24", top: 62, left: 88, delay: 1.8 },
  { id: "p25", top: 12, left: 28, delay: 2.4 },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: 'url("/assets/generated/hero-bg.dim_1920x1080.jpg")',
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-400/8 blur-[80px] pointer-events-none" />

      {/* Particle field */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/20 animate-particle"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full pill-tag mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="gradient-text font-semibold text-sm tracking-wide">
            ViralBoost AI
          </span>
          <span className="text-white/30 text-sm">
            — AI-Powered Content Engine
          </span>
        </motion.div>

        {/* FIX #1 — Tighter tracking (-0.03em) for cinematic density */}
        <motion.h1
          className="font-display font-extrabold text-white leading-none"
          style={{
            fontSize: "clamp(52px, 8vw, 88px)",
            letterSpacing: "-0.03em",
          }}
        >
          {["Go", "Viral."].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))}
          <br />
          {/* FIX #1 — text-cinematic-glow adds depth via drop-shadow filter */}
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="gradient-text text-cinematic-glow inline-block"
          >
            Faster.
          </motion.span>
        </motion.h1>

        {/* FIX #1 — subtitle opacity /55 → /72 for better legibility */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-7 text-lg text-white/72 max-w-2xl mx-auto leading-relaxed tracking-wide"
        >
          Discover trending hashtags and generate viral content topics powered
          by AI. Dominate YouTube, Instagram, Facebook &amp; more — with zero
          guesswork.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md animate-pulse" />
            <a
              href="#toolkit"
              data-ocid="hero.analyze_now.button"
              className="relative gradient-btn glow-btn px-8 py-3.5 rounded-full font-bold text-white text-base flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              Analyze Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <span className="text-white/45 text-sm">
            2 free generations — no signup needed
          </span>
        </motion.div>

        {/* Platform row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3">
            {platforms.map((p) => (
              <div
                key={p.label}
                title={p.name}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border border-white/10 hover:scale-110 transition-transform"
                style={{
                  background:
                    p.label === "IG"
                      ? "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
                      : p.color,
                }}
              >
                {p.label}
              </div>
            ))}
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Clock className="w-3 h-3" />
              <span>Active 2 seconds ago</span>
            </div>
          </div>
          <p className="text-white/25 text-xs">
            Trending on 4+ major platforms right now
          </p>
        </motion.div>
      </div>
    </section>
  );
}
