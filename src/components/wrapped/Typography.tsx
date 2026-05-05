
import { cn } from "@/lib/utils";
import React from "react";

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TextProps) => (
  <h1 className={cn("text-4xl md:text-5xl font-headline font-bold text-primary", className)}>
    {children}
  </h1>
);

export const Heading = ({ children, className, level = 2 }: TextProps & { level?: 2 | 3 | 4 }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizes = {
    2: "text-2xl md:text-3xl",
    3: "text-xl md:text-2xl",
    4: "text-lg md:text-xl",
  };
  return (
    <Tag className={cn("font-headline font-semibold text-primary", sizes[level], className)}>
      {children}
    </Tag>
  );
};

export const BodyText = ({ children, className }: TextProps) => (
  <p className={cn("text-base leading-relaxed text-foreground/80 font-body", className)}>
    {children}
  </p>
);

export const TypographyP = ({ children, className }: TextProps) => (
  <p className={cn("leading-7 [&:not(:first-child)]:mt-6 font-normal text-foreground/90", className)}>
    {children}
  </p>
);

export const MutedText = ({ children, className }: TextProps) => (
  <span className={cn("text-sm text-muted-foreground font-body", className)}>
    {children}
  </span>
);
