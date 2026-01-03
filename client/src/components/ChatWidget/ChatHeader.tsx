"use client";

interface ChatHeaderProps {
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear }) => {
  return (
    <div className="px-4 py-3 bg-primary dark:bg-primaryDark text-white dark:text-dark flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-dark/20 flex items-center justify-center">
          {/* AI Brain Icon */}
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2m-4 9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1m8 0a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1m-4 0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Gugu AI</h3>
          <p className="text-[10px] opacity-80">Your intelligent assistant</p>
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
