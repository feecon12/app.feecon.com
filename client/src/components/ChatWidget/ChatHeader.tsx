"use client";

interface ChatHeaderProps {
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear }) => {
  return (
    <div className="px-4 py-3 bg-primary dark:bg-primaryDark text-white dark:text-dark flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-dark/20 flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <h3 className="font-semibold text-sm">AI Assistant</h3>
          <p className="text-[10px] opacity-80">Always here to help</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="p-2 hover:bg-white/10 dark:hover:bg-dark/10 rounded-full transition-colors"
          aria-label="Clear chat"
          title="Clear chat"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
