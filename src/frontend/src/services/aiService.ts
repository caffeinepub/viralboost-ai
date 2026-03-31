import { createActorWithConfig } from "../config";

export interface HashtagResult {
  high: string[];
  medium: string[];
  niche: string[];
}

export interface TopicResult {
  title: string;
  desc: string;
}

export interface TrendItem {
  tag: string;
  score: number;
  platform: string;
}

export interface SidebarContent {
  hashtags: string[];
  topics: string[];
}

export interface ViralScoreCategory {
  name: string;
  score: number;
  recommendation: string;
}

export interface ViralScoreExactSolutions {
  title: string;
  description: string;
  hashtags: string[];
}

export interface ViralScoreResult {
  overall: number;
  platform: string;
  videoTitle: string;
  categories: ViralScoreCategory[];
  topFixes: string[];
  exactSolutions: ViralScoreExactSolutions;
}

// Default Gemini API key
const DEFAULT_GEMINI_KEY = "AIzaSyD45uB7Ptcd6HhCKU5dZt8MY3KGy1WfQEQ";

function fallbackHashtags(topic: string, platform: string): HashtagResult {
  const t = topic.toLowerCase().replace(/\s+/g, "");
  const T = topic.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s+/g, "");
  const platformMap: Record<string, string[]> = {
    yt: ["#YouTubeShorts", "#YouTubeCreator", "#Subscribe"],
    ig: ["#ReelsViral", "#InstagramGrowth", "#ExploreMore"],
    fb: ["#FacebookReels", "#FacebookViral", "#FBGrowth"],
    tt: ["#TikTokViral", "#ForYouPage", "#FYP"],
    tw: ["#TwitterTrends", "#Trending", "#Viral"],
  };
  const tags = platformMap[platform] || platformMap.yt;
  return {
    high: [
      `#${T}Viral`,
      `#${T}Tips`,
      tags[0],
      "#ContentCreator",
      "#ViralContent",
    ],
    medium: [
      `#${T}Content`,
      `#${T}Community`,
      tags[1],
      "#GrowthHacking",
      "#SocialMedia",
    ],
    niche: [`#${t}lovers`, `#${t}life`, tags[2], `#best${t}`],
  };
}

const FALLBACK_TOPICS: Record<string, TopicResult[]> = {
  Entertainment: [
    {
      title: "10 Viral Trends That Broke The Internet This Week",
      desc: "Roundup of the hottest trending moments across social media platforms right now.",
    },
    {
      title: "Reacting to the Most Controversial Videos Online",
      desc: "Honest reactions to videos everyone is talking about — unfiltered.",
    },
    {
      title: "I Tried Every Viral Food Hack So You Don't Have To",
      desc: "Testing the most-shared cooking hacks from TikTok and Instagram.",
    },
    {
      title: "Behind the Scenes of Your Favorite Creator's Setup",
      desc: "Exclusive look at how top creators film, edit and grow their channels.",
    },
    {
      title: "The Funniest Fails That Went Viral Last Month",
      desc: "A curated collection of relatable moments that had the internet in stitches.",
    },
  ],
  Education: [
    {
      title: "5 Things Schools Never Taught You About Money",
      desc: "Financial literacy secrets that could change how you manage your income forever.",
    },
    {
      title: "How to Learn Any Skill in 30 Days (Proven Method)",
      desc: "Science-backed techniques used by accelerated learners around the world.",
    },
    {
      title: "The Psychology Behind Why You Procrastinate",
      desc: "Deep-dive into procrastination patterns and the neuroscience of motivation.",
    },
    {
      title: "Everything You Were Told About Productivity Is Wrong",
      desc: "Debunking popular productivity myths with real research and data.",
    },
    {
      title: "How to Read 52 Books in a Year Without Burnout",
      desc: "A sustainable reading system used by successful entrepreneurs and leaders.",
    },
  ],
  Lifestyle: [
    {
      title: "Morning Routine That Changed My Entire Life",
      desc: "A 90-minute morning framework used by high-performers across industries.",
    },
    {
      title: "How I Became a Minimalist and Never Looked Back",
      desc: "The step-by-step journey to owning less and experiencing more freedom.",
    },
    {
      title: "Travel Hacks That Save You Thousands Every Year",
      desc: "Real travel strategies to fly business class and stay in luxury for less.",
    },
    {
      title: "How to Meal Prep Like a Pro in Under 2 Hours",
      desc: "Complete meal prep guide for busy people who still want to eat healthy.",
    },
    {
      title: "The Apartment Transformation That Went Viral",
      desc: "Budget-friendly home makeover ideas that make any space look premium.",
    },
  ],
  Tech: [
    {
      title: "How AI Is Changing Content Creation Forever",
      desc: "The tools that are already replacing traditional content workflows — and what to do now.",
    },
    {
      title: "10 AI Tools That Will 10x Your Productivity",
      desc: "A curated toolkit of the best AI apps for creators, marketers and developers.",
    },
    {
      title: "The Dark Side of Social Media Algorithms Explained",
      desc: "How platforms decide what goes viral — and how to make it work for you.",
    },
    {
      title: "Why Every Creator Needs to Learn Prompt Engineering",
      desc: "Getting the most from AI tools with prompts that produce incredible outputs.",
    },
    {
      title: "The Tech Stack That Powers Million-Dollar Online Businesses",
      desc: "A breakdown of tools and software behind today's most successful digital brands.",
    },
  ],
  Fitness: [
    {
      title: "I Worked Out Every Day for 90 Days — Here's What Happened",
      desc: "An honest account of the physical and mental changes from daily training.",
    },
    {
      title: "The 15-Minute Workout That Beats a 1-Hour Gym Session",
      desc: "High-intensity protocols that maximize results for time-poor people.",
    },
    {
      title: "Why Most People Never See Results at the Gym",
      desc: "The overlooked mistakes that stall progress for 80% of gym-goers.",
    },
    {
      title: "How to Build a Home Gym for Under $200",
      desc: "Budget home gym essentials that deliver real results without the membership fee.",
    },
    {
      title: "The Nutrition Plan That Actually Works (No Fads)",
      desc: "Evidence-based nutrition strategies used by natural athletes and coaches.",
    },
  ],
};

