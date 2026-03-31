import { Send } from "lucide-react";
import { useState } from "react";
import { SiInstagram, SiX, SiYoutube } from "react-icons/si";

const LINKS = {
  Product: ["Hashtag Search", "Topic Generator", "Trend Tracker", "Analytics"],
  Company: ["About", "Blog", "Careers", "Press"],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6 bg-black/60 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-btn flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm">
                  VB
                </span>
              </div>
              <span className="font-display font-bold text-white text-lg">
                ViralBoost <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed">
              The AI-powered toolkit that helps creators and brands dominate
              social media.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/40 transition-all"
              >
                <SiX className="w-3.5 h-3.5 text-white/50" />
              </a>
              <a
                href="https://www.instagram.com/tansoft_labs?igsh=MXkxYWI2bWF6OHlnOQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/40 transition-all"
              >
                <SiInstagram className="w-3.5 h-3.5 text-white/50" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-500/40 transition-all"
              >
                <SiYoutube className="w-3.5 h-3.5 text-white/50" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-display font-semibold text-white text-sm mb-4">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <span className="text-white/40 text-sm cursor-pointer hover:text-white/80 transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-2">
              Stay Ahead of Trends
            </h4>
            <p className="text-white/35 text-xs mb-4">
              Weekly viral content insights in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-ocid="footer.newsletter.input"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/50 transition-colors min-w-0"
              />
              <button
                type="button"
                data-ocid="footer.newsletter.submit_button"
                className="gradient-btn px-3 py-2 rounded-xl flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {year} ViralBoost AI. All rights reserved.
          </p>
          <p className="text-white/40 text-xs font-medium">
            Created by{" "}
            <span className="gradient-text font-semibold">Tanmoy Saha</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
