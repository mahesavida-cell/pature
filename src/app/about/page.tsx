
"use client";

import { Heading, BodyText, Title, TypographyP } from "@/components/wrapped/Typography";
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
        <Title>Kejernihan di tengah arus informasi</Title>
        <BodyText className="text-xl">PatureNews hadir sebagai wadah bagi informasi berkualitas yang disajikan dengan kejernihan maksimal dan desain yang tenang.</BodyText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, idx) => (
          <Card key={idx} className="bg-white/40 border-none shadow-none group">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                {value.icon}
              </div>
              <Heading level={4}>{value.title}</Heading>
              <BodyText className="text-sm leading-relaxed">{value.description}</BodyText>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <Heading level={2}>Mengapa minimalisme?</Heading>
          <TypographyP>Di era di mana informasi mengalir tanpa henti, kami percaya bahwa kualitas jauh lebih penting daripada kuantitas. PatureNews menghilangkan elemen yang tidak perlu untuk membiarkan berita berbicara sendiri.</TypographyP>
        </div>
        <div className="space-y-6">
          <Heading level={2}>Standar jurnalisme</Heading>
          <TypographyP>Setiap konten yang Anda baca telah melalui proses kurasi yang ketat. Kami menggabungkan kecepatan informasi digital dengan ketelitian jurnalisme tradisional.</TypographyP>
        </div>
      </div>
    </motion.div>
  );
}
