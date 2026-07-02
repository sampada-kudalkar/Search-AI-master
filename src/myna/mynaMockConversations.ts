import type { StructuredAIResponse } from "./mynaSemanticTypes";

export type MynaConversationType = "reports" | "reviews" | "agents" | "general";

export interface MynaChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  quickActions?: Array<{ id: string; label: string }>;
  structuredResponse?: StructuredAIResponse;
}

export interface MynaConversation {
  id: string;
  title: string;
  /** L2 grouping */
  conversationType: MynaConversationType;
  /** Screen title when the thread was relevant (for "This screen" grouping) */
  screenLabel: string;
  messages: MynaChatMessage[];
  /** Unix ms timestamp; used for history date display. Falls back to id-embedded timestamp. */
  createdAt?: number;
  /** True = belongs to "Shared with me" section; false/absent = "Recent chats" */
  shared?: boolean;
}

const m = (id: string, role: "user" | "assistant", text: string): MynaChatMessage => ({
  id,
  role,
  text,
});

// ─── Structured response templates ───────────────────────────────────────────

export const RATING_DROP_STRUCTURED_RESPONSE: StructuredAIResponse = {
  summary:
    "Your overall rating dropped from ⭐ 4.2 to ⭐ 3.7 this month — a 0.5-point decline driven by Downtown Branch (–1.1 pts) and Airport Kiosk (–0.8 pts), where wait-time complaints surged 42% after a staff change in mid-April.",

  insights: [
    {
      id: "i1",
      icon: "📍",
      title: "Downtown Branch collapsed",
      detail:
        "Dropped from ⭐ 3.9 → ⭐ 2.8 (–1.1 pts). 3 unanswered negative reviews now > 24h old.",
      trend: "down",
      trendValue: "–1.1 pts",
      severity: "negative",
    },
    {
      id: "i2",
      icon: "⏱",
      title: "Wait time complaints surged",
      detail:
        "Mentioned in 42% of negative reviews this month vs 18% last month — the single biggest theme.",
      trend: "down",
      trendValue: "+42%",
      severity: "negative",
    },
    {
      id: "i3",
      icon: "💬",
      title: "Response rate declined",
      detail:
        "Dropped from 91% → 78%. Unanswered reviews amplify negative perception and lower ranking signals.",
      trend: "down",
      trendValue: "–13pp",
      severity: "warning",
    },
    {
      id: "i4",
      icon: "📈",
      title: "Review volume is up 54%",
      detail:
        "43 reviews this month vs 28 last — higher visibility means the drop has more reach.",
      trend: "up",
      trendValue: "+54%",
      severity: "neutral",
    },
  ],

  metrics: [
    {
      label: "Overall Rating",
      value: "3.7 ⭐",
      previousValue: "4.2 ⭐",
      change: "–0.5",
      trend: "down",
      context: "was 4.2 last month",
    },
    {
      label: "Negative Reviews",
      value: "28%",
      previousValue: "17%",
      change: "+11pp",
      trend: "down",
      context: "of total this month",
    },
    {
      label: "Response Rate",
      value: "78%",
      previousValue: "91%",
      change: "–13pp",
      trend: "down",
      context: "vs 91% last month",
    },
    {
      label: "Avg Response Time",
      value: "14h",
      previousValue: "6h",
      change: "+8h",
      trend: "down",
      context: "target: under 4h",
    },
  ],

  table: {
    caption: "Location-level rating impact",
    headers: ["Location", "Rating", "vs Last Mo.", "Reviews", "Status"],
    rows: [
      { Location: "North Shore", Rating: "⭐ 4.7", "vs Last Mo.": "↑ +0.1", Reviews: "12", Status: "✅ Strong" },
      { Location: "Westside Mall", Rating: "⭐ 3.6", "vs Last Mo.": "↓ –0.2", Reviews: "7", Status: "⚠️ Watch" },
      { Location: "Airport Kiosk", Rating: "⭐ 3.3", "vs Last Mo.": "↓ –0.8", Reviews: "15", Status: "⚠️ Concern" },
      { Location: "Downtown", Rating: "⭐ 2.8", "vs Last Mo.": "↓ –1.1", Reviews: "9", Status: "🔴 Critical" },
    ],
  },

  chart: {
    type: "bar",
    title: "Rating by location: this month vs last",
    data: [
      { label: "N. Shore", current: 4.7, previous: 4.6 },
      { label: "Westside", current: 3.6, previous: 3.8 },
      { label: "Airport", current: 3.3, previous: 4.1 },
      { label: "Downtown", current: 2.8, previous: 3.9 },
    ],
    series: [
      { key: "current", label: "This month", color: "#2552ed" },
      { key: "previous", label: "Last month", color: "#c4b5fd" },
    ],
  },

  explanation:
    "The decline is concentrated in two locations. **Downtown Branch** replaced its shift lead mid-April and peak-hour wait times worsened — 7 of 9 reviews this month mention \"slow\" or \"wait.\" **Airport Kiosk** handled 54% more foot traffic due to spring travel volume, but staffing didn't scale with demand, compressing the score. **North Shore held steady at 4.7**, confirming the issue is operational at two specific locations, not a business-wide reputation problem.",

  recommendations: [
    {
      id: "r1",
      priority: "high",
      title: "Respond to 3 unanswered Downtown reviews today",
      detail:
        "Reviews > 24h without a response have 3× higher churn correlation. Draft a service-recovery reply.",
    },
    {
      id: "r2",
      priority: "high",
      title: "Enable auto-response templates for wait-time mentions",
      detail:
        "A templated acknowledgment + resolution commitment reduces 1–2 star escalations by ~30%.",
    },
    {
      id: "r3",
      priority: "medium",
      title: "Audit Downtown staffing for the 12–3pm peak window",
      detail:
        "All negative reviews cluster in that slot. A 1-person shift addition could resolve the bottleneck.",
    },
    {
      id: "r4",
      priority: "medium",
      title: "Send proactive review requests to Airport Kiosk customers",
      detail:
        "High volume with happy customers who rarely self-review. Automated requests typically recover 0.3–0.5 pts.",
    },
  ],

  actions: [
    { id: "a1", label: "View unanswered reviews", variant: "primary" },
    { id: "a2", label: "Create response template", variant: "secondary" },
    { id: "a3", label: "Compare with last month", variant: "outline" },
    { id: "a4", label: "Export location report", variant: "outline" },
  ],

  followUps: [
    "Show me the Downtown negative reviews",
    "What response templates work best for wait times?",
    "How are my competitors doing this month?",
    "Which shift has the most complaints?",
  ],

  sources: [
    { label: "43 reviews this month", type: "reviews" },
    { label: "Survey NPS (last 30 days)", type: "surveys" },
    { label: "4 locations tracked", type: "data" },
  ],
};

