"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Markdown } from "../ui/markdown";
import { cn } from "../../lib/utils";
import type {
  StructuredAIResponse,
  AIInsight,
  AIMetric,
  AITableData,
  AIChartData,
  AIRecommendation,
  AIAction,
  AISourceRef,
} from "../../myna/mynaSemanticTypes";

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[12px] font-semibold leading-[18px] tracking-normal text-[#8f8f8f] dark:text-[#6b7280]">
      {children}
    </p>
  );
}

function TrendPill({
  trend,
  value,
}: {
  trend?: "up" | "down" | "neutral";
  value?: string;
}) {
  if (!value) return null;
  const displayValue =
    trend === "up" || trend === "down"
      ? value.trim().replace(/^[↑↓→+\-−–—\s]+/, "")
      : value.trim().replace(/^[↑↓→\s]+/, "");
  const prefix = trend === "down" ? "-" : trend === "up" ? "+" : "";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums leading-none",
        trend === "down" && "text-[#dc2626] dark:text-[#f87171]",
        trend === "up" && "text-[#16a34a] dark:text-[#4ade80]",
        (trend === "neutral" || !trend) && "text-[#555] dark:text-[#9ba2b0]",
      )}
    >
      {prefix}
      {displayValue}
    </span>
  );
}

function getRatingValueParts(value: string) {
  const hasStar = /⭐️?/.test(value);
  return {
    hasStar,
    text: value.replace(/⭐️?/g, "").replace(/\s+/g, " ").trim(),
  };
}

function RatingStarIcon({ className }: { className?: string }) {
  return (
    <Star
      aria-hidden="true"
      className={cn("inline size-[14px] shrink-0 fill-[#FBC123] text-[#FBC123]", className)}
      strokeWidth={1.6}
      absoluteStrokeWidth
    />
  );
}

function renderTextWithRatingStars(value: unknown) {
  const text = String(value ?? "");
  if (!/⭐️?/.test(text)) return text;

  return text.split(/(⭐️?)/g).map((part, index) =>
    /⭐️?/.test(part) ? (
      <RatingStarIcon key={`star-${index}`} className="mx-0.5 align-[-1px]" />
    ) : (
      <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
    ),
  );
}

function renderChildrenWithRatingStars(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") return renderTextWithRatingStars(child);
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement<{ children?: React.ReactNode }>, {
      children: renderChildrenWithRatingStars(child.props.children),
    });
  });
}

// ─── 1. Summary block ─────────────────────────────────────────────────────────

function SummaryBlock({ summary }: { summary: string }) {
  return (
    <div className="rounded-lg border border-[#d1daf7] border-l-[3px] border-l-[#2552ed] bg-[#f0f4ff] px-3 py-2.5 dark:border-[#2e3a5c] dark:border-l-[#2952e3] dark:bg-[#16203a]">
      <p className="text-[13px] leading-[20px] text-[#212121] dark:text-[#e4e4e4]">
        {renderTextWithRatingStars(summary)}
      </p>
    </div>
  );
}

// ─── 2. Key insights section ──────────────────────────────────────────────────

const SEVERITY_LEFT_BORDER: Record<string, string> = {
  negative: "border-l-[#dc2626]",
  warning: "border-l-[#f59e0b]",
  positive: "border-l-[#16a34a]",
  neutral: "border-l-[#d1d5db] dark:border-l-[#374151]",
};

