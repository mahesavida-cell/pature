
'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PatureNews Layout Primitives
 * Library internal untuk standarisasi layout dan spacing.
 */

// Container: Memastikan penyelarasan horizontal yang konsisten di seluruh app.
export const Container = ({ children, className }: LayoutProps) => (
  <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full", className)}>
    {children}
  </div>
);

// Section: Standarisasi jarak vertikal antar blok konten.
export const Section = ({ children, className }: LayoutProps) => (
  <section className={cn("py-12 md:py-16 lg:py-20", className)}>
    {children}
  </section>
);

// Stack: Untuk vertical spacing yang konsisten antar elemen.
export const Stack = ({ children, className }: LayoutProps & { space?: 'sm' | 'md' | 'lg' }) => {
  const spaces = {
    sm: "space-y-4",
    md: "space-y-8",
    lg: "space-y-12",
  };
  return (
    <div className={cn(spaces[className as keyof typeof spaces] || "space-y-6", className)}>
      {children}
    </div>
  );
};

// PageHeader: Header khusus untuk halaman statis atau arsip.
export const PageHeader = ({ title, description, className }: { title: string, description?: string, className?: string }) => (
  <div className={cn("mb-12 md:mb-16 space-y-4 max-w-3xl", className)}>
    <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
      {title}
    </h1>
    {description && (
      <p className="text-xl text-muted-foreground font-body leading-relaxed">
        {description}
      </p>
    )}
  </div>
);
