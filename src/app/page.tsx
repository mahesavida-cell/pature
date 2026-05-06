
"use client";

import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Bookmark, ChevronRight, Share2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  useUser, 
  useFirestore, 
  useDoc, 
  useMemoFirebase, 
  setDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const BookmarkButton = ({ post, variant = "card" }: { post: any, variant?: "hero" | "card" }) => {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const postId = post?._id || post?.id;
  const bookmarkRef = useMemoFirebase(() => 
    user && db && postId ? doc(db, "userProfiles", user.uid, "bookmarks", postId) : null, 
    [db, user, postId]
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
        postId: postId,
        title: post.title,
        category: post.categories?.[0] || post.category || "Berita",
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
          "rounded-full transition-all border-primary/10 shadow-none bg-white/40 backdrop-blur-md", 
          buttonSize,
          isSaved && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
        )}
        onClick={handleToggle}
      >
        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-lg p-8 bg-white/95 backdrop-blur-xl border-none shadow-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl text-primary">Akses terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm opacity-70 text-foreground">Silakan masuk terlebih dahulu untuk mengarsipkan berita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-sm font-bold text-[10px] bg-primary h-11 shadow-none tracking-widest text-white uppercase">Masuk sekarang</AlertDialogAction>
            <AlertDialogCancel className="rounded-sm font-bold text-[10px] h-11 tracking-widest uppercase">Batal</AlertDialogCancel>
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
      ) : posts.length === 0 ? (
        <div className="py-20 text-center bg-primary/5 rounded-xl border border-dashed border-primary/10">
          <MutedText className="text-xs font-bold opacity-40">Belum ada konten untuk bagian ini.</MutedText>
        </div>
      ) : (
        <Carousel opts={{ align: "start", loop: posts.length > 3 }} className="w-full relative group">
          <CarouselContent className="-ml-4">
            {posts.map((post, idx) => (
              <CarouselItem key={post._id || `carousel-item-${idx}`} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="h-full">
                  <Card className="h-full flex flex-col group/card transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                    <Link href={`/news/${post.slug}`}>
                      <div className="relative h-56 w-full overflow-hidden bg-muted">
                        <Image src={post.mainImage ? urlFor(post.mainImage).url() : PlaceHolderImages[idx % PlaceHolderImages.length].imageUrl} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover/card:scale-105" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/95 backdrop-blur-md text-primary hover:bg-white text-[9px] font-bold border-none shadow-none px-3 py-1 tracking-wide uppercase">{post.categories?.[0] || "Berita"}</Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-7 flex-1 flex flex-col">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <ReleaseDate date={post.publishedAt} className="text-[10px] font-bold text-muted-foreground tracking-tight" />
                        </div>
                        <Link href={`/news/${post.slug}`}>
                          <h3 className="text-lg font-headline font-bold mb-3 group-hover/card:text-primary transition-colors leading-tight">{post.title}</h3>
                        </Link>
                        <BodyText className="text-sm line-clamp-3 opacity-60">{post.excerpt}</BodyText>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/5">
                        <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Redaksi PatureNews"}</span>
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
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10 border-primary/5 bg-white/40 backdrop-blur-md shadow-none" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10 border-primary/5 bg-white/40 backdrop-blur-md shadow-none" />
            </div>
          )}
        </Carousel>
      )}
    </section>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sanityPosts, setSanityPosts] = useState<any[]>([]);
  const [isSanityLoading, setIsSanityLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchSanityData = async () => {
      try {
        const posts = await client.fetch(POSTS_QUERY);
        setSanityPosts(posts || []);
        setHasError(false);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsSanityLoading(false);
      }
    };
    fetchSanityData();
  }, []);

  const heroPost = useMemo(() => (sanityPosts.length > 0 ? sanityPosts[0] : null), [sanityPosts]);
  const latestPosts = useMemo(() => (sanityPosts.length <= 1 ? [] : sanityPosts.slice(1, 7)), [sanityPosts]);
  const trendingPosts = useMemo(() => sanityPosts.filter(p => p.isTrending).slice(0, 5), [sanityPosts]);
  const curatedPosts = useMemo(() => sanityPosts.filter(p => p.isEditorsChoice).slice(0, 6), [sanityPosts]);

  if (!mounted) return null;

  return (
    <div className="space-y-16">
      {hasError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-none">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Masalah koneksi data</AlertTitle>
            <AlertDescription className="text-xs">Gagal memuat berita dari Sanity. Mohon tambahkan domain anda ke daftar <b>CORS Origins</b> di dashboard Sanity anda.</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {isSanityLoading ? (
        <section className="mb-24 lg:mb-32"><div className="aspect-[16/9] w-full bg-primary/5 animate-pulse rounded-xl" /></section>
      ) : heroPost ? (
        <section className="mb-24 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <motion.div className="lg:col-span-8 space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <Link href={`/news/${heroPost.slug}`} className="block group">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted shadow-none mb-8 border border-primary/5">
                  <Image src={heroPost.mainImage ? urlFor(heroPost.mainImage).url() : PlaceHolderImages[0].imageUrl} alt="Berita utama" fill className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" priority />
                  <div className="absolute top-6 left-6">
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-sm border-none font-bold text-[10px] shadow-none bg-white/95 backdrop-blur-md text-primary tracking-wider uppercase">Unggulan hari ini</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <Title className="group-hover:text-primary/80 transition-colors">{heroPost.title}</Title>
                  <BodyText className="line-clamp-2 max-w-3xl">{heroPost.excerpt}</BodyText>
                </div>
              </Link>
              <div className="flex items-center gap-6 pt-4 border-t border-primary/5">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground tracking-tight">
                  <Clock className="h-3.5 w-3.5" /> <ReleaseDate date={heroPost.publishedAt} /> • {heroPost.author || "Redaksi PatureNews"}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <BookmarkButton post={heroPost} variant="hero" />
                  <Button variant="outline" size="icon" className="rounded-full h-11 w-11 border-primary/10 hover:bg-primary/5 bg-white/40 shadow-none"><Share2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </motion.div>
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center justify-between border-b border-primary/5 pb-5"><Heading level={3} className="text-lg">Trending</Heading></div>
              <div className="space-y-8">
                {trendingPosts.length > 0 ? trendingPosts.map((story, idx) => (
                  <motion.div key={story._id || `trending-${idx}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1, duration: 0.5 }}>
                    <Link href={`/news/${story.slug}`} className="group flex gap-5 items-start">
                      <span className="text-4xl font-headline font-bold text-primary/10 group-hover:text-primary/20 transition-colors tabular-nums shrink-0 leading-none">0{idx + 1}</span>
                      <div className="space-y-1.5 flex-1">
                        <Badge variant="secondary" className="px-2 py-0 h-auto text-[8px] font-bold bg-primary/5 text-primary border-none rounded-sm shadow-none tracking-tight uppercase">{story.categories?.[0] || "Berita"}</Badge>
                        <h4 className="text-sm font-headline font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{story.title}</h4>
                        <ReleaseDate date={story.publishedAt} className="text-[9px] font-bold block" />
                      </div>
                    </Link>
                  </motion.div>
                )) : <MutedText className="text-xs italic opacity-40">Belum ada berita trending.</MutedText>}
              </div>
              <Link href="/latest" className="block"><Button variant="ghost" className="w-full justify-between text-[10px] font-bold hover:underline rounded-lg px-5 py-7 border border-dashed border-primary/20 mt-4 tracking-widest uppercase">Lihat berita lainnya <ChevronRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </section>
      ) : <div className="py-32 text-center"><Heading level={2}>Selamat datang di PatureNews</Heading><BodyText className="mt-4">Belum ada berita yang diterbitkan hari ini.</BodyText></div>}

      <NewsCarousel posts={curatedPosts} sectionTitle="Pilihan redaksi" viewAllLink="/editors-choice" isLoading={isSanityLoading} />
      <NewsCarousel posts={latestPosts} sectionTitle="Berita terbaru" viewAllLink="/latest" isLoading={isSanityLoading} />
    </div>
  );
}
