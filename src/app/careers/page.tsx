
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Globe, Zap, Coffee } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const jobs = [
    { title: "Redaktur Senior", type: "Full-time", location: "Jakarta / Remote", dept: "Redaksi", color: "bg-blue-500/10 text-blue-600" },
    { title: "UI/UX Designer", type: "Full-time", location: "Jakarta", dept: "Produk", color: "bg-purple-500/10 text-purple-600" },
    { title: "Frontend Engineer (React)", type: "Contract", location: "Remote", dept: "Produk", color: "bg-orange-500/10 text-orange-600" },
    { title: "Spesialis Media Sosial", type: "Full-time", location: "Jakarta", dept: "Pemasaran", color: "bg-green-500/10 text-green-600" },
  ];

  const benefits = [
    { icon: <Globe className="h-5 w-5" />, title: "Remote-first", desc: "Bekerja dari mana saja yang membuat Anda produktif." },
    { icon: <Zap className="h-5 w-5" />, title: "Pertumbuhan cepat", desc: "Kesempatan belajar di industri media yang berkembang." },
    { icon: <Coffee className="h-5 w-5" />, title: "Kultur inklusif", desc: "Lingkungan kerja yang menghargai setiap ide unik." },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-24"
        >
          {/* Hero */}
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <Title className="text-5xl">Mari berkarya bersama</Title>
            <BodyText>
              Bergabunglah dengan tim yang percaya bahwa setiap berita berhak mendapatkan kejernihan dan setiap pembaca berhak mendapatkan kualitas.
            </BodyText>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="space-y-3 text-center md:text-left">
                <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-4 mx-auto md:mx-0">
                  {benefit.icon}
                </div>
                <Heading level={4} className="text-base">{benefit.title}</Heading>
                <MutedText className="text-[11px] leading-relaxed block">{benefit.desc}</MutedText>
              </div>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-primary/5 pb-6">
              <Heading level={2} className="text-2xl">Posisi terbuka</Heading>
              <Badge variant="outline" className="px-3 py-1 text-[10px] font-bold opacity-60">
                {jobs.length} Posisi tersedia
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:border-primary/30 transition-all cursor-pointer group bg-white/40">
                    <CardContent className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <Badge className={`${job.color} border-none text-[9px] font-bold px-3 py-0.5 rounded-sm shadow-none`}>
                          {job.dept}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{job.type}</span>
                      </div>
                      <Heading level={4} className="text-xl mb-3 group-hover:text-primary transition-colors">{job.title}</Heading>
                      <div className="flex items-center justify-between mt-8">
                        <MutedText className="text-[11px] flex items-center gap-2">
                          <Globe className="h-3 w-3" /> {job.location}
                        </MutedText>
                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* General Application */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150"><Briefcase className="h-32 w-32" /></div>
            <div className="relative z-10 space-y-4">
              <Heading level={2} className="text-white text-3xl">Belum menemukan posisi yang pas?</Heading>
              <BodyText className="max-w-xl mx-auto text-sm text-white/70">
                Kami selalu mencari talenta luar biasa. Jika Anda memiliki visi yang sama, kirimkan portofolio dan CV Anda untuk pertimbangan masa depan.
              </BodyText>
            </div>
            <Button variant="secondary" className="font-bold text-xs rounded-full px-12 h-12 shadow-lg hover:scale-105 transition-transform">
              Kirim aplikasi umum
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
