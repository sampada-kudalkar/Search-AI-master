"use client";

import { L2NavLayout } from "./stubs";
import {
  conversationById,
  isMynaL2PlaceholderKey,
} from "../../myna/mynaL2NavKeys";
import type { MynaConversation } from "../../myna/mynaMockConversations";

export interface MynaConversationsL2NavPanelProps {
  conversations: MynaConversation[];
  activeItem: string;
  onSelectConversation: (conversationId: string) => void;
  onCreateNewChat: () => void;
}

export function MynaConversationsL2NavPanel({
  conversations,
  activeItem,
  onSelectConversation,
  onCreateNewChat,
}: MynaConversationsL2NavPanelProps) {
  /** Omit empty threads so “New chat” only appears once (header action), not per draft row. */
  const conversationsWithHistory = conversations.filter((c) => c.messages.length > 0);
  const recentConversations = conversationsWithHistory.filter((c) => !c.shared);
  const sharedConversations = conversationsWithHistory.filter((c) => c.shared);
  const sections = [
    {
      label: "Recent chats",
      children: recentConversations.map((c) => ({ label: c.title, key: c.id })),
    },
    {
      label: "Shared with me",
      children: sharedConversations.map((c) => ({ label: c.title, key: c.id })),
    },
  ];

  return (
    <L2NavLayout
      data-no-print
      panelTitle="Ask BirdGPT"
      searchPlaceholder="Search chats"
      searchNoResultsLabel="No matching chats."
      headerAction={{ label: "All chats", onClick: onCreateNewChat }}
      sections={sections}
      defaultExpandedSections={["Recent chats"]}
      activeItem={activeItem}
      onActiveItemChange={(key: string) => {
        const itemKey = key.slice(key.indexOf("/") + 1);
        if (!itemKey || isMynaL2PlaceholderKey(itemKey)) return;
        const conv = conversationById(conversationsWithHistory, itemKey);
        if (conv) onSelectConversation(conv.id);
      }}
    />
  );
}
