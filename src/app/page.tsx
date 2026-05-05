
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Bookmark, TrendingUp, ChevronRight, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isHeroSaved, setIsHeroSaved] = useState(false);
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-news");
  
  const headlineStories = [
    { id: "h1", title: "Terobosan AI dalam diagnosa medis terkini", category: "Sains", readTime: "4 mnt", image: PlaceHolderImages[0].imageUrl },
    { id: "h2", title: "Startup lokal raih pendanaan seri B", category: "Bisnis", readTime: "3 mnt", image: PlaceHolderImages[1].imageUrl },
    { id: "h3", title: "Pameran seni digital di Jakarta", category: "Budaya", readTime: "5 mnt", image: PlaceHolderImages[2].imageUrl },
    { id: "h4", title: "Review lengkap gadget lipat terbaru", category: "Teknologi", readTime: "6 mnt", image: PlaceHolderImages[3].imageUrl },
    { id: "h5", title: "Arsitektur minimalis untuk rumah sempit", category: "Desain", readTime: "4 mnt", image: PlaceHolderImages[0].imageUrl },
    { id: "h6", title: "Perjalanan menuju emisi nol bersih", category: "Sains", readTime: "7 mnt", image: PlaceHolderImages[1].imageUrl },
  ];

  const posts = [
    {
      id: "1",
      title: "Evolusi desain digital minimalis",
      category: "Desain",
      author: "Alex Rivers",
      readTime: "5 menit baca",
      excerpt: "Menjelajahi bagaimana ruang kosong and tipografi yang jelas menjadi standar untuk sistem informasi modern.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    },
    {
      id: "2",
      title: "Arsitektur berkelanjutan di lingkungan perkotaan",
      category: "Budaya",
      author: "Maya Lin",
      readTime: "8 menit baca",
      excerpt: "Bagaimana kota mengintegrasikan ruang hijau ke dalam kehidupan vertikal untuk melawan kenaikan suhu global.",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
    },
    {
      id: "3",
      title: "Masa depan pasar global terdesentralisasi",
      category: "Bisnis",
      author: "Jordan Lee",
      readTime: "6 menit baca",
      excerpt: "Pandangan mendalam tentang bagaimana blockchain membentuk kembali infrastruktur perbankan tradisional di ekonomi negara berkembang.",
      image: PlaceHolderImages.find(img => img.id === "business-news")?.imageUrl
    }
  ];

  const popularPosts = [
    { id: "1", title: "Mengapa tipografi lebih penting dari yang Anda pikirkan", category: "Desain", rank: "01" },
    { id: "2", title: "Kebangkitan AI dalam jurnalisme modern", category: "Teknologi", rank: "02" },
    { id: "3", title: "10 prinsip hidup berkelanjutan", category: "Budaya", rank: "03" }
  ];

  return (
    <div className="bg-background min-h-screen pb-10">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-40">
        {/* Rombakan Hero Section: 2 Segmen */}
        <section className="mb-16 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Segmen Kiri: Berita Utama */}
            <motion.div 
              className="lg:col-span-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link href="/news/1" className="block group">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted shadow-md mb-6">
                  {heroImage?.imageUrl && (
                    <Image 
                      src={heroImage.imageUrl} 
                      alt="Berita utama"
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="px-3 py-1 rounded-sm border-none font-bold text-[10px] shadow-sm bg-white/95 backdrop-blur-md text-primary">
                      Unggulan hari ini
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <Title className="leading-tight text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tighter group-hover:text-primary/80 transition-colors">
                    Revolusi senyap informasi profesional
                  </Title>
                  <BodyText className="text-base md:text-lg text-foreground/70 line-clamp-2">
                    Temukan bagaimana InfoFlow menjadi standar baru untuk jurnalisme digital minimalis yang memprioritaskan kejelasan di atas segalanya.
                  </BodyText>
                </div>
              </Link>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Clock className="h-3 w-3" /> 5 menit baca • Alex Rivers
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full h-10 w-10 transition-all duration-300 shadow-sm border-primary/10", 
                      isHeroSaved && "bg-primary text-primary-foreground border-primary"
                    )}
                    onClick={() => setIsHeroSaved(!isHeroSaved)}
                  >
                    <Bookmark className={cn("h-4 w-4", isHeroSaved && "fill-current")} />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-primary/10">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Segmen Kanan: 6 Headline Pilihan */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-base font-headline font-bold">Pilihan redaksi</Heading>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {headlineStories.map((story, idx) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/news/${story.id}`} className="group flex gap-4 items-start">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted border border-primary/5">
                        <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <Badge variant="secondary" className="px-1.5 py-0 h-auto text-[9px] font-bold bg-primary/10 text-primary border-none rounded-sm shadow-none">
                          {story.category}
                        </Badge>
                        <h4 className="text-sm font-headline font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                        <span className="text-[9px] font-bold text-muted-foreground opacity-60 block">{story.readTime} baca</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Button variant="ghost" className="w-full justify-between text-[10px] font-bold hover:bg-primary/5 rounded-md px-4 py-6 border border-dashed border-primary/10 mt-2">
                Lihat berita lainnya <ChevronRight className="h-3 w-3" />
              </Button>
            </div>

          </div>
        </section>

        {/* Bagian bawah tetap seperti semula sesuai instruksi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 border-b border-border/60 pb-4">
              <Heading level={2} className="text-xl md:text-2xl font-headline font-bold">Cerita terbaru</Heading>
              <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-bold">Lihat semua</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card className="h-full flex flex-col group bg-white hover:bg-white/80 transition-all duration-300 border border-border/20 rounded-lg overflow-hidden shadow-sm">
                    <Link href={`/news/${post.id}`}>
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        {post.image && (
                          <Image 
                            src={post.image} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/95 backdrop-blur-sm text-primary hover:bg-white text-[9px] font-bold border-none shadow-sm px-2">
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
                          <h3 className="text-base font-headline font-bold mb-2 group-hover:text-accent transition-colors leading-snug">
                            {post.title}
                          </h3>
                        </Link>
                        <BodyText className="text-xs line-clamp-2 text-foreground/60">
                          {post.excerpt}
                        </BodyText>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                        <span className="text-[10px] font-bold text-primary/70">{post.author}</span>
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
          </section>

          <section className="lg:col-span-4">
            <div className="sticky top-40 space-y-10">
              <div className="flex items-center gap-3 mb-6 border-b border-border/60 pb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-lg font-headline font-bold">Sedang tren</Heading>
              </div>
              <div className="space-y-6">
                {popularPosts.map((post, idx) => (
                  <motion.div 
                    key={post.id} 
                    className="flex gap-4 group cursor-pointer"
                    whileTap={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-xl font-headline font-bold text-primary/10 group-hover:text-primary/40 transition-colors">
                      {post.rank}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[9px] font-bold text-accent">
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
                className="bg-primary p-6 rounded-lg text-primary-foreground mt-8 relative overflow-hidden shadow-md"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-10">
                  <h4 className="font-headline font-bold text-base mb-2">InfoFlow Premium</h4>
                  <p className="text-[10px] text-primary-foreground/70 mb-6 leading-relaxed">
                    Laporan eksklusif and tanpa iklan.
                  </p>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button variant="secondary" className="w-full font-bold text-[10px] h-9 rounded-md">
                      Tingkatkan akun
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t py-12 bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image 
              src="/pature_news.png" 
              alt="InfoFlow Logo" 
              width={120} 
              height={35} 
              className="h-7 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            />
          </Link>
          <div className="flex gap-6 text-[10px] font-bold text-muted-foreground">
            <Link href="#" className="hover:text-primary">Tentang kami</Link>
            <Link href="#" className="hover:text-primary">Kontak</Link>
            <Link href="#" className="hover:text-primary">Privasi</Link>
          </div>
          <MutedText className="text-[10px] font-bold opacity-50">© 2024 InfoFlow Media</MutedText>
        </div>
      </footer>
    </div>
  );
}
