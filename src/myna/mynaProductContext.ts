export interface MynaProductContext {
  description: string;
  dataSnapshot: string;
  industryBenchmarks: string;
}

export const PRODUCT_CONTEXTS: Record<string, MynaProductContext> = {
  Reviews: {
    description:
      "Monitors and manages customer reviews across 200+ platforms (Google, Yelp, Facebook, etc.). Tracks ratings, sentiment, volume, response rates, and themes by location.",
    dataSnapshot: `
Current account data (4 locations):
- This week: 43 total reviews, avg ⭐3.7 (↑0.2 vs last week)
  - North Shore: ⭐4.7 (12 reviews) — top performer
  - Downtown: ⭐2.8 (9 reviews) — 3 unanswered negatives >12h old ⚠️
  - Westside Mall: ⭐3.1 (7 reviews) — recurring theme: staff responsiveness
  - Airport Kiosk: ⭐3.3 (15 reviews) — high volume, moderate rating
- Sentiment: 61% positive (↑5%), 24% neutral, 15% negative (↓3%)
- Response rate: 91% (target: 95%; industry avg: 72%)
- Top positive themes: staff friendliness, quick service
- Top negative themes: wait times (Downtown), parking (Westside)
- Review sources: Google 58%, Yelp 22%, Facebook 20%`,
    industryBenchmarks: `
- Industry avg response rate: 72% (yours: 91% — top quartile)
- Industry avg rating (multi-location services): 4.0–4.2 ⭐
- Businesses above 4.0 ⭐ get 35% more clicks from local search
- Responding within 24h correlates with 0.4 ⭐ higher avg rating`,
  },

  Overview: {
    description:
      "Cross-product dashboard showing review health, messaging, campaigns, listings, and AI agent status in one view. Ideal for a quick business-wide pulse.",
    dataSnapshot: `
This week across all products:
- Reviews: 43 new, avg ⭐3.7 (↑0.2); volume ↑18% vs last Monday
- Inbox: 127 messages, 94% response rate; 3 urgent items >12h old
- Campaigns: Spring Promo (34% open rate), Referral Drive (41% open rate ← above industry)
- Listings: 94% overall accuracy; Yelp (Airport) sync pending, Apple Maps (Westside) photos stale
- BirdAI agents: 4 running; 1 alert — Appointment Reminder (3% fail rate)
- Areas needing attention: Downtown reviews (⭐2.8), Westside Yelp holiday hours missing`,
    industryBenchmarks: `
- Healthy NPS for services: 65–75 (yours: 67 — above avg)
- Industry avg email open rate: 22–28% (yours: 34–41%)
- Top-quartile multi-location businesses maintain 4.0+ avg rating with <10h avg response time`,
  },

  Social: {
    description:
      "Social media management for Facebook, Instagram, LinkedIn, and more. Compose and schedule posts, track engagement, and identify top-performing content types.",
    dataSnapshot: `
This week's social performance:
- Top post: Team photo (Instagram) — 847 likes, 92 shares, 4.2% engagement ← top quartile
- Customer spotlight (Facebook): 312 reactions, 41 comments
- Service announcement (LinkedIn): 189 impressions, 22 link clicks
- Instagram engagement: ↑18% vs last week; team content outperforms product content 2:1
- Best posting window: Tue–Thu, 10am–12pm local
- Content insight: behind-the-scenes posts get 2.4× avg engagement; customer stories avg 38 shares/post
- Scheduled queue: 4 posts ready for next week`,
    industryBenchmarks: `
- Industry avg Instagram engagement rate: 1.5–3.5% (yours: 4.2% — top quartile)
- Reels/video get 3× more reach than static images on Instagram
- B2C brands posting 3–5×/week see 30% higher follower growth
- User-generated content (customer photos/stories) drives 85% higher trust`,
  },

  Campaigns: {
    description:
      "Email and SMS campaign builder for review requests, promotions, re-engagement, and referral programs. Tracks open rates, click-throughs, and conversions.",
    dataSnapshot: `
Active campaigns:
- Referral Drive (🟢 Live): 41% open rate ← best campaign this year; 8.2% CTR; 5.1% conversion
- Spring Promo (🟢 Live): 34% open rate; 6.1% CTR; 4.3% conversion
- Re-engagement (🟡 Paused): 22% open rate; 3.4% CTR — subject line refresh recommended

Last 30 days:
- Overall conversion rate: 4.8% (↑0.9% vs prior month)
- Avg unsubscribe rate: 0.4% (healthy — industry threshold: <0.5%)
- Contacts reached: 1,847
- Referral Drive success: personalized subject line + Tuesday AM send + single clear CTA`,
    industryBenchmarks: `
- Industry avg open rate: 22–28% (yours: 34–41% — significantly above)
- Industry avg CTR: 2.5–4% (yours: 3.4–8.2%)
- Top campaigns (personalized + clear CTA): 35–45% open rates
- Re-engagement campaigns typically recover 10–15% of lapsed contacts`,
  },

  Contacts: {
    description:
      "CRM-style customer database linked across messaging, reviews, campaigns, and surveys. Supports tagging, segmentation, engagement scoring, and import/export.",
    dataSnapshot: `
Contact database (4,218 total):
- New this month: 284 contacts (↑12% vs last month)
  - Web form: 141 (top channel, ↑31% since landing page redesign)
  - Email import: 89 | Referral: 54
- Most engaged: Sarah K. (8/10 emails opened, 5 click-throughs), Marcus T. (multi-campaign responder, 5-star reviewer), Priya N. (active on 3 channels, NPS 9)
- Email engagement: ↑7% open rate vs last month (now ~31%)
- SMS response rate: 34% (↑4%)
- Highest-engagement segments: recent customers (<30 days) and loyalty members`,
    industryBenchmarks: `
- Industry avg email open rate: 22–28% (yours: ~31%)
- SMS marketing avg response rate: 30–45% (yours: 34%)
- Cross-channel engaged customers have 2–3× higher LTV
- Segmented campaigns see 14% higher open rates than broadcast`,
  },

  Inbox: {
    description:
      "Unified messaging inbox for SMS, email, chat, Facebook Messenger, Google Messages, and more. Includes AI-suggested replies, triage, assignment, and SLA tracking.",
    dataSnapshot: `
Current inbox (14 unread, oldest: 6h ago):
- 🔴 3 urgent: billing dispute (31h — escalation risk ⚠️), appointment mix-up, TechCorp renewal (~$4k ARR)
- 🟡 6 medium: feature requests, general inquiries
- 🟢 5 low: thank-yous, confirmations
This week: 127 conversations, 94% response rate
- Avg first response time: 2.1h (target: <2h)
- Top topics: scheduling/appointments (31%), billing (24%), product info (19%), complaints (14%)
- Channels: SMS 48%, email 33%, chat 19%`,
    industryBenchmarks: `
- Industry avg first response time: 4.2h (yours: 2.1h — 2× faster)
- 42% of customers expect a response within 1h
- Responding in <1h: 3× higher satisfaction vs >4h
- Automated FAQ can deflect 20–30% of repetitive message volume`,
  },

  Reports: {
    description:
      "Performance reports and analytics across reviews, reputation, campaigns, NPS, and locations. Includes scheduled delivery and executive summaries.",
    dataSnapshot: `
Last month's metrics:
- Reviews: avg ⭐3.9, 187 total (↑14%)
- NPS: 67 (↑4 pts — enabled auto-response templates 6 weeks ago)
- Response rate: 91% (↑4%)
- Campaigns: 3 sent, 29% avg open rate (↓2% — possible subject line fatigue)

This quarter vs last:
| Metric | This Q | Last Q | Δ |
|--------|--------|--------|---|
| Avg Rating | ⭐3.9 | ⭐3.6 | ↑8% |
| NPS | 67 | 63 | ↑6% |
| Response Rate | 91% | 87% | ↑5% |
| Review Volume | 542 | 480 | ↑13% |

All 4 KPIs up — best quarter in the past year.`,
    industryBenchmarks: `
- Industry median NPS (multi-location SMB): 42–55 (yours: 67 — excellent)
- Industry avg campaign open rate: 22–28% (yours: 29%)
- Monthly NPS tracking drives 2× faster score improvement vs quarterly`,
  },

  Surveys: {
    description:
      "NPS and customer satisfaction surveys sent post-visit via email or SMS. Two reports: NPS Report (score, promoters/passives/detractors by location, region, division, pilot group) and Survey Responses Report (completion rates, question-level response volumes and patterns). Can diagnose why scores are down, prescribe improvements, and surface descriptive data across dimensions.",
    dataSnapshot: `
NPS Report:
- Overall NPS: 19.7 (target: 30 ⚠️ — below target)
- Promoters: 28% | Passives: 35% | Detractors: 37%
- Total responses (last 12 months): 4,218

NPS by location:
- North Shore: NPS 62 ← top performer
- Westside Mall: NPS 51
- Airport Kiosk: NPS 39
- Downtown: NPS 28 ← needs attention
- Region 12: NPS 28 (detractors ↑ vs prior quarter ⚠️)

NPS by division:
- Division B: NPS 34
- Division A: NPS 12 ← significantly lower ⚠️

Pilot group: NPS 44 vs control group: NPS 22

NPS by age group:
- 50+ group: NPS 31
- 18–25 group: NPS -8 ← detractor-heavy

Top detractor themes: wait times (42%), pricing (28%), communication (19%)
Top promoter themes: staff friendliness (67%), ease of booking (44%)
Detractor keywords most frequent: "wait", "slow", "expensive", "unclear"

Survey Responses Report:
- Completion rate: 81.9% (↓2.1% vs last wave ⚠️)
- Partial completions: 18.1%
- Avg time to complete: 4.2 min
- Responses trend: ↓7% MoM (last 3 months)
- Most answered: Q1 Overall Satisfaction, Q2 Likelihood to Recommend
- Most skipped: Q5 Income (optional, 62% skip rate)
- Questions 0–3: high response rate | Questions 4–6: significantly fewer responses`,
    industryBenchmarks: `
- B2C NPS benchmark: 30–45 (yours: 19.7 — below)
- Healthcare/service NPS benchmark: 58–72
- Survey completion rate >80% is good (yours: 81.9% — just above threshold)
- Survey response rate >50% is strong (industry median: 33%)
- Moving passives to promoters typically requires resolving the #1 friction (wait time or process complexity)
- Reducing detractor rate by 5% typically lifts NPS by ~8 points`,
  },

  Listings: {
    description:
      "Manages business listing accuracy across Google, Yelp, Apple Maps, Bing, Facebook, and 50+ directories. Detects inconsistencies and syncs updates.",
    dataSnapshot: `
Listing accuracy:
- Overall: 94% across all directories
- ✅ Google: 98% — hours and phone current
- ⚠️ Yelp: 91% — holiday hours missing at 2 locations (Airport, North Shore)
- ⚠️ Apple Maps: 88% — outdated photos, missing website URL (Westside)
- ✅ Facebook: 96% — all current
- ⚠️ Bing — Downtown: incorrect zip code on file

Recent changes (last 7 days):
- ✅ Google Thanksgiving hours updated at all 4 locations
- ✅ New photos published to Facebook (North Shore)
- ⚠️ Yelp sync failed for Airport — retrying`,
    industryBenchmarks: `
- 80% of consumers lose trust from inconsistent online business info
- Fixing listing accuracy increases local search discovery by 15–20%
- Businesses with photos get 42% more direction requests on Google
- NAP consistency (name, address, phone) is a confirmed local SEO ranking factor`,
  },

  BirdAI: {
    description:
      "AI-powered automation for review requests, lead qualification, appointment reminders, and customer follow-ups. Monitor agent health, configure triggers, and track automation ROI.",
    dataSnapshot: `
Agent health (current):
- ✅ Review Response Bot: running, 14 replies sent today, 99.1% uptime
- ✅ Lead Qualifier: active, 8 leads scored in last hour, routed to CRM
- ⚠️ Appointment Reminder: 2 failed sends — phone number format issue (~3% of contacts)
- ✅ Feedback Collector: healthy, 99.2% uptime, 34 responses collected today
- 🔁 Re-engagement Bot: 18% email open rate (target: 25% — subject line refresh needed)

Last 24h automation summary:
- 147 review requests sent → 23 responses (15.6% rate)
- 89 appointment reminders delivered (2 failed)
- 8 new leads qualified and routed to CRM
- 3 negative reviews flagged for manual follow-up`,
    industryBenchmarks: `
- Automated review requests generate 3–5× more reviews than manual asks
- AI appointment reminders reduce no-shows by 28% on average
- Lead qualification automation boosts conversion rates by ~20%
- AI-assisted businesses respond to customers 4× faster on average`,
  },

  Competitors: {
    description:
      "Competitive intelligence tracking competitor review volume, ratings, response rates, and ranking trends across platforms.",
    dataSnapshot: `
Competitive snapshot (last 30 days):
| Metric | You | Competitor A | Competitor B | Competitor C |
|--------|-----|-------------|-------------|-------------|
| Avg Rating | ⭐3.9 | ⭐4.1 | ⭐3.7 | ⭐3.5 |
| Review Volume | 187 | 142 | 94 | 67 |
| Response Rate | 91% | 76% | 58% | 43% |

Rankings: 🥇 Response rate #1 | 🥈 Review volume #2 | 🥉 Avg rating #3
- Competitor A gaining fastest: ↑22% MoM in reviews (post-purchase email flow)
- Your 91% response rate vs Competitor A's 76% is a strong trust differentiator
- Gap to close: Downtown avg ⭐2.8 vs Competitor A's ⭐4.1 in same area`,
    industryBenchmarks: `
- 0.5 ⭐ rating gap = 30–40% fewer clicks in local search
- Response rate >70% signals attentiveness to potential customers
- Top 3 local search positions capture 75% of all clicks
- Consumers read avg 4+ reviews before trusting a business`,
  },

  Ticketing: {
    description:
      "Customer support ticketing linked to the inbox. Tracks issue categorization, assignment, resolution time, and escalation.",
    dataSnapshot: `
Current ticket queue (22 open):
- 🔴 3 critical (>24h): billing dispute (31h — escalation risk ⚠️), refund request, product defect report
- 🟡 7 medium (>8h): feature requests, general inquiries
- 🟢 12 low: feature requests, compliments

Key metrics (last 30 days):
- Avg resolution time: 6.2h (↓1.4h vs last month ✅ — 2× faster than industry avg of 12h)
  - General: 3.1h | Technical: 7.2h | Billing: 9.8h ← slowest
- CSAT for resolved tickets: 4.2/5
- Most reported: login/access (34 tickets, ↑40% since password policy change last week)`,
    industryBenchmarks: `
- Industry avg resolution: 12h (yours: 6.2h — 2× faster)
- Issues resolved in <4h correlate with 2× higher satisfaction scores
- Self-serve FAQ deflects 20–40% of repetitive support tickets
- First-contact resolution rate benchmark: 70–75%`,
  },

  Insights: {
    description:
      "AI-powered customer insights surfacing themes, sentiment patterns, and actionable findings across reviews, surveys, inbox messages, and social comments.",
    dataSnapshot: `
Key insights this month:
- #1 friction point: wait times — in 34% of negative feedback across all channels
- #1 strength: staff friendliness — in 67% of positive mentions
- Customers who receive a follow-up message are 2.4× more likely to leave a positive review
- Sentiment this week: 68% positive (↑4%), 14% negative, 18% neutral
- Weekend staff getting notably better feedback after last week's training
- Weekday afternoons: concentrated source of wait-time complaints

Most common themes (all channels):
1. Wait times — 38% of mentions | 2. Staff attitude — 31% | 3. Pricing — 19% | 4. Location/parking — 12%
Top insight sources: Google Reviews (44%), in-store survey (29%), SMS inbox (27%)`,
    industryBenchmarks: `
- Companies acting on insights within 7 days see 2× improvement in satisfaction
- 15% wait time reduction → ~0.4 ⭐ improvement in reviews
- Staff training impact is measurable in reviews within 2–3 weeks
- Closing the loop on negative feedback recovers ~70% of at-risk customers`,
  },

  Search: {
    description:
      "AI-powered local search visibility tool. Tracks ranking positions on Google Maps, voice search, and Bing to optimize local SEO.",
    dataSnapshot: `
Local search visibility:
- Avg rank across target queries: #3.2 (↑0.4 vs last month)
- Google Maps local pack: appearing for 68% of target keywords
- Voice search capture rate: 34% of local voice queries
- Top ranked: "[brand] [city]" (#1), "best [service] near me" (#2)
- Opportunity: "affordable [service]" — currently #7, top 3 reachable with listing updates
- Bing: weaker presence (42% of target keywords in top 5)`,
    industryBenchmarks: `
- Top 3 local pack positions capture 75% of all clicks
- Voice searches growing 35% YoY for local business queries
- Businesses with 4.0+ rating rank avg 1.2 positions higher in local search
- NAP consistency improves local rank by an estimated 15%`,
  },

  "Search AI": {
    description: "AI-powered competitor analysis — tracks visibility, citation share, and keyword rankings across ChatGPT, Gemini, Perplexity, and Claude.",
    dataSnapshot: `
Visibility score: 62%
Citation share: 18%
Top keyword: dental implants near me
Tracked competitors: 8
Platforms: ChatGPT, Gemini, Perplexity, Claude`,
    industryBenchmarks: `
- Top-quartile brands achieve 70%+ AI visibility across LLM platforms
- Citation share >20% correlates with 35% more inbound queries
- Businesses optimizing for AI search see 2× faster visibility growth`,
  },
};

export function getProductContext(screenTitle: string): MynaProductContext | undefined {
  return PRODUCT_CONTEXTS[screenTitle];
}
