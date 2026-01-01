import { Request, Response } from "express";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface GenerateRequest {
  prompt: string;
  temperature?: number | string;
  tone?: string;
  maxTokens?: number | string;
  model?: string;
}

//Generate AI response handler
const groqHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("[groqHandler] body:", req.body);
    }

    const {
      prompt,
      temperature,
      tone = "neutral",
      maxTokens,
      model = "llama3-8b-8192",
    }: GenerateRequest = req.body;

    //validation
    if (!prompt || prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: "Prompt is required and cannot be empty.",
      });
      return;
    }

    // Validate API key presence
    if (!process.env.GROQ_API_KEY) {
      res.status(400).json({
        success: false,
        message: "GROQ_API_KEY is not configured on the server",
      });
      return;
    }

    // Coerce numeric inputs that may arrive as strings
    const tempNum =
      typeof temperature === "string"
        ? Number(temperature)
        : temperature ?? 0.7;
    const maxTokNum =
      typeof maxTokens === "string" ? Number(maxTokens) : maxTokens ?? 1024;

    //validate temperature range
    if (!Number.isFinite(tempNum) || tempNum < 0 || tempNum > 2) {
      res.status(400).json({
        success: false,
        message: "Temperature must be a number between 0 and 2",
      });
      return;
    }

    // validate max tokens
    if (!Number.isFinite(maxTokNum) || maxTokNum <= 0) {
      res.status(400).json({
        success: false,
        message: "maxTokens must be a positive number",
      });
      return;
    }

    //contruct system message based on tone
    const systemMessage = getSystemMessage(tone);

    //call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: model,
      temperature: tempNum,
      max_tokens: maxTokNum,
      top_p: 1,
      stream: false,
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;

    if (!generatedText) {
      res.status(500).json({
        success: false,
        message: "Failed to generate response",
      });
      return;
    }

    //success response
    res.status(201).json({
      success: true,
      message: "Response generated successfully",
      data: {
        response: generatedText,
        metadata: {
          model: model,
          temperature: tempNum,
          tone: tone,
          tokensUsed: chatCompletion.usage?.total_tokens || 0,
          promptTokens: chatCompletion.usage?.prompt_tokens || 0,
          completionTokens: chatCompletion.usage?.completion_tokens || 0,
        },
      },
    });
  } catch (err: any) {
    console.error("Error in groqHandler:", err);

    //handle specific Groq API errors
    if (err.status === 401) {
      res.status(401).json({
        success: false,
        message: "Invalid API Key",
      });
      return;
    }

    if (err.status == 429) {
      res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again later.",
      });
      return;
    }

    if (err.status == 400) {
      res.status(400).json({
        success: false,
        message: "Invalid request parameters",
        error: err.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};

//Helper function to get system message based on tone
const getSystemMessage = (tone: string): string => {
  const toneMessages: { [key: string]: string } = {
    neutral:
      "You are a helpful AI assistant. Provide clear, accurate, and informative responses.",
    friendly:
      "You are a friendly and enthusiastic AI assistant. Be warm, approachable, and use a conversational tone.",
    professional:
      "You are a professional AI assistant. Provide formal, well-structured, and business-appropriate responses.",
    creative:
      "You are a creative AI assistant. Think outside the box and provide innovative, imaginative responses.",
    casual:
      "You are a casual AI assistant. Use a relaxed, informal tone like you're talking to a friend.",
    technical:
      "You are a technical AI assistant. Provide detailed, precise, and technically accurate responses.",
    humorous:
      "You are a witty AI assistant. Add appropriate humor and wit to your responses while staying helpful.",
  };
  return toneMessages[tone.toLowerCase()] || toneMessages.neutral;
};

export { groqHandler };
