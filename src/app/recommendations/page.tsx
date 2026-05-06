"use client";

import { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/wrapped/Layout";
import { Title, TypographyMuted, TypographyLabel } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Clock, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  Inbox
} from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";
import { formatCasing } from "@/lib/casing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function RecommendationsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [postsData, catsData] = await Promise.all([
          client.fetch(POSTS_QUERY),
          client.fetch(CATEGORIES_QUERY)
        ]);
        setPosts(postsData || []);
        setCategories(catsData || []);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroPosts = useMemo(() => posts.slice(0, 5), [posts]);
  const trendingPosts = useMemo(() => posts.slice(5, 10), [posts]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20 text-primary" />
        <TypographyMuted className="text-xs" casing="sentence">Mempelajari preferensi anda...</TypographyMuted>
      </Container>
    );
  }

  return (
    <Container className="space-y-6 pt-4">
      <header className="max-w-4xl">
        <TypographyMuted className="mb-1" casing="sentence">Eksplorasi cerdas</TypographyMuted>
        <Title className="text-2xl md:text-3xl leading-none mb-3">{formatCasing("Rekomendasi untuk anda", 'sentence')}</Title>
        <TypographyMuted className="text-sm md:text-base leading-relaxed max-w-2xl" casing="sentence">
          Wawasan yang dikurasi secara mandiri berdasarkan pemetaan konten PatureNews untuk menjaga kualitas informasi anda.
        </TypographyMuted>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
        <div className="lg:col-span-8 space-y-4">
          <TypographyLabel className="m-0" casing="sentence">Pilihan yang dipersonalisasi</TypographyLabel>
          <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 5000 })]} className="w-full relative group">
            <CarouselContent>
              {heroPosts.map((post) => (
                <CarouselItem key={`rec-hero-${post._id}`}>
                  <Link href={`/news/${post.slug}`} className="block group/hero">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/5 bg-muted">
                      <Image src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/1200/675`} alt={post.title} fill className="object-cover transition-transform duration-1000 group-hero:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <Badge className="bg-white/95 text-primary border-none shadow-none text-[9px] font-bold mb-4 px-3 py-1">Untuk Anda</Badge>
                        <h2 className="text-xl md:text-2xl font-headline font-semibold leading-tight mb-3">{post.title}</h2>
                        <div className="flex items-center gap-5 text-[10px] font-bold text-white/60">
                          <ReleaseDate date={post.publishedAt} className="tracking-widest" />
                          <span>•</span>
                          <span className="tracking-widest uppercase">{post.author}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </Carousel>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <TypographyLabel className="m-0" casing="sentence">Sedang hangat didiskusikan</TypographyLabel>
            <div className="pt-1 space-y-6">
              {trendingPosts.map((post, idx) => (
                <Link key={post._id} href={`/news/${post.slug}`} className="group flex gap-5 items-start">
                  <span className="text-3xl font-headline font-semibold text-primary/10 group-hover:text-primary/20 transition-colors shrink-0">0{idx + 1}</span>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="font-body font-medium text-[13px] leading-snug group-hover:text-primary transition-colors line-clamp-2 tracking-tight">{post.title}</h4>
                    <ReleaseDate date={post.publishedAt} className="text-[9px] font-bold block opacity-40 tracking-widest uppercase" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 space-y-20 pb-24">
          {categories.map((cat, idx) => {
            const catPosts = posts.filter(p => p.categories?.includes(cat.title)).slice(0, 6);
            if (catPosts.length === 0) return null;

            return (
              <section key={`cat-sec-${idx}`} className="space-y-8">
                <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                  <TypographyLabel className="m-0" casing="sentence">Eksplorasi {cat.title}</TypographyLabel>
                  <Link href={`/category/${cat.slug}`} className="flex items-center gap-2 text-[11px] font-bold text-primary/40 hover:text-primary transition-all tracking-tight uppercase">
                    Selengkapnya <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catPosts.map((post) => (
                    <motion.div key={post._id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                      <Card className="h-full flex flex-col group transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                        <Link href={`/news/${post.slug}`}>
                          <div className="relative h-48 w-full overflow-hidden bg-muted">
                            <Image src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/600/400`} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          </div>
                        </Link>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-3 w-3 text-muted-foreground/50" />
                            <ReleaseDate date={post.publishedAt} className="text-[10px] font-bold text-muted-foreground tracking-tight" />
                          </div>
                          <Link href={`/news/${post.slug}`}>
                            <h4 className="font-body font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 tracking-tight">{post.title}</h4>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="bg-primary text-primary-foreground rounded-2xl p-16 text-center space-y-8 shadow-2xl relative overflow-hidden mb-24">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12"><Sparkles className="h-32 w-32" /></div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-white text-3xl font-headline font-semibold">Ingin topik yang lebih spesifik?</h2>
            <p className="max-w-xl mx-auto text-sm text-white/70 font-body">Sesuaikan preferensi konten anda di pengaturan profil untuk mendapatkan kurasi berita yang lebih akurat setiap harinya.</p>
          </div>
          <Link href="/profile">
            <Button variant="secondary" className="font-bold text-xs rounded-full px-12 h-12 shadow-lg hover:scale-105 transition-transform uppercase tracking-widest">Atur profil</Button>
          </Link>
        </section>
    </Container>
  );
}
