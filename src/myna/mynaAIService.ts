// mynaAIService.ts
// Core AI service — wraps the LangChain service with a simpler API surface

import { mynaLangChainService } from "./mynaLangChainService";
import type { MynaMessage, MynaAIConfig } from "./mynaSemanticTypes";

const DEFAULT_CONFIG: MynaAIConfig = {
  model: "claude-opus-4-5",
  maxTokens: 1024,
  temperature: 0.7,
  systemPrompt:
    "You are BirdAI, an AI assistant embedded in the Birdeye platform. " +
    "You help local businesses understand their online presence, reviews, listings, " +
    "and competitor visibility across AI search platforms. " +
    "Be concise, data-driven, and actionable in your responses."
};

export interface MynaAIServiceOptions {
  config?: Partial<MynaAIConfig>;
  productContext?: string;
}

export async function sendMessage(
  messages: MynaMessage[],
  userInput: string,
  options: MynaAIServiceOptions = {}
): Promise<string> {
  const config = { ...DEFAULT_CONFIG, ...options.config };

  const systemPromptWithContext = options.productContext
    ? `${config.systemPrompt}\n\nCurrent product context: ${options.productContext}`
    : config.systemPrompt;

  return mynaLangChainService.chat(messages, userInput, {
    ...config,
    systemPrompt: systemPromptWithContext
  });
}

export async function* streamMessage(
  messages: MynaMessage[],
  userInput: string,
  options: MynaAIServiceOptions = {}
): AsyncGenerator<string> {
  const config = { ...DEFAULT_CONFIG, ...options.config };

  const systemPromptWithContext = options.productContext
    ? `${config.systemPrompt}\n\nCurrent product context: ${options.productContext}`
    : config.systemPrompt;

  yield* mynaLangChainService.streamChat(messages, userInput, {
    ...config,
    systemPrompt: systemPromptWithContext
  });
}

export const mynaAIService = {
  sendMessage,
  streamMessage
};