function InsightCard({ insight }: { insight: AIInsight }) {
  return (
    <div
      className={cn(
        "rounded-md border border-[#e5e9f0] border-l-[3px] bg-white px-3 py-2.5 dark:border-[#333a47] dark:bg-[#1e2430]",
        SEVERITY_LEFT_BORDER[insight.severity ?? "neutral"],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden className="shrink-0 text-[14px] leading-none">
            {insight.icon}
          </span>
          <p className="truncate text-[12px] font-semibold leading-none text-[#212121] dark:text-[#e4e4e4]">
            {renderTextWithRatingStars(insight.title)}
          </p>
        </div>
        <TrendPill trend={insight.trend} value={insight.trendValue} />
      </div>
      <p className="mt-1.5 text-[12px] leading-[17px] text-[#555] dark:text-[#9ba2b0]">
        {renderTextWithRatingStars(insight.detail)}
      </p>
    </div>
  );
}

function InsightsSection({
  insights,
  expanded,
}: {
  insights: AIInsight[];
  expanded: boolean;
}) {
  return (
    <div>
      <SectionLabel>Key Insights</SectionLabel>
      <div className={cn("grid gap-3", expanded ? "grid-cols-2" : "grid-cols-1")}>
        {insights.map((ins) => (
          <InsightCard key={ins.id} insight={ins} />
        ))}
      </div>
    </div>
  );
}

// ─── 3. Data snapshot (metrics) ───────────────────────────────────────────────

function MetricCell({ metric }: { metric: AIMetric }) {
  const isDown = metric.trend === "down";
  const isUp = metric.trend === "up";
  const value = getRatingValueParts(metric.value);
  return (
    <div className="flex h-[80px] flex-col gap-[8px] rounded-[8px] bg-[#f7f8fa] px-3 pb-2.5 pt-[12px] dark:bg-[#1e2430]">
      <p className="text-[11px] leading-none text-[#8f8f8f] dark:text-[#6b7280]">
        {metric.label}
      </p>
      <div className="flex items-center justify-start gap-[2px]">
        <p
          className={cn(
            "text-[18px] font-semibold tabular-nums leading-none",
            isDown && "text-[#212121] dark:text-[#e4e4e4]",
            isUp && "text-[#16a34a] dark:text-[#4ade80]",
            !isDown && !isUp && "text-[#212121] dark:text-[#e4e4e4]",
          )}
        >
          {value.text}
        </p>
        {value.hasStar && (
          <RatingStarIcon className="size-[16px]" />
        )}
        <TrendPill trend={metric.trend} value={metric.change} />
      </div>
      {metric.context && (
        <p className="text-[12px] leading-none text-[#555] dark:text-[#6b7280]">
          {metric.context}
        </p>
      )}
    </div>
  );
}

function MetricsSection({ metrics }: { metrics: AIMetric[] }) {
  return (
    <div>
      <SectionLabel>Data Snapshot</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => (
          <MetricCell key={`metric-${i}`} metric={m} />
        ))}
      </div>
    </div>
  );
}

// ─── 4. Data table section ────────────────────────────────────────────────────

function formatTableCellValue(value: unknown) {
  return String(value ?? "").trim().replace(/^[↑↓→]\s*/, "");
}

