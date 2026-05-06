'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PatureNews Layout Primitives (Design System Compliant)
 * Standardized spacing based on the 4px baseline.
 */

export const Container = ({ children, className }: LayoutProps) => (
  <div className={cn("mx-auto max-w-[1200px] px-6 lg:px-8 w-full", className)}>
    {children}
  </div>
);

export const Section = ({ children, className }: LayoutProps) => (
  <section className={cn("py-12 md:py-16 lg:py-24", className)}>
    {children}
  </section>
);

export const Stack = ({ children, className, space = 'md' }: LayoutProps & { space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) => {
  const spaces = {
    xs: "space-y-1", // 4px
    sm: "space-y-4", // 16px
    md: "space-y-6", // 24px
    lg: "space-y-10", // 40px
    xl: "space-y-16", // 64px
  };
  return (
    <div className={cn(spaces[space], className)}>
      {children}
    </div>
  );
};

export const PageHeader = ({ title, description, className }: { title: string, description?: string, className?: string }) => (
  <div className={cn("mb-12 md:mb-16 space-y-4 max-w-3xl", className)}>
    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-primary leading-[1.15]">
      {title}
    </h1>
    {description && (
      <p className="text-xl text-muted-foreground font-body leading-relaxed tracking-tight">
        {description}
      </p>
    )}
  </div>
);
