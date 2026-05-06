'use client';

import { cn } from "@/lib/utils";
import React from "react";
import { formatCasing, type CasingType } from "@/lib/casing";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  casing?: CasingType;
}

/**
 * PatureNews Typography Library - Vercel/Geist Professional Standards
 * Font Scale: Based on 4px baseline grid
 * Line Heights: Optimized for readability (1.5 for body, 1.1-1.25 for headings)
 * Letter Spacing: Negative tracking for large text, neutral for body
 */

export const TypographyH1 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h1
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-[-0.025em] text-primary antialiased text-balance",
      className
    )}
    style={{ fontSynthesis: 'none', textRendering: 'optimizeLegibility' }}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h1>
);

export const TypographyH2 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h2
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-2xl sm:text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-primary mt-10 mb-4 antialiased text-balance",
      className
    )}
    style={{ fontSynthesis: 'none', textRendering: 'optimizeLegibility' }}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h2>
);

export const TypographyH3 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h3
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-xl sm:text-2xl font-semibold leading-[1.25] tracking-[-0.015em] text-primary mt-8 mb-3 antialiased",
      className
    )}
    style={{ fontSynthesis: 'none', textRendering: 'optimizeLegibility' }}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h3>
);

export const TypographyH4 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h4
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-lg sm:text-xl font-semibold leading-[1.3] tracking-[-0.01em] text-primary mt-6 mb-2 antialiased",
      className
    )}
    style={{ fontSynthesis: 'none', textRendering: 'optimizeLegibility' }}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h4>
);

export const TypographyP = ({ children, className }: TypographyProps) => (
  <p
    className={cn(
      "font-body text-base sm:text-lg font-normal leading-relaxed text-foreground/85 max-w-prose mb-6 antialiased text-pretty",
      className
    )}
    style={{ fontSynthesis: 'none', textRendering: 'optimizeLegibility' }}
  >
    {children}
  </p>
);

export const TypographyBlockquote = ({ children, className }: TypographyProps) => (
  <blockquote
    className={cn(
      "my-8 border-l-2 border-primary/15 pl-6 text-lg font-normal italic text-foreground/70 font-body antialiased",
      className
    )}
    style={{ fontSynthesis: 'none' }}
  >
    {children}
  </blockquote>
);

export const TypographyList = ({ children, className }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2.5 font-body text-base sm:text-lg leading-relaxed mb-6 antialiased", className)} style={{ fontSynthesis: 'none' }}>
    {children}
  </ul>
);

export const TypographyInlineCode = ({ children, className }: TypographyProps) => (
  <code
    className={cn(
      "relative rounded-md bg-secondary px-1.5 py-0.5 font-mono text-sm font-normal text-primary",
      className
    )}
  >
    {children}
  </code>
);

export const TypographyLead = ({ children, className }: TypographyProps) => (
  <p className={cn("text-lg sm:text-xl font-normal text-muted-foreground font-body leading-relaxed mb-8 antialiased text-pretty", className)} style={{ fontSynthesis: 'none' }}>
    {children}
  </p>
);

export const TypographyLarge = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <div className={cn("text-lg font-medium font-body text-primary leading-snug antialiased", className)} style={{ fontSynthesis: 'none' }}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </div>
);

export const TypographySmall = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <small className={cn("text-sm font-normal leading-snug font-body antialiased", className)} style={{ fontSynthesis: 'none' }}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </small>
);

export const TypographyMuted = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <p className={cn("text-sm font-normal text-muted-foreground font-body leading-relaxed antialiased", className)} style={{ fontSynthesis: 'none' }}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </p>
);

/**
 * TypographyLabel - Form Label Standard
 * 14px, medium weight, proper spacing
 */
export const TypographyLabel = ({ children, className, casing = 'none' }: TypographyProps) => (
  <label
    className={cn(
      "block text-sm text-foreground font-body font-medium mb-2 antialiased cursor-text leading-none",
      className
    )}
    style={{ 
      fontFeatureSettings: '"liga" 1',
      fontSynthesis: 'none',
      textRendering: 'optimizeLegibility',
    }}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </label>
);

// Semantic Aliases
export const Title = TypographyH1;
export const Heading = ({ children, className, level = 2, casing = 'sentence' }: TypographyProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  const components = {
    1: TypographyH1,
    2: TypographyH2,
    3: TypographyH3,
    4: TypographyH4,
    5: TypographyLarge,
    6: TypographySmall,
  };
  const Component = (components[level] || TypographyH2) as any;
  return <Component className={className} casing={casing}>{children}</Component>;
};

export const BodyText = ({ children, className }: TypographyProps) => (
  <p className={cn("text-base font-normal leading-relaxed text-foreground/85 font-body antialiased text-pretty", className)} style={{ fontSynthesis: 'none' }}>
    {children}
  </p>
);

export const MutedText = TypographyMuted;
