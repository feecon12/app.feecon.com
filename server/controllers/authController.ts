import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { emailBuilder } from "../nodemailer";
import { AuthEventType, authLogger } from "../utils/authLogger";
import {
  comparePasswords,
  generateSecureToken,
  generateTokens,
  hashPassword,
  validatePasswordStrength,
  verifyToken,
} from "../utils/authSecurity";
import { tokenBlacklist } from "../utils/tokenManagement";

// Custom Request interface with additional properties
interface CustomRequest extends Request {
  userId?: string;
  userRole?: string;
}

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

const app = express();
app.use(cookieParser());
app.use(express.json());

/**---------Authentication and Authorization flows------------------*/
//signup
const signUpHandler = async (req: CustomRequest, res: Response) => {
  try {
    // IP and User Agent for security logging
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    const userData = req.body;

    // Validate password strength
    const passwordCheck = validatePasswordStrength(userData.password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordCheck.message,
      });
    }

    // Check for matching passwords
    if (userData.password !== userData.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmation do not match",
      });
    }

    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
      // Don't reveal if email exists for security
      return res.status(400).json({
        success: false,
        message:
          "Registration failed. Please try again with different credentials.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Generate verification token
    const verificationToken = generateSecureToken();
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hour expiry

    // Create new user object
    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      emailVerificationToken: verificationToken,
      emailTokenExpiry: tokenExpiry,
      emailVerified: false,
      role: userData.role || "user",
      failedLoginAttempts: 0,
      accountLocked: false,
    }) as IUser;

    // Save user to database
    await newUser.save();

    // Send verification email
    emailBuilder(
      userData.email,
      "Verify Your Email",
      `Please verify your email by clicking this link: ${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&userId=${newUser._id}`
    )
      .then(() => {
        console.log(
          "Verification email sent successfully to " + userData.email
        );
      })
      .catch((err: any) => {
        console.log("Error sending verification email", err);
      });

    // Log signup event
    authLogger.log({
      type: AuthEventType.SIGNUP,
      userId: newUser.id.toString(),
      username: newUser.username,
      email: newUser.email,
      ip,
      userAgent,
      message: "New user registered",
    });

    // Return success without exposing sensitive data
    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      userId: newUser.id,
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message:
        "Registration failed due to an internal error. Please try again later.",
    });
  }
};

//login
const loginHandler = async (req: CustomRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = (await User.findOne({ email })) as IUser;

    // IP and User Agent for security logging
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // User not found - don't reveal specific reason for security
    if (!user) {
      // Log the failed attempt
      authLogger.log({
        type: AuthEventType.LOGIN_FAILURE,
        ip,
        userAgent,
        email,
        message: "Login attempt with non-existent email",
      });

      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    // Check if account is locked
    if (user.accountLocked) {
      const now = new Date();

      // If lock has expired, unlock the account
      if (user.accountLockedUntil && user.accountLockedUntil < now) {
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await user.save();
      } else {
        // Account is still locked
        authLogger.log({
          type: AuthEventType.LOGIN_FAILURE,
          userId: user.id.toString(),
          username: user.username,
          email: user.email,
          ip,
          userAgent,
          message: "Login attempt on locked account",
        });

        return res.status(401).json({
          status: 401,
          message:
            "Account is locked due to multiple failed attempts. Please try again later or reset your password.",
        });
      }
    }

    // Compare passwords
    const isMatch = await comparePasswords(password, user.password);

    // Password doesn't match
    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.accountLocked = true;

        // Lock for 30 minutes
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 30);
        user.accountLockedUntil = lockUntil;

        authLogger.log({
          type: AuthEventType.ACCOUNT_LOCKED,
          userId: user.id.toString(),
          username: user.username,
          email: user.email,
          ip,
          userAgent,
          message: "Account locked due to multiple failed login attempts",
        });
      }

      await user.save();

      authLogger.log({
        type: AuthEventType.LOGIN_FAILURE,
        userId: user.id.toString(),
        username: user.username,
        email: user.email,
        ip,
        userAgent,
        message: `Failed login attempt. Attempts: ${user.failedLoginAttempts}`,
      });

      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    // Login successful - reset failed attempts
    user.failedLoginAttempts = 0;

    // Generate both access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id.toString(),
      SECRET_KEY
    );

    // Store refresh token and its expiry
    const decoded = verifyToken(refreshToken, SECRET_KEY);
    if (decoded && decoded.exp) {
      user.refreshToken = refreshToken;
      user.refreshTokenExpiry = new Date(decoded.exp * 1000);
    }

    await user.save();

    // Set access token in HTTPS cookie
    res.cookie("token", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite: process.env.ENV === "production" ? "none" : "strict",
    });

    // Set refresh token in HTTPS cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite: process.env.ENV === "production" ? "none" : "strict",
    });

    // Log successful login
    authLogger.log({
      type: AuthEventType.LOGIN_SUCCESS,
      userId: user.id.toString(),
      username: user.username,
      email: user.email,
      ip,
      userAgent,
      message: "Login successful",
    });

    // Return minimal user data
    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const isAuthorized = (allowedRoles: string[]) => {
  return async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(401).json({
        status: "failed to authenticate",
        message: "You are not authorized to access this route",
      });
    }
  };
};

