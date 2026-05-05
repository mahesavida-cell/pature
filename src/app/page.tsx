
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Bookmark, ChevronRight, Share2, Sun, Cloud, CloudRain, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  useUser, 
  useFirestore, 
  useDoc, 
  useCollection,
  useMemoFirebase, 
  setDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from "@/firebase";
import { doc, collection, query, orderBy, limit, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const MarketWeatherBar = () => {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  
  const cities = [
    { name: "Jakarta", temp: "31°C", status: "Cerah", icon: <Sun className="h-3 w-3" /> },
    { name: "Surabaya", temp: "33°C", status: "Berawan", icon: <Cloud className="h-3 w-3" /> },
    { name: "Bandung", temp: "24°C", status: "Hujan", icon: <CloudRain className="h-3 w-3" /> },
    { name: "Medan", temp: "29°C", status: "Cerah", icon: <Sun className="h-3 w-3" /> },
  ];

  const stocks = [
    { symbol: "IHSG", price: "7,245.12", change: "+0.45%", up: true },
    { symbol: "BBCA", price: "10,125", change: "-0.25%", up: false },
    { symbol: "BBRI", price: "4,850", change: "+1.20%", up: true },
    { symbol: "TLKM", price: "3,120", change: "-0.95%", up: false },
    { symbol: "ASII", price: "5,150", change: "+0.10%", up: true },
    { symbol: "GOTO", price: "52", change: "0.00%", up: true },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cities.length]);

  return (
    <div className="border-b border-primary/5 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-10 flex items-center justify-between overflow-hidden">
        {/* Weather Section (Left) */}
        <div className="flex items-center gap-3 w-48 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCityIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-primary/40">{cities[currentCityIndex].icon}</span>
              <span className="text-[10px] font-bold text-primary tracking-tight">
                {cities[currentCityIndex].name} {cities[currentCityIndex].temp}
              </span>
              <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                {cities[currentCityIndex].status}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stock Ticker (Right) */}
        <div className="flex-1 relative flex items-center overflow-hidden ml-8">
          <motion.div
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...stocks, ...stocks].map((stock, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-primary">{stock.symbol}</span>
                <span className="text-[10px] font-medium text-muted-foreground">{stock.price}</span>
                <div className={cn(
                  "flex items-center gap-0.5 text-[9px] font-bold",
                  stock.up ? "text-green-600" : "text-red-600"
                )}>
                  {stock.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {stock.change}
                </div>
              </div>
            ))}
          </motion.div>
          {/* Fading Gradients for ticker smooth look */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/50 to-transparent z-10" />
        </div>
      </div>
    </div>
  );
};

const BookmarkButton = ({ post, variant = "card" }: { post: any, variant?: "hero" | "card" }) => {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const bookmarkRef = useMemoFirebase(() => 
    user && post.id ? doc(db, "users", user.uid, "bookmarks", post.id) : null, 
    [db, user, post.id]
  );
  const { data: bookmarkData } = useDoc(bookmarkRef);
  const isSaved = !!bookmarkData;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setIsDialogOpen(true);
      return;
    }
    if (!bookmarkRef) return;

    if (isSaved) {
      deleteDocumentNonBlocking(bookmarkRef);
      toast({ title: "Dihapus dari arsip", description: `"${post.title}" berhasil dihapus.` });
    } else {
      setDocumentNonBlocking(bookmarkRef, {
        postId: post.id,
        title: post.title,
        category: post.category,
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Berhasil diarsipkan", description: `"${post.title}" tersimpan di profil.` });
    }
  };

  const buttonSize = variant === "hero" ? "h-11 w-11" : "h-9 w-9";

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "rounded-full transition-all border-primary/10 shadow-sm bg-white/40 backdrop-blur-md", 
          buttonSize,
          isSaved && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
        )}
        onClick={handleToggle}
      >
        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-lg p-8 bg-white/90 backdrop-blur-xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl text-primary">Akses terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm opacity-70 text-foreground">Silakan masuk terlebih dahulu untuk mengarsipkan berita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="rounded-sm font-bold text-[10px] h-11 uppercase tracking-widest">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-sm font-bold text-[10px] bg-primary h-11 shadow-sm uppercase tracking-widest text-white">Masuk sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const NewsCarousel = ({ posts, sectionTitle, viewAllLink, isLoading }: { posts: any[], sectionTitle: string, viewAllLink: string, isLoading?: boolean }) => {
  return (
    <section className="mb-24 lg:mb-32">
      <div className="flex items-center justify-between mb-8 border-b border-primary/5 pb-6">
        <Heading level={2}>{sectionTitle}</Heading>
        <Link href={viewAllLink}>
          <Button variant="ghost" className="text-[10px] font-bold tracking-widest hover:underline px-4 transition-all uppercase">Lihat semua</Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] rounded-xl bg-primary/5 animate-pulse" />)}
        </div>
      ) : (
        <Carousel opts={{ align: "start", loop: posts.length > 3 }} className="w-full relative group">
          <CarouselContent className="-ml-4">
            {posts.map((post, idx) => (
              <CarouselItem key={post.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col group/card hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40">
                    <Link href={`/news/${post.id}`}>
                      <div className="relative h-56 w-full overflow-hidden bg-muted">
                        <Image 
                          src={post.image || `https://picsum.photos/seed/${post.id}/600/400`} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/95 backdrop-blur-md text-primary hover:bg-white text-[9px] font-bold border-none shadow-md px-3 py-1 tracking-wide uppercase">
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
                        <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.authorName || post.author || "Penulis InfoFlow"}</span>
                        <BookmarkButton post={post} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {posts.length > 3 && (
            <div className="hidden lg:block">
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 border-primary/5 bg-white/40 backdrop-blur-md" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 border-primary/5 bg-white/40 backdrop-blur-md" />
            </div>
          )}
        </Carousel>
      )}
    </section>
  );
};

