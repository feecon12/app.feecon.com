/**
 * CSRF Protection Middleware
 */
import { NextFunction, Request, Response } from "express";
import { generateCsrfToken } from "./authSecurity";

/**
 * Generate and set CSRF token
 * Sets both a cookie and returns token in response
 */
export const setCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Generate a new CSRF token
  const csrfToken = generateCsrfToken();

  // Set CSRF token in cookie
  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false, // This needs to be accessible from JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Store token in request for use in controller
  req.csrfToken = csrfToken;

  next();
};

/**
 * Validate CSRF token
 * Compares token from cookie with token from request header
 */
export const validateCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip CSRF check for GET requests
  if (req.method === "GET") {
    return next();
  }

  // Get token from cookie
  const cookieToken = req.cookies["XSRF-TOKEN"];

  // Get token from header
  const headerToken = req.headers["x-xsrf-token"] as string;

  // Validate token
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed",
    });
  }

  next();
};
