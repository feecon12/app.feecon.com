import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import Blog from "../models/blogModel";
import Message from "../models/messageModel";
import Project from "../models/projectModel";
import Skill from "../models/skillModel";
import { logAction } from "./agentActionLogger";
import guardrails from "./agentGuardrails";

/**
 * Agent Tools for the Website Agent
 * These tools allow the AI agent to interact with the website's data
 * All tools now include action logging for audit trails
 */

// Session context for logging (set by controller)
let currentSessionId: string | null = null;
let currentUserId: string | undefined = undefined;

export const setToolContext = (sessionId: string, userId?: string) => {
  currentSessionId = sessionId;
  currentUserId = userId;
};

export const clearToolContext = () => {
  currentSessionId = null;
  currentUserId = undefined;
};

// Tool: Search Skills
export const searchSkillsTool = new DynamicStructuredTool({
  name: "search_skills",
  description:
    "Search for skills and technologies. Use this when users ask about what technologies, skills, or expertise are available.",
  schema: z.object({
    query: z
      .string()
      .optional()
      .describe("Optional search query to filter skills"),
    category: z
      .string()
      .optional()
      .describe("Category to filter by (e.g., frontend, backend, database)"),
  }),
  func: async ({ query, category }: { query?: string; category?: string }) => {
    const startTime = Date.now();
    try {
      const filter: Record<string, any> = {};
      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }

      const skills = await Skill.find(filter).limit(20);

      const result =
        skills.length === 0
          ? "No skills found matching the criteria."
          : `Found ${skills.length} skills:\n${skills
              .map(
                (s: any) => `- ${s.name}${s.category ? ` (${s.category})` : ""}`
              )
              .join("\n")}`;

      // Log the action
      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "search_skills",
          input: { query, category },
          output: { count: skills.length },
          success: true,
          durationMs: Date.now() - startTime,
        });
      }

      return result;
    } catch (error) {
      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "search_skills",
          input: { query, category },
          output: null,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          durationMs: Date.now() - startTime,
        });
      }
      return "Error searching skills. Please try again.";
    }
  },
});

// Tool: Search Projects
export const searchProjectsTool = new DynamicStructuredTool({
  name: "search_projects",
  description:
    "Search for projects in the portfolio. Use this when users ask about projects, work samples, or want to see examples of work.",
  schema: z.object({
    query: z
      .string()
      .optional()
      .describe("Search query for project title or description"),
    technology: z
      .string()
      .optional()
      .describe("Filter by technology used (e.g., React, Node.js)"),
  }),
  func: async ({
    query,
    technology,
  }: {
    query?: string;
    technology?: string;
  }) => {
    const startTime = Date.now();
    try {
      const filter: Record<string, any> = {};
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
      }

      const projects = await Project.find(filter).limit(10).sort("-createdAt");

      const result =
        projects.length === 0
          ? "No projects found matching the criteria."
          : `Found ${projects.length} projects:\n${projects
              .map(
                (p: any) =>
                  `- **${p.title}**: ${
                    p.description?.substring(0, 100) || "No description"
                  }...${p.projectUrl ? ` [View](${p.projectUrl})` : ""}`
              )
              .join("\n")}`;

      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "search_projects",
          input: { query, technology },
          output: { count: projects.length },
          success: true,
          durationMs: Date.now() - startTime,
        });
      }

      return result;
    } catch (error) {
      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "search_projects",
          input: { query, technology },
          output: null,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          durationMs: Date.now() - startTime,
        });
      }
      return "Error searching projects. Please try again.";
    }
  },
});

