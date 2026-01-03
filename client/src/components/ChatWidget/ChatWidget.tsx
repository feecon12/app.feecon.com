"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}

interface ChatWidgetProps {
  apiUrl?: string;
}

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
  : "https://app.feecon.co.in/api";

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiUrl = DEFAULT_API_URL,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load session from localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chat_session_id");
    if (savedSessionId) {
      setSessionId(savedSessionId);
      loadChatHistory(savedSessionId);
    }
  }, []);

  // Load chat history for existing session
  const loadChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`${apiUrl}/agent/history/${sid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.history) {
          setMessages(
            data.data.history.map((msg: any, idx: number) => ({
              id: `${sid}-${idx}`,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(),
            }))
          );
        }
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // Send message to agent
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      if (data.success) {
        // Save session ID
        if (data.data.sessionId && !sessionId) {
          setSessionId(data.data.sessionId);
          localStorage.setItem("chat_session_id", data.data.sessionId);
        }

        const assistantMessage: Message = {
          id: data.data.messageId || `assistant-${Date.now()}`,
          role: "assistant",
          content: data.data.response,
          timestamp: new Date(),
          toolsUsed: data.data.toolsUsed,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat session
  const clearChat = async () => {
    if (sessionId) {
      try {
        await fetch(`${apiUrl}/agent/session/${sessionId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to clear session:", err);
      }
    }
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem("chat_session_id");
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary dark:bg-primaryDark 
                   text-white dark:text-dark shadow-lg flex items-center justify-center
                   hover:scale-110 transition-transform duration-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="flex items-center gap-1"
            >
              {/* Chat Bubble Icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-120px)]
                       bg-light dark:bg-dark border border-dark/10 dark:border-light/10 
                       rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <ChatHeader onClear={clearChat} />

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-dark/50 dark:text-light/50 mt-8">
                  <p className="text-lg font-medium">
                    👋 Hi, I&apos;m Gugu AI!
                  </p>
                  <p className="text-sm mt-2">
                    Your intelligent assistant. Ask me about skills, projects,
                    or anything else!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isLoading && <TypingIndicator />}

              {error && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={sendMessage}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
