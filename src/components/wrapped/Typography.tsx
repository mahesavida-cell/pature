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
 * PatureNews Typography Library (Professional Reference System)
 * Optimized for hierarchy, rhythm, and clarity.
 */

export const TypographyH1 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h1
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-3xl md:text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-primary",
      className
    )}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h1>
);

export const TypographyH2 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h2
    id={id}
    className={cn(
      "scroll-m-20 font-body text-2xl font-semibold leading-[1.25] tracking-[-0.01em] text-primary mt-8 mb-3",
      className
    )}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h2>
);

export const TypographyH3 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h3
    id={id}
    className={cn(
      "scroll-m-20 font-body text-xl font-semibold leading-[1.35] tracking-[-0.01em] text-primary mt-6 mb-2",
      className
    )}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h3>
);

export const TypographyH4 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h4
    id={id}
    className={cn(
      "scroll-m-20 font-body text-lg font-semibold leading-[1.4] tracking-[-0.01em] text-primary mt-4 mb-2",
      className
    )}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h4>
);

export const TypographyP = ({ children, className }: TypographyProps) => (
  <p
    className={cn(
      "font-body text-[18px] font-normal leading-[1.75] tracking-[0.01em] text-foreground/90 max-w-[65ch] mb-5",
      className
    )}
  >
    {children}
  </p>
);

export const TypographyBlockquote = ({ children, className }: TypographyProps) => (
  <blockquote
    className={cn(
      "mt-6 border-l-2 border-primary/20 pl-6 italic text-xl font-light text-foreground/70 font-body tracking-normal mb-6",
      className
    )}
  >
    {children}
  </blockquote>
);

export const TypographyList = ({ children, className }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2 font-body font-normal text-[18px] leading-[1.75] tracking-normal mb-6", className)}>
    {children}
  </ul>
);

export const TypographyInlineCode = ({ children, className }: TypographyProps) => (
  <code
    className={cn(
      "relative rounded bg-secondary px-[0.3rem] py-[0.2rem] font-mono text-sm font-normal text-primary tracking-tight",
      className
    )}
  >
    {children}
  </code>
);

export const TypographyLead = ({ children, className }: TypographyProps) => (
  <p className={cn("text-xl font-normal text-muted-foreground font-body leading-relaxed tracking-tight mb-8", className)}>
    {children}
  </p>
);

export const TypographyLarge = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <div className={cn("text-lg font-semibold font-body text-primary tracking-[-0.01em] leading-normal", className)}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </div>
);

export const TypographySmall = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <small className={cn("text-sm font-normal leading-normal font-body tracking-normal", className)}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </small>
);

export const TypographyMuted = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <p className={cn("text-sm font-normal text-muted-foreground tracking-wide font-body leading-relaxed", className)}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </p>
);

// Semantic Alises
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
  <p className={cn("text-base font-normal leading-relaxed text-foreground/80 font-body tracking-normal", className)}>
    {children}
  </p>
);

export const MutedText = TypographyMuted;
