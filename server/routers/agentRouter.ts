import { Router } from "express";
import {
  chatHandler,
  getHistory,
  submitFeedback,
  clearSession,
  getStatus,
} from "../controllers/agentController";
import rateLimit from "express-rate-limit";

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
 * @desc    Get agent status and health check
 * @access  Public
 */
router.get("/status", getStatus);

export default router;