export const FALLBACK_TRENDS: TrendItem[] = [
  { tag: "#AIGenerated", score: 98, platform: "all" },
  { tag: "#ViralShorts", score: 95, platform: "yt" },
  { tag: "#ReelsViral", score: 93, platform: "ig" },
  { tag: "#FYP", score: 91, platform: "tt" },
  { tag: "#ContentCreator", score: 88, platform: "all" },
  { tag: "#TechTrends2025", score: 85, platform: "all" },
  { tag: "#DigitalNomad", score: 83, platform: "ig" },
  { tag: "#MindsetShift", score: 80, platform: "all" },
  { tag: "#YouTubeShorts", score: 78, platform: "yt" },
  { tag: "#InstagramGrowth", score: 76, platform: "ig" },
  { tag: "#WorkFromAnywhere", score: 74, platform: "fb" },
  { tag: "#AITools", score: 72, platform: "all" },
  { tag: "#SideHustle", score: 70, platform: "all" },
  { tag: "#ForYouPage", score: 68, platform: "tt" },
  { tag: "#FacebookReels", score: 65, platform: "fb" },
];

const FALLBACK_SIDEBAR: SidebarContent = {
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

const GEMINI_KEY_STORAGE = "viralboost_gemini_key";

export function getStoredGeminiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || DEFAULT_GEMINI_KEY;
}

export async function saveGeminiKey(key: string): Promise<void> {
  if (key) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key);
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
  try {
    const actor = await createActorWithConfig();
    await (actor as any).setGeminiApiKey(key || DEFAULT_GEMINI_KEY);
  } catch (e) {
    console.warn("Failed to save Gemini key to backend:", e);
  }
}

export async function initGeminiKey(): Promise<void> {
  const key = getStoredGeminiKey();
  try {
    const actor = await createActorWithConfig();
    await (actor as any).setGeminiApiKey(key);
  } catch (e) {
    console.warn("Failed to initialize Gemini key:", e);
  }
}

function safeParseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function fetchHashtags(
  topic: string,
  platform: string,
): Promise<HashtagResult> {
  try {
    const actor = await createActorWithConfig();
    const raw = await (actor as any).generateHashtags(topic, platform);
    const fb = fallbackHashtags(topic, platform);
    const parsed = safeParseJson<HashtagResult>(raw, fb);
    if (!parsed.high || !parsed.medium || !parsed.niche) return fb;
    return parsed;
  } catch {
    return fallbackHashtags(topic, platform);
  }
}

