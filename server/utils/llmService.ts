/**
 * LLM Service - Unified interface for multiple LLM providers
 * Supports: Groq, OpenAI, Anthropic
 * Features: Fallback, retry logic, usage tracking, rate limiting
 */

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

// Lazy imports to prevent crashes if packages are missing
let ChatGroq: any;
let ChatOpenAI: any;
let ChatAnthropic: any;

const loadProviders = async () => {
  try {
    const groqModule = await import("@langchain/groq");
    ChatGroq = groqModule.ChatGroq;
  } catch (e) {
    console.warn("[LLM Service] @langchain/groq not available");
  }

  try {
    const openaiModule = await import("@langchain/openai");
    ChatOpenAI = openaiModule.ChatOpenAI;
  } catch (e) {
    console.warn("[LLM Service] @langchain/openai not available");
  }

  try {
    const anthropicModule = await import("@langchain/anthropic");
    ChatAnthropic = anthropicModule.ChatAnthropic;
  } catch (e) {
    console.warn("[LLM Service] @langchain/anthropic not available");
  }
};

// ============ Types ============

export type LLMProvider = "groq" | "openai" | "anthropic";

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  requestsByProvider: Record<LLMProvider, number>;
  tokensByProvider: Record<LLMProvider, number>;
  errors: number;
  averageLatencyMs: number;
}

// ============ Configuration ============

// Default models for each provider
const DEFAULT_MODELS: Record<LLMProvider, string> = {
  groq: "llama-3.3-70b-versatile",
  openai: "gpt-4o-mini",
  anthropic: "claude-3-haiku-20240307",
};

// Approximate cost per 1K tokens (input + output average)
const COST_PER_1K_TOKENS: Record<LLMProvider, Record<string, number>> = {
  groq: {
    "llama-3.3-70b-versatile": 0.0008,
    "llama-3.1-8b-instant": 0.0001,
    "mixtral-8x7b-32768": 0.0003,
  },
  openai: {
    "gpt-4o": 0.015,
    "gpt-4o-mini": 0.0003,
    "gpt-4-turbo": 0.02,
    "gpt-3.5-turbo": 0.001,
  },
  anthropic: {
    "claude-3-opus-20240229": 0.045,
    "claude-3-sonnet-20240229": 0.009,
    "claude-3-haiku-20240307": 0.0008,
  },
};

// ============ Usage Tracking ============

class UsageTracker {
  private stats: UsageStats = {
    totalRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    requestsByProvider: { groq: 0, openai: 0, anthropic: 0 },
    tokensByProvider: { groq: 0, openai: 0, anthropic: 0 },
    errors: 0,
    averageLatencyMs: 0,
  };

  private latencies: number[] = [];

  trackRequest(
    provider: LLMProvider,
    model: string,
    tokens: number,
    latencyMs: number
  ): void {
    this.stats.totalRequests++;
    this.stats.totalTokens += tokens;
    this.stats.requestsByProvider[provider]++;
    this.stats.tokensByProvider[provider] += tokens;

    // Calculate cost
    const costPer1K = COST_PER_1K_TOKENS[provider][model] || 0.001;
    this.stats.totalCost += (tokens / 1000) * costPer1K;

    // Track latency
    this.latencies.push(latencyMs);
    if (this.latencies.length > 100) this.latencies.shift();
    this.stats.averageLatencyMs =
      this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;
  }

  trackError(): void {
    this.stats.errors++;
  }

  getStats(): UsageStats {
    return { ...this.stats };
  }

  reset(): void {
    this.stats = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      requestsByProvider: { groq: 0, openai: 0, anthropic: 0 },
      tokensByProvider: { groq: 0, openai: 0, anthropic: 0 },
      errors: 0,
      averageLatencyMs: 0,
    };
    this.latencies = [];
  }
}

// ============ LLM Service ============

class LLMService {
  private providers: Map<LLMProvider, BaseChatModel> = new Map();
  private usageTracker = new UsageTracker();
  private fallbackOrder: LLMProvider[] = ["groq", "openai", "anthropic"];
  private initialized = false;