export default function Home() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Journalistic selection for Hero: The single latest post
  const heroQuery = useMemoFirebase(() => query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(1)), [db]);
  const { data: heroData } = useCollection(heroQuery);
  const heroPost = heroData?.[0] || {
    id: "hero-placeholder",
    title: "Revolusi senyap informasi profesional",
    category: "Media",
    readTime: "5 menit baca",
    author: "Alex Rivers",
    excerpt: "Temukan bagaimana InfoFlow menjadi standar baru untuk jurnalisme digital minimalis yang memprioritaskan kejelasan di atas segalanya.",
    image: PlaceHolderImages[0].imageUrl
  };

  // Latest news excluding the Hero post (journalistic standard)
  const latestQuery = useMemoFirebase(() => query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(7)), [db]);
  const { data: allLatestPosts, isLoading: isLatestLoading } = useCollection(latestQuery);
  const carouselLatestPosts = useMemo(() => {
    if (!allLatestPosts) return [];
    // Skip the first post because it's already used as the Hero
    return allLatestPosts.slice(1);
  }, [allLatestPosts]);

  const trendingQuery = useMemoFirebase(() => query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(5)), [db]);
  const { data: trendingPosts, isLoading: isTrendingLoading } = useCollection(trendingQuery);

  const curatedQuery = useMemoFirebase(() => query(collection(db, "posts"), where("category", "==", "Media"), limit(6)), [db]);
  const { data: curatedPosts, isLoading: isCuratedLoading } = useCollection(curatedQuery);

  if (!mounted) return null;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-20"> {/* Offset for Navbar */}
        <MarketWeatherBar />
        <main className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32 pb-20">
          {/* Hero & Trending Section */}
          <section className="mb-24 lg:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <motion.div 
                className="lg:col-span-8 space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Link href={`/news/${heroPost.id}`} className="block group">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted shadow-sm mb-8 border border-primary/5">
                    <Image 
                      src={heroPost.image || PlaceHolderImages[0].imageUrl} 
                      alt="Berita utama"
                      fill
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-6 left-6">
                      <Badge variant="secondary" className="px-4 py-1.5 rounded-sm border-none font-bold text-[10px] shadow-sm bg-white/95 backdrop-blur-md text-primary tracking-wider uppercase">
                        Unggulan hari ini
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Title className="group-hover:text-primary/80 transition-colors">
                      {heroPost.title}
                    </Title>
                    <BodyText className="line-clamp-2 max-w-3xl">
                      {heroPost.excerpt}
                    </BodyText>
                  </div>
                </Link>
                <div className="flex items-center gap-6 pt-4 border-t border-primary/5">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground tracking-tight">
                    <Clock className="h-3.5 w-3.5" /> {heroPost.readTime || "5 mnt"} • {heroPost.authorName || heroPost.author}
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <BookmarkButton post={heroPost} variant="hero" />
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 border-primary/10 hover:bg-primary/5 bg-white/40">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              <div className="lg:col-span-4 space-y-8">
                <div className="flex items-center justify-between border-b border-primary/5 pb-5">
                  <Heading level={3} className="text-lg">Trending</Heading>
                </div>
                <div className="space-y-8">
                  {isTrendingLoading ? (
                    [1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 w-full bg-primary/5 animate-pulse rounded-lg" />)
                  ) : (trendingPosts || []).map((story, idx) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <Link href={`/news/${story.id}`} className="group flex gap-5 items-start">
                        <span className="text-4xl font-headline font-bold text-primary/10 group-hover:text-primary/20 transition-colors tabular-nums shrink-0 leading-none">
                          0{idx + 1}
                        </span>
                        <div className="space-y-1.5 flex-1">
                          <Badge variant="secondary" className="px-2 py-0 h-auto text-[8px] font-bold bg-primary/5 text-primary border-none rounded-sm shadow-none tracking-tight uppercase">
                            {story.category}
                          </Badge>
                          <h4 className="text-sm font-headline font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {story.title}
                          </h4>
                          <MutedText className="text-[9px] font-bold block">{story.readTime || "5 mnt"} baca</MutedText>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <Link href="/latest" className="block">
                  <Button variant="ghost" className="w-full justify-between text-[10px] font-bold hover:underline rounded-lg px-5 py-7 border border-dashed border-primary/20 mt-4 tracking-widest uppercase">
                    Lihat berita lainnya <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <NewsCarousel 
            posts={curatedPosts || []} 
            sectionTitle="Pilihan redaksi" 
            viewAllLink="/editors-choice" 
            isLoading={isCuratedLoading}
          />

          <NewsCarousel 
            posts={carouselLatestPosts || []} 
            sectionTitle="Berita terbaru" 
            viewAllLink="/latest" 
            isLoading={isLatestLoading}
          />

          <NewsCarousel 
            posts={curatedPosts?.slice().reverse() || []} 
            sectionTitle="Rekomendasi untuk anda" 
            viewAllLink="/recommendations" 
            isLoading={isCuratedLoading}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}
