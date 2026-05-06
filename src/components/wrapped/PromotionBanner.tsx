
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatCasing } from "@/lib/casing";

const benefits = [
  "Akses artikel eksklusif tanpa batas",
  "Simpan berita favorit di profil personal",
  "Bergabung dalam diskusi komunitas aktif",
  "Terima notifikasi informasi paling relevan"
];

export const PromotionBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-20 sm:h-16 mb-8 rounded-xl overflow-hidden border border-primary/5 shadow-sm group">
      {/* Animated Mesh Background - Pure Code */}
      <div className="absolute inset-0 bg-white opacity-90 z-0" />
      <div className="absolute inset-0 overflow-hidden z-[-1]">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-blue-400/20 blur-[60px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-[200%] bg-purple-400/20 blur-[60px] rounded-full"
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-orange-100/30 via-transparent to-teal-100/30"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-between px-6 gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden md:flex h-8 w-8 rounded-lg bg-primary/5 items-center justify-center text-primary/40">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 overflow-hidden">
            <span className="text-[11px] font-bold text-primary/40 uppercase tracking-widest whitespace-nowrap">
              {formatCasing("Privilese anggota:", 'upper')}
            </span>
            <div className="h-5 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(8px)", y: -10 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[13px] sm:text-[14px] font-medium text-primary/80 truncate"
                >
                  {formatCasing(benefits[index], 'sentence')}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Link href="/auth">
          <Button size="sm" className="h-9 px-6 rounded-full bg-primary text-white text-[11px] font-bold tracking-tight hover:scale-105 transition-all shadow-lg shadow-primary/10 gap-2 shrink-0">
            {formatCasing("Daftar sekarang", 'sentence')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