/** Deterministic seed for L2 ↔ conversation mapping and Storybook */
export const MYNA_SEED_CONVERSATIONS: MynaConversation[] = [
  {
    id: "myna-seed-reviews-pulse",
    title: "Pulse on Reviews",
    conversationType: "reviews",
    screenLabel: "Reviews",
    createdAt: 1750982400000, // 2025-06-27
    messages: [
      m(
        "m-pulse-a",
        "assistant",
        "Here is a quick pulse for **Reviews**: 12 new this week, sentiment slightly up vs last week.",
      ),
      m("m-pulse-u", "user", "Which locations drove the uptick?"),
      m(
        "m-pulse-a2",
        "assistant",
        "Top contributors were downtown and airport kiosks. I can break down by source if you want.",
      ),
    ],
  },
  {
    id: "myna-seed-reviews-draft",
    title: "Last week's sentiment",
    conversationType: "reviews",
    screenLabel: "Reviews",
    createdAt: 1750982400000, // 2025-06-27
    messages: [
      m("m-draft-u", "user", "How did sentiment trend last week?"),
      m(
        "m-draft-a",
        "assistant",
        "**Last week:** slightly positive vs the prior week; volume was steady. I can chart by location or source next.",
      ),
    ],
  },
  {
    id: "myna-seed-reports-q4",
    title: "Q4 report summary",
    conversationType: "reports",
    screenLabel: "Reports",
    createdAt: 1750982400000, // 2025-06-27
    messages: [
      m("m-q4-u", "user", "Summarize Q4 for leadership."),
      m(
        "m-q4-a",
        "assistant",
        "**Q4 snapshot:** revenue flat QoQ, NPS +2, support volume down 8%. Highlights: retention in enterprise tier and faster first response.",
      ),
    ],
  },
  {
    id: "myna-seed-agents-health",
    title: "Monitor health check",
    conversationType: "agents",
    screenLabel: "BirdAI",
    createdAt: 1750982400000, // 2025-06-27
    messages: [
      m("m-health-a", "assistant", "All monitored agents are **healthy**. Last errors cleared 2h ago."),
      m("m-health-u", "user", "Any queued jobs stuck?"),
      m(
        "m-health-a2",
        "assistant",
        "Two low-priority report jobs are retrying; nothing blocking customer-facing flows.",
      ),
    ],
  },
  {
    id: "myna-seed-general-social",
    title: "Social campaign ideas",
    conversationType: "general",
    screenLabel: "Social",
    createdAt: 1750982400000, // 2025-06-27
    messages: [
      m("m-soc-u", "user", "Ideas for a product launch thread."),
      m(
        "m-soc-a",
        "assistant",
        "Consider a countdown thread, a behind-the-scenes clip, and a single clear CTA. I can draft hooks for each.",
      ),
    ],
  },
  {
    id: "myna-seed-reviews-rating-drop",
    title: "Why did my rating drop this month?",
    conversationType: "reviews",
    screenLabel: "Reviews",
    createdAt: 1745539200000, // 2025-04-25
    messages: [
      m("m-rdrop-u", "user", "Why did my overall rating drop this month?"),
      {
        id: "m-rdrop-a",
        role: "assistant",
        text: "Your overall rating dropped from ⭐ 4.2 to ⭐ 3.7 this month — primarily driven by Downtown Branch (–1.1 pts) and Airport Kiosk (–0.8 pts), where wait-time complaints surged 42% in April.",
        structuredResponse: RATING_DROP_STRUCTURED_RESPONSE,
      },
    ],
  },
];

