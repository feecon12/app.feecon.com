import { Request, Response } from "express";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { v4 as uuidv4 } from "uuid";
import { agentTools } from "../utils/agentTools";

// In-memory conversation storage (replace with Redis/MongoDB for production)
const conversationStore: Map<
  string,
  { messages: BaseMessage[]; createdAt: Date }
> = new Map();

// Feedback storage
const feedbackStore: Array<{
  sessionId: string;
  messageId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
}> = [];

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

// Initialize the LLM with tool binding
const initializeLLM = () => {
  let llm;

  // Prefer Groq (free tier available), fall back to OpenAI
  if (process.env.GROQ_API_KEY) {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.AGENT_MODEL || "llama-3.1-70b-versatile",
      temperature: parseFloat(process.env.AGENT_TEMPERATURE || "0.7"),
      maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "1024"),
    });
  } else if (process.env.OPENAI_API_KEY) {
    llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.AGENT_MODEL || "gpt-4o-mini",
      temperature: parseFloat(process.env.AGENT_TEMPERATURE || "0.7"),
      maxTokens: parseInt(process.env.AGENT_MAX_TOKENS || "1024"),
    });
  } else {
    throw new Error(
      "No LLM API key configured. Set GROQ_API_KEY or OPENAI_API_KEY."
    );
  }

  // Bind tools to the LLM
  return llm.bindTools(agentTools);
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
let llmWithTools: ReturnType<typeof initializeLLM> | null = null;

const getLLM = () => {
  if (!llmWithTools) {
    llmWithTools = initializeLLM();
  }
  return llmWithTools;
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

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: "Message is required and cannot be empty.",
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

    // Get the LLM
    const llm = getLLM();

    // Build messages array with system prompt and history
    const messages: BaseMessage[] = [
      new HumanMessage({ content: SYSTEM_PROMPT }),
      ...conversation.messages,
      new HumanMessage(message.trim()),
    ];

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
      const toolResultMessage = `Tool results:\n${toolResults.join("\n")}\n\nBased on these results, please provide a helpful response to the user.`;

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
    conversation.messages.push(new HumanMessage(message.trim()));
    conversation.messages.push(new AIMessage(finalResponse));

    // Keep only last 20 messages to prevent context overflow
    if (conversation.messages.length > 20) {
      conversation.messages = conversation.messages.slice(-20);
    }

    // Generate message ID for feedback
    const messageId = uuidv4();

    res.status(200).json({
      success: true,
      data: {
        response: finalResponse,
        sessionId,
        messageId,
        toolsUsed,
      },
    });
  } catch (error: any) {
    console.error("[Agent Chat Error]", error);

    // Handle specific errors
    if (error.message?.includes("API key")) {
      res.status(503).json({
        success: false,
        error: "AI service is not configured. Please contact the administrator.",
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
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const isConfigured = hasGroqKey || hasOpenAIKey;

    res.status(200).json({
      success: true,
      data: {
        status: isConfigured ? "operational" : "not_configured",
        provider: hasGroqKey ? "groq" : hasOpenAIKey ? "openai" : "none",
        model:
          process.env.AGENT_MODEL ||
          (hasGroqKey ? "llama-3.1-70b-versatile" : "gpt-4o-mini"),
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

export default {
  chatHandler,
  getHistory,
  submitFeedback,
  clearSession,
  getStatus,
};
