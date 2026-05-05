"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card as BaseCard, CardContent, CardHeader } from "@/components/ui/card";

interface WrappedCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

/**
 * A professional card wrapper with an outline style.
 * Uses a clear border and subtle backdrop blur to achieve a minimalist look.
 */
export const Card = ({ children, className, animate = true }: WrappedCardProps) => {
  const content = (
    <BaseCard className={cn(
      "overflow-hidden border-2 border-primary/5 shadow-none bg-background/20 backdrop-blur-sm hover:border-primary/10 transition-all duration-300 rounded-lg", 
      className
    )}>
      {children}
    </BaseCard>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
};

export { CardHeader, CardContent };
