// mynaMockConversations.ts
// Mock conversation starters and canned responses for demo/dev mode

import type { MynaConversation } from "./mynaSemanticTypes";

export const MOCK_CONVERSATIONS: MynaConversation[] = [
  {
    id: "mock-1",
    title: "Visibility Drop Analysis",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
    productContext: "Search AI",
    messages: [
      {
        id: "msg-1-1",
        role: "user",
        content: "Why is my visibility dropping?",
        timestamp: Date.now() - 86400000
      },
      {
        id: "msg-1-2",
        role: "assistant",
        content:
          "Based on your Search AI data, your visibility has dropped 8 points over the past 30 days. " +
          "The primary driver appears to be a shift in how ChatGPT and Perplexity cite local dental practices — " +
          "they've started prioritizing businesses with more recent reviews and structured FAQ content on their websites. " +
          "I'd recommend focusing on generating fresh reviews and adding Q&A schema markup to your site.",
        timestamp: Date.now() - 86399000
      }
    ]
  },
  {
    id: "mock-2",
    title: "Competitor Gain Check",
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 1800000,
    productContext: "Search AI",
    messages: [
      {
        id: "msg-2-1",
        role: "user",
        content: "Which competitor is gaining on me?",
        timestamp: Date.now() - 43200000
      },
      {
        id: "msg-2-2",
        role: "assistant",
        content:
          "Smile Dental Studio has gained the most ground — up 11 points in citation share this month. " +
          "They appear to have published a series of long-form blog posts targeting 'dental implants near me' " +
          "and related queries that AI platforms are now actively citing. " +
          "Their Google review velocity has also increased by 40% month-over-month.",
        timestamp: Date.now() - 43199000
      }
    ]
  }
];

export function getMockConversation(id: string): MynaConversation | undefined {
  return MOCK_CONVERSATIONS.find((c) => c.id === id);
}
