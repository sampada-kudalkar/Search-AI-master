import { ChatAnthropic } from "@langchain/anthropic";
import { z } from "zod";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { Client } from "langsmith";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";
import type { MynaChatMessage } from "./mynaMockConversations";
import type { StructuredAIResponse } from "./mynaSemanticTypes";
import { PRODUCT_CONTEXTS, getProductContext } from "./mynaProductContext";

// ─── Zod schema (mirrors StructuredAIResponse) ───────────────────────────────

const InsightSchema = z.object({
  id: z.string(),
  icon: z.string().describe("Single emoji e.g. '⚠️' or '📉'"),
  title: z.string().describe("3–5 words"),
  detail: z.string().describe("One sentence explaining this finding"),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  trendValue: z.string().optional().describe("e.g. '↓0.4' or '+18%'"),
  severity: z.enum(["positive", "warning", "negative", "neutral"]).optional(),
});

const MetricSchema = z.object({
  label: z.string(),
  value: z.string().describe("Formatted value e.g. '3.7 ⭐' or '91%'"),
  previousValue: z.string().optional(),
  change: z.string().optional().describe("Delta e.g. '↑0.2' or '↓3%'"),
  trend: z.enum(["up", "down", "neutral"]).optional(),
  context: z.string().optional().describe("Short qualifier e.g. 'vs last month'"),
});

const TableSchema = z.object({
  caption: z.string().optional(),
  headers: z.array(z.string()),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
});

const ChartSchema = z.object({
  type: z.enum(["bar", "line", "area"]).default("bar"),
  title: z.string().optional(),
  data: z
    .array(z.record(z.string(), z.union([z.string(), z.number()])))
    .describe("Each item MUST have 'label' key plus one key per series"),
  series: z.array(
    z.object({
      key: z.string().describe("Must match a key in data items"),
      label: z.string(),
      color: z.string().describe("Hex color e.g. '#2552ed'"),
    }),
  ),
});

const RecommendationSchema = z.object({
  id: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  title: z.string(),
  detail: z.string().optional(),
});

const ActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  variant: z.enum(["primary", "secondary", "outline", "ghost"]).optional(),
});

const SourceSchema = z.object({
  label: z.string(),
  type: z.enum(["reviews", "surveys", "inbox", "campaigns", "data"]).optional(),
});

const MynaStructuredSchema = z.object({
  summary: z.string().describe("Direct 1–2 sentence answer to the user's question"),
  insights: z
    .array(InsightSchema)
    .max(4)
    .optional()
    .describe("2–4 key findings as insight cards. Include for diagnostic/analysis queries only."),
  metrics: z
    .array(MetricSchema)
    .max(4)
    .optional()
    .describe("2–4 KPI highlights. Include when numbers are the main answer."),
  table: TableSchema.optional().describe(
    "Location or period breakdown. Include when 3+ rows of comparable data exist.",
  ),
  chart: ChartSchema.optional().describe(
    "Time-series or comparison chart. Include ONLY for trend/comparison queries with 4+ data points.",
  ),
  explanation: z
    .string()
    .optional()
    .describe("2–3 sentence 'why/how' in plain prose. Include for diagnostic questions."),
  recommendations: z
    .array(RecommendationSchema)
    .max(4)
    .optional()
    .describe("Prioritized next steps. Include for action/improvement queries."),
  actions: z
    .array(ActionSchema)
    .max(3)
    .optional()
    .describe("CTA buttons for the most important actions."),
  followUps: z
    .array(z.string())
    .max(3)
    .optional()
    .describe("3 follow-up question suggestions relevant to this response."),
  sources: z
    .array(SourceSchema)
    .max(3)
    .optional()
    .describe("Data sources that back this response."),
});

// ─── System prompt ────────────────────────────────────────────────────────────

/** One-line product index so the AI can reason about cross-product queries. */
function buildProductIndex(activeScreen: string): string {
  return Object.entries(PRODUCT_CONTEXTS)
    .filter(([name]) => name !== activeScreen)
    .map(([name, ctx]) => `- **${name}**: ${ctx.description.split(".")[0]}`)
    .join("\n");
}

