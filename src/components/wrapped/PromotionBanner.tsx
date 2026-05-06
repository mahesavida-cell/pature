"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
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
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-28 sm:h-16 mb-10 rounded-xl overflow-hidden border border-primary/10 shadow-2xl shadow-primary/5 group">
      {/* Advanced Animated Background Layer - Pure Code */}
      <div className="absolute inset-0 overflow-hidden bg-white">
        {/* Dynamic Color Blobs - Intensified */}
        <motion.div 
          animate={{ 
            scale: [1, 1.6, 1.3, 1],
            x: [0, 80, -40, 0],
            y: [0, -50, 30, 0],
            rotate: [0, 120, 240, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-blue-500/25 blur-[100px] rounded-full mix-blend-multiply"
        />
        <motion.div 
          animate={{ 
            scale: [1.4, 1, 1.7, 1.4],
            x: [0, -90, 50, 0],
            y: [0, 70, -40, 0],
            rotate: [360, 240, 120, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/4 w-full h-[200%] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-multiply"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1.5, 1, 1.2],
            x: [0, 40, -60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-1/4 w-full h-full bg-rose-400/15 blur-[120px] rounded-full mix-blend-screen"
        />

        {/* Moving Tech Pattern Layer */}
        <motion.div 
          animate={{ 
            backgroundPosition: ["0px 0px", "60px 60px"] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.08]"
          style={{ 
            backgroundImage: `radial-gradient(circle, currentColor 1.2px, transparent 1.2px)`,
            backgroundSize: '30px 30px',
            color: '#000'
          }}
        />

        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Soft Glass Surface */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 h-full flex flex-col sm:flex-row items-center justify-between px-8 gap-4 py-3 sm:py-0">
        <div className="flex items-center gap-5 min-w-0">
          <div className="hidden md:flex h-10 w-10 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 items-center justify-center text-primary shadow-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 opacity-70" />
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 overflow-hidden">
            <span className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.3em] whitespace-nowrap antialiased">
              {formatCasing("Keanggotaan", 'upper')}
            </span>
            <div className="h-6 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(12px)", y: 15 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(12px)", y: -15 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[14px] sm:text-[15px] font-medium text-primary tracking-tight truncate leading-none"
                >
                  {formatCasing(benefits[index], 'sentence')}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/membership" className="group/link flex items-center gap-1.5 text-[11px] font-bold text-primary/60 hover:text-primary transition-colors tracking-tight">
            <span>Pelajari selengkapnya</span>
            <div className="relative overflow-hidden">
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left duration-300" />
            </div>
          </Link>

          <Link href="/auth">
            <Button size="sm" className="h-10 px-10 rounded-full bg-primary text-white text-[11px] font-bold tracking-widest hover:scale-[1.03] active:scale-[0.98] transition-all shadow-none gap-3 shrink-0 uppercase border-none">
              {formatCasing("Daftar sekarang", 'none')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};