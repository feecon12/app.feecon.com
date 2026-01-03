"use client";

import { motion } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  // Simple markdown-like rendering for bold and links
  const renderContent = (content: string) => {
    // Convert **bold** to <strong>
    let rendered = content.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );

    // Convert [text](url) to links
    rendered = rendered.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary dark:text-primaryDark underline">$1</a>'
    );

    // Convert newlines to <br>
    rendered = rendered.replace(/\n/g, "<br>");

    return rendered;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-primary dark:bg-primaryDark text-white dark:text-dark rounded-br-md"
            : "bg-dark/5 dark:bg-light/10 text-dark dark:text-light rounded-bl-md"
        }`}
      >
        <div
          className="text-sm leading-relaxed whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: renderContent(message.content) }}
        />

        {/* Show tools used (for debugging/transparency) */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-60">
            🔧 Used: {message.toolsUsed.join(", ")}
          </div>
        )}

        <div
          className={`text-[10px] mt-1 opacity-50 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
