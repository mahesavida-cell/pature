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
 * Professional Card - Vercel Standard
 * Border: 1px subtle border
 * Radius: 8px (md)
 * Hover: Subtle border darkening
 */
export const Card = ({ children, className, animate = true }: WrappedCardProps) => {
  const content = (
    <BaseCard className={cn(
      "overflow-hidden border border-border bg-card hover:border-border/80 transition-colors duration-200 rounded-lg", 
      className
    )}>
      {children}
    </BaseCard>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
};

export { CardHeader, CardContent };