// Tool: Search Blogs
export const searchBlogsTool = new DynamicStructuredTool({
  name: "search_blogs",
  description:
    "Search for blog posts. Use this when users ask about articles, tutorials, or blog content.",
  schema: z.object({
    query: z
      .string()
      .optional()
      .describe("Search query for blog title or content"),
    tag: z.string().optional().describe("Filter by tag"),
  }),
  func: async ({ query, tag }: { query?: string; tag?: string }) => {
    const startTime = Date.now();
    try {
      const filter: Record<string, any> = { published: true };
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ];
      }
      if (tag) {
        filter.tags = { $in: [tag] };
      }

      const blogs = await Blog.find(filter).limit(10).sort("-createdAt");

      const result =
        blogs.length === 0
          ? "No blog posts found matching the criteria."
          : `Found ${blogs.length} blog posts:\n${blogs
              .map(
                (b: any) =>
                  `- **${b.title}**: ${
                    b.excerpt || b.content?.substring(0, 80) || ""
                  }...`
              )
              .join("\n")}`;

      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "search_blogs",
          input: { query, tag },
          output: { count: blogs.length },
          success: true,
          durationMs: Date.now() - startTime,
        });
      }

      return result;
    } catch (error) {
      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "search_blogs",
          input: { query, tag },
          output: null,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          durationMs: Date.now() - startTime,
        });
      }
      return "Error searching blogs. Please try again.";
    }
  },
});

// Tool: Get FAQ Answer
export const getFaqAnswerTool = new DynamicStructuredTool({
  name: "get_faq_answer",
  description:
    "Get answers to frequently asked questions about the portfolio owner, services, or general inquiries.",
  schema: z.object({
    question: z.string().describe("The FAQ question to answer"),
  }),
  func: async ({ question }: { question: string }) => {
    const startTime = Date.now();

    // FAQ knowledge base
    const faqs: Record<string, string> = {
      contact:
        "You can reach out through the contact form on this website, or email directly. I typically respond within 24-48 hours.",
      services:
        "I offer web development services including: Full-stack development, React/Next.js applications, Node.js backends, API development, and consulting.",
      experience:
        "I have 5+ years of experience in software development, working with healthcare and insurance sectors, building scalable web applications.",
      availability:
        "I'm currently available for new projects and consultations. Use the booking feature to schedule a call.",
      pricing:
        "Pricing varies based on project scope and requirements. Please reach out through the contact form for a custom quote.",
      technologies:
        "I specialize in React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, AWS, and more. Use the 'search_skills' tool for a complete list.",
      timeline:
        "Project timelines depend on scope. Small projects: 1-2 weeks. Medium: 1-2 months. Large: 3+ months. Let's discuss your specific needs.",
      resume:
        "You can view the complete professional experience, skills, and projects on this portfolio website. Navigate to the About page for biography, or the Skills section for technical expertise. For a formal resume, please use the contact form to request one.",
      cv: "You can view the complete professional experience, skills, and projects on this portfolio website. Navigate to the About page for biography, or the Skills section for technical expertise. For a formal resume/CV, please use the contact form to request one.",
      download:
        "This portfolio website serves as a comprehensive online resume. You can explore skills, projects, and experience through the navigation. For downloadable documents, please contact directly through the contact form.",
      hire: "I'm available for hire! You can book a consultation through the booking feature, or send a message through the contact form. Let's discuss your project requirements.",
      location:
        "I work remotely and am available for projects worldwide. Timezone: IST (UTC+5:30). Happy to accommodate different time zones for meetings.",
      about:
        "I'm a full-stack developer specializing in React, Next.js, and Node.js. Check out the About page for my full biography, and the Projects section to see my work.",
    };

    const questionLower = question.toLowerCase();
    let matchedKey: string | null = null;
    let answer: string;

    // Find matching FAQ
    for (const [key, value] of Object.entries(faqs)) {
      if (questionLower.includes(key)) {
        matchedKey = key;
        answer = value;
        break;
      }
    }

    if (!matchedKey) {
      answer =
        "I don't have a specific FAQ answer for that. You can ask me about: contact info, services, experience, availability, pricing, technologies, timelines, resume/CV, hiring, location, or about the portfolio owner.";
    }

    if (currentSessionId) {
      logAction({
        sessionId: currentSessionId,
        userId: currentUserId,
        toolName: "get_faq_answer",
        input: { question },
        output: { matchedKey },
        success: true,
        durationMs: Date.now() - startTime,
      });
    }

    return answer!;
  },
});

