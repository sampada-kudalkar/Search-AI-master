"use client";

import {
  Children,
  cloneElement,
  isValidElement,

  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Search,
  Sparkles,
  SquarePen,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "../ui/chat-container";
import { Markdown } from "../ui/markdown";
import { MynaSemanticResponse } from "./MynaSemanticResponse.v1";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollButton } from "../ui/scroll-button";
import { cn } from "../../lib/utils";
import { AskMynaTextBox } from "./AskMynaTextBox.v2";
import { ShareChatDrawer } from "./ShareChatDrawer.v1";
import type { MynaChatMessage, MynaConversation } from "../../myna/mynaMockConversations";
import {
  MYNA_CHAT_HEADER_TITLE,

} from "../../myna/mynaChatChrome";

// ─── Avatars ─────────────────────────────────────────────────────────────────

function MynaAiAvatar({ size = 20 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9970D7] to-[#2552ED]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Sparkles style={{ width: size * 0.6, height: size * 0.6, color: 'white' }} />
    </span>
  );
}

function UserAvatarFallback() {
  return (
    <div className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#bdbdbd]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
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

function renderTextWithRatingStars(value: string) {
  return value.split(/(⭐️?)/g).map((part, index) =>
    /⭐️?/.test(part) ? (
      <RatingStarIcon key={`star-${index}`} className="mx-0.5 align-[-1px]" />
    ) : (
      part
    ),
  );
}

function renderChildrenWithRatingStars(children: React.ReactNode): React.ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") return renderTextWithRatingStars(child);
    if (!isValidElement(child)) return child;
    return cloneElement(child, {
      children: renderChildrenWithRatingStars(child.props.children),
    });
  });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <MynaAiAvatar />
      <Loader2
        width={20}
        height={20}
        aria-hidden
        className="animate-spin shrink-0 text-[#8f8f8f]"
      />
      <span className="hidden items-center gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#8f8f8f] animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      <span className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#8f8f8f]">
        Working on it…
      </span>
    </div>
  );
}

