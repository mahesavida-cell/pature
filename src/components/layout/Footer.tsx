"use client";

import Link from "next/link";
import Image from "next/image";
import { TypographyMuted, BodyText } from "@/components/wrapped/Typography";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCasing } from "@/lib/casing";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer = () => {
  const supportLinks = [
    { name: "Tentang kami", href: "/about" },
    { name: "Kontak redaksi", href: "/contact" },
    { name: "Karir", href: "/careers" },
    { name: "Ketentuan", href: "/terms" },
    { name: "Privasi", href: "/privacy" }
  ];

  return (
    <footer className="bg-white/40 border-t mt-20 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-20">
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image src="/pature_news.png" alt="PatureNews Logo" width={160} height={45} className="h-9 w-auto object-contain" />
            </Link>
            <BodyText className="text-sm max-w-md mt-2 leading-relaxed tracking-normal">
              PatureNews adalah platform media modern yang berfokus pada penyampaian informasi berkualitas dengan desain minimalis. Kami memprioritaskan kejernihan berita di atas segalanya untuk komunitas informasi global.
            </BodyText>
            <div className="flex items-center gap-6 text-muted-foreground/40 pt-4">
              {[
                { icon: <XIcon />, href: "#" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
                { icon: <Facebook className="h-5 w-5" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#" }
              ].map((social, idx) => (
                <Link key={idx} href={social.href} className="hover:text-primary transition-all transform hover:-translate-y-0.5">{social.icon}</Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <TypographyMuted casing="upper">Kategori</TypographyMuted>
            <ul className="space-y-2">
              {["Teknologi", "Desain digital", "Bisnis global", "Budaya modern", "Sains terkini"].map((item) => (
                <li key={item}><Link href="#" className="text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all tracking-tighter">{formatCasing(item, 'sentence')}</Link></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <TypographyMuted casing="upper">Dukungan</TypographyMuted>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item.name}><Link href={item.href} className="text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all tracking-tighter">{formatCasing(item.name, 'sentence')}</Link></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3 space-y-6">
            <TypographyMuted casing="upper">Hubungi kami</TypographyMuted>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/80 tracking-tight">redaksi@paturenews.com</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground/40 font-medium italic tracking-wide">Punya saran atau pertanyaan? Tim redaksi kami siap mendengar aspirasi Anda.</p>
            </div>
          </div>
        </div>
        <Separator className="opacity-5 mx-auto" />
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <span className="text-[10px] font-bold text-muted-foreground/40 tracking-wider">© 2024 PatureNews Media Group. Seluruh hak cipta dilindungi.</span>
          <div className="flex items-center gap-10">
            <Link href="/terms" className="text-[10px] font-bold text-muted-foreground/40 hover:text-primary transition-all tracking-widest uppercase">Aksesibilitas</Link>
            <Link href="#" className="text-[10px] font-bold text-muted-foreground/40 hover:text-primary transition-all tracking-widest uppercase">Peta situs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
