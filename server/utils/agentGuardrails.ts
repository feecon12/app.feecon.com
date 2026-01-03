/**
 * Agent Guardrails - Safety checks and input validation
 * Prevents harmful actions and validates LLM outputs
 */

// Sensitive operation patterns that require extra caution
const SENSITIVE_PATTERNS = [
  /delete\s+(all|everything|database|account)/i,
  /drop\s+(table|database|collection)/i,
  /rm\s+-rf/i,
  /format\s+c:/i,
  /sudo\s+rm/i,
  /exec\s*\(/i,
  /eval\s*\(/i,
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
];

// Prompt injection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(to\s+be|you're)/i,
  /forget\s+(your|all)\s+(instructions|rules)/i,
  /new\s+instructions:/i,
  /system\s*:\s*/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\|im_start\|>/i,
  /###\s*(system|instruction)/i,
];

// Personal data patterns (for privacy protection)
const PII_PATTERNS = [
  /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/, // SSN
  /\b\d{16}\b/, // Credit card
  /\b[A-Z]{2}\d{6,8}\b/i, // Passport
];

export interface ValidationResult {
  isValid: boolean;
  blocked: boolean;
  reason?: string;
  sanitizedInput?: string;
  warnings: string[];
}

/**
 * Validate user input before processing
 */
export const validateInput = (input: string): ValidationResult => {
  const warnings: string[] = [];
  let sanitizedInput = input;

  // Check for empty input
  if (!input || input.trim().length === 0) {
    return {
      isValid: false,
      blocked: true,
      reason: "Empty input",
      warnings: [],
    };
  }

  // Check input length
  if (input.length > 5000) {
    return {
      isValid: false,
      blocked: true,
      reason: "Input too long (max 5000 characters)",
      warnings: [],
    };
  }

  // Check for prompt injection attempts
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isValid: false,
        blocked: true,
        reason: "Potential prompt injection detected",
        warnings: ["Blocked: Suspicious instruction pattern detected"],
      };
    }
  }

  // Check for sensitive operations
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(input)) {
      warnings.push("Input contains potentially sensitive operation request");
      break;
    }
  }

  // Check for PII (warn but don't block)
  for (const pattern of PII_PATTERNS) {
    if (pattern.test(input)) {
      warnings.push(
        "Input may contain personal information - handle with care"
      );
      break;
    }
  }

  // Sanitize HTML/script tags
  sanitizedInput = input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  return {
    isValid: true,
    blocked: false,
    sanitizedInput,
    warnings,
  };
};

/**
 * Validate LLM output before returning to user
 */
export const validateOutput = (output: string): ValidationResult => {
  const warnings: string[] = [];

  // Check for empty output
  if (!output || output.trim().length === 0) {
    return {
      isValid: false,
      blocked: false,
      reason: "Empty response from LLM",
      warnings: [],
    };
  }

  // Check for potential code execution in output
  const codePatterns = [
    /```(bash|sh|shell|cmd|powershell)[\s\S]*?(rm|del|drop|delete|format)/i,
    /<script/i,
    /eval\s*\(/i,
  ];

  for (const pattern of codePatterns) {
    if (pattern.test(output)) {
      warnings.push("Output contains potentially dangerous code");
    }
  }

  // Check for hallucinated URLs (common patterns that might be fake)
  const suspiciousUrls = /https?:\/\/(?!app\.feecon|github\.com|linkedin\.com)[^\s]+/gi;
  const urls = output.match(suspiciousUrls);
  if (urls && urls.length > 0) {
    warnings.push(`Output contains external URLs that should be verified: ${urls.length} found`);
  }

  return {
    isValid: true,
    blocked: false,
    warnings,
  };
};

/**
 * Check if an action requires confirmation
 */
export const requiresConfirmation = (
  toolName: string,
  input: Record<string, any>
): boolean => {
  // Tools that always require confirmation
  const confirmationRequired = [
    "delete_resource",
    "update_database",
    "send_email",
    "deploy_action",
    "rollback_action",
  ];

  if (confirmationRequired.includes(toolName)) {
    return true;
  }

  // Check for destructive keywords in input
  const inputStr = JSON.stringify(input).toLowerCase();
  const destructiveKeywords = ["delete", "remove", "drop", "clear", "reset"];

  return destructiveKeywords.some((kw) => inputStr.includes(kw));
};

/**
 * Rate limiting check for sensitive operations
 */
const sensitiveOpCounts: Map<string, { count: number; resetAt: Date }> =
  new Map();

export const checkSensitiveRateLimit = (
  sessionId: string,
  toolName: string,
  maxOps: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } => {
  const key = `${sessionId}:${toolName}`;
  const now = new Date();

  let tracker = sensitiveOpCounts.get(key);

  if (!tracker || tracker.resetAt < now) {
    tracker = { count: 0, resetAt: new Date(now.getTime() + windowMs) };
    sensitiveOpCounts.set(key, tracker);
  }

  if (tracker.count >= maxOps) {
    return { allowed: false, remaining: 0 };
  }

  tracker.count++;
  return { allowed: true, remaining: maxOps - tracker.count };
};

/**
 * Content filter for responses
 */
export const filterContent = (content: string): string => {
  // Remove any accidental API keys or secrets
  let filtered = content.replace(
    /(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"]?[\w-]{20,}['"]?/gi,
    "[REDACTED]"
  );

  // Remove potential file paths that might leak server info
  filtered = filtered.replace(
    /(?:\/home\/\w+|C:\\Users\\\w+)[^\s]*/g,
    "[PATH_REDACTED]"
  );

  return filtered;
};

export default {
  validateInput,
  validateOutput,
  requiresConfirmation,
  checkSensitiveRateLimit,
  filterContent,
};
