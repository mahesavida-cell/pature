
import { cn } from "@/lib/utils";
import React from "react";

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TextProps) => (
  <h1 className={cn("text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary tracking-tighter leading-[1.1]", className)}>
    {children}
  </h1>
);

export const Heading = ({ children, className, level = 2 }: TextProps & { level?: 2 | 3 | 4 }) => {
  const Tag = `h${level}` as "h2" | "h3" | "h4";
  const sizes = {
    2: "text-2xl md:text-3xl lg:text-4xl tracking-tight",
    3: "text-xl md:text-2xl tracking-tight",
    4: "text-lg md:text-xl tracking-tight",
  };
  return (
    <Tag className={cn("font-headline font-bold text-primary", sizes[level], className)}>
      {children}
    </Tag>
  );
};

export const BodyText = ({ children, className }: TextProps) => (
  <p className={cn("text-base md:text-lg leading-relaxed text-foreground/70 font-body font-medium", className)}>
    {children}
  </p>
);

export const TypographyP = ({ children, className }: TextProps) => (
  <p className={cn("leading-relaxed [&:not(:first-child)]:mt-6 font-normal text-foreground/80 text-lg", className)}>
    {children}
  </p>
);

export const MutedText = ({ children, className }: TextProps) => (
  <span className={cn("text-sm text-muted-foreground/60 font-body font-medium tracking-wide", className)}>
    {children}
  </span>
);
