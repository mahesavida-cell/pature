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
 * PatureNews Typography Library (v3.0)
 * Integrated Tracking Handler: Standardizing character spacing for a high-end editorial feel.
 */

export const TypographyH1 = ({ children, className, id, casing = 'sentence' }: TypographyProps) => (
  <h1
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-4xl font-bold tracking-tight lg:text-6xl text-primary leading-[1.1]",
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
      "scroll-m-20 border-b border-primary/5 pb-2 font-headline text-3xl font-semibold tracking-tight first:mt-0 text-primary",
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
      "scroll-m-20 font-headline text-2xl font-semibold tracking-tight text-primary",
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
      "scroll-m-20 font-headline text-xl font-semibold tracking-tight text-primary",
      className
    )}
  >
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </h4>
);

export const TypographyP = ({ children, className }: TypographyProps) => (
  <p
    className={cn(
      "font-body text-[18px] leading-7 [&:not(:first-child)]:mt-6 text-foreground/85 max-w-[65ch] tracking-normal",
      className
    )}
  >
    {children}
  </p>
);

export const TypographyBlockquote = ({ children, className }: TypographyProps) => (
  <blockquote
    className={cn(
      "mt-6 border-l-4 border-primary/20 pl-6 italic text-xl text-foreground/70 font-body tracking-tight",
      className
    )}
  >
    {children}
  </blockquote>
);

export const TypographyList = ({ children, className }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2 font-body text-[18px] tracking-normal", className)}>
    {children}
  </ul>
);

export const TypographyInlineCode = ({ children, className }: TypographyProps) => (
  <code
    className={cn(
      "relative rounded bg-primary/5 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary tracking-tighter",
      className
    )}
  >
    {children}
  </code>
);

export const TypographyLead = ({ children, className }: TypographyProps) => (
  <p className={cn("text-xl text-muted-foreground font-body leading-relaxed tracking-tight", className)}>
    {children}
  </p>
);

export const TypographyLarge = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <div className={cn("text-lg font-semibold font-headline text-primary tracking-tight", className)}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </div>
);

export const TypographySmall = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <small className={cn("text-sm font-medium leading-none font-body tracking-tight", className)}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </small>
);

export const TypographyMuted = ({ children, className, casing = 'sentence' }: TypographyProps) => (
  <p className={cn("text-[10px] font-bold text-muted-foreground/60 tracking-wider font-body", className)}>
    {typeof children === 'string' ? formatCasing(children, casing) : children}
  </p>
);

// Backward compatibility aliases
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
  <p className={cn("text-base leading-relaxed text-foreground/70 font-body tracking-normal", className)}>
    {children}
  </p>
);

export const MutedText = TypographyMuted;
