// mynaSemanticTypes.ts
// Core semantic types for the Myna AI conversation system

export type MynaRole = "user" | "assistant" | "system";

export interface MynaMessage {
  id: string;
  role: MynaRole;
  content: string;
  timestamp: number;
}

export interface MynaConversation {
  id: string;
  title: string;
  messages: MynaMessage[];
  createdAt: number;
  updatedAt: number;
  productContext?: string;
}

export interface MynaStreamChunk {
  text: string;
  done: boolean;
}

export interface MynaAIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export interface MynaProductDataSnapshot {
  [key: string]: string | number | string[];
}

export interface MynaProductContextEntry {
  description: string;
  dataSnapshot: MynaProductDataSnapshot;
  quickActions: string[];
}

export type MynaProductContextMap = Record<string, MynaProductContextEntry>;
