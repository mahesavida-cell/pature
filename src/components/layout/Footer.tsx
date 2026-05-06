
"use client";

import Link from "next/link";
import Image from "next/image";
import { TypographyMuted, BodyText } from "@/components/wrapped/Typography";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCasing } from "@/lib/casing";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(CATEGORIES_QUERY).then((data) => {
      setCategories(data || []);
    });
  }, []);

  const supportLinks = [
    { name: "Tentang kami", href: "/about" },
    { name: "Kontak redaksi", href: "/contact" },
    { name: "Karir", href: "/careers" },
    { name: "Ketentuan", href: "/terms" },
    { name: "Privasi", href: "/privacy" }
  ];

  return (
    <footer className="border-t border-border bg-background mt-16 sm:mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Link href="/" className="inline-block transition-opacity hover:opacity-70">
              <Image src="/pature_news.png" alt="PatureNews Logo" width={140} height={40} className="h-7 w-auto object-contain" />
            </Link>
            <BodyText className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              PatureNews adalah platform media modern yang berfokus pada penyampaian informasi berkualitas dengan desain minimalis.
            </BodyText>
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: <XIcon />, href: "#", label: "Twitter" },
                { icon: <Instagram className="h-4 w-4" />, href: "#", label: "Instagram" },
                { icon: <Facebook className="h-4 w-4" />, href: "#", label: "Facebook" },
                { icon: <Linkedin className="h-4 w-4" />, href: "#", label: "LinkedIn" }
              ].map((social, idx) => (
                <Link 
                  key={idx} 
                  href={social.href} 
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-7 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-foreground">Kategori</h4>
              <ul className="flex flex-col gap-3">
                {categories.length > 0 ? categories.slice(0, 5).map((cat) => (
                  <li key={cat._id}>
                    <Link 
                      href={`/category/${cat.slug}`} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {formatCasing(cat.title, 'sentence')}
                    </Link>
                  </li>
                )) : (
                  <li className="text-sm text-muted-foreground">Memuat...</li>
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-foreground">Dukungan</h4>
              <ul className="flex flex-col gap-3">
                {supportLinks.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {formatCasing(item.name, 'sentence')}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h4 className="text-sm font-semibold text-foreground">Kontak</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">redaksi@paturenews.com</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tim redaksi kami siap mendengar aspirasi Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PatureNews. Seluruh hak cipta dilindungi.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Aksesibilitas
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Peta situs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
