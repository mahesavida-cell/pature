"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-20"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Title>Kejernihan di tengah arus informasi</Title>
            <BodyText className="text-xl">
              InfoFlow hadir sebagai wadah bagi informasi berkualitas yang disajikan dengan kejernihan maksimal dan desain yang tenang.
            </BodyText>
          </div>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <Card key={idx} className="bg-white/40 border-none shadow-sm group">
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {value.icon}
                  </div>
                  <Heading level={4}>{value.title}</Heading>
                  <BodyText className="text-sm leading-relaxed">
                    {value.description}
                  </BodyText>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <Heading level={2}>Mengapa minimalisme?</Heading>
              <TypographyP>
                Di era di mana informasi mengalir tanpa henti, kami percaya bahwa kualitas jauh lebih penting daripada kuantitas. Gangguan visual seringkali menghalangi pemahaman yang mendalam. Oleh karena itu, InfoFlow menghilangkan elemen yang tidak perlu untuk membiarkan berita berbicara sendiri.
              </TypographyP>
            </div>
            <div className="space-y-6">
              <Heading level={2}>Standar jurnalisme</Heading>
              <TypographyP>
                Setiap konten yang Anda baca di InfoFlow telah melalui proses kurasi yang ketat. Kami menggabungkan kecepatan informasi digital dengan ketelitian jurnalisme tradisional untuk memastikan setiap wawasan yang kami tawarkan memiliki nilai nyata.
              </TypographyP>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
