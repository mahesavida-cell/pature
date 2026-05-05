
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card as BaseCard, CardContent, CardHeader } from "@/components/ui/card";

interface WrappedCardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const Card = ({ children, className, animate = true }: WrappedCardProps) => {
  const content = (
    <BaseCard className={cn("overflow-hidden border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300 rounded-xl", className)}>
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