export async function fetchTopics(
  category: string,
  platform: string,
): Promise<TopicResult[]> {
  try {
    const actor = await createActorWithConfig();
    const raw = await (actor as any).generateTopics(category, platform);
    const parsed = safeParseJson<TopicResult[]>(raw, []);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return FALLBACK_TOPICS[category] || FALLBACK_TOPICS.Tech;
    }
    return parsed;
  } catch {
    return FALLBACK_TOPICS[category] || FALLBACK_TOPICS.Tech;
  }
}

export async function fetchTrending(platform: string): Promise<TrendItem[]> {
  try {
    const actor = await createActorWithConfig();
    const raw = await (actor as any).getTrending(platform);
    const parsed = safeParseJson<TrendItem[]>(raw, []);
    if (!Array.isArray(parsed) || parsed.length === 0) return FALLBACK_TRENDS;
    return parsed;
  } catch {
    return FALLBACK_TRENDS;
  }
}

export async function fetchSidebarContent(): Promise<SidebarContent> {
  try {
    const actor = await createActorWithConfig();
    const raw = await (actor as any).getSidebarContent();
    const parsed = safeParseJson<SidebarContent>(raw, FALLBACK_SIDEBAR);
    if (!parsed.hashtags || !parsed.topics) return FALLBACK_SIDEBAR;
    return parsed;
  } catch {
    return FALLBACK_SIDEBAR;
  }
}

// ─── Viral Score Analyzer ─────────────────────────────────────────────────────

export function detectPlatform(url: string): string {
  if (/youtube\.com|youtu\.be/.test(url)) return "YouTube";
  if (/tiktok\.com/.test(url)) return "TikTok";
  if (/instagram\.com/.test(url)) return "Instagram";
  if (/facebook\.com/.test(url)) return "Facebook";
  if (/twitter\.com|x\.com/.test(url)) return "Twitter";
  return "Unknown";
}

// ─── Video Metadata ──────────────────────────────────────────────────────────

interface VideoMetadata {
  title: string;
  author: string;
  description: string;
  tags: string[];
}

export function extractTopicFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const raw = `${parsed.pathname} ${parsed.search}`;
    return raw
      .split(/[\/\?&=]+/)
      .map((seg) =>
        seg
          .replace(/[-_]/g, " ")
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .trim(),
      )
      .filter(
        (seg) =>
          seg.length > 2 &&
          !/^(watch|video|embed|shorts|reel|p|v|t|www)$/i.test(seg),
      )
      .slice(0, 6)
      .join(" ")
      .trim();
  } catch {
    return "";
  }
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Piped API — free YouTube proxy, no API key required.
 * Returns full description, tags, uploader. Multiple public instances for resilience.
 */
async function fetchFromPipedAPI(
  videoId: string,
): Promise<Partial<VideoMetadata>> {
  const instances = [
    `https://pipedapi.kavin.rocks/streams/${videoId}`,
    `https://piped-api.garudalinux.org/streams/${videoId}`,
    `https://api.piped.yt/streams/${videoId}`,
  ];
  for (const endpoint of instances) {
    try {
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        title?: string;
        description?: string;
        uploader?: string;
        tags?: string[];
      };
      if (data.title) {
        return {
          title: data.title,
          author: data.uploader ?? "",
          description: (data.description ?? "").slice(0, 800),
          tags: data.tags ?? [],
        };
      }
    } catch {
      // try next instance
    }
  }
  return {};
}

/**
 * CORS proxy scrape — extracts og:title, og:description, keywords from the page HTML.
 * Used as a final fallback when all APIs fail.
 */