//protect the route - verify token
const protectRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get access token from cookie
    const accessToken = req.cookies.token;

    // If no token, return unauthorized
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // Check if token is blacklisted
    if (tokenBlacklist.isBlacklisted(accessToken)) {
      return res.status(401).json({
        success: false,
        message: "Token is no longer valid. Please log in again.",
      });
    }

    // Verify token
    const payload = verifyToken(accessToken, SECRET_KEY);

    if (!payload || !payload.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token. Please log in again.",
      });
    }

    // Check if user exists and is not locked
    const user = (await User.findById(payload.userId)) as IUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    if (user.accountLocked) {
      return res.status(401).json({
        success: false,
        message:
          "Your account is locked. Please reset your password or contact support.",
      });
    }

    // Set user info in request for use in controllers
    req.userId = user.id.toString();
    req.userRole = user.role;

    next();
  } catch (err: any) {
    // Handle token expiry by checking for refresh token
    if (err.name === "TokenExpiredError" && req.cookies.refreshToken) {
      return refreshAccessToken(req, res, next);
    }

    res.status(401).json({
      success: false,
      message: "Authentication failed. Please log in again.",
    });
  }
};

// Function to refresh access token using refresh token
const refreshAccessToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found. Please log in again.",
      });
    }

    // Check if refresh token is blacklisted
    if (tokenBlacklist.isBlacklisted(refreshToken)) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid. Please log in again.",
      });
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken, SECRET_KEY);

    if (!payload || !payload.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
      });
    }

    // Find user and verify refresh token matches
    const user = (await User.findById(payload.userId)) as IUser;

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
      });
    }

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id.toString(),
      SECRET_KEY
    );

    // Update user's refresh token
    const decoded = verifyToken(newRefreshToken, SECRET_KEY);
    if (decoded && decoded.exp) {
      user.refreshToken = newRefreshToken;
      user.refreshTokenExpiry = new Date(decoded.exp * 1000);
      await user.save();
    }

    // Set new cookies
    res.cookie("token", accessToken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite: process.env.ENV === "production" ? "none" : "strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite: process.env.ENV === "production" ? "none" : "strict",
    });

    // Continue with authenticated request
    req.userId = user.id.toString();
    req.userRole = user.role;

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: "Authentication failed. Please log in again.",
    });
  }
};

const getMeHandler = async (req: CustomRequest, res: Response) => {
  const user = await User.findById(req.userId).select(
    "-password -confirmPassword"
  );
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, user });
};

//logout
const logoutHandler = (req: CustomRequest, res: Response): void => {
  try {
    // Get the tokens from cookies
    const accessToken = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;

    // IP and User Agent for security logging
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // Add tokens to blacklist if they exist
    if (accessToken) {
      tokenBlacklist.blacklistToken(accessToken, SECRET_KEY);
    }

    if (refreshToken) {
      tokenBlacklist.blacklistToken(refreshToken, SECRET_KEY);

      // If we have userId in the request, update the user record
      if (req.userId) {
        User.findByIdAndUpdate(req.userId, {
          $unset: { refreshToken: "", refreshTokenExpiry: "" },
        }).exec();
      }
    }

    // Clear cookies with same options as when they were set
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.ENV === "production",
      sameSite:
        process.env.ENV === "production"
          ? ("none" as const)
          : ("strict" as const),
    };
    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    // Log the logout event
    if (req.userId) {
      authLogger.log({
        type: AuthEventType.LOGOUT,
        userId: req.userId,
        ip,
        userAgent,
        message: "User logged out successfully",
      });
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      success: false,
      message: "Error processing logout",
    });
  }
};

//-----------Forgot password and Reset password --------------
const forgotPassword = async (req: CustomRequest, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    //verify that email exists in database
    if (!user) {
      res.status(404).json({
        status: "fail!",
        message: "User not found",
      });
    } else {
      //generate a token
      const token = otpGenerator();
      user.token = token.toString();
      user.otpExpiry = new Date(Date.now() + 1000 * 60 * 5);
      await user.save();
      //send email with link to reset password
      emailBuilder(user.email, "Reset Password", `Your OTP is ${token}`)
        .then(() => {
          console.log("Reset email is sent successfully to " + user.email);
        })
        .catch((err: any) => {
          console.log("Error in sending email", err);
        });
      res.status(200).json({
        status: "success",
        message: "OTP is sent to your email",
        userId: user.id,
      });
    }
  } catch (err: any) {
    console.log("Error in forget password", err);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

const otpGenerator = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

//Reset Password
const resetPassword = async (req: CustomRequest, res: Response) => {
  try {
    const { token, password, userId } = req.body;
    if (!token || !password || !userId) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    } else {
      if (String(user.token) !== String(token)) {
        res.status(401).json({
          status: "fail",
          message: "Invalid token",
        });
      } else {
        if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
          res.status(401).json({
            status: "fail",
            message: "Token expired",
          });
        } else {
          //Hash the new Password before saving
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          user.confirmPassword = hashedPassword;
          user.token = undefined;
          user.otpExpiry = undefined;
          await user.save();
          res.status(200).json({
            status: "success",
            message: "Password reset successfully",
          });
        }
      }
    }
  } catch (err: any) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export {
  forgotPassword,
  getMeHandler,
  isAuthorized,
  loginHandler,
  logoutHandler,
  protectRoute,
  refreshAccessToken,
  resetPassword,
  signUpHandler,
};
