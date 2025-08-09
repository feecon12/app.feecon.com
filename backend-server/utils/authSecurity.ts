/**
 * Auth Security Utilities
 * Contains security-related functions for authentication
 */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Token interfaces
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Configuration (should be moved to .env in production)
const ACCESS_TOKEN_EXPIRY = "15m"; // Short lived token
const REFRESH_TOKEN_EXPIRY = "7d"; // Longer lived refresh token
const PASSWORD_SALT_ROUNDS = 12; // Higher salt rounds = more secure but slower

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns Object containing validation result and message
 */
export const validatePasswordStrength = (
  password: string
): { isValid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  return { isValid: true };
};

/**
 * Hash a password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
};

/**
 * Compare a password with a hash
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns True if password matches hash
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate secure tokens for authentication
 * @param payload - Data to include in token
 * @param secret - Secret key for signing
 * @returns Object containing access and refresh tokens
 */
export const generateTokens = (userId: string, secret: string): TokenPair => {
  const payload: JwtPayload = { userId };

  const accessToken = jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

/**
 * Verify JWT token
 * @param token - Token to verify
 * @param secret - Secret key used for signing
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (
  token: string,
  secret: string
): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Generate a secure CSRF token
 * @returns CSRF token string
 */
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};

/**
 * Generate a more secure OTP
 * @param length - Length of OTP (default: 6)
 * @returns Secure OTP code
 */
export const generateSecureOTP = (length = 6): string => {
  const otpBuffer = crypto.randomBytes(length);
  // Convert to numeric OTP (each byte to a digit 0-9)
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += otpBuffer.readUInt8(i) % 10;
  }
  return otp;
};

/**
 * Create a unique token for password reset or email verification
 * @returns Secure random token
 */
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
