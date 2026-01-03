/**
 * Agent Action Logger & Audit Trail
 * Logs all agent actions for security and debugging
 */

export interface AgentAction {
  id: string;
  timestamp: Date;
  sessionId: string;
  toolName: string;
  input: Record<string, any>;
  output: Record<string, any> | string | null;
  success: boolean;
  error?: string;
  durationMs: number;
  userId?: string;
  ipAddress?: string;
}

// In-memory action log (replace with MongoDB in production)
const actionLog: AgentAction[] = [];
const MAX_LOG_SIZE = 10000;

/**
 * Log an agent action
 */
export const logAction = (
  action: Omit<AgentAction, "id" | "timestamp">
): AgentAction => {
  const fullAction: AgentAction = {
    ...action,
    id: `action-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: new Date(),
  };

  actionLog.push(fullAction);

  // Keep log size manageable
  if (actionLog.length > MAX_LOG_SIZE) {
    actionLog.splice(0, actionLog.length - MAX_LOG_SIZE);
  }

  // Console log for debugging
  console.log(
    `[Agent Action] ${fullAction.success ? "SUCCESS" : "ERROR"} | ${fullAction.toolName} | Session: ${fullAction.sessionId}`
  );

  return fullAction;
};

/**
 * Get recent actions for a session
 */
export const getSessionActions = (
  sessionId: string,
  limit: number = 50
): AgentAction[] => {
  return actionLog
    .filter((a) => a.sessionId === sessionId)
    .slice(-limit);
};

/**
 * Get all recent actions (admin only)
 */
export const getRecentActions = (limit: number = 100): AgentAction[] => {
  return actionLog.slice(-limit);
};

/**
 * Get action statistics
 */
export const getActionStats = () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentActions = actionLog.filter((a) => a.timestamp > oneHourAgo);
  const dailyActions = actionLog.filter((a) => a.timestamp > oneDayAgo);

  const toolUsage: Record<string, number> = {};
  for (const action of dailyActions) {
    toolUsage[action.toolName] = (toolUsage[action.toolName] || 0) + 1;
  }

  return {
    totalActions: actionLog.length,
    actionsLastHour: recentActions.length,
    actionsLast24Hours: dailyActions.length,
    successRate:
      dailyActions.length > 0
        ? (dailyActions.filter((a) => a.success).length /
            dailyActions.length) *
          100
        : 0,
    errorCount: dailyActions.filter((a) => !a.success).length,
    toolUsage,
    averageExecutionTime:
      dailyActions.length > 0
        ? dailyActions.reduce((sum, a) => sum + a.durationMs, 0) /
          dailyActions.length
        : 0,
  };
};

/**
 * Clear action log (admin only)
 */
export const clearActionLog = (): void => {
  actionLog.length = 0;
};

export default {
  logAction,
  getSessionActions,
  getRecentActions,
  getActionStats,
  clearActionLog,
};