function DataTable({ table }: { table: AITableData }) {
  return (
    <div>
      {table.caption && <SectionLabel>{table.caption}</SectionLabel>}
      <div className="overflow-x-auto rounded-md border border-[#e5e9f0] dark:border-[#333a47]">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e5e9f0] bg-[#f7f8fa] dark:border-[#2e3340] dark:bg-[#1a1f2b]">
              {table.headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-2 text-left font-semibold text-[#555] dark:text-[#9ba2b0]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr
                key={`row-${i}`}
                className="border-b border-[#f0f1f5] transition-colors last:border-0 hover:bg-[#f7f8fa] dark:border-[#262b35] dark:hover:bg-[#262b35]"
              >
                {table.headers.map((h) => (
                  <td
                    key={h}
                    className="whitespace-nowrap px-3 py-2 text-[#212121] dark:text-[#e4e4e4]"
                  >
                    <span className="inline-flex items-center justify-start gap-[2px] align-middle">
                      {renderTextWithRatingStars(formatTableCellValue(row[h]))}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 5. Chart section ─────────────────────────────────────────────────────────

function ChartSection({ chart }: { chart: AIChartData }) {
  const chartConfig = Object.fromEntries(
    chart.series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  return (
    <div>
      {chart.title && <SectionLabel>{chart.title}</SectionLabel>}
      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <BarChart
          data={chart.data}
          barGap={3}
          barSize={11}
          margin={{ top: 2, right: 4, bottom: 0, left: -20 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 5]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {chart.series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ChartContainer>
      <div className="mt-2 flex items-center justify-center gap-4">
        {chart.series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div
              className="h-2 w-3 shrink-0 rounded-[2px]"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[11px] text-[#8f8f8f] dark:text-[#6b7280]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. Explanation section ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EXPLANATION_MD: Record<string, React.ComponentType<any>> = {
  p({ children }: { children?: React.ReactNode }) {
    return (
      <p className="m-0 text-[13px] leading-[20px] text-[#555] dark:text-[#9ba2b0]">
        {renderChildrenWithRatingStars(children)}
      </p>
    );
  },
  strong({ children }: { children?: React.ReactNode }) {
    return (
      <strong className="font-semibold text-[#212121] dark:text-[#e4e4e4]">
        {renderChildrenWithRatingStars(children)}
      </strong>
    );
  },
};

function ExplanationSection({ explanation }: { explanation: string }) {
  return (
    <div>
      <SectionLabel>What&apos;s driving this?</SectionLabel>
      <div className="rounded-md bg-[#f7f8fa] px-3 py-2.5 dark:bg-[#1a1f2b]">
        <Markdown
          className="prose prose-sm max-w-none dark:prose-invert"
          components={EXPLANATION_MD}
        >
          {explanation}
        </Markdown>
      </div>
    </div>
  );
}

// ─── 7. Recommendations section ──────────────────────────────────────────────

const PRIORITY_STYLE = {
  high: {
    bg: "bg-[#fef2f2] dark:bg-[#3f1515]",
    text: "text-[#dc2626] dark:text-[#f87171]",
    label: "High",
  },
  medium: {
    bg: "bg-[#fffbeb] dark:bg-[#2a2210]",
    text: "text-[#d97706] dark:text-[#fbbf24]",
    label: "Med",
  },
  low: {
    bg: "bg-[#f0f1f5] dark:bg-[#262b35]",
    text: "text-[#555] dark:text-[#9ba2b0]",
    label: "Low",
  },
} as const;

function RecommendationItem({ rec }: { rec: AIRecommendation }) {
  const style = PRIORITY_STYLE[rec.priority];
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-[2px] shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.4px] leading-none",
          style.bg,
          style.text,
        )}
      >
        {style.label}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] leading-[19px] text-[#212121] dark:text-[#e4e4e4]">
          {renderTextWithRatingStars(rec.title)}
        </p>
        {rec.detail && (
          <p className="mt-0.5 text-[12px] leading-[17px] text-[#555] dark:text-[#9ba2b0]">
            {renderTextWithRatingStars(rec.detail)}
          </p>
        )}
      </div>
    </div>
  );
}

function RecommendationsSection({
  recommendations,
}: {
  recommendations: AIRecommendation[];
}) {
  return (
    <div>
      <SectionLabel>Recommended Actions</SectionLabel>
      <div className="flex flex-col gap-3">
        {recommendations.map((rec) => (
          <RecommendationItem key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}

// ─── 8. Action buttons ────────────────────────────────────────────────────────

function ActionsSection({
  actions,
  onAction,
}: {
  actions: AIAction[];
  onAction?: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, i) => (
        <button
          key={action.id}
          type="button"
          onClick={() => onAction?.(action.id)}
          className={cn(
            "h-8 rounded px-3 text-[12px] font-medium leading-none transition-colors",
            i === 0 || action.variant === "primary"
              ? "bg-[#2552ed] text-white hover:bg-[#1e44cc] dark:bg-[#2952e3] dark:hover:bg-[#2552ed]"
              : "border border-[#e5e9f0] bg-white text-[#212121] hover:bg-[#f0f1f5] dark:border-[#333a47] dark:bg-[#262b35] dark:text-[#e4e4e4] dark:hover:bg-[#2e3340]",
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

// ─── 9. Follow-up chips ───────────────────────────────────────────────────────

function FollowUpsSection({
  followUps,
  onFollowUp,
}: {
  followUps: string[];
  onFollowUp?: (text: string) => void;
}) {
  return (
    <div>
      <SectionLabel>Ask a follow-up</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {followUps.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onFollowUp?.(prompt)}
            className="h-7 rounded-full border border-[#e5e9f0] bg-white px-3 text-[12px] text-[#212121] transition-colors hover:border-[#c4b5fd] hover:bg-[#f5f3ff] dark:border-[#333a47] dark:bg-[#1e2430] dark:text-[#e4e4e4] dark:hover:border-[#5d4e8a] dark:hover:bg-[#252c3a]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 10. Sources footer ───────────────────────────────────────────────────────

function SourcesFooter({ sources }: { sources: AISourceRef[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <span className="text-[11px] text-[#8f8f8f] dark:text-[#6b7280]">
        Sources:
      </span>
      {sources.map((s, i) => (
        <span key={`src-${i}`} className="text-[11px] text-[#8f8f8f] dark:text-[#6b7280]">
          {s.label}
          {i < sources.length - 1 && (
            <span className="ml-1.5 opacity-40">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-[#e5e9f0] dark:bg-[#2e3340]",
        className,
      )}
    />
  );
}

export function MynaSemanticResponseSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-[#d1daf7] border-l-[3px] border-l-[#2552ed] bg-[#f0f4ff] px-3 py-2.5 dark:border-[#2e3a5c] dark:border-l-[#2952e3] dark:bg-[#16203a]">
        <SkeletonPulse className="h-4 w-[85%]" />
        <SkeletonPulse className="mt-1.5 h-4 w-[60%]" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-[80px] flex-col gap-[8px] rounded-[8px] bg-[#f7f8fa] px-3 pb-2.5 pt-[12px] dark:bg-[#1e2430]"
          >
            <SkeletonPulse className="h-3 w-[50%]" />
            <SkeletonPulse className="h-5 w-[40%]" />
          </div>
        ))}
      </div>
      <SkeletonPulse className="h-[120px] w-full" />
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

export function MynaSemanticResponseError({ message }: { message?: string }) {
  return (
    <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2.5 dark:border-[#5f2020] dark:bg-[#2d1515]">
      <p className="text-[13px] leading-[20px] text-[#dc2626] dark:text-[#f87171]">
        {message ?? "Something went wrong generating this response. Please try again."}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface MynaSemanticResponseProps {
  response: StructuredAIResponse;
  expandedThread?: boolean;
  onFollowUp?: (text: string) => void;
  onAction?: (actionId: string) => void;
}

export function MynaSemanticResponse({
  response,
  expandedThread = false,
  onFollowUp,
  onAction,
}: MynaSemanticResponseProps) {
  return (
    <div className="mx-0 flex w-full flex-col gap-4">
      {/* 1. Summary */}
      <SummaryBlock summary={response.summary} />

      {/* 2. Key insights */}
      {response.insights && response.insights.length > 0 && (
        <InsightsSection insights={response.insights} expanded={expandedThread} />
      )}

      {/* 3. Data snapshot */}
      {response.metrics && response.metrics.length > 0 && (
        <MetricsSection metrics={response.metrics} />
      )}

      {/* 4. Table */}
      {response.table && <DataTable table={response.table} />}

      {/* 5. Chart */}
      {response.chart && <ChartSection chart={response.chart} />}

      {/* 6. Explanation */}
      {response.explanation && (
        <ExplanationSection explanation={response.explanation} />
      )}

      {/* 7. Recommendations */}
      {response.recommendations && response.recommendations.length > 0 && (
        <RecommendationsSection recommendations={response.recommendations} />
      )}

      {/* 8. Action buttons */}
      {response.actions && response.actions.length > 0 && (
        <ActionsSection actions={response.actions} onAction={onAction} />
      )}

      {/* 9. Follow-up chips */}
      {response.followUps && response.followUps.length > 0 && (
        <FollowUpsSection followUps={response.followUps} onFollowUp={onFollowUp} />
      )}

      {/* 10. Sources */}
      {response.sources && response.sources.length > 0 && (
        <SourcesFooter sources={response.sources} />
      )}
    </div>
  );
}