// Tool: Submit Contact Request (Sensitive - includes guardrails)
export const submitContactTool = new DynamicStructuredTool({
  name: "submit_contact",
  description:
    "Submit a contact request or message. Use this when a user wants to get in touch, send a message, or inquire about services.",
  schema: z.object({
    name: z.string().describe("Name of the person contacting"),
    email: z.string().describe("Email address of the person"),
    message: z.string().describe("The message or inquiry"),
    subject: z.string().optional().describe("Subject of the message"),
  }),
  func: async ({
    name,
    email,
    message,
    subject,
  }: {
    name: string;
    email: string;
    message: string;
    subject?: string;
  }) => {
    const startTime = Date.now();

    // Validate input with guardrails
    const validation = guardrails.validateInput(message);
    if (validation.blocked) {
      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "submit_contact",
          input: { name, email, messageLength: message.length },
          output: null,
          success: false,
          error: `Blocked: ${validation.reason}`,
          durationMs: Date.now() - startTime,
        });
      }
      return "Sorry, your message could not be submitted. Please try rephrasing your message.";
    }

    // Rate limit check for contact submissions
    if (currentSessionId) {
      const rateCheck = guardrails.checkSensitiveRateLimit(
        currentSessionId,
        "submit_contact",
        3, // Max 3 contacts per session
        300000 // 5 minute window
      );

      if (!rateCheck.allowed) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "submit_contact",
          input: { name, email },
          output: null,
          success: false,
          error: "Rate limit exceeded",
          durationMs: Date.now() - startTime,
        });
        return "You've submitted multiple contact requests recently. Please wait a few minutes before trying again.";
      }
    }

    try {
      await Message.create({
        name,
        email,
        message: validation.sanitizedInput || message,
        subject: subject || "Contact from AI Agent",
        source: "ai-agent",
      });

      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "submit_contact",
          input: { name, email, messageLength: message.length },
          output: { success: true },
          success: true,
          durationMs: Date.now() - startTime,
        });
      }

      return `Thank you, ${name}! Your message has been submitted successfully. You'll receive a response at ${email} within 24-48 hours.`;
    } catch (error) {
      if (currentSessionId) {
        logAction({
          sessionId: currentSessionId,
          userId: currentUserId,
          toolName: "submit_contact",
          input: { name, email },
          output: null,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          durationMs: Date.now() - startTime,
        });
      }
      return "Sorry, there was an error submitting your message. Please try the contact form directly or email us.";
    }
  },
});

// Tool: Get Booking Info
export const getBookingInfoTool = new DynamicStructuredTool({
  name: "get_booking_info",
  description:
    "Get information about booking a consultation or service. Use this when users want to schedule a call or book services.",
  schema: z.object({
    type: z
      .enum(["consultation", "project", "general"])
      .optional()
      .describe("Type of booking inquiry"),
  }),
  func: async ({ type }: { type?: "consultation" | "project" | "general" }) => {
    const startTime = Date.now();

    const bookingInfo: Record<string, string> = {
      consultation:
        "For a consultation call, you can book a 30-minute discovery session. This helps us understand your project requirements and discuss potential solutions.",
      project:
        "To start a project, first book a consultation call. After discussing requirements, I'll provide a detailed proposal with timeline and pricing.",
      general:
        "I offer various booking options: 30-min discovery calls, 1-hour technical consultations, and project kickoff sessions. Visit the booking page to see available slots.",
    };

    const result =
      bookingInfo[type || "general"] +
      "\n\nTo proceed, please visit the booking section on the website or let me know your preferred date/time.";

    if (currentSessionId) {
      logAction({
        sessionId: currentSessionId,
        userId: currentUserId,
        toolName: "get_booking_info",
        input: { type },
        output: { infoType: type || "general" },
        success: true,
        durationMs: Date.now() - startTime,
      });
    }

    return result;
  },
});

// Export all tools as an array
export const agentTools = [
  searchSkillsTool,
  searchProjectsTool,
  searchBlogsTool,
  getFaqAnswerTool,
  submitContactTool,
  getBookingInfoTool,
];

export default agentTools;