function buildSystemPrompt(screenTitle: string, webContext?: string): string {
  const activeCtx = getProductContext(screenTitle);

  const activeDataBlock = activeCtx
    ? `### ${screenTitle} — live account data
${activeCtx.dataSnapshot}

### ${screenTitle} — industry benchmarks
${activeCtx.industryBenchmarks}`
    : "";

  const productIndex = buildProductIndex(screenTitle);

  const webBlock = webContext
    ? `\n## Real-time web context\n${webContext}\n`
    : "";

  return `You are Myna, Birdeye's intelligent AI assistant.

Birdeye is a reputation and customer experience platform for multi-location businesses — managing reviews, messaging, campaigns, surveys, listings, contacts, and AI automation.

## Scope rule — IMPORTANT
The user is currently viewing the **${screenTitle}** section, but you are NOT restricted to it.
- Answer every question based on the **user's actual intent**, not the active tab.
- If the question is about ${screenTitle}: use the live account data below.
- If the question is about a different Birdeye product: use your knowledge of that product.
- If the question is general (business, marketing, strategy, etc.): answer helpfully without forcing ${screenTitle} context into it.
- Never say "I can only help with ${screenTitle}". You can help with anything.

## Active screen context (use when the question is about ${screenTitle})
${activeDataBlock}

## Other Birdeye products (reference when the question is about these areas)
${productIndex}
${webBlock}
## Structured response rules
- The user's question determines scope — not the active tab
- For simple / conversational questions: fill only \`summary\` and \`followUps\`
- For data / analysis questions: include \`insights\`, \`metrics\`, \`table\`, or \`chart\` as relevant
- For trend questions: include a \`chart\` with 4–6 data points
- For "why" questions: include \`explanation\` and \`recommendations\`
- For action questions: include \`recommendations\` and \`actions\`
- Chart colors: #2552ed (primary), #94a3b8 (secondary), #22c55e (green), #ef4444 (red), #f59e0b (amber)
- Only include sections that add genuine value for this specific query
- Do NOT say "As an AI…" — you ARE Myna`;
}

// ─── Optional Tavily web search ───────────────────────────────────────────────

const WEB_SEARCH_RE =
  /\b(competitor|industry|benchmark|market|real.?time|2024|2025|latest|news|trend|compared to|vs\.?)\b/i;

async function maybeSearchWeb(query: string): Promise<string | undefined> {
  const tavilyKey = (import.meta.env.VITE_TAVILY_API_KEY ?? "") as string;
  if (!tavilyKey || !WEB_SEARCH_RE.test(query)) return undefined;

  try {
    const res = await fetch("/api/tavily/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: `Birdeye ${query} 2025`,
        max_results: 3,
        search_depth: "basic",
      }),
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as {
      results?: Array<{ title: string; content: string }>;
    };
    return data.results
      ?.map((r) => `${r.title}: ${r.content}`)
      .join("\n\n")
      .slice(0, 1200);
  } catch {
    return undefined;
  }
}

// ─── LangChain service ────────────────────────────────────────────────────────

// ─── LangSmith tracer ─────────────────────────────────────────────────────────

function getTracer(): LangChainTracer | null {
  const apiKey = (import.meta.env.VITE_LANGSMITH_API_KEY ?? "") as string;
  if (!apiKey) return null;

  try {
    const client = new Client({
      apiUrl:
        typeof window !== "undefined"
          ? `${window.location.origin}/api/langsmith`
          : "https://api.smith.langchain.com",
      apiKey,
    });
    return new LangChainTracer({
      projectName:
        ((import.meta.env.VITE_LANGSMITH_PROJECT ?? "") as string) || "birdeyev2-myna",
      client,
    });
  } catch {
    return null;
  }
}

let _model: ChatAnthropic | null = null;

function getModel(): ChatAnthropic {
  if (_model) return _model;
  const apiKey = (import.meta.env.VITE_ANTHROPIC_API_KEY ?? "") as string;
  if (!apiKey) throw new Error("VITE_ANTHROPIC_API_KEY not set");

  _model = new ChatAnthropic({
    model: "claude-haiku-4-5-20251001",
    maxTokens: 1200,
    apiKey,
    // Route through Vite dev proxy to avoid CORS
    anthropicApiUrl:
      typeof window !== "undefined"
        ? `${window.location.origin}/api/anthropic`
        : undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  return _model;
}

export async function generateMynaResponseLangChain(
  screenTitle: string,
  userMessage: string,
  history: MynaChatMessage[],
): Promise<{ text: string; structured: StructuredAIResponse }> {
  const model = getModel();
  const structuredModel = model.withStructuredOutput(MynaStructuredSchema);

  // Optionally enrich context with real web data
  const webContext = await maybeSearchWeb(userMessage);

  const messages = [
    new SystemMessage(buildSystemPrompt(screenTitle, webContext)),
    ...history
      .filter((m) => m.text.trim())
      .slice(-6)
      .map((m) =>
        m.role === "user" ? new HumanMessage(m.text) : new AIMessage(m.text),
      ),
    new HumanMessage(userMessage),
  ];

  const tracer = getTracer();
  const callbacks = tracer ? [tracer] : undefined;

  const result = await structuredModel.invoke(messages, { callbacks });

  return {
    text: result.summary,
    structured: result as StructuredAIResponse,
  };
}
