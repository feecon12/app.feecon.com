import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  chatHandler,
  clearSession,
  getHistory,
  getStatus,
  getUsageStats,
  healthCheck,
  submitFeedback,
} from "../controllers/agentController";

const router = Router();

// Rate limiter for agent endpoints (more restrictive than general API)
const agentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // 30 requests per minute
  message: "Too many requests to the AI agent. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/agent/chat
 * @desc    Send a message to the AI agent
 * @access  Public
 * @body    { message: string, sessionId?: string }
 */
router.post("/chat", agentLimiter, chatHandler);

/**
 * @route   GET /api/agent/history/:sessionId
 * @desc    Get conversation history for a session
 * @access  Public
 */
router.get("/history/:sessionId", getHistory);

/**
 * @route   POST /api/agent/feedback
 * @desc    Submit feedback for an agent response
 * @access  Public
 * @body    { sessionId: string, messageId: string, rating: number, comment?: string }
 */
router.post("/feedback", submitFeedback);

/**
 * @route   DELETE /api/agent/session/:sessionId
 * @desc    Clear a conversation session
 * @access  Public
 */
router.delete("/session/:sessionId", clearSession);

/**
 * @route   GET /api/agent/status
 * @desc    Get agent status and configuration
 * @access  Public
 */
router.get("/status", getStatus);

/**
 * @route   GET /api/agent/usage
 * @desc    Get LLM usage statistics
 * @access  Admin (TODO: add auth middleware)
 */
router.get("/usage", getUsageStats);

/**
 * @route   GET /api/agent/health
 * @desc    Quick health check with provider latency
 * @access  Public
 */
router.get("/health", healthCheck);

export default router;
