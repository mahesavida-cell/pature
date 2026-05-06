import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * PatureNews Typography Library
 * Pustaka komponen terpusat untuk konsistensi tipografi editorial.
 * Didesain stabil untuk mencegah hydration mismatch.
 */

export const TypographyH1 = ({ children, className, id }: TypographyProps) => (
  <h1
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-4xl font-bold tracking-tight lg:text-6xl text-primary leading-[1.1]",
      className
    )}
  >
    {children}
  </h1>
);

export const TypographyH2 = ({ children, className, id }: TypographyProps) => (
  <h2
    id={id}
    className={cn(
      "scroll-m-20 border-b border-primary/5 pb-2 font-headline text-3xl font-semibold tracking-tight first:mt-0 text-primary",
      className
    )}
  >
    {children}
  </h2>
);

export const TypographyH3 = ({ children, className, id }: TypographyProps) => (
  <h3
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-2xl font-semibold tracking-tight text-primary",
      className
    )}
  >
    {children}
  </h3>
);

export const TypographyH4 = ({ children, className, id }: TypographyProps) => (
  <h4
    id={id}
    className={cn(
      "scroll-m-20 font-headline text-xl font-semibold tracking-tight text-primary",
      className
    )}
  >
    {children}
  </h4>
);

export const TypographyP = ({ children, className }: TypographyProps) => (
  <p
    className={cn(
      "font-body text-[18px] leading-7 [&:not(:first-child)]:mt-6 text-foreground/85 max-w-[65ch]",
      className
    )}
  >
    {children}
  </p>
);

export const TypographyBlockquote = ({ children, className }: TypographyProps) => (
  <blockquote
    className={cn(
      "mt-6 border-l-4 border-primary/20 pl-6 italic text-xl text-foreground/70 font-body",
      className
    )}
  >
    {children}
  </blockquote>
);

export const TypographyList = ({ children, className }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2 font-body text-[18px]", className)}>
    {children}
  </ul>
);

export const TypographyInlineCode = ({ children, className }: TypographyProps) => (
  <code
    className={cn(
      "relative rounded bg-primary/5 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary",
      className
    )}
  >
    {children}
  </code>
);

export const TypographyLead = ({ children, className }: TypographyProps) => (
  <p className={cn("text-xl text-muted-foreground font-body leading-relaxed", className)}>
    {children}
  </p>
);

export const TypographyLarge = ({ children, className }: TypographyProps) => (
  <div className={cn("text-lg font-semibold font-headline text-primary", className)}>
    {children}
  </div>
);

export const TypographySmall = ({ children, className }: TypographyProps) => (
  <small className={cn("text-sm font-medium leading-none font-body", className)}>
    {children}
  </small>
);

export const TypographyMuted = ({ children, className }: TypographyProps) => (
  <p className={cn("text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.05em] font-body", className)}>
    {children}
  </p>
);

// Backward compatibility aliases for existing components
export const Title = TypographyH1;

export const Heading = ({ children, className, level = 2 }: TypographyProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  const components = {
    1: TypographyH1,
    2: TypographyH2,
    3: TypographyH3,
    4: TypographyH4,
    5: TypographyLarge,
    6: TypographySmall,
  };
  const Component = components[level] || TypographyH2;
  return <Component className={className}>{children}</Component>;
};

export const BodyText = ({ children, className }: TypographyProps) => (
  <p className={cn("text-base leading-relaxed text-foreground/70 font-body", className)}>
    {children}
  </p>
);

export const MutedText = TypographyMuted;
