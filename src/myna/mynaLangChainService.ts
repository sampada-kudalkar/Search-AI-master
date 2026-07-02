// mynaLangChainService.ts
// LangChain + Anthropic integration for the Myna AI assistant

import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";
import type { MynaMessage, MynaAIConfig } from "./mynaSemanticTypes";

function buildLangChainMessages(
  history: MynaMessage[],
  userInput: string,
  systemPrompt: string
): BaseMessage[] {
  const msgs: BaseMessage[] = [new SystemMessage(systemPrompt)];

  for (const msg of history) {
    if (msg.role === "user") {
      msgs.push(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      msgs.push(new AIMessage(msg.content));
    }
  }

  msgs.push(new HumanMessage(userInput));
  return msgs;
}

function createModel(config: MynaAIConfig) {
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_ANTHROPIC_API_KEY;

  return new ChatAnthropic({
    model: config.model,
    maxTokens: config.maxTokens,
    temperature: config.temperature,
    anthropicApiKey: apiKey,
    clientOptions: {
      dangerouslyAllowBrowser: true
    }
  });
}

async function chat(
  history: MynaMessage[],
  userInput: string,
  config: MynaAIConfig
): Promise<string> {
  const model = createModel(config);
  const messages = buildLangChainMessages(history, userInput, config.systemPrompt);
  const response = await model.invoke(messages);
  const content = response.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "string" ? c : "text" in c ? String(c.text) : ""))
      .join("");
  }
  return String(content);
}

async function* streamChat(
  history: MynaMessage[],
  userInput: string,
  config: MynaAIConfig
): AsyncGenerator<string> {
  const model = createModel(config);
  const messages = buildLangChainMessages(history, userInput, config.systemPrompt);
  const stream = await model.stream(messages);

  for await (const chunk of stream) {
    const content = chunk.content;
    if (typeof content === "string") {
      yield content;
    } else if (Array.isArray(content)) {
      for (const c of content) {
        if (typeof c === "string") yield c;
        else if ("text" in c) yield String(c.text);
      }
    }
  }
}

export const mynaLangChainService = {
  chat,
  streamChat
};
