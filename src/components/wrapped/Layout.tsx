'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PatureNews Layout Primitives - Vercel Standard
 * Container: max-width 1200px with consistent padding
 * Section: Vertical rhythm with proper spacing scale
 * Based on 8px grid system
 */

export const Container = ({ children, className }: LayoutProps) => (
  <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8", className)}>
    {children}
  </div>
);

export const Section = ({ children, className }: LayoutProps) => (
  <section className={cn("py-16 sm:py-20 lg:py-24", className)}>
    {children}
  </section>
);

export const Stack = ({ children, className, gap = 'md' }: LayoutProps & { gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' }) => {
  const gaps = {
    xs: "gap-1",   // 4px
    sm: "gap-3",   // 12px
    md: "gap-6",   // 24px
    lg: "gap-8",   // 32px
    xl: "gap-12",  // 48px
    '2xl': "gap-16", // 64px
  };
  return (
    <div className={cn("flex flex-col", gaps[gap], className)}>
      {children}
    </div>
  );
};

export const PageHeader = ({ title, description, className }: { title: string, description?: string, className?: string }) => (
  <div className={cn("mb-12 sm:mb-16 max-w-3xl", className)}>
    <h1 className="font-headline text-4xl sm:text-5xl font-semibold tracking-[-0.025em] text-primary leading-[1.1] text-balance">
      {title}
    </h1>
    {description && (
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground font-body leading-relaxed text-pretty">
        {description}
      </p>
    )}
  </div>
);
