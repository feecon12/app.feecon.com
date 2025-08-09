/**
 * Security Monitoring Utility
 *
 * This module provides functions for logging and monitoring security-related events
 */
import { Request, Response } from "express";

interface SecurityLog {
  timestamp?: string; // Make timestamp optional since we'll set a default
  type: "warning" | "violation" | "blocked" | "info";
  message: string;
  ip?: string;
  userId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
}

/**
 * Log a security event
 * In production, this would be connected to a proper monitoring system
 */
export const logSecurityEvent = (log: SecurityLog): void => {
  const logEntry = {
    ...log,
    timestamp: log.timestamp || new Date().toISOString(),
  };

  console.log(
    `[SECURITY ${logEntry.type.toUpperCase()}] ${logEntry.timestamp}: ${
      logEntry.message
    }`
  );

  // In production, you would send this to a monitoring service
  // For example: sendToMonitoringService(logEntry);
};

/**
 * Create a security logger middleware
 * This logs successful and unsuccessful authentication attempts
 */
export const createAuthLogger = () => {
  return (req: Request, res: Response, next: Function) => {
    // Store the original send function
    const originalSend = res.send;

    (res as any).send = function (body: any) {
      // Check if this is an authentication response
      if (
        req.path.includes("/login") ||
        req.path.includes("/signup") ||
        req.path.includes("/auth")
      ) {
        const isSuccessful = res.statusCode < 400;
        const userId = req.body && req.body.email ? req.body.email : "unknown";

        logSecurityEvent({
          type: isSuccessful ? "info" : "warning",
          message: isSuccessful
            ? `Successful authentication for user ${userId}`
            : `Failed authentication attempt for user ${userId}`,
          ip: req.ip,
          userId,
          url: req.originalUrl,
          method: req.method,
          userAgent: req.get("User-Agent") || "unknown",
        });
      }

      // Call the original send function
      return originalSend.call(this, body);
    };

    next();
  };
};

/**
 * Middleware to detect and log potential security attacks
 */
export const detectSecurityThreats = (
  req: Request,
  res: Response,
  next: Function
) => {
  // Check for SQL injection attempts
  const sqlInjectionPattern = /(\%27)|(\')|(\-\-)|(\%23)|(#)/i;
  const hasParams = req.params && Object.keys(req.params).length > 0;
  const hasQuery = req.query && Object.keys(req.query).length > 0;

  if (hasParams) {
    for (const key in req.params) {
      if (
        typeof req.params[key] === "string" &&
        sqlInjectionPattern.test(req.params[key] as string)
      ) {
        logSecurityEvent({
          type: "violation",
          message: `Potential SQL injection attempt detected in URL parameters`,
          ip: req.ip,
          url: req.originalUrl,
          method: req.method,
          userAgent: req.get("User-Agent") || "unknown",
        });
        break;
      }
    }
  }

  if (hasQuery) {
    for (const key in req.query) {
      if (
        typeof req.query[key] === "string" &&
        sqlInjectionPattern.test(req.query[key] as string)
      ) {
        logSecurityEvent({
          type: "violation",
          message: `Potential SQL injection attempt detected in query parameters`,
          ip: req.ip,
          url: req.originalUrl,
          method: req.method,
          userAgent: req.get("User-Agent") || "unknown",
        });
        break;
      }
    }
  }

  // Check for XSS attempts
  const xssPattern =
    /<script>|<\/script>|javascript:|onerror=|onload=|onclick=/i;

  if (hasParams) {
    for (const key in req.params) {
      if (
        typeof req.params[key] === "string" &&
        xssPattern.test(req.params[key] as string)
      ) {
        logSecurityEvent({
          type: "violation",
          message: `Potential XSS attempt detected in URL parameters`,
          ip: req.ip,
          url: req.originalUrl,
          method: req.method,
          userAgent: req.get("User-Agent") || "unknown",
        });
        break;
      }
    }
  }

  if (hasQuery) {
    for (const key in req.query) {
      if (
        typeof req.query[key] === "string" &&
        xssPattern.test(req.query[key] as string)
      ) {
        logSecurityEvent({
          type: "violation",
          message: `Potential XSS attempt detected in query parameters`,
          ip: req.ip,
          url: req.originalUrl,
          method: req.method,
          userAgent: req.get("User-Agent") || "unknown",
        });
        break;
      }
    }
  }

  next();
};
