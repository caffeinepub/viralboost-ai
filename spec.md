# ViralBoost AI

## Current State
Fully functional SaaS-style app with:
- Hero section with static background, gradient glows, motion animations
- Navbar with glassmorphism, Gemini AI pill, mobile menu
- ViralScoreAnalyzer: URL input → AI score gauge + breakdown + exact solutions
- HashtagSearch: topic + platform → tiered hashtag results
- TopicGenerator: category + platform → 5 viral topic ideas
- RealTimeTrends: live trending hashtags with platform filters
- TrendingSidebar: sticky sidebar with hashtags, topics, platform links
- HowItWorks: 3-step process section
- BlurOverlay: usage gate with ad simulation
- Footer with attribution
- AdBanner placeholders
- Framer Motion animations throughout
- Dark neon aesthetic: black bg, purple/cyan gradients, glassmorphism cards

## Requested Changes (Diff)

### Add
- **Cinematic animated background**: Floating gradient orbs / mesh that slowly drift across the hero and page
- **Particle field**: Subtle floating dots/stars in the hero section for depth
- **Animated gradient border**: Cards get a slow flowing gradient border animation on key components
- **Score counter animation**: The viral score number counts up from 0 when results appear
- **Typing / reveal animation**: Hero headline uses a character stagger reveal for cinematic entrance
- **Parallax scroll layers**: Background glows move at different rates as user scrolls
- **Shimmer loading**: Replace basic spinners with a cinematic shimmer skeleton
- **3D card hover tilt**: Cards respond to mouse movement with subtle perspective tilt
- **Cinematic section reveals**: whileInView animations with more dramatic timing and distance
- **Animated trend bars**: Score bars fill with a cinematic easing, with a glow sweep effect
- **Pulsing glow rings**: The logo and key icons have subtle animated rings expanding outward

### Modify
- **index.css**: Add keyframe animations for: floating orbs, animated gradient border, shimmer sweep, glow ring pulse, particle drift, card tilt transitions
- **Hero.tsx**: Add animated particle field (CSS-based floating dots), improve stagger timing, add depth layers, add a cinematic intro sequence
- **App.tsx**: Add animated background mesh layer that spans full page
- **RealTimeTrends.tsx**: Fix bug — `spinning` state gets stuck; spinning clears before fetch completes. Fix: tie spinning to loading state instead of setTimeout
- **BlurOverlay.tsx**: Fix bug — `cooldown` prop is declared but never used. Fix: display remaining cooldown info or remove unused prop
- **ViralScoreAnalyzer.tsx**: Fix bugs:
  1. Score number should animate (count up from 0 to final value)
  2. Individual hashtag copy buttons have no visual feedback — add copied state per tag
  3. Add URL validation before submitting (basic URL format check)
- **HashtagSearch.tsx**: Fix bugs:
  1. `handleSearch` called directly in onClick without void — wrap in void or arrow
  2. `copyTag` button click should void the promise
- **ScoreGauge**: Replace static text number with animated counter that counts from 0 to score value
- **HowItWorks.tsx**: Add connecting animated dashes between steps, more dramatic entrance animation
- **TrendingSidebar.tsx**: Improve hashtag pill hover effects, add animated indicator dot

### Remove
- Nothing removed

## Implementation Plan

1. **index.css enhancements**: Add @keyframes for: `float-orb` (slow drift), `border-flow` (gradient border animation), `shimmer` (loading sweep), `glow-ring` (expanding ring pulse), `count-up` timing reference, `particle-float` (micro dot movement). Add utility classes: `.animated-border`, `.shimmer-text`, `.glow-ring`.

2. **Background mesh layer in App.tsx**: Add a fixed `<div>` behind all content with 3-4 absolutely positioned blurred gradient orbs that use CSS animation to slowly drift. Colors: purple/cyan matching brand.

3. **Hero.tsx — particle field**: Add 20-30 absolutely positioned tiny dots (w-0.5 h-0.5, white/10) with staggered CSS animation delays for a starfield effect. Each dot has random position and random animation-delay for natural drift.

4. **Hero.tsx — cinematic text reveal**: Wrap each word of the headline in a `motion.span` with staggered `y: 40 → 0` and `opacity: 0 → 1` with `delay: i * 0.08`.

5. **ScoreGauge counter**: Add `useEffect` to animate from 0 to `score` using `useState(displayScore)` and a `setInterval` incrementing by ~2 per frame when `animate` is true.

6. **ViralScoreAnalyzer bug fixes**:
   - Add `copiedTags: Set<string>` state for per-hashtag copy feedback
   - Add simple URL regex validation before calling `analyzeVideoViral`
   - Integrate counter into ScoreGauge

7. **HashtagSearch bug fixes**: Wrap `onClick={() => void handleSearch()}` and `onClick={() => void copyTag(tag)}`

8. **RealTimeTrends bug fix**: Remove the 700ms `setTimeout` hack. Instead, tie the `spinning` class directly to `loading` state: `className={loading ? 'animate-spin' : ''}`

9. **BlurOverlay bug fix**: Either remove `cooldown` from props interface and the call site, or display it. Since cooldown is passed from usageCtrl but not meaningful in current flow, remove the prop entirely from the interface and call sites.

10. **Card hover tilt**: Add `whileHover` on key glass-card motion wrappers with `rotateX`, `rotateY` subtle values and `perspective` style.

11. **Validate entire build**: Typecheck + lint + build must pass.
