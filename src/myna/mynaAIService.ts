import type { MynaChatMessage } from "./mynaMockConversations";
import type { StructuredAIResponse } from "./mynaSemanticTypes";
import { getProductContext } from "./mynaProductContext";
import { generateMynaResponseLangChain } from "./mynaLangChainService";

export type MynaResponse = { text: string; structured?: StructuredAIResponse };

// ─── Main entry — LangChain → local fallback ─────────────────────────────────

export async function generateMynaResponse(
  screenTitle: string,
  userMessage: string,
  history: MynaChatMessage[],
): Promise<MynaResponse> {
  const apiKey = (import.meta.env.VITE_ANTHROPIC_API_KEY ?? "") as string;

  if (apiKey) {
    try {
      return await generateMynaResponseLangChain(screenTitle, userMessage, history);
    } catch {
      // fall through to local engine
    }
  }

  return { text: generateLocalResponse(screenTitle, userMessage) };
}

// ─── Intelligent local fallback engine ───────────────────────────────────────

type Intent =
  | "summary"
  | "comparison"
  | "drill_down"
  | "trend"
  | "action"
  | "health_check"
  | "general";

function detectIntent(q: string): Intent {
  if (/\b(health|status|check|running|working|ok|alive|all good)\b/.test(q)) return "health_check";
  if (/\b(summar|overview|pulse|snapshot|how (are|is|did|was)|what('s| is| are)|give me a|quick)\b/.test(q))
    return "summary";
  if (/\b(compar|vs\.?|versus|difference|better|rank|benchmark|against|stack up)\b/.test(q))
    return "comparison";
  if (/\b(trend|over time|recently|last (week|month)|growing|declining|pattern|change|this week|this month)\b/.test(q))
    return "trend";
  if (/\b(show|list|which|who|where|top|bottom|highest|lowest|best|worst|most|least|display)\b/.test(q))
    return "drill_down";
  if (/\b(help|fix|improve|draft|suggest|recommend|should|how (to|do|can)|can you|what (can|should)|tip)\b/.test(q))
    return "action";
  return "general";
}

// Per-product response rules (regex-based, more flexible than string matching)
const PRODUCT_RULES: Record<string, Array<{ match: RegExp; reply: string }>> = {
  Reviews: [
    {
      match: /\b(attention|poor|low|worst|problem|concern|underperform|below|struggling)\b/,
      reply:
        "**Locations needing attention:**\n\n- **Downtown** — ⭐2.8 avg (↓0.4 vs last week). Top complaint: wait times. 3 unanswered negatives >12h old ⚠️\n- **Westside Mall** — ⭐3.1. Recurring theme: staff responsiveness.\n- **Airport Kiosk** — ⭐3.3 with high volume — significant impact even at moderate rating.\n\nWant me to draft response templates for any of these?",
    },
    {
      match: /\b(rating|star|score|by location|per location|breakdown|location)\b/,
      reply:
        "**Ratings by location this week:**\n\n| Location | Rating | Reviews | Status |\n|---|---|---|---|\n| North Shore | ⭐4.7 | 12 | ✅ Top performer |\n| Airport Kiosk | ⭐3.3 | 15 | → Monitor |\n| Westside Mall | ⭐3.1 | 7 | ⚠️ Watch |\n| Downtown | ⭐2.8 | 9 | 🔴 Needs attention |\n\n**Overall: ⭐3.7** across 43 reviews this week. Resolving Downtown's wait-time issues could lift the overall average to 3.9+.",
    },
    {
      match: /\b(sentiment|theme|topic|positive|negative|feel|trend)\b/,
      reply:
        "**Review sentiment this week:**\n\n📈 Positive: **61%** (↑5%)\n➡️ Neutral: 24%\n📉 Negative: **15%** (↓3%)\n\n**Top positive themes:** staff friendliness, quick service\n**Top negative themes:** wait times (Downtown), parking (Westside)\n\nOverall trajectory is improving — Downtown is the main drag. A targeted wait-time initiative there would accelerate the trend.",
    },
    {
      match: /\b(response|respond|reply|unanswered|answered|rate)\b/,
      reply:
        "**Review response status:**\n\n- Your response rate is **91%** — well above the 72% industry avg\n- ⚠️ 3 negative reviews at Downtown are unanswered (>12h) — these carry the highest churn risk\n- Target: 95% response rate within 24h\n\nWant me to draft responses for the 3 flagged Downtown reviews?",
    },
  ],

  Overview: [
    {
      match: /\b(performance|week|business|all|overall|summary|pulse|health|snapshot)\b/,
      reply:
        "**This week at a glance:**\n\n- **Reviews:** 43 new, ⭐3.7 avg (↑0.2), volume ↑18%\n- **Inbox:** 127 messages, 94% response rate\n- **Campaigns:** Spring Promo 34% open, Referral Drive 41% open ← above industry\n- **Listings:** 94% accuracy — Yelp and Apple Maps need updates\n- **BirdAI:** 4 agents healthy, 1 minor alert (Appointment Reminder)\n\nStandout: review volume surge and Referral Drive open rate. Downtown reviews still need attention.",
    },
    {
      match: /\b(attention|focus|issue|problem|fix|urgent|priority|need|action)\b/,
      reply:
        "**3 things needing your attention right now:**\n\n1. **Downtown reviews** — ⭐2.8 avg, 3 unanswered negatives (>12h old)\n2. **Yelp and Apple Maps listings** — holiday hours missing, photos stale at 2–3 locations\n3. **Re-engagement campaign** — 22% open rate vs 28% target; subject line refresh recommended\n\nResolving #1 and #2 would have the highest combined impact on local search visibility and customer trust.",
    },
    {
      match: /\b(compar|month|last|vs|versus|trend|against)\b/,
      reply:
        "**This month vs last month:**\n\n| Metric | This Month | Last Month | Δ |\n|---|---|---|---|\n| Avg Rating | ⭐3.9 | ⭐3.6 | ↑8% |\n| NPS | 67 | 63 | ↑6% |\n| Response Rate | 91% | 87% | ↑5% |\n| Review Volume | 187 | 164 | ↑14% |\n\nAll four KPIs trending up — best month in the past quarter. Campaign open rates dipped slightly (-2%), worth monitoring.",
    },
  ],

  Social: [
    {
      match: /\b(top|perform|best|highest|engag|post|content)\b/,
      reply:
        "**Top performing posts this week:**\n\n1. 📸 **Team photo** (Instagram) — 847 likes, 92 shares, **4.2% engagement** ← top quartile\n2. 🎉 **Customer spotlight** (Facebook) — 312 reactions, 41 comments\n3. 📢 **Service announcement** (LinkedIn) — 189 impressions, 22 link clicks\n\nInstagram engagement ↑18% vs last week. Team content is outperforming product content 2:1 — lean into that pattern next week.",
    },
    {
      match: /\b(engag|drive|type|format|what work|which)\b/,
      reply:
        "**What drives engagement on your channels:**\n\n- **Behind-the-scenes** content: 2.4× avg engagement ← highest multiplier\n- **Customer stories**: most shares (avg 38 per post)\n- **Questions & polls**: 3× more comments than announcements\n\nBest posting window: **Tue–Thu, 10am–12pm** local time. Reels get ~3× more reach than static images on Instagram right now.",
    },
    {
      match: /\b(idea|suggest|next|upcoming|plan|create|draft|what should)\b/,
      reply:
        "**Post ideas for next week:**\n\n1. 🎥 **Day-in-the-life Reel** — high organic reach on Instagram; best for awareness\n2. 📊 **Customer win with stats** (\"We helped X achieve Y in Z days\") — great for LinkedIn\n3. ❓ **Poll** — \"What service would you want to see next?\" — drives 3× more comments than announcements\n\nShall I draft copy for any of these?",
    },
  ],

  Campaigns: [
    {
      match: /\b(perform|active|campaign|how|status|all)\b/,
      reply:
        "**Active campaign performance:**\n\n| Campaign | Status | Open Rate | CTR | Conversion |\n|---|---|---|---|---|\n| Referral Drive | 🟢 Live | **41%** | 8.2% | 5.1% |\n| Spring Promo | 🟢 Live | 34% | 6.1% | 4.3% |\n| Re-engagement | 🟡 Paused | 22% | 3.4% | — |\n\n**Referral Drive** is the standout — 41% open rate vs 28% industry avg. Its formula (personalized subject + Tuesday AM + single CTA) should be replicated for the Spring Promo next send.",
    },
    {
      match: /\b(open rate|highest|best|top|winner|leading)\b/,
      reply:
        "**Referral Drive** leads with a **41% open rate** — well above the 28% industry benchmark.\n\nSuccess formula: personalized subject line, Tuesday morning send, concise body with a single clear CTA.\n\nWant me to apply this template to the paused Re-engagement campaign? A subject line refresh + Tuesday resend could recover significant open rate from its current 22%.",
    },
    {
      match: /\b(conversion|ctr|click|trend|improve|lift)\b/,
      reply:
        "**Conversion trends (last 30 days):**\n\n- Overall conversion rate: **4.8%** (↑0.9% vs prior month)\n- Referral Drive: 8.2% CTR → 5.1% conversion ← best performer\n- Spring Promo: 6.1% CTR → 4.3% conversion\n- Re-engagement: 3.4% CTR (paused) — a subject line refresh could recover ~1.5% CTR\n\nRe-engaging the paused campaign with Referral Drive's template is the highest-ROI move right now.",
    },
  ],

  Contacts: [
    {
      match: /\b(new|month|grow|acqui|source|channel|add)\b/,
      reply:
        "**New contacts this month:** 284 (↑12% vs last month)\n\n- 🌐 Web form: 141 ← top channel (↑31% since landing page redesign)\n- 📧 Email import: 89\n- 🔗 Referral: 54\n\nThe web form redesign is clearly working. A referral campaign to activate your existing contacts could accelerate the referral channel — it typically has the highest customer LTV.",
    },
    {
      match: /\b(engag|active|best|top|valuable|loyal|most)\b/,
      reply:
        "**Most engaged contacts this month:**\n\n1. **Sarah K.** — 8/10 emails opened, 5 click-throughs (strong buyer signal)\n2. **Marcus T.** — responded to 2 campaigns, left a 5-star review\n3. **Priya N.** — active on 3 channels, NPS: 9\n\nAll three are strong referral or loyalty offer candidates. Building a \"high-engagement\" segment from their behavior patterns could improve campaign targeting across the board.",
    },
    {
      match: /\b(trend|summar|overview|activ|email|sms|channel|overall)\b/,
      reply:
        "**Contact engagement trends:**\n\n- Email open rate: ↑7% vs last month (now ~31%)\n- SMS response rate: **34%** (↑4%)\n- Avg contacts per campaign: 412\n\nHighest-engagement segments: **recent customers** (<30 days) and **loyalty members** — 2–3× more likely to respond than the general list. Worth creating dedicated nurture sequences for both.",
    },
  ],

  Inbox: [
    {
      match: /\b(unread|summar|summary|inbox|message|overview|today)\b/,
      reply:
        "**Inbox summary (14 unread):**\n\n🔴 **3 urgent**: billing dispute (31h — escalation risk ⚠️), appointment mix-up, TechCorp renewal (~$4k ARR)\n🟡 **6 medium**: feature requests, general inquiries\n🟢 **5 low**: thank-yous, confirmations\n\nOldest unread is 6 hours old. The TechCorp renewal is time-sensitive revenue — want me to draft a response?",
    },
    {
      match: /\b(priority|urgent|high|important|critical|escalat|first)\b/,
      reply:
        "**Highest priority conversations right now:**\n\n1. **Billing dispute** — 31h wait, escalation risk ⚠️ — respond immediately\n2. **Amy L.** — appointment mix-up, needs same-day reschedule\n3. **TechCorp** — renewal question worth ~$4k ARR — time-sensitive\n\nAll three need a response within the next 2 hours. The billing dispute carries the highest churn risk — unresolved billing issues are the top driver of customer loss.",
    },
    {
      match: /\b(topic|frequen|common|appear|categor|type|theme)\b/,
      reply:
        "**Most common inbox topics:**\n\n1. Scheduling & appointments — **31%** ← dominant\n2. Billing questions — 24%\n3. Product/service info — 19%\n4. Complaints — 14%\n5. General feedback — 12%\n\nScheduling is the top driver. A self-service booking FAQ or AI chatbot for common scheduling questions could deflect ~25% of inbox volume, freeing your team for higher-value conversations.",
    },
  ],

  Reports: [
    {
      match: /\b(last month|summar|performance|overview|summary|month|results)\b/,
      reply:
        "**Last month's performance:**\n\n- **Reviews:** ⭐3.9 avg, 187 total (↑14%)\n- **NPS:** 67 (↑4 pts)\n- **Response rate:** 91% — enabled auto-response templates 6 weeks ago\n- **Campaigns:** 3 sent, 29% avg open rate (↓2% — possible subject line fatigue)\n\nStrongest area: review volume growth (+14%). Watch: campaign open rate dipped — a creative refresh is likely due.",
    },
    {
      match: /\b(quarter|vs|metric|key|kpi|compar|this quarter)\b/,
      reply:
        "**This quarter vs last quarter:**\n\n| Metric | This Q | Last Q | Δ |\n|---|---|---|---|\n| Avg Rating | ⭐3.9 | ⭐3.6 | ↑8% |\n| NPS | 67 | 63 | ↑6% |\n| Response Rate | 91% | 87% | ↑5% |\n| Review Volume | 542 | 480 | ↑13% |\n\nAll 4 KPIs trending up — best quarter in the past year. The response rate jump (+4%) from enabling auto-templates accounts for most of the NPS improvement.",
    },
    {
      match: /\b(improv|recent|best|gain|biggest|most|what changed)\b/,
      reply:
        "**Biggest improvements recently:**\n\n1. **Review response rate:** 78% → 91% — after enabling auto-response templates (6 weeks ago)\n2. **NPS:** ↑4 pts — driven by faster support resolution times\n3. **Campaign open rate:** Referral Drive at 41% — best single campaign performance this year\n\nThe response rate improvement is the most structurally significant — it's the key upstream driver of the NPS gains.",
    },
  ],

  Surveys: [
    // ── NPS DIAGNOSTIC: Why is NPS down / declining? ─────────────────────────
    {
      match: /\b(nps.*(down|declin|drop|lower|decreas|below|why)|why.*nps|detractor.*(increas|grow|more)|passives.*(prevalent|more)|below.*target|19\.7|promoter.*drop|pilot.*group.*pattern)\b/i,
      reply:
        "**Why NPS is below target (19.7 vs goal of 30):**\n\n- **Detractors at 37%** are driving the gap — wait times (42%), pricing (28%), communication (19%) are the top complaints\n- **Division A (NPS 12)** is a major drag vs Division B (NPS 34)\n- **Downtown and Region 12** (both NPS 28) have increasing detractor rates this quarter\n- **18–25 age group** (NPS -8) is significantly more detractor-heavy than the 50+ group (NPS 31)\n\nAddressing wait times alone — the #1 detractor theme — could move 5–8% of detractors to passive, which would lift overall NPS by ~8 points.",
    },
    // ── NPS DIAGNOSTIC: Location / Region / Division breakdown ───────────────
    {
      match: /\b(location.*(underperform|nps|differ|compar)|region\s*12|division\s*[ab]|branch|segment.*nps|certain.*location|nps.*location|nps.*region|nps.*division|new york|underperform.*compar)\b/i,
      reply:
        "**NPS breakdown by dimension:**\n\n| Location | NPS | Status |\n|---|---|---|\n| North Shore | 62 | ✅ Top performer |\n| Westside Mall | 51 | ✅ Strong |\n| Airport Kiosk | 39 | → Monitor |\n| Downtown | 28 | ⚠️ Needs attention |\n| Region 12 | 28 | ⚠️ Detractors ↑ |\n\n**By division:** Division B (34) vs Division A (12) — a 22-point gap.\n**Pilot group:** NPS 44 vs control group NPS 22 — pilot approach is showing strong results.\n\nNorth Shore's success pattern (high promoter response, staff rating, fast completion) is worth replicating at Downtown and Region 12.",
    },
    // ── NPS DIAGNOSTIC: Specific dimension / correlation ─────────────────────
    {
      match: /\b(18.?25|age.*group|wait.*time.*issue|check.?in|correlation|plasma|reason.*exit|satisfaction.*drop|overall.*satisfaction|check.?in.*process)\b/i,
      reply:
        "**Segment and correlation analysis:**\n\n- **18–25 age group:** NPS -8 vs 50+ group NPS 31 — the younger cohort skews heavily detractor; their top issues are wait times and pricing\n- **'Wait Time' as issue:** customers who select it as a pain point score **14 points lower** on NPS on average\n- **'Check-in Process' rating** has a strong positive correlation with final NPS — a 1-point improvement in check-in rating correlates with ~6-point NPS uplift\n- **'Overall Satisfaction' drop:** most correlated with wait time complaints and Q5 skip rate\n\nFocusing check-in improvements at Downtown and Region 12 would have the highest NPS impact given their current low scores.",
    },
    // ── NPS PRESCRIPTIVE: How to improve NPS ─────────────────────────────────
    {
      match: /\b(improve.*nps|address.*detractor|move.*passive|replicate.*success|structure.*survey.*program|increase.*promoter|improvement.*effort|how.*nps|focus.*improvement|high.*percentage.*detractor|lower.*promoter)\b/i,
      reply:
        "**How to improve NPS from 19.7 toward target 30:**\n\n1. **Address wait times** — cited by 42% of detractors; reducing it by 15% at Downtown and Region 12 could lift their NPS by 8–10 points\n2. **Replicate North Shore** — NPS 62; their check-in process rating and staff responsiveness scores are the key differentiators\n3. **Move passives (35%) to promoters** — passives cite ease of process (3.8) and pricing as their top friction; a follow-up message campaign recovers ~30% of passives\n4. **Division A focus** — NPS 12 is 22 points below Division B; start with the highest-volume locations within Division A\n5. **Pilot the pilot-group approach broadly** — pilot group NPS 44 vs control 22; the approach is working and should be scaled",
    },
    // ── NPS DESCRIPTIVE: Trend, distribution, top performers ─────────────────
    {
      match: /\b(nps.*trend|compar.*q2|top.*performer|regional.*breakdown|distribution.*nps|nps.*distribution|promoters.*vs|detractor.*rate|what.*percentage|pilot.*group.*performance|nps.*score.*trend|our.*nps.*time)\b/i,
      reply:
        "**NPS data snapshot:**\n\n- Overall NPS: **19.7** (target: 30; Q2 was 23.4 — down ↓3.7 pts)\n- Promoters: **28%** | Passives: **35%** | Detractors: **37%**\n- Total responses (12 months): **4,218**\n\n**By region:** North Shore 62 ← #1 | Westside 51 | Airport 39 | Downtown 28 | Region 12 28\n**By division:** Division B 34 | Division A 12\n**Pilot vs control:** 44 vs 22 — 22-point spread\n**Highest detractor rate segment:** Region 12 and 18–25 age group",
    },
    // ── SURVEY RESPONSES DIAGNOSTIC: Why responses/completion dropping ────────
    {
      match: /\b(responses?.*(drop|declin|fewer|low)|completion.*(declin|drop|differ|lower)|partial.*completion|response.*pattern|question.*type.*different|0.?3.*getting|location.*39.*60|fewer.*response|specific.*question)\b/i,
      reply:
        "**Why survey responses and completion are declining:**\n\n- **Completion rate dropped to 81.9%** (↓2.1% vs last wave) — partial completions now at 18.1%\n- **Questions 0–3** (Overall Satisfaction, Likelihood to Recommend, Staff Rating) get high responses; **Questions 4–6** see a significant drop-off — survey fatigue setting in\n- **Q5 Income** is optional and skipped by 62% of respondents — its position may be deterring completion of Q6\n- **Location variance:** Downtown shows 39 NPS while North Shore shows 62+ — the completion rate gap mirrors this: lower-NPS locations also have lower completion (likely disengaged detractors dropping off)\n- **MoM responses ↓7%** over last 3 months — consistent downward trend",
    },
    // ── SURVEY RESPONSES PRESCRIPTIVE: How to improve responses/completion ────
    {
      match: /\b(increase.*response|structure.*question|reduce.*partial|improve.*response.*rate|improve.*completion|81\.?9|prioritize.*question|handle.*low.*response|handle.*question|how.*completion|more.*response)\b/i,
      reply:
        "**How to improve survey responses and completion:**\n\n1. **Shorten post-Q3 section** — drop-off starts at Q4; moving optional questions (Income) to the end or removing them reduces partial completions by ~25%\n2. **Current 81.9% completion** — reaching 85%+ would add ~130 fully-complete responses/month\n3. **Prioritize Q1–Q3** for insights — Overall Satisfaction, NPS, and Staff Rating have the highest response rates and strongest correlation with final NPS\n4. **Location-specific nudges** — send a reminder SMS to Downtown and Region 12 respondents who started but didn't finish (18.1% partial rate)\n5. **Reduce to 5 core questions** for mobile respondents — mobile completion lags desktop by ~9%",
    },
    // ── SURVEY RESPONSES DESCRIPTIVE: Volume, completion status, per month ────
    {
      match: /\b(total.*response|completion.*rate|which.*question.*most|trend.*response|yes.*response|completion.*status|response.*month|how.*many.*response|12.*month.*response|per.*month|current.*completion|receiving.*most)\b/i,
      reply:
        "**Survey responses overview:**\n\n- Total responses (last 12 months): **4,218**\n- Current completion rate: **81.9%** (completed) | 18.1% partial\n- Avg monthly responses: **351/month** (↓7% MoM trend)\n- Most answered questions: Q1 Overall Satisfaction, Q2 Likelihood to Recommend\n- Most 'Yes' responses: Q3 'Would you return?' — 74% Yes\n- Highest engagement locations: North Shore, Westside Mall\n- Completion status this period: 3,450 complete | 768 partial\n\nMonthly trend over 6 months: 412 → 398 → 381 → 365 → 352 → 340 — consistent downward slope to watch.",
    },
    // ── COMBINATION: Cross-metric (NPS × response rate) ──────────────────────
    {
      match: /\b(high.*nps.*low.*response|low.*response.*nps|correlat|driving.*detractor|better.*insight.*completion|question.*correlat.*nps|specific.*question.*nps|cross.*report|nps.*response)\b/i,
      reply:
        "**Cross-metric insight — NPS × Survey Responses:**\n\n- **North Shore** has both high NPS (62) and high completion rate (89%) — the two metrics reinforce each other; engaged, satisfied customers complete more\n- **Downtown** has low NPS (28) and lower completion (74%) — disengaged detractors are dropping off before Q4, which means their feedback is under-represented\n- **Questions driving detractor NPS:** Q2 (Wait Time rating) and Q6 (Ease of Process) have the strongest correlation with detractor classification\n- **Completion rate ≥85%** at a location correlates with NPS scores 12+ points higher on average\n\nImproving Downtown's completion rate would surface more detractor feedback, making root-cause analysis more accurate — and resolving their issues would lift both metrics.",
    },
    // ── THEMES / KEYWORDS / FEEDBACK SUMMARY ─────────────────────────────────
    {
      match: /\b(theme|keyword|top.*3|additional.*comment|summar.*feedback|positive.*feedback|nursing|most.*frequen|top.*reason|hear.*about|detractor.*keyword)\b/i,
      reply:
        "**Feedback themes and keywords:**\n\n**Top 3 themes in detractor comments:** wait times (42%), pricing (28%), communication (19%)\n**Top promoter themes:** staff friendliness (67%), ease of booking (44%)\n**Most frequent detractor keywords:** \"wait\", \"slow\", \"expensive\", \"unclear\"\n\n**Top reasons selected in 'How did you hear about us?':**\n1. Referral from friend/family — 38%\n2. Google search — 31%\n3. Social media — 19%\n\nPositive staff feedback is a strong asset — featuring it in marketing materials and review requests could improve both acquisition and promoter rate.",
    },
    // ── AVERAGE / SCORE BREAKDOWN ─────────────────────────────────────────────
    {
      match: /\b(average.*time|time.*finish|skip.*income|skipped|optional.*question|satisf.*score|average.*satisf|csat|lowest.*score|score.*breakdown)\b/i,
      reply:
        "**Survey score and completion breakdown:**\n\n- Avg time to complete: **4.2 minutes**\n- Q5 Income (optional): **62% skip rate** — highest of all questions\n- Overall Satisfaction avg: **4.1 / 5**\n- Likelihood to Recommend (NPS question): **19.7** net score\n- Lowest-scoring dimension: **Wait Time** (3.4 / 5 and top detractor driver)\n- Highest-scoring dimension: **Staff Friendliness** (4.6 / 5)\n\nThe 62% skip rate on Q5 (Income) suggests either survey fatigue by that point or perceived irrelevance — moving it after the NPS question or removing it could improve completion of subsequent questions.",
    },
  ],

  Listings: [
    {
      match: /\b(up to date|accurate|check|status|current|health|all)\b/,
      reply:
        "**Listing accuracy check:**\n\n✅ Google — 98% (hours and phone current)\n⚠️ Yelp — 91% — holiday hours missing at Airport and North Shore\n⚠️ Apple Maps — 88% — outdated photos and missing website URL at Westside\n✅ Facebook — 96% — all current\n⚠️ Bing — Downtown: incorrect zip code\n\nWant me to queue the Yelp and Apple Maps fixes? The Apple Maps photo update alone could increase direction requests by ~15%.",
    },
    {
      match: /\b(low|poor|worst|inaccurate|problem|issue|fix|score)\b/,
      reply:
        "**Listings with the lowest accuracy:**\n\n1. **Apple Maps — Westside** (88%) — photos 8+ months old, missing website URL\n2. **Yelp — Airport** (91%) — no holiday hours, outdated tagline\n3. **Bing — Downtown** — incorrect zip code on file\n\nFixing these three could increase local search discovery by 15–20% — they affect how you appear in navigation apps and voice search.",
    },
    {
      match: /\b(recent|change|update|last|history|what happened)\b/,
      reply:
        "**Recent listing changes (last 7 days):**\n\n✅ Google Thanksgiving hours updated at all 4 locations\n✅ New photos published to Facebook (North Shore)\n⚠️ Yelp sync failed for Airport location — still retrying\n\nThe Yelp failure is isolated — everything else is current. The Airport Yelp fix should resolve automatically once the retry succeeds.",
    },
  ],

  BirdAI: [
    {
      match: /\b(health|status|agent|check|running|ok|alive|working|all)\b/,
      reply:
        "**Agent health status:**\n\n✅ Review Response Bot — running, 14 replies sent today, 99.1% uptime\n✅ Lead Qualifier — active, 8 leads scored in last hour, routed to CRM\n⚠️ Appointment Reminder — 2 failed sends (phone number format issue, ~3% of contacts)\n✅ Feedback Collector — healthy, 99.2% uptime, 34 responses today\n\nThe Appointment Reminder issue is minor and config-fixable — affects only contacts with non-standard phone formats. Want to see the affected records?",
    },
    {
      match: /\b(underperform|poor|low|fail|worst|issue|problem|alert|concern)\b/,
      reply:
        "**Agents needing attention:**\n\n- **Appointment Reminder** — 3% failed send rate (target: 99.8%). Root cause: phone number format mismatch. Fix: update validation rules.\n- **Re-engagement Bot** — 18% email open rate vs 25% target. Root cause: subject line staleness. Fix: refresh subject templates.\n\nBoth are config changes, not agent failures — low effort, high impact. Want me to suggest the specific updates?",
    },
    {
      match: /\b(recent|activ|last|24h|today|hour|automation|log|what happened)\b/,
      reply:
        "**Automation activity (last 24h):**\n\n- 🔁 147 review requests sent → 23 responses (15.6% rate ← above 12% industry avg)\n- 📅 89 appointment reminders delivered, 2 failed\n- 🎯 8 new leads qualified and routed to CRM\n- ⭐ 3 negative reviews flagged for manual follow-up\n\nAll agents running within normal parameters except Appointment Reminder (minor phone format issue). Overall automation ROI is strong.",
    },
  ],

  Competitors: [
    {
      match: /\b(compar|vs|how (do|am|are|is)|rank|stand|benchmark|against|position)\b/,
      reply:
        "**Your competitive position (last 30 days):**\n\n| Metric | You | Competitor A | Competitor B | Competitor C |\n|---|---|---|---|---|\n| Avg Rating | ⭐3.9 | ⭐4.1 | ⭐3.7 | ⭐3.5 |\n| Review Volume | **187** | 142 | 94 | 67 |\n| Response Rate | **91%** | 76% | 58% | 43% |\n\nYou lead on volume and response rate. Your 91% response rate vs Competitor A's 76% is a strong trust differentiator. Close the Downtown rating gap and you'd edge out Competitor A overall.",
    },
    {
      match: /\b(gaining|grow|most|surge|fast|who|which competitor)\b/,
      reply:
        "**Fastest-growing competitor: Competitor A** — ↑22% MoM in review volume (142 this month).\n\nTheir surge is driven by a post-purchase email review request flow — similar to what Birdeye's automated review requests can do. They're averaging ⭐4.1.\n\nYour **91% response rate** (vs their 76%) is a meaningful trust signal — consumers notice responsiveness. Worth amplifying in any local advertising.",
    },
    {
      match: /\b(rank|position|where|standing|this month|overall|my rank)\b/,
      reply:
        "**Your competitive ranking this month:**\n\n🥇 **Response rate:** #1 of 4 tracked (91%)\n🥈 **Review volume:** #2 (187 reviews)\n🥉 **Avg rating:** #3 (3.9 ⭐)\n\n**Quick win:** Bring Downtown from ⭐2.8 to ⭐4.0+ and you'd move to #2 in avg rating, closing the gap with Competitor A. Protecting the response rate lead is equally important — it's now a key differentiator.",
    },
  ],

  Ticketing: [
    {
      match: /\b(open|attention|ticket|need|urgent|backlog|queue|show)\b/,
      reply:
        "**Open tickets needing attention:**\n\n🔴 **3 critical** (>24h):\n- Billing dispute — 31h, escalation risk ⚠️\n- Refund request — 24h pending\n- Product defect report — awaiting engineering triage\n\n🟡 **7 medium** (>8h): feature requests, general inquiries\n🟢 **12 low**: feature requests, compliments\n\nThe billing dispute is most urgent — 31h without response has significant churn risk. Recommend prioritizing it now.",
    },
    {
      match: /\b(resolution|time|average|fast|slow|long|how long)\b/,
      reply:
        "**Average resolution time: 6.2h** (↓1.4h vs last month ✅ — 2× faster than the 12h industry avg)\n\n| Category | Avg Time |\n|---|---|\n| General | 3.1h |\n| Technical | 7.2h |\n| Billing | **9.8h** ← |\n\nBilling takes 3× longer than general. A self-serve billing FAQ covering the top 5 question types could cut that to ~5h and deflect ~20% of billing tickets entirely.",
    },
    {
      match: /\b(issue|report|often|frequen|common|type|categor|most)\b/,
      reply:
        "**Most reported issues (last 30 days):**\n\n1. Login/access problems — 34 tickets (28%) ← spiking ↑40%\n2. Billing questions — 27 tickets (22%)\n3. Feature not working — 19 tickets (16%)\n4. Cancellation/refund — 14 tickets (11%)\n\n**Root cause of login spike:** password policy change last week is the likely driver. A proactive status page update + FAQ entry would reduce this category by an estimated 30%.",
    },
  ],

  Insights: [
    {
      match: /\b(top|key|main|important|insight|customer|finding|biggest)\b/,
      reply:
        "**Top customer insights this month:**\n\n1. 🕐 **Wait times** — #1 friction point, in 34% of negative feedback (cross-channel: reviews, surveys, inbox)\n2. 😊 **Staff friendliness** — biggest strength, in 67% of positive mentions\n3. 📨 **Follow-up effect** — customers who receive one are **2.4×** more likely to leave a positive review\n\n**Highest-impact quick win:** a 1-day post-visit follow-up in your booking flow could lift review scores by 0.3–0.5 ⭐.",
    },
    {
      match: /\b(sentiment|trend|week|positive|negative|change|how is)\b/,
      reply:
        "**Sentiment trends this week:**\n\n📈 Positive: **68%** (↑4% vs last week)\n📉 Negative: **14%** (↓3%)\n➡️ Neutral: 18%\n\nThe positive shift is driven by weekend staff — they received notably better feedback after last week's training. Negative mentions concentrate around **weekday afternoon wait times** — a staffing or process change in that window would have high impact.",
    },
    {
      match: /\b(theme|appear|feedback|common|frequen|categor|what do)\b/,
      reply:
        "**Most common themes in customer feedback:**\n\n1. 🕐 **Wait times** — 38% of mentions (mixed; dominant negative driver)\n2. 😊 **Staff attitude** — 31% (overwhelmingly positive)\n3. 💰 **Pricing** — 19% (neutral to slightly negative)\n4. 📍 **Location/parking** — 12% (mostly neutral)\n\nWant a breakdown by channel (reviews vs surveys vs inbox) or by location? The location view often reveals where to act first.",
    },
  ],
};

function buildProductResponse(screenTitle: string, _intent: Intent, q: string): string | null {
  const rules = PRODUCT_RULES[screenTitle];
  if (!rules) return null;
  for (const rule of rules) {
    if (rule.match.test(q)) return rule.reply;
  }
  return null;
}

// ─── Query-based product detection ───────────────────────────────────────────
// Infers which Birdeye product the user is asking about from keywords,
// so responses stay accurate even when the active screen is different.

const PRODUCT_SIGNALS: Array<{ re: RegExp; screen: string }> = [
  { re: /\b(review|rating|star|yelp|google review|response rate|sentiment|unanswered)\b/i, screen: "Reviews" },
  { re: /\b(campaign|email blast|sms blast|open rate|click.?through|ctr|drip)\b/i, screen: "Campaigns" },
  { re: /\b(survey|nps|net promoter|csat|satisfaction score|detractor|promoter|passives?)\b/i, screen: "Surveys" },
  { re: /\b(social|instagram|facebook|linkedin|post|reel|engag|follower|hashtag)\b/i, screen: "Social" },
  { re: /\b(inbox|message|conversation|reply|respond|thread|ticket.?queue)\b/i, screen: "Inbox" },
  { re: /\b(listing|accuracy|apple maps|google business|bing|directory|sync|citation)\b/i, screen: "Listings" },
  { re: /\b(competitor|competitive|comp score|rival|market share|vs competition)\b/i, screen: "Competitors" },
  { re: /\b(contact|customer list|segment|lead|import|engagement score|crm)\b/i, screen: "Contacts" },
  { re: /\b(support ticket|ticketing|resolution time|helpdesk|open ticket|ticket queue)\b/i, screen: "Ticketing" },
  { re: /\b(agent|automation|bot|bird.?ai|workflow|ai.?agent|auto.?reply)\b/i, screen: "BirdAI" },
  { re: /\b(insight|sentiment trend|theme|feedback theme|keyword|topic.?analysis)\b/i, screen: "Insights" },
  { re: /\b(report|analytics|dashboard|kpi|metric|quarter|month.?over|week.?over)\b/i, screen: "Reports" },
  { re: /\b(overview|business health|pulse|all.?in.?one|summary across)\b/i, screen: "Overview" },
];

function detectTargetScreen(query: string): string | null {
  for (const { re, screen } of PRODUCT_SIGNALS) {
    if (re.test(query)) return screen;
  }
  return null;
}

function generateLocalResponse(screenTitle: string, userMessage: string): string {
  const intent = detectIntent(userMessage.toLowerCase());
  const q = userMessage.toLowerCase();

  // Try to detect the product the user is asking about; fall back to the active screen.
  const detectedScreen = detectTargetScreen(q);
  const targetScreen = detectedScreen ?? screenTitle;

  // 1. Try matched product's rules first
  const specific = buildProductResponse(targetScreen, intent, q);
  if (specific) return specific;

  // 2. If target differs from active screen, try active screen's rules too
  if (targetScreen !== screenTitle) {
    const activeSpecific = buildProductResponse(screenTitle, intent, q);
    if (activeSpecific) return activeSpecific;
  }

  // 3. Generic data-snapshot fallback using the target screen's context
  const ctx = getProductContext(targetScreen);
  if (ctx) {
    const label = detectedScreen ? `**${targetScreen}**` : `**${screenTitle}**`;
    const intros: Record<Intent, string> = {
      summary:      `Here's a quick snapshot for ${label}:`,
      comparison:   `Here's how ${label} metrics compare right now:`,
      trend:        `Recent trends in ${label}:`,
      drill_down:   `Key data points in ${label} right now:`,
      action:       `For ${label}, here's what I'd recommend:`,
      health_check: `${label} health check:`,
      general:      `Here's what I know about your ${label} right now:`,
    };
    return `${intros[intent]}\n\n${ctx.dataSnapshot.trim()}\n\nWhat would you like to dig into — trends, specific locations, or comparisons?`;
  }

  return `I'm Myna, your Birdeye AI assistant. Ask me anything about your reviews, campaigns, surveys, social, contacts, or any other Birdeye product — I'm not limited to the current screen.`;
}
