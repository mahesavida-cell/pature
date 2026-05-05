"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Bookmark, TrendingUp, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isSaved, setIsSaved] = useState(false);
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-news");
  
  const posts = [
    {
      id: "1",
      title: "Evolusi Desain Digital Minimalis",
      category: "Desain",
      author: "Alex Rivers",
      readTime: "5 Menit Baca",
      excerpt: "Menjelajahi Bagaimana Ruang Kosong Dan Tipografi Yang Jelas Menjadi Standar Untuk Sistem Informasi Modern.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    },
    {
      id: "2",
      title: "Arsitektur Berkelanjutan Di Lingkungan Perkotaan",
      category: "Budaya",
      author: "Maya Lin",
      readTime: "8 Menit Baca",
      excerpt: "Bagaimana Kota Mengintegrasikan Ruang Hijau Ke Dalam Kehidupan Vertikal Untuk Melawan Kenaikan Suhu Global.",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
    },
    {
      id: "3",
      title: "Masa Depan Pasar Global Terdesentralisasi",
      category: "Bisnis",
      author: "Jordan Lee",
      readTime: "6 Menit Baca",
      excerpt: "Pandangan Mendalam Tentang Bagaimana Blockchain Membentuk Kembali Infrastruktur Perbankan Tradisional Di Ekonomi Negara Berkembang.",
      image: PlaceHolderImages.find(img => img.id === "business-news")?.imageUrl
    }
  ];

  const popularPosts = [
    { id: "1", title: "Mengapa Tipografi Lebih Penting Dari Yang Anda Pikirkan", category: "Desain", rank: "01" },
    { id: "2", title: "Kebangkitan AI Dalam Jurnalisme Modern", category: "Teknologi", rank: "02" },
    { id: "3", title: "10 Prinsip Hidup Berkelanjutan", category: "Budaya", rank: "03" }
  ];

  return (
    <div className="bg-background min-h-screen pb-10">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12">
        <section className="mb-12 md:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-[24px] bg-muted group shadow-xl"
            >
              {heroImage?.imageUrl && (
                <Image 
                  src={heroImage.imageUrl} 
                  alt="Berita Utama"
                  fill
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  priority
                />
              )}
            </motion.div>
            
            <motion.div 
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 rounded-full border-none font-bold text-[10px] tracking-wide shadow-sm">
                  Unggulan
                </Badge>
                <MutedText className="text-[10px] tracking-wide font-bold">Hari Ini</MutedText>
              </div>
              <Title className="leading-tight text-3xl sm:text-4xl md:text-6xl font-headline tracking-tighter">
                Revolusi Senyap Informasi Profesional
              </Title>
              <BodyText className="text-base md:text-xl text-foreground/70">
                Temukan Bagaimana InfoFlow Menjadi Standar Baru Untuk Jurnalisme Digital Minimalis.
              </BodyText>
              <div className="flex items-center gap-3 pt-2">
                <Link href="/news/1" className="flex-1 sm:flex-none">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button className="w-full sm:px-10 h-12 text-xs font-bold tracking-wide rounded-xl shadow-lg">
                      Baca Artikel
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full h-12 w-12 transition-all duration-300 shadow-sm", 
                      isSaved && "bg-primary text-primary-foreground border-primary shadow-lg"
                    )}
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 border-b border-border/60 pb-4">
              <Heading level={2} className="text-xl md:text-3xl font-headline font-bold">Cerita Terbaru</Heading>
              <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-bold">Lihat Semua</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="h-full flex flex-col group bg-white hover:bg-white/80 transition-all duration-300 border border-border/20 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg">
                    <Link href={`/news/${post.id}`}>
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        {post.image && (
                          <Image 
                            src={post.image} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/95 backdrop-blur-sm text-primary hover:bg-white text-[9px] font-bold tracking-tight border-none shadow-sm px-2">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] font-bold text-muted-foreground">{post.readTime}</span>
                        </div>
                        <Link href={`/news/${post.id}`}>
                          <h3 className="text-lg font-headline font-bold mb-2 group-hover:text-accent transition-colors leading-snug">
                            {post.title}
                          </h3>
                        </Link>
                        <BodyText className="text-xs line-clamp-2 text-foreground/60">
                          {post.excerpt}
                        </BodyText>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                        <span className="text-[10px] font-black text-primary/70 tracking-wide">{post.author}</span>
                        <motion.div whileTap={{ scale: 0.8 }}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-12 flex justify-center"
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="w-full sm:w-auto px-10 h-12 font-bold text-[10px] tracking-wide rounded-xl shadow-sm">
                Lihat Lebih Banyak
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </section>

          <section className="lg:col-span-4">
            <div className="sticky top-24 space-y-10">
              <div className="flex items-center gap-3 mb-6 border-b border-border/60 pb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-lg font-headline font-bold">Sedang Tren</Heading>
              </div>

              <div className="space-y-6">
                {popularPosts.map((post, idx) => (
                  <motion.div 
                    key={post.id} 
                    className="flex gap-4 group cursor-pointer"
                    whileTap={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-2xl font-headline font-bold text-primary/10 group-hover:text-primary/40 transition-colors">
                      {post.rank}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[9px] tracking-wide font-black text-accent">
                        {post.category}
                      </span>
                      <Link href={`/news/${post.id}`}>
                        <h4 className="text-sm font-headline font-bold leading-tight group-hover:text-accent transition-colors">
                          {post.title}
                        </h4>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="bg-primary p-8 rounded-[24px] text-primary-foreground mt-8 relative overflow-hidden shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-10">
                  <h4 className="font-headline font-bold text-lg mb-2">InfoFlow Premium</h4>
                  <p className="text-[10px] text-primary-foreground/70 mb-6 leading-relaxed">
                    Laporan Eksklusif Dan Tanpa Iklan.
                  </p>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button variant="secondary" className="w-full font-bold text-[10px] tracking-wide h-10 rounded-xl">
                      Tingkatkan Akun
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t py-16 bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">InfoFlow</Link>
          <div className="flex gap-6 text-[11px] font-bold tracking-wide text-muted-foreground">
            <Link href="#" className="hover:text-primary">Tentang Kami</Link>
            <Link href="#" className="hover:text-primary">Kontak</Link>
            <Link href="#" className="hover:text-primary">Privasi</Link>
          </div>
          <MutedText className="text-[10px] font-bold opacity-50 tracking-[0.1em]">© 2024 InfoFlow Media</MutedText>
        </div>
      </footer>
    </div>
  );
}