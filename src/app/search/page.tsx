
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Search as SearchIcon, ArrowRight, RefreshCw } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { useState, useMemo } from "react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const NewsCarousel = ({ posts, sectionTitle, viewAllLink }: { posts: any[], sectionTitle: string, viewAllLink: string }) => {
  return (
    <section className="mb-24">
      <div className="flex items-center justify-between mb-8 border-b border-primary/5 pb-6">
        <Heading level={2}>{sectionTitle}</Heading>
        <Link href={viewAllLink}>
          <Button variant="ghost" className="text-[10px] font-bold tracking-widest hover:underline px-6">Lihat semua</Button>
        </Link>
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {posts.map((post, idx) => (
            <CarouselItem key={post.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card className="h-full flex flex-col group/card hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40">
                <Link href={`/news/${post.id}`}>
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    <Image 
                      src={post.image || PlaceHolderImages[idx % 4].imageUrl} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 backdrop-blur-md text-primary hover:bg-white text-[9px] font-bold border-none shadow-md px-3 py-1 tracking-wide">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-7 flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{post.readTime || "5 mnt"}</span>
                    </div>
                    <Link href={`/news/${post.id}`}>
                      <h3 className="text-lg font-headline font-bold mb-3 group-hover/card:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                    <BodyText className="text-sm line-clamp-3 opacity-60">
                      {post.excerpt}
                    </BodyText>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/5">
                    <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Penulis InfoFlow"}</span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/card:opacity-100 transition-all transform translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryText = searchParams.get("q") || "";
  const db = useFirestore();
  const router = useRouter();

  const postsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "posts"), limit(50));
  }, [db]);
  const { data: firestorePosts, isLoading } = useCollection(postsQuery);

  // Fallback data if firestore is empty
  const staticFallbackPosts = [
    { id: "1", title: "Evolusi desain digital minimalis", category: "Desain", author: "Alex Rivers", readTime: "5 mnt", excerpt: "Menjelajahi bagaimana ruang kosong dan tipografi yang jelas menjadi standar untuk sistem informasi modern.", image: PlaceHolderImages[0].imageUrl },
    { id: "2", title: "Arsitektur berkelanjutan di lingkungan perkotaan", category: "Budaya", author: "Maya Lin", readTime: "8 mnt", excerpt: "Bagaimana kota mengintegrasikan ruang hijau ke dalam kehidupan vertikal.", image: PlaceHolderImages[1].imageUrl },
    { id: "3", title: "Masa depan pasar global terdesentralisasi", category: "Bisnis", author: "Jordan Lee", readTime: "6 mnt", excerpt: "Pandangan mendalam tentang bagaimana blockchain membentuk kembali infrastruktur perbankan.", image: PlaceHolderImages[2].imageUrl },
    { id: "4", title: "Tren gaya hidup ramah lingkungan", category: "Budaya", author: "Sarah Chen", readTime: "4 mnt", excerpt: "Kesan sederhana namun bermakna dari perubahan gaya hidup masyarakat urban.", image: PlaceHolderImages[3].imageUrl },
    { id: "5", title: "Inovasi AI dalam industri kreatif", category: "Teknologi", author: "Lara Chen", readTime: "7 mnt", excerpt: "Bagaimana algoritma membantu desainer menciptakan karya yang lebih personal.", image: PlaceHolderImages[0].imageUrl },
    { id: "6", title: "Kesehatan mental di dunia digital", category: "Budaya", author: "Dr. Elena Smith", readTime: "5 mnt", excerpt: "Strategi untuk menjaga keseimbangan antara produktivitas dan kesejahteraan emosional.", image: PlaceHolderImages[1].imageUrl },
  ];

  const posts = useMemo(() => {
    if (!firestorePosts || firestorePosts.length === 0) return staticFallbackPosts;
    return firestorePosts;
  }, [firestorePosts]);

  const filteredResults = useMemo(() => {
    if (!queryText.trim()) return [];
    return posts.filter(post => 
      post.title?.toLowerCase().includes(queryText.toLowerCase()) ||
      post.category?.toLowerCase().includes(queryText.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(queryText.toLowerCase())
    );
  }, [queryText, posts]);

  const latestNews = useMemo(() => {
    return posts.slice(0, 6);
  }, [posts]);

  const recommendedNews = useMemo(() => {
    return posts.slice().reverse().slice(0, 6);
  }, [posts]);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-40 pb-24">
        <div className="space-y-12 mb-20">
          <div className="flex flex-col gap-4">
            <MutedText className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Hasil pencarian</MutedText>
            <Title className="text-4xl md:text-5xl tracking-tighter">
              &ldquo;{queryText}&rdquo;
            </Title>
            <BodyText className="opacity-60">
              {isLoading ? "Sedang mencari berita..." : `Ditemukan ${filteredResults.length} hasil pencarian.`}
            </BodyText>
          </div>

          {!isLoading && filteredResults.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 px-10 rounded-3xl border-2 border-dashed border-primary/10 flex flex-col items-center text-center space-y-8 bg-white/10 backdrop-blur-sm"
            >
              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center text-primary/20">
                <SearchIcon className="h-10 w-10" />
              </div>
              <div className="space-y-3">
                <Heading level={2} className="text-2xl">Maaf, kami tidak menemukan hasil</Heading>
                <BodyText className="max-w-md mx-auto">
                  Coba gunakan kata kunci lain yang lebih umum atau periksa kembali ejaan Anda.
                </BodyText>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="outline" 
                  className="rounded-full px-8 h-12 font-bold text-[11px] tracking-widest bg-white/40"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Cari kata kunci lain
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  className="rounded-full px-8 h-12 font-bold text-[11px] tracking-widest shadow-lg"
                >
                  Lihat berita lainnya
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResults.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40">
                    <Link href={`/news/${post.id}`}>
                      <div className="relative h-56 w-full overflow-hidden bg-muted">
                        <Image 
                          src={post.image || PlaceHolderImages[idx % 4].imageUrl} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/95 backdrop-blur-md text-primary hover:bg-white text-[9px] font-bold border-none shadow-md px-3 py-1 tracking-wide">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-7 flex-1 flex flex-col">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{post.readTime || "5 mnt"}</span>
                        </div>
                        <Link href={`/news/${post.id}`}>
                          <h3 className="text-lg font-headline font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                            {post.title}
                          </h3>
                        </Link>
                        <BodyText className="text-sm line-clamp-3 opacity-60">
                          {post.excerpt}
                        </BodyText>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                        <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Penulis InfoFlow"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Branding & More News */}
        <div className="pt-20 space-y-32">
          <NewsCarousel posts={latestNews} sectionTitle="Berita terbaru" viewAllLink="/latest" />
          <NewsCarousel posts={recommendedNews} sectionTitle="Rekomendasi untuk Anda" viewAllLink="/recommendations" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
