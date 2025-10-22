#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  // Get the last commit date from git
  const lastCommitDate = execSync("git log -1 --format=%ci", {
    encoding: "utf8",
  }).trim();

  // Get current build date
  const buildDate = new Date().toISOString();

  // In production environments like Vercel, set environment variables directly
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.CI) {
    process.env.NEXT_PUBLIC_LAST_UPDATED = lastCommitDate;
    process.env.NEXT_PUBLIC_BUILD_DATE = buildDate;
    console.log("✅ Build information set for production environment");
    console.log(`Last commit: ${lastCommitDate}`);
    console.log(`Build date: ${buildDate}`);
    return;
  }

  // Create environment variables content for local development
  const envContent = `NEXT_PUBLIC_LAST_UPDATED=${lastCommitDate}
NEXT_PUBLIC_BUILD_DATE=${buildDate}
`;

  // Write to .env.local file
  const envPath = path.join(__dirname, "..", ".env.local");

  // Read existing .env.local if it exists
  let existingEnv = "";
  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, "utf8");
  }

  // Remove any existing NEXT_PUBLIC_LAST_UPDATED or NEXT_PUBLIC_BUILD_DATE lines
  const filteredEnv = existingEnv
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("NEXT_PUBLIC_LAST_UPDATED=") &&
        !line.startsWith("NEXT_PUBLIC_BUILD_DATE=")
    )
    .join("\n");

  // Combine with new build info
  const finalEnvContent =
    (filteredEnv.trim() ? filteredEnv + "\n" : "") + envContent;

  // Write the updated .env.local file
  fs.writeFileSync(envPath, finalEnvContent);

  console.log("✅ Build information generated successfully");
  console.log(`Last commit: ${lastCommitDate}`);
  console.log(`Build date: ${buildDate}`);
} catch (error) {
  console.warn(
    "⚠️  Could not get git information, using current date as fallback"
  );
  console.warn("Error:", error.message);

  // Fallback to current date if git is not available
  const fallbackDate = new Date().toISOString();
  
  // In production environments like Vercel, set environment variables directly
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.CI) {
    process.env.NEXT_PUBLIC_LAST_UPDATED = fallbackDate;
    process.env.NEXT_PUBLIC_BUILD_DATE = fallbackDate;
    console.log("✅ Fallback build information set for production environment");
    return;
  }

  const envContent = `NEXT_PUBLIC_LAST_UPDATED=${fallbackDate}
NEXT_PUBLIC_BUILD_DATE=${fallbackDate}
`;

  const envPath = path.join(__dirname, "..", ".env.local");
  let existingEnv = "";
  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, "utf8");
  }

  const filteredEnv = existingEnv
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("NEXT_PUBLIC_LAST_UPDATED=") &&
        !line.startsWith("NEXT_PUBLIC_BUILD_DATE=")
    )
    .join("\n");

  const finalEnvContent =
    (filteredEnv.trim() ? filteredEnv + "\n" : "") + envContent;
  fs.writeFileSync(envPath, finalEnvContent);

  console.log("✅ Fallback build information generated");
}