  constructor() {
    // Don't initialize in constructor - use lazy init
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Load provider modules dynamically
    await loadProviders();

    // Initialize Groq (free tier available - prioritize)
    if (process.env.GROQ_API_KEY && ChatGroq) {
      try {
        this.providers.set(
          "groq",
          new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: process.env.GROQ_MODEL || DEFAULT_MODELS.groq,
            temperature: parseFloat(process.env.AGENT_TEMPERATURE || "0.7"),
            maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "1024"),
          })
        );
      } catch (e) {
        console.error("[LLM Service] Failed to initialize Groq:", e);
      }
    }

    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY && ChatOpenAI) {
      try {
        this.providers.set(
          "openai",
          new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_MODEL || DEFAULT_MODELS.openai,
            temperature: parseFloat(process.env.AGENT_TEMPERATURE || "0.7"),
            maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "1024"),
          })
        );
      } catch (e) {
        console.error("[LLM Service] Failed to initialize OpenAI:", e);
      }
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY && ChatAnthropic) {
      try {
        this.providers.set(
          "anthropic",
          new ChatAnthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
            model: process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic,
            temperature: parseFloat(process.env.AGENT_TEMPERATURE || "0.7"),
            maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "1024"),
          })
        );
      } catch (e) {
        console.error("[LLM Service] Failed to initialize Anthropic:", e);
      }
    }

    this.initialized = true;
    console.log(
      `[LLM Service] Initialized with providers: ${
        this.getAvailableProviders().join(", ") || "none"
      }`
    );
  }

  /**
   * Ensure service is initialized before use
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): LLMProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get a specific provider's LLM instance
   */
  getProvider(provider: LLMProvider): BaseChatModel | undefined {
    return this.providers.get(provider);
  }

  /**
   * Get the primary (preferred) provider
   */
  async getPrimaryProvider(): Promise<{
    provider: LLMProvider;
    llm: BaseChatModel;
  } | null> {
    await this.ensureInitialized();
    for (const provider of this.fallbackOrder) {
      const llm = this.providers.get(provider);
      if (llm) {
        return { provider, llm };
      }
    }
    return null;
  }

  /**
   * Chat with automatic fallback between providers
   */
  async chat(
    messages: BaseMessage[],
    preferredProvider?: LLMProvider,
    maxRetries: number = 2
  ): Promise<LLMResponse> {
    await this.ensureInitialized();

    const providers = preferredProvider
      ? [
          preferredProvider,
          ...this.fallbackOrder.filter((p) => p !== preferredProvider),
        ]
      : this.fallbackOrder;

    let lastError: Error | null = null;

    for (const provider of providers) {
      const llm = this.providers.get(provider);
      if (!llm) continue;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const startTime = Date.now();
          const response = await llm.invoke(messages);
          const latencyMs = Date.now() - startTime;

          // Extract content
          const content =
            typeof response.content === "string"
              ? response.content
              : JSON.stringify(response.content);

          // Estimate tokens (rough approximation)
          const estimatedTokens = Math.ceil(
            (messages.reduce((acc, m) => acc + String(m.content).length, 0) +
              content.length) /
              4
          );

          // Track usage
          this.usageTracker.trackRequest(
            provider,
            DEFAULT_MODELS[provider],
            estimatedTokens,
            latencyMs
          );

          return {
            content,
            provider,
            model: DEFAULT_MODELS[provider],
            usage: {
              promptTokens: Math.ceil(
                messages.reduce((acc, m) => acc + String(m.content).length, 0) /
                  4
              ),
              completionTokens: Math.ceil(content.length / 4),
              totalTokens: estimatedTokens,
            },
            latencyMs,
          };
        } catch (error: any) {
          lastError = error;
          this.usageTracker.trackError();

          // Log error
          console.error(
            `[LLM Service] ${provider} attempt ${attempt + 1} failed:`,
            error.message
          );

          // Wait before retry (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
          }
        }
      }
    }

    throw new Error(
      `All LLM providers failed. Last error: ${
        lastError?.message || "Unknown error"
      }`
    );
  }

  /**
   * Simple text completion (convenience method)
   */
  async complete(
    prompt: string,
    systemPrompt?: string,
    preferredProvider?: LLMProvider
  ): Promise<LLMResponse> {
    const messages: BaseMessage[] = [];

    if (systemPrompt) {
      messages.push(new SystemMessage(systemPrompt));
    }
    messages.push(new HumanMessage(prompt));

    return this.chat(messages, preferredProvider);
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): UsageStats {
    return this.usageTracker.getStats();
  }

  /**
   * Reset usage statistics
   */
  resetUsageStats(): void {
    this.usageTracker.reset();
  }

  /**
   * Check service health
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    providers: Record<LLMProvider, { available: boolean; latencyMs?: number }>;
  }> {
    await this.ensureInitialized();

    const results: Record<
      LLMProvider,
      { available: boolean; latencyMs?: number }
    > = {
      groq: { available: false },
      openai: { available: false },
      anthropic: { available: false },
    };

    for (const [provider, llm] of this.providers) {
      try {
        const startTime = Date.now();
        await llm.invoke([new HumanMessage("Hi")]);
        results[provider] = {
          available: true,
          latencyMs: Date.now() - startTime,
        };
      } catch {
        results[provider] = { available: false };
      }
    }

    return {
      healthy: Object.values(results).some((r) => r.available),
      providers: results,
    };
  }
}

// ============ Singleton Export ============

export const llmService = new LLMService();

export default llmService;
