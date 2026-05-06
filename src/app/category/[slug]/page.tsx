
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POSTS_BY_CATEGORY_QUERY, CATEGORY_DETAIL_QUERY } from "@/sanity/lib/queries";
import { Container, Section } from "@/components/wrapped/Layout";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
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

  // Split posts for Hero Carousel and Trending
  const heroPosts = useMemo(() => posts.slice(0, 5), [posts]);
  const trendingPosts = useMemo(() => posts.slice(0, 5), [posts]); 
  const archivedPosts = useMemo(() => posts.slice(5), [posts]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20" />
        <BodyText className="text-xs opacity-40">Memuat arsip berita...</BodyText>
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
    <Container>
      {/* Title Section - Tight spacing to header */}
      <Section className="pt-0 pb-6 md:pb-8">
        <div className="max-w-4xl space-y-1">
          <MutedText className="text-[10px] font-bold opacity-40 tracking-widest" casing="sentence">Arsip kategori</MutedText>
          <div className="flex items-baseline gap-4">
            <Title className="text-2xl md:text-3xl lg:text-4xl leading-none">{formatCasing(category.title, 'sentence')}</Title>
            {topic && (
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] px-3 py-1 font-bold">
                Topik: {topic}
              </Badge>
            )}
          </div>
          <BodyText className="text-base md:text-lg opacity-60 leading-relaxed max-w-2xl !mt-1">
            {category.description || `Eksplorasi mendalam seputar ${category.title.toLowerCase()} dan perkembangan terbarunya.`}
          </BodyText>
        </div>
      </Section>

      {/* Hero & Trending Section - Reduced vertical spacing */}
      <Section className="pt-0 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Hero Carousel */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-2">
              <Heading level={4} className="m-0 text-[11px] font-bold tracking-wider opacity-40" casing="sentence">Unggulan</Heading>
            </div>
            {heroPosts.length > 0 ? (
              <Carousel opts={{ loop: true }} className="w-full relative group">
                <CarouselContent>
                  {heroPosts.map((post) => (
                    <CarouselItem key={post._id}>
                      <Link href={`/news/${post.slug}`} className="block group/hero">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/5 bg-muted">
                          <Image 
                            src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/1200/675`} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hero:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                            <Badge className="bg-white/95 text-primary border-none shadow-none text-[9px] font-bold mb-3 md:mb-4">
                              {formatCasing(post.categories?.[0] || category.title, 'sentence')}
                            </Badge>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-headline font-semibold leading-tight mb-3 md:mb-4 group-hero:text-white/90 transition-colors">
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
                <div className="absolute right-4 bottom-4 flex gap-2">
                  <CarouselPrevious className="relative translate-y-0 left-0 h-9 w-9 border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all shadow-none" />
                  <CarouselNext className="relative translate-y-0 right-0 h-9 w-9 border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all shadow-none" />
                </div>
              </Carousel>
            ) : (
              <div className="aspect-[16/9] bg-primary/5 rounded-xl border border-dashed border-primary/10 flex items-center justify-center">
                <MutedText className="text-xs font-bold opacity-30">Belum ada berita utama</MutedText>
              </div>
            )}
          </div>

          {/* Right: Trending List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-2">
              <Heading level={4} className="m-0 text-[11px] font-bold tracking-wider opacity-40" casing="sentence">Terpopuler</Heading>
            </div>
            <RevealGroup className="space-y-6 pt-1">
              {trendingPosts.length > 0 ? trendingPosts.map((post, idx) => (
                <RevealItem key={`trending-${post._id}`}>
                  <Link href={`/news/${post.slug}`} className="group flex gap-5 items-start">
                    <span className="text-3xl md:text-4xl font-headline font-semibold text-primary/10 group-hover:text-primary/20 transition-colors tabular-nums shrink-0 leading-none">0{idx + 1}</span>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-body font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                        {post.title}
                      </h4>
                      <ReleaseDate date={post.publishedAt} className="text-[10px] font-bold block opacity-40 tracking-widest" />
                    </div>
                  </Link>
                </RevealItem>
              )) : (
                <MutedText className="text-xs italic opacity-40">Belum ada berita trending.</MutedText>
              )}
            </RevealGroup>
            
            <Link href="/latest" className="group mt-6 flex items-center justify-center p-4 border border-dashed border-primary/10 rounded-xl hover:bg-primary/5 transition-all text-[11px] font-bold text-primary/60 hover:text-primary tracking-widest">
              <span>Arsip berita terbaru</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Archives Grid */}
      <Section className="pt-0 pb-20">
        <div className="flex items-center justify-between border-b border-primary/5 pb-3 mb-8">
          <Heading level={3} className="text-xl m-0" casing="sentence">Arsip berita</Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
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
                    <div className="relative h-52 w-full overflow-hidden bg-muted">
                      <Image 
                        src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/600/400`} 
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <ReleaseDate date={post.publishedAt} className="text-[10px] font-bold text-muted-foreground tracking-tight" />
                      </div>
                      <Link href={`/news/${post.slug}`}>
                        <h3 className="font-body font-medium text-lg leading-snug tracking-[-0.01em] group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <BodyText className="text-sm line-clamp-2 opacity-60 mt-2.5 !mb-0">
                        {post.excerpt}
                      </BodyText>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-5 border-t border-primary/5">
                      <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Redaksi"}</span>
                      <Link href={`/news/${post.slug}`}>
                        <ArrowRight className="h-4 w-4 text-primary hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/10">
              <MutedText className="text-xs font-bold opacity-30 tracking-widest">Lihat berita terbaru lainnya</MutedText>
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}
