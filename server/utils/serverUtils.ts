/**
 * Server Utilities
 * Contains utilities for server operations and management
 */
import { Server } from "http";

/**
 * Setup graceful shutdown for the server
 * @param server - The HTTP server instance
 * @param serviceName - Optional name of the service for logging
 */
export const setupGracefulShutdown = (
  server: Server,
  serviceName = "HTTP Server"
) => {
  // Handle graceful shutdown on SIGTERM (e.g., when Docker sends terminate signal)
  process.on("SIGTERM", () => {
    console.log(`SIGTERM signal received: closing ${serviceName}`);

    server.close(() => {
      console.log(`${serviceName} closed`);
      process.exit(0);
    });

    // Force close after 10 seconds if server hasn't closed gracefully
    setTimeout(() => {
      console.error(
        `${serviceName} couldn't close gracefully within 10 seconds, forcing shutdown`
      );
      process.exit(1);
    }, 10000);
  });

  // Handle graceful shutdown on SIGINT (e.g., when Ctrl+C is pressed)
  process.on("SIGINT", () => {
    console.log(`SIGINT signal received: closing ${serviceName}`);

    server.close(() => {
      console.log(`${serviceName} closed`);
      process.exit(0);
    });

    // Force close after 10 seconds if server hasn't closed gracefully
    setTimeout(() => {
      console.error(
        `${serviceName} couldn't close gracefully within 10 seconds, forcing shutdown`
      );
      process.exit(1);
    }, 10000);
  });

  // Handle uncaught exceptions to prevent the server from crashing without cleanup
  process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    console.log(`Closing ${serviceName} due to uncaught exception`);

    server.close(() => {
      console.log(`${serviceName} closed`);
      process.exit(1);
    });

    // Force close after 10 seconds if server hasn't closed gracefully
    setTimeout(() => {
      console.error(
        `${serviceName} couldn't close gracefully within 10 seconds, forcing shutdown`
      );
      process.exit(1);
    }, 10000);
  });
};

/**
 * Check server health
 * @returns Object containing server health information
 */
export const checkServerHealth = () => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  return {
    uptime: uptime,
    uptimeFormatted: formatUptime(uptime),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format uptime into a human-readable string
 * @param uptime - Uptime in seconds
 * @returns Formatted uptime string (e.g., "5d 7h 23m 16s")
 */
const formatUptime = (uptime: number): string => {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
