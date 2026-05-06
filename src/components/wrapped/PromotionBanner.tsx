"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatCasing } from "@/lib/casing";

const benefits = [
  "Akses artikel eksklusif tanpa batas",
  "Simpan berita favorit di profil",
  "Diskusi komunitas aktif",
  "Notifikasi informasi paling relevan"
];

export const PromotionBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % benefits.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-[140px] sm:min-h-[64px] mb-10 rounded-xl overflow-hidden border border-primary/10 shadow-2xl shadow-primary/5 group">
      {/* Advanced Animated Background Layer */}
      <div className="absolute inset-0 overflow-hidden bg-white">
        {/* Dynamic Color Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1.2, 1],
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-blue-500/15 blur-[80px] rounded-full mix-blend-multiply"
        />
        <motion.div 
          animate={{ 
            scale: [1.3, 1, 1.5, 1.3],
            x: [0, -40, 30, 0],
            y: [0, 40, -20, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-[200%] bg-indigo-600/10 blur-[80px] rounded-full mix-blend-multiply"
        />

        {/* Moving Tech Pattern Layer */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{ 
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            color: '#000'
          }}
        />

        {/* Glass Surface */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 gap-6 py-6 sm:py-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 min-w-0 w-full sm:w-auto">
          <div className="hidden md:flex h-10 w-10 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 items-center justify-center text-primary shadow-sm shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 opacity-60" />
            </motion.div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-5 overflow-hidden text-center sm:text-left">
            <span className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.25em] whitespace-nowrap antialiased">
              {formatCasing("Keanggotaan", 'upper')}
            </span>
            <div className="h-7 flex items-center justify-center sm:justify-start overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-primary tracking-tight truncate leading-tight"
                >
                  {formatCasing(benefits[index], 'sentence')}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-5 sm:gap-8 w-full sm:w-auto border-t sm:border-none border-primary/5 pt-5 sm:pt-0">
          <Link href="/membership" className="group/link flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-primary/50 hover:text-primary transition-colors tracking-tight">
            <span className="relative">
              Pelajari selengkapnya
              <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-primary/30 origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300" />
            </span>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
          </Link>

          <Link href="/auth" className="shrink-0">
            <Button size="sm" className="h-10 sm:h-9 px-8 sm:px-10 rounded-full bg-primary text-white text-[10px] sm:text-[11px] font-bold tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all shadow-none gap-2.5 uppercase border-none">
              {formatCasing("Daftar", 'none')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
