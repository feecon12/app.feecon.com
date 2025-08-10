/**------Module imports -----------------------*/
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { protectRoute } from "./controllers/authController";
import {
  authRouter,
  bookingRouter,
  groqRouter,
  messageRouter,
  productRouter,
  reviewRouter,
  userRouter,
} from "./routers";
import {
  createAuthLimiter,
  createGeneralLimiter,
  findAvailablePort,
  getCSPConfig,
  securityHeaders,
} from "./utils/security";
import {
  ensureSecurityHeaders,
  logSuspiciousRequests,
  preventParameterPollution,
  sanitizeInputs,
} from "./utils/securityMiddleware";
import {
  createAuthLogger,
  detectSecurityThreats,
} from "./utils/securityMonitoring";
import { checkServerHealth, setupGracefulShutdown } from "./utils/serverUtils";

dotenv.config();

const app = express();

/*--------Environment variables------------*/
const PORT = process.env.PORT;
if (!PORT) {
  throw new Error("PORT environment variable is not set!");
}
const DB_URI = process.env.DB_URI as string;
const CLIENT_URL = process.env.CLIENT_URL;
const ENV = process.env.ENV;

/**-------Middlewares----------------------*/
// Log suspicious requests that might indicate security probing
app.use(logSuspiciousRequests);

// Detect potential security attacks
app.use(detectSecurityThreats);

// Apply Helmet for setting various HTTP security headers
app.use(helmet());

// Configure content security policy
app.use(helmet.contentSecurityPolicy(getCSPConfig(CLIENT_URL as string)));

// Ensure security headers are present in all responses
app.use(ensureSecurityHeaders);

// Rate limiting to prevent brute force and DoS attacks
const limiter = createGeneralLimiter();
// Apply rate limiting to all requests
app.use(limiter);

// Apply stricter rate limits to authentication routes
const authLimiter = createAuthLimiter();

// Parse cookies
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent large payload attacks
app.use(bodyParser.json({ limit: "10kb" }));

// Sanitize user input to prevent injection attacks
app.use(sanitizeInputs);

// Prevent parameter pollution
app.use(preventParameterPollution);

// CORS configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // This is crucial for cookies to work
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ], // Extended headers for preflight requests
    optionsSuccessStatus: 200,
  })
);

//Explicit handle preflight requests for all routes
app.options("*", cors({
  origin: CLIENT_URL,
  credentials: true,
}));

/**-------Database connection strings------*/
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log(`MongoDB connection in ${ENV} environment is established!`);
  })
  .catch((err: Error) => {
    console.log("Something went wrong with DB connection", err);
  });

/** ------------Routes---------------------*/
// Add security headers for all routes
app.use((req: Request, res: Response, next: NextFunction) => {
  // Apply all security headers from our centralized configuration
  Object.entries(securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });
  next();
});

// Add health check endpoint
app.get("/health", (req: Request, res: Response) => {
  const health = checkServerHealth();

  // Check database connection
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText =
    dbStatus === 0
      ? "disconnected"
      : dbStatus === 1
      ? "connected"
      : dbStatus === 2
      ? "connecting"
      : dbStatus === 3
      ? "disconnecting"
      : "unknown";

  res.status(200).json({
    status: "ok",
    server: health,
    database: {
      status: dbStatusText,
      connected: dbStatus === 1,
    },
    env: ENV,
  });
});

app.use("/api/contact", messageRouter);
app.use("/api/auth", authLimiter, createAuthLogger(), authRouter); // Apply stricter rate limiting and logging to auth routes
app.use("/api/user", protectRoute, userRouter);
app.use("/api/product", protectRoute, productRouter);
app.use("/api/booking", protectRoute, bookingRouter);
app.use("/api/review", protectRoute, reviewRouter);
app.use("/api/generate",protectRoute, groqRouter);

/**----Central Error Handling Middleware----*/
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Define generic message for 500 errors to avoid leaking implementation details
  const isProd = ENV === "production";
  const statusCode = err.statusCode || 500;

  // Sanitize error messages in production
  let errorMessage: string;
  if (isProd && statusCode === 500) {
    errorMessage = "Internal Server Error";
  } else {
    errorMessage = err.message || "Internal Server Error";
  }

  // Log detailed error in development/staging
  if (!isProd) {
    console.error(`[ERROR] ${statusCode}: ${errorMessage}`, err.stack);
  } else {
    // Log minimal info in production - potentially add error ID for tracking
    const errorId =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.error(`[ERROR] ${errorId} - ${statusCode}: ${errorMessage}`);

    // In a real production environment, you might want to log to a monitoring service
    // logToMonitoringService(errorId, statusCode, err);
  }

  // Avoid exposing stack traces and detailed errors in production
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(isProd ? {} : { stack: err.stack }),
  });
});

/*------ Fallback middleware (When no route hits, this will be called)-----*/
app.use(function (req: Request, res: Response) {
  // Don't expose route information in 404 response
  // Log attempted access to unknown route (could be useful for detecting scanning attempts)
  console.log(`[404] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  // Return generic 404 without details about what was not found
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

/* -------Server connection string------- */
// Start the server with port detection
const startServer = async () => {
  try {
    const preferredPort = parseInt(PORT, 10);
    const availablePort = await findAvailablePort(preferredPort);

    const server = app.listen(availablePort, () => {
      console.log(
        `Server is running in ${ENV} at http://localhost:${availablePort}`
      );
      console.log(
        `Health check available at: http://localhost:${availablePort}/health`
      );

      // Log if we're using a different port than preferred
      if (availablePort !== preferredPort) {
        console.log(
          `Note: The original port ${preferredPort} was in use, so port ${availablePort} is being used instead.`
        );
      }
    });

    // Set up graceful shutdown handling
    setupGracefulShutdown(server, "API Server");
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
