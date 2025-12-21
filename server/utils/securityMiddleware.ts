/**
 * Security Middleware
 * This file contains middleware functions to enhance security
 */
import { NextFunction, Request, Response } from "express";

/**
 * Sanitize user input to prevent injection attacks
 * Basic implementation - in production, use a proper sanitization library
 */
export const sanitizeInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) {
    // Create a new object to avoid modifying the original request
    const sanitizedBody: any = {};

    // Fields that should not be sanitized (URLs, etc)
    const skipSanitization = [
      "image",
      "projectUrl",
      "githubUrl",
      "profileImage",
    ];

    // Basic sanitization for each field in the request body
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        if (skipSanitization.includes(key)) {
          // Don't sanitize URL fields
          sanitizedBody[key] = req.body[key];
        } else {
          // Remove potentially dangerous characters
          sanitizedBody[key] = req.body[key]
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }
      } else {
        sanitizedBody[key] = req.body[key];
      }
    }

    req.body = sanitizedBody;
  }

  next();
};

/**
 * Prevent parameter pollution by ensuring parameters aren't duplicated
 * Basic implementation - in production, use express-hpp or similar
 */
export const preventParameterPollution = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Clean up query parameters
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key]) && req.query[key].length > 0) {
        // Take only the last value for each parameter
        (req.query as any)[key] = (req.query[key] as any[])[0];
      }
    }
  }

  next();
};

/**
 * Log suspicious requests that might indicate security probing
 */
export const logSuspiciousRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check for common attack patterns in URLs
  const suspiciousPatterns = [
    /\/wp-admin/i,
    /\/wp-login/i,
    /\/admin/i,
    /\.php$/i,
    /\.aspx$/i,
    /\.asp$/i,
    /\.\.\//i, // Path traversal attempts
    /select.*from/i, // SQL injection attempts
    /union.*select/i, // SQL injection attempts
    /script/i, // XSS attempts
    /alert\(/i, // XSS attempts
  ];

  const url = req.originalUrl;
  const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(url));

  if (isSuspicious) {
    console.warn(
      `[SECURITY WARNING] Suspicious request detected: ${req.method} ${url} from IP ${req.ip}`
    );
    // In production, you might want to log this to a security monitoring system
  }

  next();
};

/**
 * Check for common security headers in responses
 * This ensures our responses always have proper security headers even if they were missed elsewhere
 */
export const ensureSecurityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Store the original end function
  const originalEnd = res.end;

  // Override the end function
  (res as any).end = function (
    chunk?: any,
    encoding?: string,
    callback?: () => void
  ) {
    // Ensure critical security headers are present
    if (!res.getHeader("X-Content-Type-Options")) {
      res.setHeader("X-Content-Type-Options", "nosniff");
    }

    if (!res.getHeader("X-Frame-Options")) {
      res.setHeader("X-Frame-Options", "DENY");
    }

    if (!res.getHeader("X-XSS-Protection")) {
      res.setHeader("X-XSS-Protection", "1; mode=block");
    }

    // Call the original end function
    return originalEnd.call(this, chunk, encoding as any, callback);
  };

  next();
};
