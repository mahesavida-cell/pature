
import { cn } from "@/lib/utils";
import React from "react";

interface TextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Hero Title: Digunakan untuk berita utama atau headline halaman.
 * Ukuran: 32px (mobile) hingga 60px (desktop)
 */
export const Title = ({ children, className }: TextProps) => (
  <h1 className={cn(
    "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-primary",
    "tracking-[-0.02em] leading-[1.15]",
    className
  )}>
    {children}
  </h1>
);

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Headings: Digunakan untuk sub-judul dalam konten.
 * Menggunakan skala editorial yang konsisten.
 */
export const Heading = ({ children, className, level = 2 }: TextProps & { level?: HeadingLevel }) => {
  const Tag = `h${level}` as any;
  const sizes: Record<HeadingLevel, string> = {
    1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.2]",
    2: "text-2xl md:text-3xl lg:text-4xl tracking-tight leading-[1.25]",
    3: "text-xl md:text-2xl tracking-tight leading-[1.3]",
    4: "text-lg md:text-xl tracking-tight leading-[1.3]",
    5: "text-base md:text-lg tracking-tight leading-[1.4]",
    6: "text-sm md:text-base tracking-tight leading-[1.4]",
  };
  return (
    <Tag className={cn("font-headline font-bold text-primary", sizes[level], className)}>
      {children}
    </Tag>
  );
};

/**
 * UI Body Text: Digunakan untuk elemen UI umum, navigasi, dan deskripsi pendek.
 * Ukuran: 16px (1rem)
 */
export const BodyText = ({ children, className }: TextProps) => (
  <p className={cn(
    "text-base leading-relaxed text-foreground/70 font-body font-medium",
    className
  )}>
    {children}
  </p>
);

/**
 * Editorial Article Text: Digunakan khusus untuk paragraf berita yang panjang.
 * Ukuran: 18px (1.125rem)
 * Line Height: 1.7 untuk kenyamanan baca maksimal.
 * Width: Dibatasi maksimal 65 karakter per baris.
 */
export const TypographyP = ({ children, className }: TextProps) => (
  <p className={cn(
    "text-[18px] leading-[1.75] text-foreground/85 font-normal",
    "max-w-[65ch] [&:not(:first-child)]:mt-6",
    className
  )}>
    {children}
  </p>
);

/**
 * Meta/Muted Text: Digunakan untuk tanggal, kategori, atau informasi sekunder.
 * Ukuran: 12-14px
 * Letter Spacing: Sedikit renggang untuk kejelasan di ukuran kecil.
 */
export const MutedText = ({ children, className }: TextProps) => (
  <span className={cn(
    "text-xs md:text-sm font-body font-bold text-muted-foreground/60 uppercase tracking-[0.02em]",
    className
  )}>
    {children}
  </span>
);
