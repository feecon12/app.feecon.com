/**
 * Authentication Logging Service
 * Records security events for audit purposes
 */
import fs from "fs";
import path from "path";

// Log event types
export enum AuthEventType {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS",
  PASSWORD_RESET_FAILURE = "PASSWORD_RESET_FAILURE",
  SIGNUP = "SIGNUP",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  LOGOUT = "LOGOUT",
  TOKEN_REFRESH = "TOKEN_REFRESH",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

// Log event interface
interface AuthLogEvent {
  timestamp: string;
  type: AuthEventType;
  userId?: string;
  username?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  message: string;
  details?: any;
}

/**
 * Auth Logger class for recording security events
 */
class AuthLogger {
  private static instance: AuthLogger;
  private logDir: string;
  private logFile: string;

  private constructor() {
    // Create log directory if it doesn't exist
    this.logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Set log file path
    this.logFile = path.join(this.logDir, "auth.log");
  }

  public static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  /**
   * Log an authentication event
   * @param event - The event to log
   */
  public log(event: Omit<AuthLogEvent, "timestamp">): void {
    const logEntry: AuthLogEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Log to file
    fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + "\n");

    // In development/testing environment, also log to console
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[AUTH] ${logEntry.timestamp} - ${logEntry.type}: ${logEntry.message}`
      );
    }

    // In production, you would integrate with monitoring service
    // this.sendToMonitoringService(logEntry);
  }

  /**
   * Get recent authentication logs
   * @param limit - Maximum number of logs to retrieve
   * @returns Array of log entries
   */
  public getRecentLogs(limit = 100): AuthLogEvent[] {
    try {
      const logs = fs
        .readFileSync(this.logFile, "utf8")
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => JSON.parse(line) as AuthLogEvent)
        .slice(-limit);

      return logs;
    } catch (error) {
      console.error("Error reading auth log file:", error);
      return [];
    }
  }

  /**
   * Filter logs by event type
   * @param type - Event type to filter by
   * @param limit - Maximum number of logs to retrieve
   * @returns Filtered log entries
   */
  public getLogsByType(type: AuthEventType, limit = 100): AuthLogEvent[] {
    try {
      const logs = this.getRecentLogs(1000);
      return logs.filter((log) => log.type === type).slice(-limit);
    } catch (error) {
      console.error("Error filtering auth logs:", error);
      return [];
    }
  }

  /**
   * Get logs for a specific user
   * @param userId - User ID to filter by
   * @param limit - Maximum number of logs to retrieve
   * @returns Filtered log entries
   */
  public getLogsByUser(userId: string, limit = 100): AuthLogEvent[] {
    try {
      const logs = this.getRecentLogs(1000);
      return logs.filter((log) => log.userId === userId).slice(-limit);
    } catch (error) {
      console.error("Error filtering auth logs:", error);
      return [];
    }
  }
}

export const authLogger = AuthLogger.getInstance();
