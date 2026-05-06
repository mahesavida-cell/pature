
"use client";

import { Container, Section } from "@/components/wrapped/Layout";
import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyLead, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/wrapped/Card";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Globe, MessageSquare, Bookmark, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MembershipPage() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Akses tanpa batas",
      desc: "Nikmati seluruh arsip berita, laporan mendalam, dan esei eksklusif tanpa batasan paywall harian.",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: <Bookmark className="h-6 w-6" />,
      title: "Arsip personal",
      desc: "Simpan dan organisasikan berita yang penting bagi anda langsung ke profil untuk referensi di masa depan.",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Diskusi cerdas",
      desc: "Bergabunglah dalam ruang komentar moderasi yang mengutamakan wawasan berkualitas daripada kebisingan.",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Prioritas informasi",
      desc: "Dapatkan pemberitahuan seketika untuk topik yang paling relevan dengan minat profesional anda.",
      color: "bg-green-500/10 text-green-600"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Optimized Atmospheric Background */}
      <div className="fixed inset-0 -z-10 bg-white">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute inset-0 overflow-hidden"
        >
          {/* Simplified Dynamic Blobs for Performance */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-full h-full bg-indigo-50/40 blur-[80px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              x: [0, -30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-1/4 w-full h-full bg-rose-50/30 blur-[80px] rounded-full"
          />
          
          <div className="absolute inset-0 opacity-[0.02]" style={{ 
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
        </motion.div>
      </div>

      <Container className="pt-8 pb-32">
        {/* Hero Section - Elevated for immediate visibility */}
        <Section className="text-center space-y-6 max-w-4xl mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase mb-4">
              <Sparkles className="h-3 w-3" />
              Paturenews premium
            </div>
            <TypographyH1 className="text-5xl md:text-7xl leading-[1.05] tracking-tighter">
              Kejernihan informasi untuk masa depan anda.
            </TypographyH1>
            <TypographyLead className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto">
              Beralihlah ke pengalaman membaca yang lebih dalam, terkurasi, dan tanpa distraksi.
            </TypographyLead>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link href="/auth">
              <Button size="lg" className="h-14 px-12 rounded-full bg-primary text-white text-sm font-bold tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 uppercase shadow-none">
                Mulai berlangganan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" className="h-14 px-10 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary/5">
              Lihat penawaran tim
            </Button>
          </motion.div>
        </Section>

        {/* Feature Grid - Optimized Motion */}
        <Section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <div className="group relative overflow-hidden bg-white/50 backdrop-blur-md border border-primary/5 rounded-2xl hover:border-primary/20 transition-all duration-400 h-full">
                  <CardContent className="p-10 space-y-6">
                    <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                    <div className="space-y-3">
                      <TypographyH3 className="text-2xl m-0">{feature.title}</TypographyH3>
                      <TypographyP className="text-foreground/70 leading-relaxed m-0 text-base">
                        {feature.desc}
                      </TypographyP>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Selengkapnya <ArrowRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 transition-transform duration-700 group-hover:scale-[1.8] group-hover:rotate-0">
                    {feature.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Deep Dive Section - Optimized Visuals */}
        <Section className="py-24 bg-primary text-white rounded-[40px] overflow-hidden relative shadow-none">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 p-12 md:p-20 items-center">
            <div className="lg:col-span-6 space-y-8">
              <div className="h-1 w-20 bg-white/20" />
              <TypographyH2 className="text-white text-4xl md:text-5xl mt-0">Dibuat untuk profesional yang menghargai waktu.</TypographyH2>
              <TypographyP className="text-white/70 text-lg mb-0">
                Kami memahami bahwa di era digital yang bising, perhatian anda adalah aset yang paling berharga. Paturenews premium dirancang untuk memberikan informasi yang paling relevan dengan efisiensi maksimal.
              </TypographyP>
              <ul className="space-y-4 pt-4">
                {[
                  "Laporan riset pasar mingguan",
                  "Analisis tren teknologi mendalam",
                  "Integrasi mulus dengan perangkat mobile",
                  "Pengalaman bebas iklan selamanya"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-sm font-medium text-white/90"
                  >
                    <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-sm">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[1px] border-dashed border-white/10 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-center space-y-4 shadow-2xl">
                      <TypographyH3 className="text-white text-3xl m-0">Integritas mutlak</TypographyH3>
                      <MutedText className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Standar jurnalisme kami</MutedText>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Final CTA */}
        <Section className="py-32 text-center space-y-12">
           <div className="max-w-2xl mx-auto space-y-4">
             <TypographyH2 className="text-4xl md:text-5xl">Siap untuk langkah selanjutnya?</TypographyH2>
             <TypographyP className="text-lg opacity-60">Bergabunglah dengan ribuan pembaca cerdas lainnya hari ini.</TypographyP>
           </div>
           <div className="flex flex-col items-center gap-6">
              <Link href="/auth">
                <Button size="lg" className="h-16 px-16 rounded-full bg-primary text-white text-base font-bold tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-none uppercase">
                  Daftar sekarang
                </Button>
              </Link>
              <MutedText className="text-[10px] font-bold uppercase tracking-widest opacity-30">Batalkan kapan saja • Tanpa kontrak tersembunyi</MutedText>
           </div>
        </Section>
      </Container>
    </div>
  );
}
