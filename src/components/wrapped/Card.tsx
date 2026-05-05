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
 * A professional card wrapper that adds a backdrop blur and a soft border.
 * This approach keeps the original ShadCN component intact while adding
 * a sophisticated glassmorphism layer.
 */
export const Card = ({ children, className, animate = true }: WrappedCardProps) => {
  const content = (
    <BaseCard className={cn(
      "overflow-hidden border border-white/20 shadow-sm bg-white/40 backdrop-blur-md hover:shadow-md transition-all duration-300 rounded-lg", 
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
