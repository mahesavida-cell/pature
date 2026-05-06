
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POSTS_BY_CATEGORY_QUERY, CATEGORY_DETAIL_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/wrapped/Layout";
import { Title, Heading, BodyText, MutedText, TypographyMuted, TypographyLabel } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, RefreshCw, Inbox, ChevronDown, Home } from "lucide-react";
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

const AnimatedEmptyState = ({ 
  message, 
  allCategories = [], 
  currentSlug 
}: { 
  message: string;
  allCategories?: any[];
  currentSlug?: string;
}) => {
  const router = useRouter();
  const otherCategories = allCategories.filter(cat => cat.slug !== currentSlug);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 w-full h-full">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="opacity-20"
      >
        <Inbox className="h-12 w-12 text-primary" />
      </motion.div>
      <div className="text-center space-y-2">
        <TypographyMuted className="text-sm">{message}</TypographyMuted>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 px-6 rounded-lg text-[13px] font-medium border-primary/5 bg-white/40 shadow-none hover:bg-primary hover:text-white transition-all gap-2"
          onClick={() => router.push('/')}
        >
          <Home className="h-3.5 w-3.5" />
          {formatCasing("Kembali ke beranda", 'sentence')}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 px-6 rounded-lg text-[13px] font-medium border-primary/5 bg-white/40 shadow-none hover:bg-primary hover:text-white transition-all gap-2"
            >
              {formatCasing("Pilih kategori lain", 'sentence')}
              <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl p-2 bg-white/95 backdrop-blur-xl shadow-2xl border border-primary/5" align="center">
            <DropdownMenuLabel className="px-3 py-2 text-[11px] text-muted-foreground/40 font-bold tracking-tight">
              {formatCasing("Kategori tersedia", 'sentence')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/5 mx-1" />
            {otherCategories.map((cat) => (
              <DropdownMenuItem 
                key={cat._id} 
                className="rounded-lg cursor-pointer py-2 px-3 text-xs font-medium text-muted-foreground/80 hover:bg-primary/5 hover:text-primary transition-all"
                onClick={() => router.push(`/category/${cat.slug}`)}
              >
                {formatCasing(cat.title, 'sentence')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const topic = searchParams.get("topic");
  
  const [category, setCategory] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catData, postsData, allCats] = await Promise.all([
          client.fetch(CATEGORY_DETAIL_QUERY, { slug }),
          client.fetch(POSTS_BY_CATEGORY_QUERY, { slug }),
          client.fetch(CATEGORIES_QUERY)
        ]);
        
        setCategory(catData);
        setAllCategories(allCats || []);
        
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

  const trendingPosts = useMemo(() => posts.slice(0, 5), [posts]);

  const groupedByTopic = useMemo(() => {
    if (!category?.subCategories || !posts) return [];
    
    return category.subCategories.map((topicName: string) => {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(topicName.toLowerCase()) || 
        (post.excerpt && post.excerpt.toLowerCase().includes(topicName.toLowerCase()))
      );
      return { name: topicName, posts: filtered };
    }).filter((group: any) => group.posts.length > 0);
  }, [category, posts]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20 text-primary" />
        <TypographyMuted className="text-xs" casing="sentence">Memuat arsip berita...</TypographyMuted>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container className="py-32 flex flex-col items-center justify-center text-center">
        <AnimatedEmptyState 
          message="Maaf, kategori yang Anda cari tidak dapat ditemukan." 
          allCategories={allCategories}
          currentSlug={slug}
        />
      </Container>
    );
  }

  return (
    <Container className="space-y-6 pt-2">
      {/* Title Section - Rapat ke header */}
      <header className="pt-2">
        <div className="max-w-4xl">
          <TypographyMuted className="mb-1" casing="sentence">Arsip kategori</TypographyMuted>
          <div className="flex items-baseline gap-4 mb-2">
            <Title className="text-2xl md:text-3xl leading-none">{formatCasing(category.title, 'sentence')}</Title>
            {topic && (
              <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] px-3 py-1 font-bold shadow-none">
                Topik: {topic}
              </Badge>
            )}
          </div>
          <TypographyMuted className="text-sm md:text-base leading-relaxed max-w-2xl" casing="sentence">
            {category.description || `Eksplorasi mendalam seputar ${category.title.toLowerCase()} dan perkembangan terbarunya.`}
          </TypographyMuted>
        </div>
      </header>

      {/* Hero & Trending Section - Jarak rapat dan profesional */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
        {/* Left: Hero Carousel */}
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
            <div className="aspect-[16/9] bg-primary/5 rounded-xl border border-dashed border-primary/10">
              <AnimatedEmptyState 
                message="Belum ada berita unggulan saat ini." 
                allCategories={allCategories}
                currentSlug={slug}
              />
            </div>
          )}
        </div>

        {/* Right: Trending List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-primary/5 pb-2">
            <TypographyLabel className="m-0 mt-0" casing="sentence">Terpopuler</TypographyLabel>
          </div>
          <div className="pt-1">
            {trendingPosts.length > 0 ? (
              <RevealGroup className="space-y-5">
                {trendingPosts.map((post, idx) => (
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
                ))}
              </RevealGroup>
            ) : (
              <div className="py-20">
                <AnimatedEmptyState 
                  message="Belum ada berita terpopuler." 
                  allCategories={allCategories}
                  currentSlug={slug}
                />
              </div>
            )}
          </div>
          
          <Link href="/latest" className="group mt-4 flex items-center justify-center p-3 border border-dashed border-primary/10 rounded-lg hover:bg-primary/5 transition-all text-[11px] font-bold text-primary/60 hover:text-primary tracking-widest">
            <span>Arsip berita terbaru</span>
            <ArrowRight className="h-3 w-3 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Deep Topic Exploration - Slider Horizontal */}
      <div className="pt-8 space-y-12">
        {groupedByTopic.length > 0 && groupedByTopic.map((group: any, groupIdx: number) => (
          <section key={`topic-group-${groupIdx}`} className="space-y-4">
            <div className="flex items-center justify-between border-b border-primary/5 pb-2">
              <TypographyLabel className="m-0 mt-0" casing="sentence">Topik {group.name}</TypographyLabel>
              <Link 
                href={`/category/${slug}?topic=${encodeURIComponent(group.name)}`} 
                className="text-[11px] font-bold text-primary/40 hover:text-primary transition-all tracking-tight uppercase"
              >
                Lihat Semua
              </Link>
            </div>
            
            <Carousel 
              opts={{ align: "start", loop: false }} 
              className="w-full relative group"
            >
              <CarouselContent className="-ml-4">
                {group.posts.map((post: any, idx: number) => (
                  <CarouselItem key={`topic-post-${post._id}`} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full flex flex-col group/card transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                      <Link href={`/news/${post.slug}`}>
                        <div className="relative h-48 w-full overflow-hidden bg-muted">
                          <Image 
                            src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/600/400`} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover/card:scale-105"
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
                            <h3 className="font-body font-medium text-base leading-snug tracking-tight group-hover/card:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                          <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Redaksi"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {group.posts.length > 3 && (
                <div className="hidden lg:block">
                  <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-8 w-8 border-primary/5 bg-white/40 shadow-none" />
                  <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-8 w-8 border-primary/5 bg-white/40 shadow-none" />
                </div>
              )}
            </Carousel>
          </section>
        ))}
      </div>

      {/* Archives Grid */}
      <div className="pt-8 pb-20">
        <div className="flex items-center justify-between border-b border-primary/5 pb-2 mb-6">
          <Heading level={3} className="text-lg m-0 mt-0" casing="sentence">Arsip berita</Heading>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(5).map((post, idx) => (
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
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/10">
            <AnimatedEmptyState 
              message="Eksplorasi berita terbaru lainnya di halaman utama." 
              allCategories={allCategories}
              currentSlug={slug}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