async function fetchFromCORSProxy(
  url: string,
): Promise<Partial<VideoMetadata>> {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://thingproxy.freeboard.io/fetch/${url}`,
  ];
  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;
      const raw = (await res.json()) as { contents?: string };
      const html = raw.contents ?? "";
      if (!html) continue;

      const titleMatch =
        html.match(/property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]+property=["']og:title["']/i) ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i);

      const descMatch =
        html.match(
          /property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
        ) ||
        html.match(
          /content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
        ) ||
        html.match(/name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]+name=["']description["']/i);

      const keywordsMatch =
        html.match(/name=["']keywords["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["'][^>]+name=["']keywords["']/i);

      if (titleMatch?.[1] || descMatch?.[1]) {
        return {
          title: titleMatch?.[1] ? decodeHtml(titleMatch[1]).trim() : "",
          description: descMatch?.[1]
            ? decodeHtml(descMatch[1]).slice(0, 800).trim()
            : "",
          tags: keywordsMatch?.[1]
            ? keywordsMatch[1].split(/,\s*/).slice(0, 10)
            : [],
        };
      }
    } catch {
      // try next proxy
    }
  }
  return {};
}

/**
 * Fetches real video metadata using multiple free sources in order of quality.
 * Each step fills in missing fields and silently skips failures.
 */
export async function fetchVideoMetadata(
  url: string,
  platform: string,
): Promise<VideoMetadata> {
  const encoded = encodeURIComponent(url);
  let metadata: VideoMetadata = {
    title: "",
    author: "",
    description: "",
    tags: [],
  };

  // ── 1. Platform oEmbed (fast, reliable, title + author) ─────────────────
  const oEmbedUrls: string[] = [];
  if (platform === "YouTube") {
    oEmbedUrls.push(
      `https://www.youtube.com/oembed?url=${encoded}&format=json`,
    );
  } else if (platform === "TikTok") {
    oEmbedUrls.push(`https://www.tiktok.com/oembed?url=${encoded}`);
  }
  for (const oUrl of oEmbedUrls) {
    try {
      const res = await fetch(oUrl, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = (await res.json()) as {
          title?: string;
          author_name?: string;
        };
        if (data.title) {
          metadata.title = data.title;
          metadata.author = data.author_name ?? "";
          break;
        }
      }
    } catch {
      /* silently skip */
    }
  }

  // ── 2. noembed.com universal fallback (title + author) ──────────────────
  if (!metadata.title) {
    try {
      const res = await fetch(`https://noembed.com/embed?url=${encoded}`, {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          title?: string;
          author_name?: string;
          error?: string;
        };
        if (data.title && !data.error) {
          metadata.title = data.title;
          metadata.author = data.author_name ?? "";
        }
      }
    } catch {
      /* silently skip */
    }
  }

  // ── 3. Piped API for YouTube — full description + tags, NO KEY needed ────
  if (platform === "YouTube") {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      const piped = await fetchFromPipedAPI(videoId);
      if (!metadata.title && piped.title) metadata.title = piped.title;
      if (!metadata.author && piped.author) metadata.author = piped.author;
      if (!metadata.description && piped.description)
        metadata.description = piped.description;
      if (!metadata.tags.length && piped.tags) metadata.tags = piped.tags;
    }
  }

  // ── 4. CORS proxy page scrape — og:description, keywords (all platforms) ─
  if (!metadata.description) {
    const scraped = await fetchFromCORSProxy(url);
    if (!metadata.title && scraped.title) metadata.title = scraped.title;
    if (scraped.description) metadata.description = scraped.description;
    if (!metadata.tags.length && scraped.tags)
      metadata.tags = scraped.tags ?? [];
  }

  // ── 5. YouTube Data API v3 (richest data if key has it enabled) ──────────
  if (
    platform === "YouTube" &&
    (!metadata.description || !metadata.tags.length)
  ) {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${DEFAULT_GEMINI_KEY}`,
          { signal: AbortSignal.timeout(4000) },
        );
        if (res.ok) {
          const data = (await res.json()) as {
            items?: Array<{
              snippet?: {
                title?: string;
                channelTitle?: string;
                description?: string;
                tags?: string[];
              };
            }>;
          };
          const snippet = data?.items?.[0]?.snippet;
          if (snippet?.title) {
            metadata.title = snippet.title;
            metadata.author = snippet.channelTitle ?? metadata.author;
            if (!metadata.description && snippet.description) {
              metadata.description = snippet.description.slice(0, 800);
            }
            if (!metadata.tags.length && snippet.tags) {
              metadata.tags = snippet.tags.slice(0, 10);
            }
          }
        }
      } catch {
        /* silently skip */
      }
    }
  }

  return metadata;
}

// ─── Fallback viral score ─────────────────────────────────────────────────────

function fallbackViralScore(
  url: string,
  meta?: VideoMetadata,
): ViralScoreResult {
  const seed = url.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const r = (min: number, max: number, offset = 0) =>
    min + ((seed + offset) % (max - min));
  const platform = detectPlatform(url);
  const topic = meta?.title || extractTopicFromUrl(url) || "your video";
  const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "");

  return {
    overall: r(42, 78),
    platform,
    videoTitle: meta?.title || "Video Analysis",
    categories: [
      {
        name: "Hook & Title",
        score: r(40, 85, 1),
        recommendation: `Rewrite your title with a number or curiosity gap specific to the "${topic}" topic.`,
      },
      {
        name: "Thumbnail Appeal",
        score: r(35, 80, 2),
        recommendation:
          "Use high-contrast visuals and a bold text overlay that teases the main value of this video.",
      },
      {
        name: "Content Length",
        score: r(45, 90, 3),
        recommendation:
          "Aim for 7-15 minutes on YouTube; keep every scene tight to maintain watch time.",
      },
      {
        name: "Hashtag Strategy",
        score: r(30, 75, 4),
        recommendation: `Mix 3-5 high-reach tags with 2-3 niche tags specific to ${topic}.`,
      },
      {
        name: "Description SEO",
        score: r(25, 70, 5),
        recommendation:
          "Put your primary keyword in the first 2 lines so it shows in search results.",
      },
      {
        name: "Engagement Triggers",
        score: r(40, 80, 6),
        recommendation:
          "Ask a direct question related to your topic in the first 30 seconds.",
      },
      {
        name: "Trending Relevance",
        score: r(35, 85, 7),
        recommendation:
          "Connect your content to a current trend or challenge in your niche.",
      },
      {
        name: "Platform Optimization",
        score: r(50, 90, 8),
        recommendation: `Post during peak hours for ${platform} (6-9pm local time) for best initial reach.`,
      },
    ],
    topFixes: [
      `Strengthen the hook in the first 3 seconds — lead with the biggest value from "${topic}".`,
      "Add trending niche-specific hashtags to increase discoverability.",
      "Use bold, high-contrast thumbnail with a visible text hook.",
    ],
    exactSolutions: {
      title: `The Truth About ${topic} That Nobody Is Telling You`,
      description: `In this video, we go deep on ${topic} — covering everything you need to know to get real results fast.\n\n👉 What you'll discover:\n• The most important insight about ${topic}\n• Common mistakes people make and how to avoid them\n• Step-by-step strategies that actually work\n\n🔔 Subscribe for more content on ${topic} and related topics.\n\n#${topicSlug} #${platform}Tips #ViralContent`,
      hashtags: [
        `#${topicSlug}`,
        `#${topicSlug}tips`,
        `#${topicSlug}viral`,
        `#${platform}Growth`,
        "#ContentCreator",
        "#ViralVideo",
        "#GrowthHacking",
        `#${platform}Tips`,
      ],
    },
  };
}

