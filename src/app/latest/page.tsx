"use client";

import { useEffect, useState, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/wrapped/Layout";
import { Title, TypographyMuted, TypographyLabel } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  ChevronDown, 
  Calendar, 
  Type, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  Inbox
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const AnimatedEmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-6 w-full h-full min-h-[300px]">
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="opacity-20"
    >
      <Inbox className="h-12 w-12 text-primary" />
    </motion.div>
    <TypographyMuted className="text-sm" casing="sentence">{message}</TypographyMuted>
  </div>
);

export default function LatestNewsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sorting states
  const [sortBy, setSortBy] = useState<'time' | 'year' | 'popularity' | 'alphabet'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedLetter, setSelectedLetter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await client.fetch(POSTS_QUERY);
        setPosts(data || []);
      } catch (error) {
        console.error("Failed to fetch latest posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroTrendingPosts = useMemo(() => posts.slice(0, 5), [posts]);
  
  const availableYears = useMemo(() => {
    const years = posts.map(p => new Date(p.publishedAt).getFullYear().toString());
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [posts]);

  const availableLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (sortBy === 'year' && selectedYear) {
      result = result.filter(p => new Date(p.publishedAt).getFullYear().toString() === selectedYear);
    }

    if (sortBy === 'alphabet' && selectedLetter) {
      result = result.filter(p => p.title.toLowerCase().startsWith(selectedLetter.toLowerCase()));
    }

    result.sort((a, b) => {
      if (sortBy === 'time') {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      if (sortBy === 'alphabet') {
        return sortOrder === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      }
      if (sortBy === 'popularity') {
        return sortOrder === 'desc' ? b.title.length - a.title.length : a.title.length - b.title.length;
      }
      return 0;
    });

    return result;
  }, [posts, sortBy, sortOrder, selectedYear, selectedLetter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, any[]> = {};
    posts.forEach(post => {
      const cat = post.categories?.[0] || "Lainnya";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(post);
    });
    return Object.entries(groups).map(([name, items]) => ({ name, posts: items }));
  }, [posts]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20 text-primary" />
        <TypographyMuted className="text-xs" casing="sentence">Menghubungkan ke pusat informasi...</TypographyMuted>
      </Container>
    );
  }

  return (
    <Container className="space-y-6 pt-4">
      <header className="max-w-4xl">
        <TypographyMuted className="mb-1" casing="sentence">Arsip terbaru</TypographyMuted>
        <Title className="text-2xl md:text-3xl leading-none mb-3">{formatCasing("Berita terbaru", 'sentence')}</Title>
        <TypographyMuted className="text-sm md:text-base leading-relaxed max-w-2xl" casing="sentence">
          Aliran informasi terkini yang dikurasi secara mandiri dari berbagai kategori untuk memastikan anda tetap terhubung.
        </TypographyMuted>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
        <div className="lg:col-span-8 space-y-4">
          <TypographyLabel className="m-0" casing="sentence">Baru saja diterbitkan</TypographyLabel>
          <Carousel 
            opts={{ loop: true }} 
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]} 
            className="w-full relative group"
          >
            <CarouselContent>
              {heroTrendingPosts.map((post) => (
                <CarouselItem key={`hero-${post._id}`}>
                  <Link href={`/news/${post.slug}`} className="block group/hero">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/5 bg-muted">
                      <Image 
                        src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/1200/675`} 
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hero:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <Badge className="bg-white/95 text-primary border-none shadow-none text-[9px] font-bold mb-4 px-3 py-1">
                          {post.categories?.[0] || "Terbaru"}
                        </Badge>
                        <h2 className="text-xl md:text-2xl font-headline font-semibold leading-tight mb-3">
                          {post.title}
                        </h2>
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
            <TypographyLabel className="m-0" casing="sentence">Paling banyak dibaca</TypographyLabel>
            <div className="pt-1">
              <RevealGroup className="space-y-6">
                {heroTrendingPosts.map((post, idx) => (
                  <RevealItem key={`trending-${post._id}`}>
                    <Link href={`/news/${post.slug}`} className="group flex gap-5 items-start">
                      <span className="text-3xl font-headline font-semibold text-primary/10 group-hover:text-primary/20 transition-colors shrink-0">0{idx + 1}</span>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className="font-body font-medium text-[13px] leading-snug group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                          {post.title}
                        </h4>
                        <ReleaseDate date={post.publishedAt} className="text-[9px] font-bold block opacity-40 tracking-widest uppercase" />
                      </div>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>

        <div className="pt-10 space-y-16">
          {groupedByCategory.map((group, idx) => (
            <section key={`group-${idx}`} className="space-y-6">
              <div className="flex items-center justify-between border-b border-primary/5 pb-4">
                <TypographyLabel className="m-0" casing="sentence">Kategori {group.name}</TypographyLabel>
              </div>
              
              <Carousel 
                opts={{ align: "start", loop: false }} 
                className="w-full relative group"
              >
                <CarouselContent className="-ml-4">
                  {group.posts.map((post: any) => (
                    <CarouselItem key={`topic-post-${post._id}`} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full flex flex-col group/card transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                        <Link href={`/news/${post.slug}`}>
                          <div className="relative h-52 w-full overflow-hidden bg-muted">
                            <Image 
                              src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/600/400`} 
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                            />
                          </div>
                        </Link>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                              <ReleaseDate date={post.publishedAt} className="text-[10px] font-bold text-muted-foreground tracking-tight" />
                            </div>
                            <Link href={`/news/${post.slug}`}>
                              <h3 className="font-body font-medium text-base leading-snug tracking-tight group-hover/card:text-primary transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden lg:block">
                  <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 border-primary/5 bg-white/40 shadow-none" />
                  <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 border-primary/5 bg-white/40 shadow-none" />
                </div>
              </Carousel>
            </section>
          ))}
        </div>

        <div className="pt-12 pb-24 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 rounded-xl bg-white/40 border border-primary/5">
            <div className="flex flex-col gap-2">
              <TypographyLabel className="m-0" casing="sentence">Semua berita</TypographyLabel>
              <div className="flex flex-wrap items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg bg-white border-primary/10 gap-2 text-[12px] font-semibold shadow-none">
                      {sortBy === 'time' && <Clock className="h-3.5 w-3.5" />}
                      {sortBy === 'popularity' && <TrendingUp className="h-3.5 w-3.5" />}
                      {sortBy === 'time' ? "Terbaru" : "Popularitas"}
                      <ChevronDown className="h-3 w-3 opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 p-2 rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl border-primary/5">
                    <DropdownMenuItem onClick={() => setSortBy('time')} className="rounded-lg gap-3 text-xs py-2.5 px-3 font-medium">
                      <Clock className="h-3.5 w-3.5" /> Terbaru
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('popularity')} className="rounded-lg gap-3 text-xs py-2.5 px-3 font-medium">
                      <TrendingUp className="h-3.5 w-3.5" /> Popularitas
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-none"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredAndSortedPosts.map((post, idx) => (
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
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <ReleaseDate date={post.publishedAt} className="text-[10px] font-bold text-muted-foreground tracking-tight" />
                      </div>
                      <Link href={`/news/${post.slug}`}>
                        <h3 className="font-body font-medium text-base leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
    </Container>
  );
}
