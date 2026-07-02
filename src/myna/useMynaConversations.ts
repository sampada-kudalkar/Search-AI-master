// useMynaConversations.ts
// React hook for managing Myna AI conversation state

import { useState, useCallback } from "react";
import { mynaAIService } from "./mynaAIService";
import type { MynaConversation, MynaMessage } from "./mynaSemanticTypes";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createConversation(productContext?: string): MynaConversation {
  return {
    id: generateId(),
    title: "New conversation",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    productContext
  };
}

export interface UseMynaConversationsReturn {
  conversations: MynaConversation[];
  activeConversation: MynaConversation | null;
  isLoading: boolean;
  error: string | null;
  startNewConversation: (productContext?: string) => void;
  selectConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

export function useMynaConversations(
  defaultProductContext?: string
): UseMynaConversationsReturn {
  const [conversations, setConversations] = useState<MynaConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const startNewConversation = useCallback(
    (productContext?: string) => {
      const conv = createConversation(productContext ?? defaultProductContext);
      setConversations((prev) => [conv, ...prev]);
      setActiveId(conv.id);
    },
    [defaultProductContext]
  );

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      let targetConv = activeConversation;

      if (!targetConv) {
        targetConv = createConversation(defaultProductContext);
        setConversations((prev) => [targetConv!, ...prev]);
        setActiveId(targetConv.id);
      }

      const userMsg: MynaMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: Date.now()
      };

      const updatedConv: MynaConversation = {
        ...targetConv,
        messages: [...targetConv.messages, userMsg],
        updatedAt: Date.now(),
        title:
          targetConv.messages.length === 0
            ? content.slice(0, 60)
            : targetConv.title
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === updatedConv.id ? updatedConv : c))
      );
      setIsLoading(true);
      setError(null);

      try {
        const reply = await mynaAIService.sendMessage(
          updatedConv.messages,
          content,
          { productContext: updatedConv.productContext }
        );

        const assistantMsg: MynaMessage = {
          id: generateId(),
          role: "assistant",
          content: reply,
          timestamp: Date.now()
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === updatedConv.id
              ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: Date.now() }
              : c
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversation, defaultProductContext]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    conversations,
    activeConversation,
    isLoading,
    error,
    startNewConversation,
    selectConversation,
    sendMessage,
    clearError
  };
}
