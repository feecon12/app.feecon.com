/**
 * Token Management Service
 * Handles JWT token operations including blacklisting for logout
 */
import { verifyToken } from "./authSecurity";

/**
 * In-memory token blacklist
 * In a production environment, this should be replaced with Redis or a database
 */
class TokenBlacklist {
  private static instance: TokenBlacklist;
  private blacklistedTokens: Set<string> = new Set();
  private tokenExpiry: Map<string, number> = new Map();

  private constructor() {
    // Start cleanup timer
    setInterval(this.cleanupExpiredTokens.bind(this), 3600000); // Clean up every hour
  }

  public static getInstance(): TokenBlacklist {
    if (!TokenBlacklist.instance) {
      TokenBlacklist.instance = new TokenBlacklist();
    }
    return TokenBlacklist.instance;
  }

  /**
   * Blacklist a token until its expiry
   * @param token - Token to blacklist
   * @param secret - Secret key to verify token
   */
  public blacklistToken(token: string, secret: string): void {
    const decoded = verifyToken(token, secret);
    if (!decoded || !decoded.exp) return;

    this.blacklistedTokens.add(token);
    this.tokenExpiry.set(token, decoded.exp);
  }

  /**
   * Check if a token is blacklisted
   * @param token - Token to check
   * @returns True if blacklisted
   */
  public isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Clean up expired tokens from the blacklist
   * Private method called by timer
   */
  private cleanupExpiredTokens(): void {
    const now = Math.floor(Date.now() / 1000);

    for (const [token, expiry] of this.tokenExpiry.entries()) {
      if (expiry < now) {
        this.blacklistedTokens.delete(token);
        this.tokenExpiry.delete(token);
      }
    }

    console.log(
      `Token blacklist cleanup complete. Active blacklist size: ${this.blacklistedTokens.size}`
    );
  }
}

export const tokenBlacklist = TokenBlacklist.getInstance();
