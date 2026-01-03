import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { agentTools } from "../utils/agentTools";
import llmService, { LLMProvider } from "../utils/llmService";

// In-memory conversation storage (replace with Redis/MongoDB for production)
const conversationStore: Map<
  string,
  { messages: BaseMessage[]; createdAt: Date; provider?: LLMProvider }
> = new Map();

// Feedback storage
const feedbackStore: Array<{
  sessionId: string;
  messageId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
}> = [];

// Request tracking for rate limiting
const requestTracker: Map<string, { count: number; resetAt: Date }> = new Map();

// System prompt for the agent
const SYSTEM_PROMPT = `You are a helpful AI assistant for a professional portfolio website (app.feecon.com).

Your role is to:
1. Help visitors learn about the portfolio owner's skills, projects, and experience
2. Guide users to relevant content (blogs, projects, skills)
3. Assist with contact inquiries and booking consultations
4. Answer frequently asked questions professionally

Guidelines:
- Be friendly, professional, and concise
- Use the available tools to fetch real data from the website
- If you don't know something, say so and suggest alternatives
- For complex inquiries, offer to connect them with the portfolio owner
- Always encourage users to explore the website further

Available tools allow you to: search skills, search projects, search blogs, answer FAQs, submit contact requests, and provide booking information.`;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.AGENT_RATE_LIMIT || "30");

// Check rate limit for a session/IP
const checkRateLimit = (
  identifier: string
): { allowed: boolean; remaining: number; resetIn: number } => {
  const now = new Date();
  let tracker = requestTracker.get(identifier);

  if (!tracker || tracker.resetAt < now) {
    tracker = {
      count: 0,
      resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
    };
    requestTracker.set(identifier, tracker);
  }

  const allowed = tracker.count < RATE_LIMIT_MAX_REQUESTS;
  if (allowed) {
    tracker.count++;
  }

  return {
    allowed,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - tracker.count),
    resetIn: Math.ceil((tracker.resetAt.getTime() - now.getTime()) / 1000),
  };
};

// Initialize the LLM with tool binding (async for lazy loading)
const initializeLLM = async () => {
  const primary = await llmService.getPrimaryProvider();
  if (!primary) {
    throw new Error(
      "No LLM API key configured. Set GROQ_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY."
    );
  }

  // Bind tools to the LLM (cast to any to access bindTools method)
  const llmWithTools = (primary.llm as any).bindTools(agentTools);
  return { llm: llmWithTools, provider: primary.provider };
};

// Process tool calls and get results
const processToolCalls = async (toolCalls: any[]): Promise<string[]> => {
  const results: string[] = [];

  for (const toolCall of toolCalls) {
    const tool = agentTools.find((t) => t.name === toolCall.name);
    if (tool) {
      try {
        // Use func directly instead of invoke to avoid type issues
        const result = await (tool as any).func(toolCall.args);
        results.push(`[${toolCall.name}]: ${result}`);
      } catch (error) {
        results.push(`[${toolCall.name}]: Error executing tool`);
      }
    }
  }

  return results;
};

// Lazy initialization of LLM
let llmWithTools: Awaited<ReturnType<typeof initializeLLM>> | null = null;

const getLLM = async () => {
  if (!llmWithTools) {
    llmWithTools = await initializeLLM();
  }
  return llmWithTools;
};

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .slice(0, 2000) // Max 2000 characters
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ""); // Remove control characters
};

/**
 * Chat Handler - Main endpoint for agent conversations
 */