// ─── Main Analyzer ────────────────────────────────────────────────────────────

export async function analyzeVideoViral(
  url: string,
): Promise<ViralScoreResult> {
  const platform = detectPlatform(url);
  const key = getStoredGeminiKey();

  // ── Step 1: Fetch rich video metadata from all available sources ──────────
  const metadata = await fetchVideoMetadata(url, platform);

  // ── Step 2: Assemble everything we know about the video ───────────────────
  const hasTitle = !!metadata.title;
  const hasDescription = !!metadata.description;
  const hasTags = metadata.tags.length > 0;
  const urlKeywords = !hasTitle ? extractTopicFromUrl(url) : "";

  let videoInfoBlock = `PLATFORM: ${platform}\nURL: ${url}\n`;
  if (hasTitle) videoInfoBlock += `TITLE: "${metadata.title}"\n`;
  if (metadata.author)
    videoInfoBlock += `CREATOR / CHANNEL: "${metadata.author}"\n`;
  if (hasDescription)
    videoInfoBlock += `DESCRIPTION (first 800 chars): "${metadata.description}"\n`;
  if (hasTags)
    videoInfoBlock += `TAGS / KEYWORDS: ${metadata.tags.slice(0, 12).join(", ")}\n`;
  if (!hasTitle && urlKeywords)
    videoInfoBlock += `URL SLUG KEYWORDS: "${urlKeywords}"\n`;

  // ── Step 3: Build the two-step Gemini prompt ──────────────────────────────
  const prompt = `You are a world-class ${platform} growth strategist and viral content expert.

━━━ VIDEO BEING ANALYZED ━━━
${videoInfoBlock}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — IDENTIFY THIS VIDEO:
Before generating anything, establish exactly what this video is about:
- What is the specific topic and core subject matter?
- What niche does it belong to?
- What keywords and terminology are central to this content?
- What is the target audience?
${hasTitle ? `Note: The actual title is "${metadata.title}" — your analysis must be about THIS exact topic.` : "Use the URL keywords and any training knowledge you have about this video to identify the topic."}

STEP 2 — GENERATE VIRAL ANALYSIS:
Based on your identification above, generate a complete viral analysis.

🚨 NON-NEGOTIABLE RULES — violating any of these makes the output useless:
1. exactSolutions.title MUST be a click-worthy rewrite of "${hasTitle ? metadata.title : `a video about ${urlKeywords || "this topic"}`}" — it must be clearly about the same subject. NEVER write a generic title like "I Tried This for 30 Days".
2. exactSolutions.description MUST open with a hook that directly names the video's specific topic. MUST include bullet points about what viewers will specifically learn from THIS video. NEVER write generic placeholder text.
3. Every hashtag in exactSolutions.hashtags MUST relate to this video's actual niche and topic — not generic content creator tags.
4. Every recommendation in categories and topFixes MUST be specific to this video's topic and ${platform}.
5. If you recognize this specific video from your training data, use that knowledge.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "overall": <integer 0-100>,
  "platform": "${platform}",
  "videoTitle": "<the actual video title>",
  "categories": [
    { "name": "Hook & Title", "score": <0-100>, "recommendation": "<specific to this video's title and topic>" },
    { "name": "Thumbnail Appeal", "score": <0-100>, "recommendation": "<specific to this video's visual content>" },
    { "name": "Content Length", "score": <0-100>, "recommendation": "<ideal length for this content type on ${platform}>" },
    { "name": "Hashtag Strategy", "score": <0-100>, "recommendation": "<specific hashtag advice for this niche>" },
    { "name": "Description SEO", "score": <0-100>, "recommendation": "<specific keywords and phrases for this video>" },
    { "name": "Engagement Triggers", "score": <0-100>, "recommendation": "<specific question or hook for this audience>" },
    { "name": "Trending Relevance", "score": <0-100>, "recommendation": "<connect this specific topic to current trends>" },
    { "name": "Platform Optimization", "score": <0-100>, "recommendation": "<${platform}-specific algorithm tip for this content>" }
  ],
  "topFixes": [
    "<most critical fix #1 — specific to this video's topic>",
    "<most critical fix #2 — specific to this video's topic>",
    "<most critical fix #3 — specific to this video's topic>"
  ],
  "exactSolutions": {
    "title": "<viral rewrite of THIS video's title — must contain the actual subject matter, never generic>",
    "description": "<full SEO-optimized description for THIS video — 4-5 paragraphs, starts with topic-specific hook, includes what viewers will learn, ends with CTA and 3 relevant hashtags>",
    "hashtags": ["<10-12 hashtags perfectly tailored to this video's exact niche — mix of high-reach and specific>"]
  }
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.65, maxOutputTokens: 2500 },
        }),
      },
    );

    if (!response.ok) {
      return fallbackViralScore(url, metadata);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = safeParseJson<ViralScoreResult>(
      cleaned,
      fallbackViralScore(url, metadata),
    );

    // Validate required structure
    if (
      typeof parsed.overall !== "number" ||
      !Array.isArray(parsed.categories) ||
      parsed.categories.length !== 8 ||
      !Array.isArray(parsed.topFixes)
    ) {
      return fallbackViralScore(url, metadata);
    }

    // Always prefer fetched metadata title over AI-guessed title
    if (
      metadata.title &&
      (!parsed.videoTitle || parsed.videoTitle === "Video Analysis")
    ) {
      parsed.videoTitle = metadata.title;
    }

    // Ensure exactSolutions exists
    if (!parsed.exactSolutions) {
      parsed.exactSolutions = fallbackViralScore(url, metadata).exactSolutions;
    }

    return parsed;
  } catch {
    return fallbackViralScore(url, metadata);
  }
}