// ─── Contextual reply engine ──────────────────────────────────────────────────

type ReplyRule = { match: string[]; reply: string };

const REPLIES: Record<string, ReplyRule[]> = {
  Reviews: [
    {
      match: ["location", "attention", "poor", "below"],
      reply:
        "**Locations needing attention right now:**\n\n- **Downtown Branch** — 2.8 ⭐ avg (↓0.4 vs last week). Top complaint: wait times.\n- **Westside Mall** — 3.1 ⭐ avg. Recurring theme: staff responsiveness.\n- **Airport Kiosk** — 3.3 ⭐ avg, high volume so impact is significant.\n\nWant me to draft response templates for any of these?",
    },
    {
      match: ["rating", "by location", "show rating"],
      reply:
        "**Ratings by location this week:**\n\n| Location | Avg | Reviews |\n|---|---|---|\n| North Shore | ⭐ 4.7 | 12 |\n| Downtown | ⭐ 2.8 | 9 |\n| Westside Mall | ⭐ 3.1 | 7 |\n| Airport Kiosk | ⭐ 3.3 | 15 |\n\nOverall: **3.7** across 43 reviews this week. Sentiment up 6% vs last week.",
    },
    {
      match: ["sentiment", "trend", "week", "pulse"],
      reply:
        "**Review sentiment this week:**\n\n📈 Positive: 61% (↑5%)\n➡️ Neutral: 24%\n📉 Negative: 15% (↓3%)\n\nTop positive themes: friendly staff, quick service.\nTop negative themes: wait times, parking at Westside.\n\nOverall trajectory is improving — Downtown is the main drag.",
    },
  ],

  Overview: [
    {
      match: ["performance", "week", "business"],
      reply:
        "**This week at a glance:**\n\n- **Reviews**: 43 new, avg 3.7 ⭐ (↑0.2)\n- **Inbox**: 127 messages, 94% response rate\n- **Campaigns**: 2 active, 31% avg open rate\n- **Listings**: 98% accuracy across all directories\n\nStandout: review volume is up 18% from last Monday. Downtown needs attention.",
    },
    {
      match: ["attention", "need", "area", "focus"],
      reply:
        "**3 areas needing your attention:**\n\n1. **Downtown reviews** — 2.8 avg, 3 unanswered negative reviews (>12h old)\n2. **Email campaign** expiring in 2 days with 22% open rate (target: 28%)\n3. **Westside listing** — hours not updated for holiday schedule\n\nWant me to help action any of these?",
    },
    {
      match: ["compare", "month", "last month"],
      reply:
        "**This month vs last month:**\n\n| Metric | This Month | Last Month | Δ |\n|---|---|---|---|\n| Avg Rating | 3.9 ⭐ | 3.6 ⭐ | ↑ 8% |\n| NPS | 67 | 63 | ↑ 6% |\n| Response Rate | 91% | 87% | ↑ 5% |\n| Review Volume | 187 | 164 | ↑ 14% |\n\nAll metrics trending up — best month in the past quarter.",
    },
  ],

  Social: [
    {
      match: ["top", "perform", "post", "best"],
      reply:
        "**Top performing posts this week:**\n\n1. 📸 Team photo (Instagram) — 847 likes, 92 shares, **4.2% engagement**\n2. 🎉 Customer spotlight (Facebook) — 312 reactions, 41 comments\n3. 📢 New service announcement (LinkedIn) — 189 impressions, 22 link clicks\n\nInstagram engagement is up **18%** vs last week. Team content is outperforming product content 2:1.",
    },
    {
      match: ["engage", "content", "drive", "most"],
      reply:
        "**What drives engagement on your channels:**\n\n- **Behind-the-scenes** posts get 2.4× avg engagement\n- **Customer stories** get the most shares (avg 38 per post)\n- **Questions & polls** drive 3× more comments than announcements\n\nBest posting window: Tuesday–Thursday, 10am–12pm local time.",
    },
    {
      match: ["idea", "suggest", "next", "upcoming"],
      reply:
        "**Post ideas for next week:**\n\n1. 🎥 Quick \"day in the life\" Reel — high organic reach on Instagram right now\n2. 📊 Customer win with stats (\"We helped X achieve Y in Z days\")\n3. ❓ Poll: what service feature would you most want to see next?\n\nShall I draft copy for any of these?",
    },
  ],

  Campaigns: [
    {
      match: ["perform", "active", "campaign", "how are"],
      reply:
        "**Active campaigns:**\n\n| Campaign | Status | Open Rate | CTR |\n|---|---|---|---|\n| Spring Promo | 🟢 Live | 34% | 6.1% |\n| Re-engagement | 🟡 Paused | 22% | 3.4% |\n| Referral Drive | 🟢 Live | 41% | 8.2% |\n\nReferral Drive is your standout this month — 41% open rate vs 28% industry avg.",
    },
    {
      match: ["open rate", "highest", "best"],
      reply:
        "**Referral Drive** leads with a **41% open rate** — well above the 28% industry benchmark.\n\nKey factors driving it: personalized subject line, sent Tuesday morning, concise single CTA.\n\nWant me to apply the same pattern to your paused Re-engagement campaign?",
    },
    {
      match: ["conversion", "trend"],
      reply:
        "**Conversion trends (last 30 days):**\n\n📈 Overall conversion rate: 4.8% (↑0.9% vs prior month)\n\nTop performers:\n- Referral Drive: 8.2% CTR → 5.1% conversion\n- Spring Promo: 6.1% CTR → 4.3% conversion\n\nRe-engagement is dragging the average — a subject line refresh could recover ~1.5% CTR.",
    },
  ],

  Contacts: [
    {
      match: ["new", "month", "this month"],
      reply:
        "**New contacts this month:** 284 (↑12% vs last month)\n\n- 🌐 Web form: 141\n- 📧 Email import: 89\n- 🔗 Referral: 54\n\nTop acquisition channel: web form — up 31% since the landing page redesign two months ago.",
    },
    {
      match: ["engaged", "most", "active"],
      reply:
        "**Most engaged contacts this month:**\n\n1. **Sarah K.** — opened 8/10 emails, clicked through on 5\n2. **Marcus T.** — responded to 2 campaigns, left a 5-star review\n3. **Priya N.** — active across 3 channels, NPS: 9\n\nAll three are strong candidates for a referral ask or loyalty offer.",
    },
    {
      match: ["trend", "activity", "summarize"],
      reply:
        "**Contact activity trends:**\n\n- Email engagement: ↑7% open rate vs last month\n- SMS response rate: 34% (↑4%)\n- Avg contacts per campaign: 412\n\nSegments with the highest engagement: recent customers (<30 days) and loyalty members.",
    },
  ],

  Inbox: [
    {
      match: ["unread", "summarize", "summary"],
      reply:
        "**Unread inbox (14 messages):**\n\n🔴 **3 urgent**: billing question, negative review follow-up, appointment conflict\n🟡 **6 medium**: feature requests, general inquiries\n🟢 **5 low**: thank-you notes, confirmations\n\nOldest unread is 6 hours old. Want me to draft replies for the urgent ones?",
    },
    {
      match: ["priority", "conversation", "high"],
      reply:
        "**Highest priority conversations right now:**\n\n1. **John D.** — billing complaint, 4h wait, escalation risk ⚠️\n2. **Amy L.** — appointment mix-up, needs reschedule today\n3. **TechCorp** — renewal question worth ~$4k ARR\n\nAll three need a response within the next 2 hours.",
    },
    {
      match: ["topic", "frequent", "appear"],
      reply:
        "**Most common topics in your inbox:**\n\n1. Scheduling & appointments — 31%\n2. Billing questions — 24%\n3. Product / service info — 19%\n4. Complaints — 14%\n5. General feedback — 12%\n\nScheduling is the dominant theme — an automated FAQ for common questions could reduce volume by ~25%.",
    },
  ],

  Reports: [
    {
      match: ["last month", "summarize", "performance", "summary"],
      reply:
        "**Last month's performance summary:**\n\n- **Reviews**: avg 3.9 ⭐, 187 total (↑14%)\n- **NPS**: 67 (↑4 pts)\n- **Response rate**: 91%\n- **Campaigns**: 3 sent, 29% avg open rate\n\nStrongest area: review volume. Watch area: campaign CTR dipped 2% — subject line fatigue possible.",
    },
    {
      match: ["quarter", "vs", "metric", "key"],
      reply:
        "**This quarter vs last quarter:**\n\n| Metric | This Q | Last Q | Δ |\n|---|---|---|---|\n| Avg Rating | 3.9 ⭐ | 3.6 ⭐ | ↑ 8% |\n| NPS | 67 | 63 | ↑ 6% |\n| Response Rate | 91% | 87% | ↑ 5% |\n| Review Volume | 542 | 480 | ↑ 13% |\n\nAll four KPIs are trending up — best quarter in the past year.",
    },
    {
      match: ["improv", "recent", "best"],
      reply:
        "**What improved most recently:**\n\n1. **Review response rate** — jumped from 78% to 91% after enabling auto-response templates\n2. **NPS** — up 4 pts, driven by faster support resolution times\n3. **Campaign open rate** — Referral Drive at 41%, best single campaign performance this year\n\nThe response rate improvement alone accounts for most of the NPS gain.",
    },
  ],

  Surveys: [
    {
      match: ["trend", "response", "recent"],
      reply:
        "**Recent survey response trends:**\n\nResponse rate: **68%** (↑5% vs last wave)\nAvg satisfaction: **4.1 / 5**\n\nTop positive themes: ease of booking, staff friendliness.\nTop negative themes: wait times (cited by 28% of respondents).\n\nMobile completion rate dropped slightly — a shorter format for mobile could recover ~8% of drop-offs.",
    },
    {
      match: ["satisfaction", "average", "score"],
      reply:
        "**Average satisfaction score: 4.1 / 5**\n\n| Question | Score |\n|---|---|\n| Staff friendliness | 4.6 |\n| Overall experience | 4.3 |\n| Value for money | 4.0 |\n| Ease of process | 3.8 |\n| Wait time | 3.4 ← |\n\nWait time is your biggest gap vs the 4.0 target. Want suggestions for addressing it?",
    },
    {
      match: ["lowest", "question", "score"],
      reply:
        "**Questions scoring the lowest:**\n\n1. \"How would you rate your wait time?\" — **3.4 avg**\n2. \"Was the process easy to understand?\" — **3.7 avg**\n3. \"Would you recommend us?\" — **3.9 avg** (NPS proxy)\n\nWait time is the single biggest drag. 23% of respondents cited it as their top frustration.",
    },
  ],

  Listings: [
    {
      match: ["up to date", "accurate", "check"],
      reply:
        "**Listing accuracy check:**\n\n✅ Google — 98% accurate (hours and phone current)\n⚠️ Yelp — 91% — holiday hours missing at 2 locations\n⚠️ Apple Maps — 88% — outdated photos at 3 locations\n✅ Facebook — 96% — all current\n\nWant me to queue the Yelp and Apple Maps fixes?",
    },
    {
      match: ["low", "accuracy", "score"],
      reply:
        "**Listings with the lowest accuracy scores:**\n\n1. **Apple Maps — Westside** (72%) — photos 8 months old, missing website URL\n2. **Yelp — Airport** (78%) — no holiday hours, outdated tagline\n3. **Bing — Downtown** (81%) — incorrect zip code on file\n\nFixing these three could increase local search discovery by ~15%.",
    },
    {
      match: ["recent", "change", "update"],
      reply:
        "**Recent listing changes (last 7 days):**\n\n- ✅ Google hours updated for Thanksgiving across all 4 locations\n- ✅ New photos published to Facebook (North Shore)\n- ⚠️ Yelp sync failed for Airport location — retrying\n\nThe Yelp sync failure is isolated; everything else is up to date.",
    },
  ],

  BirdAI: [
    {
      match: ["health", "status", "agent", "check"],
      reply:
        "**Agent health status:**\n\n✅ Review Response Bot — running, 14 replies sent today\n✅ Lead Qualifier — active, 8 leads scored in last hour\n⚠️ Appointment Reminder — 2 failed sends (phone number format issue, affects ~3% of contacts)\n✅ Feedback Collector — healthy, 99.2% uptime\n\nThe Appointment Reminder issue is minor and fixable. Want to see the affected records?",
    },
    {
      match: ["underperform", "poor", "low"],
      reply:
        "**Underperforming agents:**\n\n- **Appointment Reminder**: failed send rate 3%, down from 99.8% target\n- **Re-engagement Bot**: email open rate 18% (target: 25%) — subject line likely needs a refresh\n\nBoth are small config changes. Want me to suggest what to update for each?",
    },
    {
      match: ["recent", "automation", "activity"],
      reply:
        "**Recent automation activity (last 24h):**\n\n- 🔁 147 automated review requests sent, 23 responses received (15.6% rate)\n- ✉️ 89 appointment reminders delivered, 2 failed\n- 🎯 8 new leads qualified and routed to CRM\n- ⭐ 3 negative reviews flagged for manual follow-up\n\nAll agents running within normal parameters except Appointment Reminder.",
    },
  ],

  Competitors: [
    {
      match: ["compare", "competitor", "vs", "how do i"],
      reply:
        "**Competitive comparison (last 30 days):**\n\n| | You | Competitor A | Competitor B |\n|---|---|---|---|\n| Avg Rating | ⭐ 3.9 | ⭐ 4.1 | ⭐ 3.7 |\n| Review Volume | 187 | 142 | 94 |\n| Response Rate | 91% | 76% | 58% |\n\nYou lead on volume and response rate. Close the rating gap at Downtown and you'd edge out Competitor A overall.",
    },
    {
      match: ["gaining", "review", "most"],
      reply:
        "**Competitor gaining the most reviews:** Competitor A — **142 reviews** this month (↑22% MoM).\n\nTheir surge is driven by post-purchase email review requests. They're averaging 4.1 ⭐.\n\nYour response rate (91% vs their 76%) is a meaningful trust signal — worth highlighting in marketing.",
    },
    {
      match: ["ranking", "competitive", "this month"],
      reply:
        "**Your competitive ranking this month:**\n\n🥇 Response rate: #1 of 5 tracked (91%)\n🥈 Review volume: #2 (187 reviews)\n🥉 Avg rating: #3 (3.9 ⭐)\n\nQuick win: get Downtown to 4.0+ and you'd move to #2 in avg rating — closing the gap with Competitor A.",
    },
  ],

  Ticketing: [
    {
      match: ["open", "attention", "ticket", "need"],
      reply:
        "**Open tickets needing attention:**\n\n🔴 **3 critical** (>24h): billing dispute, refund request, product defect report\n🟡 **7 medium** (>8h): how-to questions, general feedback\n🟢 **12 low priority**: feature requests, compliments\n\nThe billing dispute has been open 31 hours — recommend prioritizing it now.",
    },
    {
      match: ["resolution", "time", "average"],
      reply:
        "**Average resolution time: 6.2 hours** (↓1.4h vs last month ✅)\n\n| Category | Avg Time |\n|---|---|\n| General | 3.1h |\n| Technical | 7.2h |\n| Billing | 9.8h |\n\nBilling takes 3× longer than general tickets. A self-serve FAQ could cut that significantly.",
    },
    {
      match: ["issue", "report", "often", "frequent"],
      reply:
        "**Most reported issues (last 30 days):**\n\n1. Login / access problems — 34 tickets (28%) ← spiking\n2. Billing questions — 27 tickets (22%)\n3. Feature not working — 19 tickets (16%)\n4. Cancellation / refund — 14 tickets (11%)\n\nLogin issues are up 40% since the password policy change last week — likely the root cause.",
    },
  ],

  Insights: [
    {
      match: ["top", "insight", "customer", "key"],
      reply:
        "**Top customer insights this month:**\n\n1. **Wait time** is the #1 friction point — mentioned in 34% of negative feedback\n2. **Staff friendliness** is your biggest strength — in 67% of positive mentions\n3. Customers who receive a follow-up message are **2.4× more likely** to leave a positive review\n\nQuick win: a 1-day post-visit follow-up in your booking flow could lift review scores by 0.3–0.5 pts.",
    },
    {
      match: ["sentiment", "trend", "week"],
      reply:
        "**Sentiment trends this week:**\n\n📈 Positive: **68%** (↑4% vs last week)\n📉 Negative: **14%** (↓3%)\n➡️ Neutral: **18%**\n\nThe positive shift is driven by weekend staff receiving notably better feedback after the recent training. Negative mentions concentrate around weekday afternoon wait times.",
    },
    {
      match: ["theme", "appear", "feedback", "common"],
      reply:
        "**Most common themes in customer feedback:**\n\n1. 🕐 **Wait times** — 38% of mentions (mixed sentiment)\n2. 😊 **Staff attitude** — 31%, overwhelmingly positive\n3. 💰 **Pricing** — 19%, neutral to slightly negative\n4. 📍 **Location / parking** — 12%, mostly neutral\n\nWant a breakdown by channel or location?",
    },
  ],
};

export function mockAssistantReply(screenTitle: string, userMessage = ""): string {
  const q = userMessage.toLowerCase();
  const rules = REPLIES[screenTitle];
  if (rules) {
    for (const rule of rules) {
      if (rule.match.some((kw) => q.includes(kw))) return rule.reply;
    }
  }
  // Generic contextual fallback
  return `Here's a quick summary for **${screenTitle}**: performance is trending positively this week. I can break down specific metrics, compare against last period, or surface areas to focus on. What would you like to explore?`;
}
