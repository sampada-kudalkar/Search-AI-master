// mynaChatChrome.ts
// UI chrome configuration for the Myna AI chat panel

export interface MynaChatChromeConfig {
  panelTitle: string;
  placeholderText: string;
  emptyStateMessage: string;
  maxHistoryDisplay: number;
  showTimestamps: boolean;
  enableMarkdown: boolean;
}

export const DEFAULT_CHAT_CHROME_CONFIG: MynaChatChromeConfig = {
  panelTitle: "Ask BirdAI",
  placeholderText: "Ask anything about your business performance…",
  emptyStateMessage:
    "Hi! I'm BirdAI. Ask me anything about your competitor visibility, " +
    "review trends, or how to improve your AI search presence.",
  maxHistoryDisplay: 50,
  showTimestamps: false,
  enableMarkdown: true
};

export const SEARCH_AI_CHAT_CHROME_CONFIG: MynaChatChromeConfig = {
  ...DEFAULT_CHAT_CHROME_CONFIG,
  panelTitle: "Ask BirdAI — Search AI",
  placeholderText: "Ask about visibility, competitors, or keyword rankings…",
  emptyStateMessage:
    "Hi! I'm BirdAI. I can help you understand your AI search visibility, " +
    "track competitor citation share, and find opportunities to improve your rankings."
};

export function getChatChromeConfig(productContext?: string): MynaChatChromeConfig {
  if (productContext === "Search AI") {
    return SEARCH_AI_CHAT_CHROME_CONFIG;
  }
  return DEFAULT_CHAT_CHROME_CONFIG;
}
