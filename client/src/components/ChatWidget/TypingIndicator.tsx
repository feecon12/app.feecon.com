"use client";

import { motion } from "framer-motion";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-dark/5 dark:bg-light/10 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-dark/40 dark:bg-light/40 rounded-full"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