// ─── Custom markdown components ───────────────────────────────────────────────
// Applied to all non-structured assistant responses for world-class typography.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MYNA_MD: Record<string, React.ComponentType<any>> = {
  p({ children }: { children?: React.ReactNode }) {
    return (
      <p className="mb-2 last:mb-0 text-[13px] leading-[21px] text-[#212121] dark:text-[#e4e4e4]">
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
  em({ children }: { children?: React.ReactNode }) {
    return (
      <em className="italic text-[#555] dark:text-[#9ba2b0]">
        {renderChildrenWithRatingStars(children)}
      </em>
    );
  },
  h1({ children }: { children?: React.ReactNode }) {
    return (
      <h1 className="mb-2 mt-3 text-[15px] font-bold leading-snug text-[#212121] first:mt-0 dark:text-[#e4e4e4]">
        {renderChildrenWithRatingStars(children)}
      </h1>
    );
  },
  h2({ children }: { children?: React.ReactNode }) {
    return (
      <h2 className="mb-1.5 mt-3 text-[14px] font-semibold leading-snug text-[#212121] first:mt-0 dark:text-[#e4e4e4]">
        {renderChildrenWithRatingStars(children)}
      </h2>
    );
  },
  h3({ children }: { children?: React.ReactNode }) {
    return (
      <h3 className="mb-1 mt-2.5 text-[13px] font-semibold leading-snug text-[#212121] first:mt-0 dark:text-[#e4e4e4]">
        {renderChildrenWithRatingStars(children)}
      </h3>
    );
  },
  ul({ children }: { children?: React.ReactNode }) {
    return <ul className="my-2 flex flex-col gap-1.5 pl-0">{children}</ul>;
  },
  ol({ children }: { children?: React.ReactNode }) {
    return <ol className="my-2 flex flex-col gap-1.5 pl-0">{children}</ol>;
  },
  li({ children }: { children?: React.ReactNode }) {
    return (
      <li className="flex items-start gap-2 text-[13px] leading-[21px] text-[#212121] dark:text-[#e4e4e4]">
        <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#212121] dark:bg-[#7c3aed]" />
        <span className="min-w-0 flex-1">{renderChildrenWithRatingStars(children)}</span>
      </li>
    );
  },
  table({ children }: { children?: React.ReactNode }) {
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-[#e5e9f0] dark:border-[#333a47]">
        <table className="w-full text-[12px] [&_tbody_td:nth-child(2)]:text-center [&_thead_th:nth-child(2)]:text-center">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: { children?: React.ReactNode }) {
    return (
      <thead className="border-b border-[#e5e9f0] bg-[#f7f8fa] dark:border-[#2e3340] dark:bg-[#1a1f2b]">
        {children}
      </thead>
    );
  },
  tbody({ children }: { children?: React.ReactNode }) {
    return <tbody>{children}</tbody>;
  },
  tr({ children }: { children?: React.ReactNode }) {
    return (
      <tr className="border-b border-[#f0f1f5] transition-colors last:border-0 hover:bg-[#f7f8fa] dark:border-[#262b35] dark:hover:bg-[#262b35]">
        {children}
      </tr>
    );
  },
  th({ children }: { children?: React.ReactNode }) {
    return (
      <th className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.4px] text-[#555] dark:text-[#9ba2b0]">
        {renderChildrenWithRatingStars(children)}
      </th>
    );
  },
  td({ children }: { children?: React.ReactNode }) {
    return (
      <td className="whitespace-nowrap px-3 py-2 text-[#212121] dark:text-[#e4e4e4]">
        {renderChildrenWithRatingStars(children)}
      </td>
    );
  },
  blockquote({ children }: { children?: React.ReactNode }) {
    return (
      <blockquote className="my-2 border-l-2 border-[#c4b5fd] pl-3 text-[13px] italic text-[#555] dark:text-[#9ba2b0]">
        {renderChildrenWithRatingStars(children)}
      </blockquote>
    );
  },
  code({ children, className }: { children?: React.ReactNode; className?: string }) {
    if (!className) {
      return (
        <code className="rounded bg-[#f0f1f5] px-1 py-0.5 font-mono text-[12px] text-[#212121] dark:bg-[#262b35] dark:text-[#e4e4e4]">
          {renderChildrenWithRatingStars(children)}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre({ children }: { children?: React.ReactNode }) {
    return <>{children}</>;
  },
  hr() {
    return <hr className="my-3 border-[#e5e9f0] dark:border-[#333a47]" />;
  },
};

// ─── Feedback row ─────────────────────────────────────────────────────────────

function FeedbackRow({ text }: { text: string }) {
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available in all envs
    }
  };

  const btnBase =
    "rounded-md p-1 transition-colors hover:bg-[#f0f1f5] dark:hover:bg-[#262b35]";
  const dim = "text-[#c8c8c8] dark:text-[#4b5563]";

  return (
    <div className="flex items-center gap-0.5 -ml-0.5">
      <button
        type="button"
        title="Helpful"
        onClick={() => setVoted((v) => (v === "up" ? null : "up"))}
        className={cn(btnBase, voted === "up" ? "text-[#2552ed]" : dim)}
      >
        <ThumbsUp className="size-3.5" />
      </button>
      <button
        type="button"
        title="Not helpful"
        onClick={() => setVoted((v) => (v === "down" ? null : "down"))}
        className={cn(btnBase, voted === "down" ? "text-[#dc2626]" : dim)}
      >
        <ThumbsDown className="size-3.5" />
      </button>
      <button
        type="button"
        title={copied ? "Copied!" : "Copy response"}
        onClick={handleCopy}
        className={cn(btnBase, copied ? "text-[#16a34a]" : dim)}
      >
        <Copy className="size-3.5" />
      </button>
    </div>
  );
}

// ─── Follow-up chips ──────────────────────────────────────────────────────────

function FollowUpChips({
  actions,
  onSelect,
}: {
  actions: Array<{ id: string; label: string }>;
  onSelect: (label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onSelect(a.label)}
          className="h-[26px] rounded-full border border-[#e5e9f0] bg-white px-2.5 text-[12px] text-[#555] transition-colors hover:border-[#c4b5fd] hover:bg-[#f5f3ff] dark:border-[#333a47] dark:bg-[#1e2430] dark:text-[#9ba2b0] dark:hover:border-[#5d4e8a] dark:hover:bg-[#252c3a]"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

// ─── Message row ─────────────────────────────────────────────────────────────

interface MessageRowProps {
  msg: MynaChatMessage;
  expandedThread: boolean;
  onQuickAction: (label: string) => void;
}

function MessageRow({ msg, expandedThread, onQuickAction }: MessageRowProps) {
  const isAssistant = msg.role === "assistant";

  return (
    <div className="flex items-start gap-2">
      {isAssistant ? <MynaAiAvatar /> : <UserAvatarFallback />}

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {/* ── Message body ── */}
        <div className="min-w-0 break-words">
          {isAssistant ? (
            msg.structuredResponse ? (
              <MynaSemanticResponse
                response={msg.structuredResponse}
                expandedThread={expandedThread}
                onFollowUp={onQuickAction}
              />
            ) : (
              <Markdown className="flex flex-col gap-0" components={MYNA_MD}>
                {msg.text}
              </Markdown>
            )
          ) : (
            <p className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#212121] dark:text-[#e4e4e4]">
              {msg.text}
            </p>
          )}
        </div>

        {/* ── Footer: chips + feedback (non-structured only) ── */}
        {isAssistant && !msg.structuredResponse && (
          <div className="flex flex-col gap-2">
            {msg.quickActions && msg.quickActions.length > 0 && (
              <FollowUpChips actions={msg.quickActions} onSelect={onQuickAction} />
            )}
            <FeedbackRow text={msg.text} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product-contextual suggestions ──────────────────────────────────────────

function getContextualSuggestions(screenTitle: string): [string, string, string] {
  const map: Record<string, [string, string, string]> = {
    Reviews: [
      "Why did my overall rating drop this month?",
      "Which locations need attention?",
      "Show ratings by location",
    ],
    Overview: [
      "What's my business performance this week?",
      "Which areas need attention?",
      "Compare this month vs last month",
    ],
    Inbox: [
      "Summarize my unread messages",
      "Show highest priority conversations",
      "What topics appear most frequently?",
    ],
    Reports: [
      "Summarize last month's performance",
      "Show key metrics vs last quarter",
      "What improved most recently?",
    ],
    BirdAI: [
      "Check agent health status",
      "Which agents are underperforming?",
      "Show recent automation activity",
    ],
    Social: [
      "Show top performing posts this week",
      "What content drives the most engagement?",
      "Suggest ideas for the next post",
    ],
    Contacts: [
      "Show new contacts this month",
      "Which contacts are most engaged?",
      "Summarize contact activity trends",
    ],
    Surveys: [
      "Show recent survey response trends",
      "What's the average satisfaction score?",
      "Which questions score the lowest?",
    ],
    Campaigns: [
      "How are my active campaigns performing?",
      "Which campaign has the highest open rate?",
      "Show conversion trends",
    ],
    Listings: [
      "Are my listings up to date?",
      "Which listings have low accuracy scores?",
      "Show recent listing changes",
    ],
    Competitors: [
      "How do I compare to my competitors?",
      "Which competitor is gaining the most reviews?",
      "Show my competitive ranking this month",
    ],
    Ticketing: [
      "Show open tickets that need attention",
      "What's the average resolution time?",
      "Which issues are reported most often?",
    ],
    Insights: [
      "What are my top customer insights?",
      "Show sentiment trends this week",
      "Which themes appear most in feedback?",
    ],
  };
  return (
    map[screenTitle] ?? [
      "Summarize last week",
      "What needs my attention?",
      "Show recent trends",
    ]
  );
}

// ─── Docked empty state greeting ─────────────────────────────────────────────

interface DockedGreetingProps {
  screenTitle: string;
  onSuggestion: (text: string) => void;
}

function DockedGreeting({ screenTitle, onSuggestion }: DockedGreetingProps) {
  const suggestions = getContextualSuggestions(screenTitle);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <MynaAiAvatar size={20} />
        <div>
          <p className="text-[14px] font-medium leading-5 text-[#212121] dark:text-[#e4e4e4]">
            Hi there 👋,
          </p>
          <p className="mt-1 text-[13px] leading-[18px] text-[#555] dark:text-[#8b92a5]">
            I&apos;m Myna. I help you turn customer data into insights. I can
            help you quickly understand your{" "}
            <span className="font-medium text-[#212121] dark:text-[#e4e4e4]">
              {screenTitle}
            </span>{" "}
            data.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-2 pl-8">
        {suggestions.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onSuggestion(label)}
            className="w-full rounded-lg border border-[#e5e9f0] bg-white px-3 py-2.5 text-left text-[13px] leading-[18px] text-[#212121] transition-colors hover:border-[#c4b5fd] hover:bg-[#f5f3ff] dark:border-[#333a47] dark:bg-[#1e2430] dark:text-[#e4e4e4] dark:hover:border-[#5d4e8a] dark:hover:bg-[#252c3a]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── History panel ────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatConvDate(conv: MynaConversation): string {
  let ts: number;
  if (conv.createdAt !== undefined) {
    ts = conv.createdAt;
  } else {
    const match = conv.id.match(/(\d{10,})$/);
    ts = match ? parseInt(match[1]) : Date.now();
  }
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

interface HistoryRowItemProps {
  conversation: MynaConversation;
  isActive: boolean;
  onClick: () => void;
}

function HistoryRowItem({ conversation, isActive, onClick }: HistoryRowItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "relative w-full cursor-pointer p-3 text-left transition-colors outline-none",
        isActive
          ? "bg-[#f2f4f7] dark:bg-[#2a3040]"
          : "bg-white hover:bg-[#f2f4f7] dark:bg-transparent dark:hover:bg-[#2a3040]",
      )}
    >
      <div className={cn("flex flex-col gap-1", isActive && "pr-7")}>
        <p className="text-[14px] leading-5 tracking-[-0.28px] text-[#212121] dark:text-[#e4e4e4]">
          {conversation.title}
        </p>
        <p className="text-[12px] leading-[18px] whitespace-nowrap text-[#8f8f8f] dark:text-[#6b7280]">
          {formatConvDate(conversation)}
        </p>
      </div>
      {isActive && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#555] transition-colors hover:bg-black/[0.06] dark:text-[#8b92a5] dark:hover:bg-white/[0.08]"
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="size-4" />
        </button>
      )}
    </div>
  );
}

interface HistoryPanelProps {
  conversations: MynaConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onBack: () => void;
  onClose: () => void;
  onToggleExpand: () => void;
  expanded: boolean;
  onOpenNewChat: () => void;
}

function HistoryPanel({
  conversations,
  activeConversationId,
  onSelectConversation,
  onBack,
  onClose,
  onToggleExpand,
  expanded,
  onOpenNewChat,
}: HistoryPanelProps) {
  const [search, setSearch] = useState("");
  const [recentOpen, setRecentOpen] = useState(true);
  const [sharedOpen, setSharedOpen] = useState(false);

  const headerIconBtnTone = expanded
    ? "text-[#6b6b6b] hover:bg-black/[0.06] dark:text-[#a8a8a8] dark:hover:bg-white/[0.08]"
    : "text-[#555] hover:bg-[#f0f1f5] dark:text-[#8b92a5] dark:hover:bg-[#2e3340]";

  const recentConvs = conversations.filter((c) => !c.shared);
  const sharedConvs = conversations.filter((c) => c.shared);

  const applySearch = (list: MynaConversation[]) =>
    search.trim()
      ? list.filter((c) => c.title.toLowerCase().includes(search.trim().toLowerCase()))
      : list;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-[#1a1f2b]">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between px-2">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={cn("shrink-0 rounded-lg transition-colors", headerIconBtnTone)}
            aria-label="Back to chat"
          >
            <ArrowLeft className="size-4 opacity-60" />
          </Button>
          <p className="min-w-0 truncate text-[16px] leading-6 text-[#555] dark:text-[#8b92a5]">
            Conversation history
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => { onOpenNewChat(); onBack(); }}
            className={cn("rounded-lg transition-colors", headerIconBtnTone)}
            aria-label="New chat"
          >
            <SquarePen className="h-[20px] w-[20px] shrink-0" aria-hidden />
          </Button>
          {!expanded && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleExpand}
              className={cn("rounded-lg transition-colors", headerIconBtnTone)}
              aria-label="Expand"
            >
              <Maximize2 className="h-[20px] w-[20px] shrink-0" aria-hidden />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn("rounded-lg transition-colors", headerIconBtnTone)}
            aria-label="Close"
          >
            <X className="h-[20px] w-[20px] shrink-0" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 px-5">
        <div className="flex h-10 items-center gap-2 border-b border-[#cccccc] dark:border-[#3d4555]">
          <Search className="size-5 shrink-0 text-[#8f8f8f]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats"
            className="flex-1 bg-transparent text-[14px] leading-5 text-[#212121] outline-none placeholder:text-[#8f8f8f] dark:text-[#e4e4e4]"
          />
        </div>
      </div>

      {/* Groups */}
      <div className="min-h-0 flex-1 overflow-y-auto pt-3">
        {/* ── Recent chats ── */}
        <button
          type="button"
          onClick={() => setRecentOpen((v) => !v)}
          className="flex h-7 w-full items-center gap-2 px-5 py-1.5 hover:bg-[#f7f8fa] dark:hover:bg-[#1e2430]"
        >
          <span className="flex-1 text-left text-[14px] leading-5 text-[#212121] dark:text-[#e4e4e4]">
            Recent chats
          </span>
          {recentOpen ? (
            <ChevronUp className="size-5 text-[#555] dark:text-[#8b92a5]" />
          ) : (
            <ChevronDown className="size-5 text-[#555] dark:text-[#8b92a5]" />
          )}
        </button>

        {recentOpen && (
          <div className="mt-2.5 px-3">
            {applySearch(recentConvs).length === 0 ? (
              <p className="px-3 py-2 text-[12px] text-[#8f8f8f]">
                {search.trim() ? "No matching conversations." : "No conversations yet."}
              </p>
            ) : (
              applySearch(recentConvs).map((c) => (
                <HistoryRowItem
                  key={c.id}
                  conversation={c}
                  isActive={c.id === activeConversationId}
                  onClick={() => onSelectConversation(c.id)}
                />
              ))
            )}
          </div>
        )}

        {/* ── Shared with me ── */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setSharedOpen((v) => !v)}
            className="flex h-7 w-full items-center gap-2 px-5 py-1.5 hover:bg-[#f7f8fa] dark:hover:bg-[#1e2430]"
          >
            <span className="flex-1 text-left text-[14px] leading-5 text-[#212121] dark:text-[#e4e4e4]">
              Shared with me
            </span>
            {sharedOpen ? (
              <ChevronUp className="size-5 text-[#555] dark:text-[#8b92a5]" />
            ) : (
              <ChevronDown className="size-5 text-[#555] dark:text-[#8b92a5]" />
            )}
          </button>

          {sharedOpen && (
            <div className="mt-2.5 px-3">
              {applySearch(sharedConvs).length === 0 ? (
                <p className="px-3 py-2 text-[12px] text-[#8f8f8f]">
                  {search.trim() ? "No matching conversations." : "No shared conversations."}
                </p>
              ) : (
                applySearch(sharedConvs).map((c) => (
                  <HistoryRowItem
                    key={c.id}
                    conversation={c}
                    isActive={c.id === activeConversationId}
                    onClick={() => onSelectConversation(c.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Props & main component ───────────────────────────────────────────────────

// ─── Delete conversation confirmation dialog ──────────────────────────────────

function DeleteConversationDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] gap-0 p-0">
        <DialogHeader className="px-6 pb-4 pt-6">
          <DialogTitle className="text-[17px] font-semibold leading-snug text-[#212121] dark:text-[#e4e4e4]">
            Delete conversation
          </DialogTitle>
        </DialogHeader>
        <p className="px-6 pb-6 text-[14px] leading-[22px] text-[#555] dark:text-[#9ba2b0]">
          Once deleted, it&apos;s gone for good. Do you want to delete?
        </p>
        <div className="border-t border-[#e5e9f0] dark:border-[#333a47]" />
        <DialogFooter className="px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface MynaChatPanelProps {
  messages: MynaChatMessage[];
  onSend: (text: string, options?: { ignoreConversationHistory?: boolean }) => void | Promise<void>;
  onClose: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
  conversations: MynaConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onOpenNewChat: () => void;
  onDeleteConversation?: (id: string) => void;
  screenTitle: string;
  composerFocusNonce?: number;
}

export function MynaChatPanel({
  messages,
  onSend,
  onClose,
  expanded,
  onToggleExpand,
  conversations,
  activeConversationId,
  onSelectConversation,
  onOpenNewChat,
  onDeleteConversation,
  screenTitle,
  composerFocusNonce: _composerFocusNonce = 0,
}: MynaChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [historyView, setHistoryView] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);
  const [ignoreConversationHistory, setIgnoreConversationHistory] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const expandedEmpty = expanded && messages.length === 0;
  const expandedThread = expanded && messages.length > 0;
  const dockedEmpty = !expanded && messages.length === 0;

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeTitle = activeConversation?.title ?? MYNA_CHAT_HEADER_TITLE;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const list = event.target.files;
    if (!list?.length) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
    event.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  };

  const stopSending = () => {
    setIsSending(false);
  };

  // Async send: shows typing indicator until the AI response is received.
  const send = async (text?: string) => {
    if (isSending) return;
    const t = (text ?? draft).trim();
    const hasFiles = files.length > 0;
    if (!t && !hasFiles) return;
    const message =
      t || (hasFiles ? `Attached: ${files.map((f) => f.name).join(", ")}` : "");
    setDraft("");
    setFiles([]);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
    setIsSending(true);
    try {
      await onSend(message, {
        ignoreConversationHistory: expanded && ignoreConversationHistory,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickAction = (label: string) => {
    setDraft(label);
  };

  const headerIconBtnTone = expanded
    ? "text-[#6b6b6b] hover:bg-black/[0.06] dark:text-[#a8a8a8] dark:hover:bg-white/[0.08]"
    : "text-[#555] hover:bg-[#f0f1f5] dark:text-[#8b92a5] dark:hover:bg-[#2e3340]";

  const renderComposer = (variant: "docked" | "expanded") => (
    <>
      <input
        ref={uploadInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />
      <AskMynaTextBox
        value={draft}
        onValueChange={setDraft}
        attachments={files.map((file, index) => ({ id: `${file.name}-${index}`, name: file.name }))}
        onRemoveAttachment={(id) => {
          const idx = files.findIndex((f, i) => `${f.name}-${i}` === id);
          if (idx >= 0) handleRemoveFile(idx);
        }}
        onAttachClick={() => uploadInputRef.current?.click()}
        onSend={() => send()}
        isSending={isSending}
        onStopSending={stopSending}
        showIgnoreConversationHistoryOption={variant === "expanded"}
        ignoreConversationHistory={ignoreConversationHistory}
        onIgnoreConversationHistoryChange={setIgnoreConversationHistory}
        emptyState={variant === "expanded" ? "default" : "default"}
        className="rounded-lg"
      />
    </>
  );

  // ── History view ─────────────────────────────────────────────────────────────
  if (historyView) {
    return (
      <div
        className={cn(
          "flex h-full min-h-0 flex-col",
          expanded && "bg-white dark:bg-[#212121]",
        )}
      >
        <HistoryPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            onSelectConversation(id);
            setHistoryView(false);
          }}
          onBack={() => setHistoryView(false)}
          onClose={onClose}
          onToggleExpand={onToggleExpand}
          expanded={expanded}
          onOpenNewChat={() => {
            onOpenNewChat();
            setHistoryView(false);
            setGreetingVisible(true);
          }}
        />
      </div>
    );
  }

  // ── Chat view ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col",
        expanded && "bg-white dark:bg-[#212121]",
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 flex-col">
        <div
          className={cn(
            "flex items-center py-2",
            expanded
              ? "h-16 justify-between px-6"
              : "h-[60px] justify-between px-4",
          )}
        >
          {expanded ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <p className="min-w-0 truncate text-[18px] font-normal leading-[26px] tracking-[-0.36px] text-[#212121] dark:text-[#e4e4e4]">
                {activeTitle}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("!size-8 shrink-0 rounded-lg transition-colors", headerIconBtnTone)}
                aria-label="Edit title"
              >
                <Pencil className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-1">
              <p className="h-full w-full truncate text-[16px] font-normal text-[#212121] dark:text-[#e4e4e4]">
                {MYNA_CHAT_HEADER_TITLE}
              </p>
            </div>
          )}
          <div className="flex shrink-0 items-center gap-2">
            {!expanded ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => { onOpenNewChat(); setGreetingVisible(true); }}
                  className={cn("group !size-8 rounded-lg transition-colors", headerIconBtnTone)}
                  aria-label="New chat"
                >
                  <SquarePen
                    aria-hidden
                    className="h-[20px] w-[20px] shrink-0 transition-[width,height] duration-150 group-hover:h-[24px] group-hover:w-[24px]"
                  />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onToggleExpand}
                  className={cn("group size-8 rounded-lg transition-colors", headerIconBtnTone)}
                  aria-label="Expand chat workspace"
                >
                  <Maximize2
                    aria-hidden
                    className="h-[20px] w-[20px] shrink-0 transition-[width,height] duration-150 group-hover:h-[24px] group-hover:w-[24px]"
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn("group !size-8 rounded-lg transition-colors", headerIconBtnTone)}
                      aria-label="More actions"
                    >
                      <MoreHorizontal
                        aria-hidden
                        className="h-[20px] w-[20px] shrink-0 transition-[width,height] duration-150 group-hover:h-[24px] group-hover:w-[24px]"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[160px]">
                    <DropdownMenuItem onSelect={() => setShareDrawerOpen(true)}>
                      Share chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setHistoryView(true)}>
                      Conversation history
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setConfirmDeleteOpen(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className={cn("group !size-6 rounded-lg transition-colors", headerIconBtnTone)}
                  aria-label="Close chat"
                >
                  <X
                    aria-hidden
                    className="h-[20px] w-[20px] shrink-0 transition-[width,height] duration-150 group-hover:h-[24px] group-hover:w-[24px]"
                  />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onToggleExpand}
                  className={cn(
                    "!size-9 shrink-0 rounded border border-[#e5e9f0] transition-colors dark:border-[#333a47]",
                    headerIconBtnTone,
                  )}
                  aria-label="Collapse chat workspace"
                >
                  <Minimize2 aria-hidden className="h-[20px] w-[20px] shrink-0" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "!size-9 shrink-0 rounded border border-[#e5e9f0] transition-colors dark:border-[#333a47]",
                        headerIconBtnTone,
                      )}
                      aria-label="More actions"
                    >
                      <MoreHorizontal aria-hidden className="h-[20px] w-[20px] shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[160px]">
                    <DropdownMenuItem onSelect={() => setShareDrawerOpen(true)}>
                      Share chat
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setConfirmDeleteOpen(true)}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onClose}>
                      Close
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded empty state — conversational greeting + wrapping suggestions + composer */}
      {expandedEmpty ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col justify-end px-4 pb-4">
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex items-start gap-2">
                <MynaAiAvatar size={20} />
                <div>
                  <p className="text-[14px] font-medium leading-5 text-[#212121] dark:text-[#e4e4e4]">
                    Hi there 👋,
                  </p>
                  <p className="mt-1 text-[13px] leading-[18px] text-[#555] dark:text-[#8b92a5]">
                    I&apos;m Myna. I help you turn customer data into insights. I can help you quickly understand your{" "}
                    <span className="font-medium text-[#212121] dark:text-[#e4e4e4]">{screenTitle}</span>{" "}
                    data.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 pl-[28px]">
                {getContextualSuggestions(screenTitle).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => send(label)}
                    className="h-[36px] rounded-[4px] border border-[#e5e9f0] bg-white px-3 text-left text-[14px] leading-5 text-[#212121] transition-colors hover:border-[#c4b5fd] hover:bg-[#f5f3ff] dark:border-[#333a47] dark:bg-[#1e2430] dark:text-[#e4e4e4] dark:hover:border-[#5d4e8a] dark:hover:bg-[#252c3a]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="min-w-0 shrink-0 px-[8px] pb-[8px] pt-[8px]">
            <div className="mx-auto min-h-[88px] w-full max-w-3xl">
              {renderComposer("expanded")}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Docked empty state — greeting pushed to bottom */}
          {dockedEmpty && greetingVisible ? (
            <div className="flex min-h-0 flex-1 flex-col justify-end px-[8px] pb-[8px]">
              <DockedGreeting
                screenTitle={screenTitle}
                onSuggestion={(text) => {
                  setGreetingVisible(false);
                  send(text);
                }}
              />
            </div>
          ) : dockedEmpty ? (
            <div className="flex-1" />
          ) : (
            /* Message list */
            <ChatContainerRoot className="relative min-h-0 flex-1">
              <ChatContainerContent
                className={cn(
                  "gap-8 px-4 pb-4 pt-2",
                  expandedThread && "mx-auto w-full max-w-3xl",
                )}
              >
                {messages.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    expandedThread={expandedThread}
                    onQuickAction={handleQuickAction}
                  />
                ))}
                {isSending && <TypingIndicator />}
                <ChatContainerScrollAnchor />
              </ChatContainerContent>
              <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 -translate-x-1/2">
                <ScrollButton type="button" className="pointer-events-auto shadow-md" />
              </div>
            </ChatContainerRoot>
          )}

          {/* Composer */}
          <div
            className={cn(
              "min-w-0 shrink-0 px-[8px] pt-[8px] pb-[8px]",
              expandedThread && "w-full bg-white dark:bg-[#212121]",
            )}
          >
            <div
              className={cn(
                "min-h-[88px] w-full",
                expandedThread && "mx-auto max-w-3xl",
              )}
            >
              {renderComposer(expandedThread ? "expanded" : "docked")}
            </div>
          </div>
        </>
      )}

      <DeleteConversationDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={() => {
          if (activeConversationId) {
            onDeleteConversation?.(activeConversationId);
          }
        }}
      />

      <ShareChatDrawer
        open={shareDrawerOpen}
        onOpenChange={setShareDrawerOpen}
        conversationTitle={activeTitle}
        conversationId={activeConversationId}
      />
    </div>
  );
}
