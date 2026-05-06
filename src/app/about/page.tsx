"use client";

import { TypographyH1, TypographyH2, TypographyH4, TypographyP, TypographyLead } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Sparkles, Target, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Misi kami",
      description: "Menyaring kebisingan digital dan menyajikan narasi bermakna bagi pembaca profesional di seluruh dunia.",
      icon: <Target className="h-6 w-6 text-primary" />,
    },
    {
      title: "Filosofi desain",
      description: "Minimalisme bukan sekadar gaya visual, melainkan cara kami menghormati waktu dan fokus pembaca.",
      icon: <Sparkles className="h-6 w-6 text-primary" />,
    },
    {
      title: "Tim redaksi",
      description: "Kumpulan jurnalis dan pemikir yang berdedikasi menjaga standar integritas informasi tertinggi.",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-20">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <TypographyH1>Kejernihan di tengah arus informasi</TypographyH1>
        <TypographyLead>PatureNews hadir sebagai wadah bagi informasi berkualitas yang disajikan dengan kejernihan maksimal dan desain yang tenang.</TypographyLead>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, idx) => (
          <Card key={idx} className="bg-white/40 border-none shadow-none group">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {value.icon}
              </div>
              <TypographyH4>{value.title}</TypographyH4>
              <TypographyP className="text-sm leading-relaxed !mt-0">{value.description}</TypographyP>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <TypographyH2>Mengapa minimalisme?</TypographyH2>
          <TypographyP>Di era di mana informasi mengalir tanpa henti, kami percaya bahwa kualitas jauh lebih penting daripada kuantitas. PatureNews menghilangkan elemen yang tidak perlu untuk membiarkan berita berbicara sendiri.</TypographyP>
        </div>
        <div className="space-y-6">
          <TypographyH2>Standar jurnalisme</TypographyH2>
          <TypographyP>Setiap konten yang Anda baca telah melalui proses kurasi yang ketat. Kami menggabungkan kecepatan informasi digital dengan ketelitian jurnalisme tradisional.</TypographyP>
        </div>
      </div>
    </motion.div>
  );
}
