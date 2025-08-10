/**
 * Authentication Type Definitions
 */

// Request interfaces
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  userId: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
  userId: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Response interfaces
export interface AuthResponse {
  success: boolean;
  message: string;
  status?: number;
  data?: any;
}

export interface TokenResponse extends AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Extend Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      csrfToken?: string;
    }
  }
}

// User types for authentication
export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  token?: string;
  otpExpiry?: Date;
  refreshToken?: string;
  failedLoginAttempts?: number;
  accountLocked?: boolean;
  accountLockedUntil?: Date;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  emailTokenExpiry?: Date;
}
