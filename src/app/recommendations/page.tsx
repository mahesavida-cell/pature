
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Filter, Heart } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function RecommendationsPage() {
  const topics = ["Teknologi", "Desain", "Bisnis", "Budaya", "Sains", "Gaya Hidup", "Lingkungan"];
  
  const sections = [
    {
      title: "Berdasarkan minat Anda",
      icon: <Heart className="h-5 w-5 text-red-500" />,
      posts: [
        { id: "r1", title: "Membangun sistem desain yang inklusif", category: "Desain", image: PlaceHolderImages[0].imageUrl },
        { id: "r2", title: "Masa depan kerja jarak jauh di Asia", category: "Budaya", image: PlaceHolderImages[1].imageUrl },
        { id: "r3", title: "Inovasi baterai untuk mobilitas perkotaan", category: "Sains", image: PlaceHolderImages[2].imageUrl },
      ]
    },
    {
      title: "Sedang hangat didiskusikan",
      icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
      posts: [
        { id: "h1", title: "Etika kecerdasan buatan dalam seni digital", category: "Teknologi", image: PlaceHolderImages[3].imageUrl },
        { id: "h2", title: "Krisis ekonomi global dan peluang startup", category: "Bisnis", image: PlaceHolderImages[0].imageUrl },
        { id: "h3", title: "Urban farming sebagai solusi pangan kota", category: "Budaya", image: PlaceHolderImages[1].imageUrl },
      ]
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-40 pb-24">
        <div className="space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-primary opacity-60">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-bold tracking-widest uppercase">Personalisasi pembaca</span>
              </div>
              <Title>Rekomendasi untuk Anda</Title>
              <BodyText>
                Wawasan yang dikurasi khusus berdasarkan riwayat bacaan dan topik yang paling sering Anda jelajahi di InfoFlow.
              </BodyText>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Button key={topic} variant="outline" size="sm" className="rounded-full text-[10px] font-bold bg-white/40 border-primary/5 hover:bg-primary hover:text-white transition-all">
                  {topic}
                </Button>
              ))}
              <Button size="sm" className="rounded-full h-9 w-9 p-0 bg-primary/5 text-primary border-none shadow-none hover:bg-primary hover:text-white transition-all">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-32">
            {sections.map((section, secIdx) => (
              <section key={section.title} className="space-y-12">
                <div className="flex items-center gap-4 border-b border-primary/5 pb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <Heading level={2}>{section.title}</Heading>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {section.posts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link href={`/news/${post.id}`} className="group block space-y-5">
                        <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-primary/5 shadow-sm bg-muted">
                          <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                        </div>
                        <div className="space-y-3">
                          <Badge variant="secondary" className="px-2 py-0.5 text-[9px] font-bold bg-primary/5 text-primary border-none rounded-sm">{post.category}</Badge>
                          <h4 className="text-lg font-headline font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                          <MutedText className="text-[10px] font-bold block opacity-40 uppercase tracking-widest">Wawasan hari ini</MutedText>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Call to Action */}
          <section className="bg-primary/95 text-primary-foreground rounded-3xl p-16 text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-175 group-hover:rotate-45">
              <Sparkles className="h-40 w-40" />
            </div>
            <div className="relative z-10 space-y-6">
              <Heading level={2} className="text-white text-4xl">Ingin topik yang lebih spesifik?</Heading>
              <BodyText className="max-w-2xl mx-auto text-white/70">
                Sesuaikan preferensi konten Anda di pengaturan profil untuk mendapatkan kurasi berita yang lebih akurat setiap harinya.
              </BodyText>
              <div className="flex justify-center pt-4">
                <Link href="/profile">
                  <Button variant="secondary" className="font-bold text-xs rounded-full px-12 h-12 shadow-lg hover:scale-105 transition-transform">
                    Atur preferensi profil
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
