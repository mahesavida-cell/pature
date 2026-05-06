"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POSTS_BY_CATEGORY_QUERY, CATEGORY_DETAIL_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/wrapped/Layout";
import { Title, Heading, BodyText, MutedText, TypographyMuted, TypographyLabel } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, RefreshCw } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";
import { formatCasing } from "@/lib/casing";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RevealGroup, RevealItem } from "@/components/wrapped/Motion";
import Autoplay from "embla-carousel-autoplay";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const topic = searchParams.get("topic");
  
  const [category, setCategory] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catData, postsData] = await Promise.all([
          client.fetch(CATEGORY_DETAIL_QUERY, { slug }),
          client.fetch(POSTS_BY_CATEGORY_QUERY, { slug })
        ]);
        
        setCategory(catData);
        
        if (topic) {
          const filtered = (postsData || []).filter((post: any) => 
            post.title.toLowerCase().includes(topic.toLowerCase()) || 
            post.excerpt.toLowerCase().includes(topic.toLowerCase())
          );
          setPosts(filtered);
        } else {
          setPosts(postsData || []);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, topic]);

  // Sync Hero and Trending using the same data slice
  const trendingPosts = useMemo(() => posts.slice(0, 5), [posts]);
  const archivedPosts = useMemo(() => posts.slice(5), [posts]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20" />
        <TypographyMuted className="text-xs">Memuat arsip berita...</TypographyMuted>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container className="py-32 text-center">
        <Title>Kategori tidak ditemukan</Title>
        <Link href="/">
          <button className="mt-8 text-sm font-medium underline underline-offset-4 hover:text-primary/60 transition-all">
            Kembali ke beranda
          </button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="space-y-6">
      {/* Title Section - Extremely tight spacing to header */}
      <header className="pt-2">
        <div className="max-w-4xl">
          <TypographyLabel className="mb-1" casing="sentence">Arsip kategori</TypographyLabel>
          <div className="flex items-baseline gap-4 mb-2">
            <Title className="text-2xl md:text-3xl leading-none">{formatCasing(category.title, 'sentence')}</Title>
            {topic && (
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] px-3 py-1 font-bold">
                Topik: {topic}
              </Badge>
            )}
          </div>
          <TypographyMuted className="text-sm md:text-base leading-relaxed max-w-2xl">
            {category.description || `Eksplorasi mendalam seputar ${category.title.toLowerCase()} dan perkembangan terbarunya.`}
          </TypographyMuted>
        </div>
      </header>

      {/* Hero & Trending Section - Compact grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-0">
        {/* Left: Hero Carousel (Synchronized with Trending) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-primary/5 pb-2">
            <TypographyLabel className="m-0 mt-0" casing="sentence">Unggulan</TypographyLabel>
          </div>
          {trendingPosts.length > 0 ? (
            <Carousel 
              opts={{ loop: true }} 
              plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]} 
              className="w-full relative group"
            >
              <CarouselContent>
                {trendingPosts.map((post) => (
                  <CarouselItem key={`hero-${post._id}`}>
                    <Link href={`/news/${post.slug}`} className="block group/hero">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/5 bg-muted">
                        <Image 
                          src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/1200/675`} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out group-hero:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <Badge className="bg-white/95 text-primary border-none shadow-none text-[9px] font-bold mb-3">
                            {formatCasing(post.categories?.[0] || category.title, 'sentence')}
                          </Badge>
                          <h2 className="text-xl md:text-2xl font-headline font-semibold leading-tight mb-2 group-hero:text-white/90 transition-colors">
                            {post.title}
                          </h2>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-white/60">
                            <ReleaseDate date={post.publishedAt} className="tracking-widest" />
                            <span>•</span>
                            <span className="tracking-widest">{post.author || "Redaksi"}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute right-4 bottom-4 flex gap-2 z-10">
                <CarouselPrevious className="relative translate-y-0 left-0 h-8 w-8 border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all shadow-none" />
                <CarouselNext className="relative translate-y-0 right-0 h-8 w-8 border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all shadow-none" />
              </div>
            </Carousel>
          ) : (
            <div className="aspect-[16/9] bg-primary/5 rounded-xl border border-dashed border-primary/10 flex items-center justify-center">
              <TypographyMuted className="text-xs">Belum ada berita unggulan saat ini.</TypographyMuted>
            </div>
          )}
        </div>

        {/* Right: Trending List (Synchronized with Hero) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-primary/5 pb-2">
            <TypographyLabel className="m-0 mt-0" casing="sentence">Terpopuler</TypographyLabel>
          </div>
          <RevealGroup className="space-y-5 pt-1">
            {trendingPosts.length > 0 ? trendingPosts.map((post, idx) => (
              <RevealItem key={`trending-${post._id}`}>
                <Link href={`/news/${post.slug}`} className="group flex gap-4 items-start">
                  <span className="text-2xl md:text-3xl font-headline font-semibold text-primary/10 group-hover:text-primary/20 transition-colors tabular-nums shrink-0 leading-none">0{idx + 1}</span>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-body font-medium text-[13px] leading-snug group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                      {post.title}
                    </h4>
                    <ReleaseDate date={post.publishedAt} className="text-[9px] font-bold block opacity-40 tracking-widest" />
                  </div>
                </Link>
              </RevealItem>
            )) : (
              <TypographyMuted className="text-xs">Belum ada berita terpopuler hari ini.</TypographyMuted>
            )}
          </RevealGroup>
          
          <Link href="/latest" className="group mt-4 flex items-center justify-center p-3 border border-dashed border-primary/10 rounded-lg hover:bg-primary/5 transition-all text-[11px] font-bold text-primary/60 hover:text-primary tracking-widest">
            <span>Arsip berita terbaru</span>
            <ArrowRight className="h-3 w-3 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Archives Grid */}
      <div className="pt-4 pb-20">
        <div className="flex items-center justify-between border-b border-primary/5 pb-2 mb-6">
          <Heading level={3} className="text-lg m-0 mt-0" casing="sentence">Arsip berita</Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archivedPosts.length > 0 ? (
            archivedPosts.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full flex flex-col group hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                  <Link href={`/news/${post.slug}`}>
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <Image 
                        src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/600/400`} 
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-3 w-3 text-muted-foreground/50" />
                        <ReleaseDate date={post.publishedAt} className="text-[9px] font-bold text-muted-foreground tracking-tight" />
                      </div>
                      <Link href={`/news/${post.slug}`}>
                        <h3 className="font-body font-medium text-base leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                      <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Redaksi"}</span>
                      <Link href={`/news/${post.slug}`}>
                        <ArrowRight className="h-3 w-3 text-primary hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/10">
              <TypographyMuted className="text-xs">Eksplorasi berita terbaru lainnya di halaman utama.</TypographyMuted>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
