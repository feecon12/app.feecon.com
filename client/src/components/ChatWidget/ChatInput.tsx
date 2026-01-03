"use client";

import { motion } from "framer-motion";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  disabled,
}) => {
  return (
    <div className="p-4 border-t border-dark/10 dark:border-light/10 bg-light dark:bg-dark">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-4 py-2.5 rounded-full bg-dark/5 dark:bg-light/10 
                     text-dark dark:text-light placeholder:text-dark/40 dark:placeholder:text-light/40
                     outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primaryDark
                     transition-all duration-200 text-sm disabled:opacity-50"
          aria-label="Chat message input"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="w-10 h-10 rounded-full bg-primary dark:bg-primaryDark 
                     text-white dark:text-dark flex items-center justify-center
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity duration-200"
          aria-label="Send message"
        >
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </motion.button>
      </div>
      <p className="text-[10px] text-center mt-2 text-dark/40 dark:text-light/40">
        Press Enter to send • Shift+Enter for new line
      </p>
    </div>
  );
};

export default ChatInput;
