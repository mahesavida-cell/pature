
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function EditorsChoicePage() {
  const choices = [
    {
      id: "ec-1",
      title: "Masa depan jurnalisme di era kecerdasan buatan",
      excerpt: "Bagaimana redaksi berita mengadaptasi teknologi generatif tanpa mengorbankan integritas informasi.",
      category: "Media",
      author: "Alex Rivers",
      image: PlaceHolderImages[0].imageUrl
    },
    {
      id: "ec-2",
      title: "Minimalisme: lebih dari sekadar tren estetika",
      excerpt: "Mengapa desain yang tenang menjadi solusi bagi kesehatan mental di dunia yang penuh gangguan digital.",
      category: "Desain",
      author: "Maya Lin",
      image: PlaceHolderImages[1].imageUrl
    },
    {
      id: "ec-3",
      title: "Ekonomi hijau dan tantangan global 2025",
      excerpt: "Analisis mendalam mengenai transisi energi dan dampaknya pada pasar berkembang di Asia.",
      category: "Bisnis",
      author: "Jordan Lee",
      image: PlaceHolderImages[2].imageUrl
    },
    {
      id: "ec-4",
      title: "Revolusi sensorik dalam antarmuka digital",
      excerpt: "Menjelajahi bagaimana teknologi haptik mengubah cara kita berinteraksi dengan layar sentuh.",
      category: "Teknologi",
      author: "Sarah Chen",
      image: PlaceHolderImages[3].imageUrl
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-40 pb-24">
        <div className="space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Pilihan redaksi
            </div>
            <Title className="text-5xl">Esei dan kurasi terbaik</Title>
            <BodyText className="text-xl">
              Pilihan mendalam yang dikurasi secara manual oleh tim redaksi kami untuk memberikan wawasan melampaui berita harian.
            </BodyText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {choices.map((choice, idx) => (
              <motion.div
                key={choice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <Link href={`/news/${choice.id}`} className="group block">
                  <Card className="border-none shadow-none bg-white/40 group-hover:bg-white/60 transition-all overflow-hidden rounded-2xl">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={choice.image} alt={choice.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <CardContent className="p-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-[9px] font-bold bg-primary text-white border-none rounded-sm">{choice.category}</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground/40">{choice.author}</span>
                      </div>
                      <Heading level={3} className="text-2xl group-hover:text-primary transition-colors leading-tight">{choice.title}</Heading>
                      <BodyText className="text-sm line-clamp-3 opacity-60 leading-relaxed">
                        {choice.excerpt}
                      </BodyText>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary group-hover:gap-4 transition-all pt-4">
                        Baca esei lengkap <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
