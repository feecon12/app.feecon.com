// @ts-nocheck
import { motion } from "framer-motion";
import React from "react";

const TransitionEffect: React.FC = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <motion.div
          className="h-full bg-primary"
          initial={{ x: "0%", width: "0%" }}
          animate={{ x: "100%", width: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <motion.div
          className="h-full bg-light"
          initial={{ x: "0%", width: "0%" }}
          animate={{ x: "100%", width: "100%" }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <motion.div
          className="h-full bg-dark"
          initial={{ x: "0%", width: "0%" }}
          animate={{ x: "100%", width: "100%" }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </>
  );
};

export default TransitionEffect;
