import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { GeminiSettings } from "./GeminiSettings";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Hashtags", href: "#toolkit" },
    { label: "Topic Gen", href: "#toolkit" },
    { label: "Trends", href: "#toolkit" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-btn glow-btn flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">
                VB
              </span>
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              ViralBoost <span className="gradient-text">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <GeminiSettings />
            <button
              type="button"
              data-ocid="nav.get_started.button"
              className="gradient-btn glow-btn px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            >
              Get Started Free
            </button>
          </div>

          <button
            type="button"
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile_menu.button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-white/5"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-white/70 hover:text-white py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center justify-between mt-2">
                <GeminiSettings />
                <button
                  type="button"
                  className="gradient-btn px-5 py-2 rounded-full text-sm font-semibold text-white"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
