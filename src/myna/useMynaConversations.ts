import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MYNA_SEED_CONVERSATIONS,
  type MynaChatMessage,
  type MynaConversation,
} from "./mynaMockConversations";
import { generateMynaResponse } from "./mynaAIService";

const STORAGE_KEY = "myna-mock-chats-v3";

const ERROR_REPLY = "Sorry, I'm having trouble responding right now. Please try again.";

function cloneSeeds(): MynaConversation[] {
  return MYNA_SEED_CONVERSATIONS.map((c) => ({
    ...c,
    messages: c.messages.map((m) => ({ ...m })),
  }));
}

function mergeWithSeeds(stored: MynaConversation[]): MynaConversation[] {
  const storedIds = new Set(stored.map((c) => c.id));
  const missing = cloneSeeds().filter((c) => !storedIds.has(c.id));
  return missing.length > 0 ? [...stored, ...missing] : stored;
}

const SCREEN_FOLLOW_UPS: Record<string, [string, string, string]> = {
  Reviews:     ["Break down by location", "Draft response templates", "Compare with last month"],
  Overview:    ["What needs my attention?", "Show full metrics", "Compare this period"],
  Reports:     ["Export this report", "Drill into a metric", "Show quarter-over-quarter"],
  Campaigns:   ["Show CTR breakdown", "Compare all campaigns", "Suggest improvements"],
  Surveys:     ["Show NPS by location", "What questions score lowest?", "How to improve responses?"],
  Insights:    ["Break down by location", "Show sentiment trend", "What actions should I take?"],
  Inbox:       ["Draft a reply", "Show by priority", "What topics are most common?"],
  BirdAI:      ["Show agent details", "What needs fixing?", "View automation activity"],
  Social:      ["Draft post copy", "Show top content", "When should I post?"],
  Contacts:    ["Segment this group", "Create a campaign", "Show engagement trend"],
  Listings:    ["Fix the issues", "Show all locations", "What's most inaccurate?"],
  Competitors: ["Show competitive gap", "What should I improve?", "Compare response rates"],
  Ticketing:   ["Show open tickets", "What's the avg resolution time?", "Most reported issues?"],
};

function getContextualQuickActions(screenTitle: string): Array<{ id: string; label: string }> {
  const labels = SCREEN_FOLLOW_UPS[screenTitle] ?? [
    "Tell me more",
    "Show details",
    "Compare with last period",
  ];
  return labels.map((label, i) => ({ id: `qa-${i}`, label }));
}

function loadStored(): MynaConversation[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MynaConversation[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStored(conversations: MynaConversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    /* ignore quota */
  }
}

/** Pass `getAppViewTitle(currentView)` from the shell so this hook does not import `App` (avoids circular deps). */
export function useMynaConversations(screenTitle: string) {

  const [conversations, setConversations] = useState<MynaConversation[]>(() => {
    if (typeof window === "undefined") return cloneSeeds();
    const stored = loadStored();
    return stored ? mergeWithSeeds(stored) : cloneSeeds();
  });

  // "" = no active conversation (show suggestions / empty state)
  const [activeConversationId, setActiveConversationId] = useState<string>("");

  useEffect(() => {
    saveStored(conversations);
  }, [conversations]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId],
  );

  // Only auto-recover a broken ID (e.g. after a conversation is deleted).
  // "" is intentional — it means "no active thread, show suggestions".
  const ensureActiveConversation = useCallback(() => {
    if (
      activeConversationId !== "" &&
      !conversations.some((c) => c.id === activeConversationId) &&
      conversations[0]
    ) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  useEffect(() => {
    ensureActiveConversation();
  }, [ensureActiveConversation]);

  /** Append a user message immediately, then await the AI response and append it. */
  const appendUserAndAssistant = useCallback(
    async (userText: string, options?: { ignoreConversationHistory?: boolean }) => {
      // Capture the target conversation ID and history at call time (avoids stale closures).
      const targetId = activeConversationId;
      const historySnapshot = options?.ignoreConversationHistory
        ? []
        : activeConversation?.messages ?? [];

      const uid = `u-${Date.now()}`;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, { id: uid, role: "user", text: userText }] }
            : c,
        ),
      );

      let replyText: string;
      let structuredResponse: MynaChatMessage["structuredResponse"];
      try {
        const result = await generateMynaResponse(screenTitle, userText, historySnapshot);
        replyText = result.text;
        structuredResponse = result.structured;
      } catch {
        replyText = ERROR_REPLY;
      }

      const aid = `a-${Date.now()}`;
      const quickActions = structuredResponse ? undefined : getContextualQuickActions(screenTitle);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, { id: aid, role: "assistant", text: replyText, structuredResponse, quickActions }] }
            : c,
        ),
      );
    },
    [activeConversationId, activeConversation, screenTitle],
  );

  /** Create a new conversation, show the user message immediately, then stream in the AI reply. */
  const createConversationWithFirstMessage = useCallback(
    async (firstUserMessage: string) => {
      const id = `myna-new-${Date.now()}`;
      const title =
        firstUserMessage.length > 42 ? `${firstUserMessage.slice(0, 40)}…` : firstUserMessage || "New chat";

      // Create conversation with user message immediately so the UI is responsive.
      const next: MynaConversation = {
        id,
        title,
        conversationType: "general",
        screenLabel: screenTitle,
        messages: [{ id: `u-${id}`, role: "user", text: firstUserMessage }],
      };
      setConversations((c) => [next, ...c]);
      setActiveConversationId(id);

      // Fetch AI response and append it.
      let replyText: string;
      let structuredResponse: MynaChatMessage["structuredResponse"];
      try {
        const result = await generateMynaResponse(screenTitle, firstUserMessage, []);
        replyText = result.text;
        structuredResponse = result.structured;
      } catch {
        replyText = ERROR_REPLY;
      }

      const quickActions = structuredResponse ? undefined : getContextualQuickActions(screenTitle);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: `a-${id}`, role: "assistant" as const, text: replyText, structuredResponse, quickActions },
                ],
              }
            : c,
        ),
      );
    },
    [screenTitle],
  );

  const createEmptyConversation = useCallback(() => {
    const id = `myna-new-${Date.now()}`;
    const next: MynaConversation = {
      id,
      title: "New chat",
      conversationType: "general",
      screenLabel: screenTitle,
      messages: [],
    };
    setConversations((c) => {
      const withoutStaleEmpty = c.filter((x) => x.messages.length > 0);
      return [next, ...withoutStaleEmpty];
    });
    setActiveConversationId(id);
  }, [screenTitle]);

  const deleteConversation = useCallback(
    (id: string) => {
      const remaining = conversations.filter((c) => c.id !== id);
      setConversations(remaining);
      if (activeConversationId === id) {
        setActiveConversationId(remaining[0]?.id ?? "");
      }
    },
    [conversations, activeConversationId],
  );

  return {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    screenTitle,
    appendUserAndAssistant,
    createConversationWithFirstMessage,
    createEmptyConversation,
    deleteConversation,
  };
}
