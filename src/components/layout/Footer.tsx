"use client";

import Link from "next/link";
import Image from "next/image";
import { MutedText, Heading, BodyText } from "@/components/wrapped/Typography";
import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-white/50 border-t mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand and Mission */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image 
                src="/pature_news.png" 
                alt="Pature News Logo" 
                width={140} 
                height={40} 
                className="h-8 w-auto object-contain"
              />
            </Link>
            <BodyText className="text-sm max-w-sm leading-relaxed opacity-70 font-medium">
              InfoFlow adalah platform media modern yang berfokus pada penyampaian informasi berkualitas dengan desain minimalis. Kami memprioritaskan kejernihan berita di atas segalanya.
            </BodyText>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors"><XIcon /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Linkedin className="h-4 w-4" /></Link>
            </div>
          </div>

          {/* Quick Links / Categories */}
          <div className="lg:col-span-3 space-y-6">
            <Heading level={4} className="text-sm font-bold uppercase tracking-widest opacity-40">Kategori berita</Heading>
            <ul className="space-y-3">
              {["Teknologi", "Desain digital", "Bisnis global", "Budaya modern", "Sains terkini"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Support */}
          <div className="lg:col-span-3 space-y-6">
            <Heading level={4} className="text-sm font-bold uppercase tracking-widest opacity-40">Dukungan & legal</Heading>
            <ul className="space-y-3">
              {["Tentang kami", "Kontak redaksi", "Karir di InfoFlow", "Ketentuan penggunaan", "Kebijakan privasi"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="lg:col-span-2 space-y-6">
            <Heading level={4} className="text-sm font-bold uppercase tracking-widest opacity-40">Hubungi kami</Heading>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground">redaksi@infoflow.com</span>
              </div>
              <p className="text-[10px] leading-relaxed text-muted-foreground/60 font-medium">
                Punya saran atau pertanyaan? Tim kami siap membantu Anda kapan saja.
              </p>
            </div>
          </div>
        </div>

        <Separator className="opacity-40" />
        
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <MutedText className="text-[10px] font-bold opacity-40 tracking-wider">
            © 2024 INFOFLOW MEDIA GROUP. SELURUH HAK CIPTA DILINDUNGI.
          </MutedText>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-[9px] font-bold text-muted-foreground/50 hover:text-primary uppercase tracking-widest">Aksesibilitas</Link>
            <Link href="#" className="text-[9px] font-bold text-muted-foreground/50 hover:text-primary uppercase tracking-widest">Peta situs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
