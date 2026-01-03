import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import Skill from "../models/skillModel";
import Project from "../models/projectModel";
import Blog from "../models/blogModel";
import Message from "../models/messageModel";

/**
 * Agent Tools for the Website Agent
 * These tools allow the AI agent to interact with the website's data
 */

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
    try {
      const filter: Record<string, any> = {};
      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }

      const skills = await Skill.find(filter).limit(20);

      if (skills.length === 0) {
        return "No skills found matching the criteria.";
      }

      const skillsList = skills
        .map((s: any) => `- ${s.name}${s.category ? ` (${s.category})` : ""}`)
        .join("\n");

      return `Found ${skills.length} skills:\n${skillsList}`;
    } catch (error) {
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
  func: async ({ query, technology }: { query?: string; technology?: string }) => {
    try {
      const filter: Record<string, any> = {};
      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ];
      }

      const projects = await Project.find(filter).limit(10).sort("-createdAt");

      if (projects.length === 0) {
        return "No projects found matching the criteria.";
      }

      const projectsList = projects
        .map(
          (p: any) =>
            `- **${p.title}**: ${p.description?.substring(0, 100) || "No description"}...${p.projectUrl ? ` [View](${p.projectUrl})` : ""}`
        )
        .join("\n");

      return `Found ${projects.length} projects:\n${projectsList}`;
    } catch (error) {
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

      if (blogs.length === 0) {
        return "No blog posts found matching the criteria.";
      }

      const blogsList = blogs
        .map(
          (b: any) =>
            `- **${b.title}**: ${b.excerpt || b.content?.substring(0, 80) || ""}...`
        )
        .join("\n");

      return `Found ${blogs.length} blog posts:\n${blogsList}`;
    } catch (error) {
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
    };

    const questionLower = question.toLowerCase();

    // Find matching FAQ
    for (const [key, answer] of Object.entries(faqs)) {
      if (questionLower.includes(key)) {
        return answer;
      }
    }

    return "I don't have a specific FAQ answer for that. You can ask me about: contact info, services, experience, availability, pricing, technologies, or project timelines.";
  },
});

// Tool: Submit Contact Request
export const submitContactTool = new DynamicStructuredTool({
  name: "submit_contact",
  description:
    "Submit a contact request or message. Use this when a user wants to get in touch, send a message, or inquire about services.",
  schema: z.object({
    name: z.string().describe("Name of the person contacting"),
    email: z.string().email().describe("Email address"),
    message: z.string().describe("The message or inquiry"),
    subject: z.string().optional().describe("Subject of the message"),
  }),
  func: async ({ name, email, message, subject }: { name: string; email: string; message: string; subject?: string }) => {
    try {
      await Message.create({
        name,
        email,
        message,
        subject: subject || "Contact from AI Agent",
        source: "ai-agent",
      });

      return `Thank you, ${name}! Your message has been submitted successfully. You'll receive a response at ${email} within 24-48 hours.`;
    } catch (error) {
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
    const bookingInfo: Record<string, string> = {
      consultation:
        "For a consultation call, you can book a 30-minute discovery session. This helps us understand your project requirements and discuss potential solutions.",
      project:
        "To start a project, first book a consultation call. After discussing requirements, I'll provide a detailed proposal with timeline and pricing.",
      general:
        "I offer various booking options: 30-min discovery calls, 1-hour technical consultations, and project kickoff sessions. Visit the booking page to see available slots.",
    };

    return (
      bookingInfo[type || "general"] +
      "\n\nTo proceed, please visit the booking section on the website or let me know your preferred date/time."
    );
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
