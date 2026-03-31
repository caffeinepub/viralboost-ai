import { Brain, Rocket, Target } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    number: "01",
    icon: Target,
    title: "Input Topic",
    desc: "Enter any keyword or niche topic. Our AI instantly understands your content domain and target audience.",
    color: "text-purple-400",
    glow: "bg-purple-600/15 border-purple-500/25",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analysis",
    desc: "Our engine scans millions of trending posts across platforms to surface the highest-performing hashtags in real-time.",
    color: "text-cyan-400",
    glow: "bg-cyan-500/15 border-cyan-400/25",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Get Viral Insights",
    desc: "Receive platform-tailored hashtags, viral topic ideas, and trend scores — ready to copy and use instantly.",
    color: "text-purple-300",
    glow: "bg-purple-500/15 border-purple-400/25",
  },
];

export function HowItWorks() {
  return (
    <section className="py-28 px-4" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0, scaleX: 0.9 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="gradient-text text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Simple Process
          </motion.p>
          {/* FIX #1 — text-5xl with tight tracking */}
          <h2 className="font-display font-bold text-white text-5xl section-heading">
            How It Works
          </h2>
          <p className="text-white/50 mt-4 text-base">
            From topic to viral content in under 60 seconds
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-purple-600/30 via-cyan-500/30 to-purple-600/30" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              /* FIX #3 — more dramatic hover: deeper lift + subtle scale */
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.25 },
              }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.18,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative text-center cursor-default"
              data-ocid={`how_it_works.step.item.${i + 1}`}
            >
              {/* FIX #3 — larger icon container (w-20 h-20) for more visual presence */}
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-2xl border flex items-center justify-center ${step.glow}`}
              >
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              {/* FIX #3 — step number at full opacity (removed opacity-60) */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full">
                <span className="gradient-text font-display font-bold text-xs">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
