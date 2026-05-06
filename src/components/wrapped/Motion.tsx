
'use client';

import { motion } from "framer-motion";
import React from "react";

interface MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * PatureNews Motion Library
 * Preset animasi untuk memberikan kesan "premium" dan "smooth".
 */

export const FadeIn = ({ children, delay = 0, className }: MotionProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Reveal = ({ children, delay = 0, className }: MotionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const RevealGroup = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const RevealItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0 },
    }}
  >
    {children}
  </motion.div>
);