export const chatHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message, sessionId: providedSessionId } = req.body;

    // Get client identifier for rate limiting (IP or session)
    const clientId = providedSessionId || req.ip || "anonymous";

    // Check rate limit
    const rateLimit = checkRateLimit(clientId);
    if (!rateLimit.allowed) {
      res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Try again in ${rateLimit.resetIn} seconds.`,
        retryAfter: rateLimit.resetIn,
      });
      return;
    }

    // Validate input
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      res.status(400).json({
        success: false,
        error: "Message is required and cannot be empty.",
      });
      return;
    }

    // Sanitize message
    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length === 0) {
      res.status(400).json({
        success: false,
        error: "Message contains invalid content.",
      });
      return;
    }

    // Get or create session ID
    const sessionId = providedSessionId || uuidv4();

    // Get conversation history
    let conversation = conversationStore.get(sessionId);
    if (!conversation) {
      conversation = { messages: [], createdAt: new Date() };
      conversationStore.set(sessionId, conversation);
    }

    // Get the LLM with tools (async lazy initialization)
    const { llm, provider } = await getLLM();
    conversation.provider = provider;

    // Build messages array with system prompt and history
    const messages: BaseMessage[] = [
      new HumanMessage({ content: SYSTEM_PROMPT }),
      ...conversation.messages,
      new HumanMessage(sanitizedMessage),
    ];

    const startTime = Date.now();

    // First LLM call - may include tool calls
    const response = await llm.invoke(messages);
    let toolsUsed: string[] = [];
    let finalResponse = "";

    // Check if there are tool calls
    if (
      response.tool_calls &&
      Array.isArray(response.tool_calls) &&
      response.tool_calls.length > 0
    ) {
      // Process tool calls
      const toolResults = await processToolCalls(response.tool_calls);
      toolsUsed = response.tool_calls.map((tc: any) => tc.name);

      // Make another call with tool results for final response
      const toolResultMessage = `Tool results:\n${toolResults.join(
        "\n"
      )}\n\nBased on these results, please provide a helpful response to the user.`;

      const finalMessages: BaseMessage[] = [
        ...messages,
        new AIMessage({
          content: response.content as string,
        }),
        new HumanMessage(toolResultMessage),
      ];

      const finalLLMResponse = await llm.invoke(finalMessages);
      finalResponse =
        typeof finalLLMResponse.content === "string"
          ? finalLLMResponse.content
          : JSON.stringify(finalLLMResponse.content);
    } else {
      // No tool calls, use direct response
      finalResponse =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);
    }

    // Update conversation history
    conversation.messages.push(new HumanMessage(sanitizedMessage));
    conversation.messages.push(new AIMessage(finalResponse));

    // Keep only last 20 messages to prevent context overflow
    if (conversation.messages.length > 20) {
      conversation.messages = conversation.messages.slice(-20);
    }

    // Generate message ID for feedback
    const messageId = uuidv4();
    const latencyMs = Date.now() - startTime;

    res.status(200).json({
      success: true,
      data: {
        response: finalResponse,
        sessionId,
        messageId,
        toolsUsed,
        provider,
        latencyMs,
        rateLimit: {
          remaining: rateLimit.remaining - 1,
          resetIn: rateLimit.resetIn,
        },
      },
    });
  } catch (error: any) {
    console.error("[Agent Chat Error]", error);

    // Handle specific errors
    if (error.message?.includes("API key")) {
      res.status(503).json({
        success: false,
        error:
          "AI service is not configured. Please contact the administrator.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Failed to process your message. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get Conversation History
 */
export const getHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: "Session ID is required.",
      });
      return;
    }

    const conversation = conversationStore.get(sessionId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: "Conversation not found.",
      });
      return;
    }

    const history = conversation.messages.map((msg, index) => ({
      id: index,
      role: msg instanceof HumanMessage ? "user" : "assistant",
      content: msg.content,
    }));

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        history,
        createdAt: conversation.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[Get History Error]", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve conversation history.",
    });
  }
};

/**
 * Submit Feedback
 */
export const submitFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, messageId, rating, comment } = req.body;

    if (!sessionId || !messageId || typeof rating !== "number") {
      res.status(400).json({
        success: false,
        error: "sessionId, messageId, and rating are required.",
      });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5.",
      });
      return;
    }

    feedbackStore.push({
      sessionId,
      messageId,
      rating,
      comment,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Thank you for your feedback!",
    });
  } catch (error: any) {
    console.error("[Submit Feedback Error]", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit feedback.",
    });
  }
};

/**
 * Clear Session
 */
export const clearSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: "Session ID is required.",
      });
      return;
    }

    const deleted = conversationStore.delete(sessionId);

    res.status(200).json({
      success: true,
      message: deleted ? "Session cleared successfully." : "Session not found.",
    });
  } catch (error: any) {
    console.error("[Clear Session Error]", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear session.",
    });
  }
};

/**
 * Agent Status/Health Check
 */
export const getStatus = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const primary = await llmService.getPrimaryProvider();
    const availableProviders = llmService.getAvailableProviders();
    const usageStats = llmService.getUsageStats();

    res.status(200).json({
      success: true,
      data: {
        status:
          availableProviders.length > 0 ? "operational" : "not_configured",
        providers: availableProviders,
        primaryProvider: primary?.provider || "none",
        model:
          process.env.AGENT_MODEL ||
          (primary?.provider === "groq"
            ? "llama-3.1-70b-versatile"
            : primary?.provider === "openai"
            ? "gpt-4o-mini"
            : primary?.provider === "anthropic"
            ? "claude-3-haiku-20240307"
            : "unknown"),
        activeSessions: conversationStore.size,
        totalFeedback: feedbackStore.length,
        averageRating:
          feedbackStore.length > 0
            ? (
                feedbackStore.reduce((sum, f) => sum + f.rating, 0) /
                feedbackStore.length
              ).toFixed(2)
            : null,
        toolsAvailable: agentTools.map((t) => t.name),
        usage: {
          totalRequests: usageStats.totalRequests,
          totalTokens: usageStats.totalTokens,
          estimatedCost: `$${usageStats.totalCost.toFixed(4)}`,
          averageLatencyMs: Math.round(usageStats.averageLatencyMs),
          errors: usageStats.errors,
          byProvider: {
            groq: {
              requests: usageStats.requestsByProvider.groq,
              tokens: usageStats.tokensByProvider.groq,
            },
            openai: {
              requests: usageStats.requestsByProvider.openai,
              tokens: usageStats.tokensByProvider.openai,
            },
            anthropic: {
              requests: usageStats.requestsByProvider.anthropic,
              tokens: usageStats.tokensByProvider.anthropic,
            },
          },
        },
        rateLimit: {
          maxRequests: RATE_LIMIT_MAX_REQUESTS,
          windowMs: RATE_LIMIT_WINDOW_MS,
        },
      },
    });
  } catch (error: any) {
    console.error("[Agent Status Error]", error);
    res.status(500).json({
      success: false,
      error: "Failed to get agent status.",
    });
  }
};

/**
 * Get Usage Statistics (Admin endpoint)
 */
export const getUsageStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const usageStats = llmService.getUsageStats();

    res.status(200).json({
      success: true,
      data: usageStats,
    });
  } catch (error: any) {
    console.error("[Usage Stats Error]", error);
    res.status(500).json({
      success: false,
      error: "Failed to get usage statistics.",
    });
  }
};

/**
 * Health Check - Quick provider availability check
 */
export const healthCheck = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const health = await llmService.healthCheck();

    res.status(health.healthy ? 200 : 503).json({
      success: health.healthy,
      data: health,
    });
  } catch (error: any) {
    console.error("[Health Check Error]", error);
    res.status(500).json({
      success: false,
      error: "Health check failed.",
    });
  }
};

export default {
  chatHandler,
  getHistory,
  submitFeedback,
  clearSession,
  getStatus,
  getUsageStats,
  healthCheck,
};
