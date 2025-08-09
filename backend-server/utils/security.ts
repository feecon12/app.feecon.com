/**
 * Security Utilities
 * This file centralizes security configurations for the application
 */
import rateLimit from "express-rate-limit";

/**
 * Configure Content Security Policy
 * @param clientUrl - The URL of the client application
 */
export const getCSPConfig = (clientUrl: string) => {
  return {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", clientUrl],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  };
};

/**
 * Create a general rate limiter
 */
export const createGeneralLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again later.",
  });
};

/**
 * Create a strict rate limiter for sensitive routes
 */
export const createAuthLimiter = () => {
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // Start blocking after 10 requests
    message: "Too many login attempts, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Set common security headers
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "same-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
};

/**
 * Utility to find an available port
 * @param preferredPort - The preferred port number to use
 * @param server - The Express server instance
 * @returns Promise that resolves with the available port number
 */
export const findAvailablePort = async (
  preferredPort: number,
  maxAttempts = 10
): Promise<number> => {
  const net = require("net");

  /**
   * Check if a port is in use
   */
  const isPortInUse = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = net.createServer();

      server.once("error", (err: any) => {
        // If the error code is EADDRINUSE, the port is already in use
        if (err.code === "EADDRINUSE") {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      server.once("listening", () => {
        // If we can listen on this port, it's available
        server.close();
        resolve(false);
      });

      server.listen(port);
    });
  };

  // Try the preferred port first
  if (!(await isPortInUse(preferredPort))) {
    return preferredPort;
  }

  // If preferred port is in use, try to find another one
  console.warn(
    `Port ${preferredPort} is already in use. Trying to find an available port...`
  );

  let currentPort = preferredPort + 1;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (!(await isPortInUse(currentPort))) {
      console.log(`Found available port: ${currentPort}`);
      return currentPort;
    }

    currentPort++;
    attempts++;
  }

  throw new Error(
    `Could not find an available port after ${maxAttempts} attempts.`
  );
};
