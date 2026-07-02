// ─── Primitive types ──────────────────────────────────────────────────────────

export type AITrend = "up" | "down" | "neutral";
export type AISeverity = "positive" | "warning" | "negative" | "neutral";
export type AIActionVariant = "primary" | "secondary" | "outline" | "ghost";
export type AIChartType = "bar" | "line" | "area";
export type AISourceType = "reviews" | "surveys" | "inbox" | "campaigns" | "data";

// ─── Section data shapes ──────────────────────────────────────────────────────

export interface AIInsight {
  id: string;
  icon: string;
  title: string;
  detail: string;
  trend?: AITrend;
  trendValue?: string;
  severity?: AISeverity;
}

export interface AIMetric {
  label: string;
  value: string;
  previousValue?: string;
  change?: string;
  trend?: AITrend;
  context?: string;
}

export interface AITableData {
  caption?: string;
  headers: string[];
  rows: Array<Record<string, string | number>>;
}

export interface AIChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface AIChartData {
  type: AIChartType;
  title?: string;
  data: Array<{ label: string } & Record<string, string | number>>;
  series: AIChartSeries[];
}

export interface AIRecommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  detail?: string;
}

export interface AIAction {
  id: string;
  label: string;
  variant?: AIActionVariant;
}

export interface AISourceRef {
  label: string;
  type?: AISourceType;
}

// ─── Root structured response ─────────────────────────────────────────────────

export interface StructuredAIResponse {
  /** One-sentence answer to the user's question — always present */
  summary: string;
  /** Key findings rendered as scannable cards (2–4 recommended) */
  insights?: AIInsight[];
  /** High-level metric highlights — show when numbers tell the story (2–4) */
  metrics?: AIMetric[];
  /** Tabular breakdown (location, period, comparison, etc.) */
  table?: AITableData;
  /** Optional chart — only include when data is chart-worthy */
  chart?: AIChartData;
  /** Prose "why/how" explanation — conversational, 2–4 sentences */
  explanation?: string;
  /** Prioritized next steps the user can take */
  recommendations?: AIRecommendation[];
  /** CTA buttons shown below recommendations */
  actions?: AIAction[];
  /** Contextual follow-up prompts as chips */
  followUps?: string[];
  /** Source/context references shown in footer */
  sources?: AISourceRef[];
}
