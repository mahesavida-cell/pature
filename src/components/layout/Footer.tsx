"use client";

import Link from "next/link";
import Image from "next/image";
import { MutedText, Heading, BodyText } from "@/components/wrapped/Typography";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="bg-white/40 border-t mt-32 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-20">
          {/* Brand and Mission */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image 
                src="/pature_news.png" 
                alt="Pature News Logo" 
                width={160} 
                height={45} 
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm max-w-md leading-relaxed text-muted-foreground/60 font-medium">
              InfoFlow adalah platform media modern yang berfokus pada penyampaian informasi berkualitas dengan desain minimalis. Kami memprioritaskan kejernihan berita di atas segalanya untuk komunitas informasi global.
            </p>
            <div className="flex items-center gap-6 text-muted-foreground/40">
              {[
                { icon: <XIcon />, href: "#" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
                { icon: <Facebook className="h-5 w-5" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#" }
              ].map((social, idx) => (
                <Link key={idx} href={social.href} className="hover:text-primary transition-all transform hover:-translate-y-0.5">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links / Categories */}
          <div className="lg:col-span-2 space-y-6">
            <Heading level={4} className="text-xs font-bold opacity-40">Kategori</Heading>
            <ul className="space-y-2">
              {["Teknologi", "Desain digital", "Bisnis global", "Budaya modern", "Sains terkini"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all tracking-wide">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company / Support */}
          <div className="lg:col-span-2 space-y-6">
            <Heading level={4} className="text-xs font-bold opacity-40">Dukungan</Heading>
            <ul className="space-y-2">
              {["Tentang kami", "Kontak redaksi", "Karir", "Ketentuan", "Privasi"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all tracking-wide">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-6">
            <Heading level={4} className="text-xs font-bold opacity-40">Hubungi kami</Heading>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/80">redaksi@infoflow.com</span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground/40 font-medium italic">
                Punya saran atau pertanyaan? Tim redaksi kami siap mendengar aspirasi Anda.
              </p>
            </div>
          </div>
        </div>

        <Separator className="opacity-5 mx-auto" />
        
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <span className="text-[9px] font-bold text-muted-foreground/30 tracking-widest uppercase">
            © 2024 INFOFLOW MEDIA GROUP. SELURUH HAK CIPTA DILINDUNGI.
          </span>
          <div className="flex items-center gap-10">
            {["Aksesibilitas", "Peta situs"].map(link => (
              <Link key={link} href="#" className="text-[9px] font-bold text-muted-foreground/30 hover:text-primary transition-all uppercase tracking-widest">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};