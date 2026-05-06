
"use client";

import { Title, Heading, BodyText, MutedText, TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyMuted, TypographyLarge, TypographySmall } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Bookmark, ChevronRight, Share2, AlertCircle, ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem, FadeIn } from "@/components/wrapped/Motion";
import { Container, Section } from "@/components/wrapped/Layout";
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
import { formatCasing } from "@/lib/casing";
import { PromotionBanner } from "@/components/wrapped/PromotionBanner";

// Memaksa Vercel untuk selalu merender halaman ini secara dinamis untuk stabilitas rute
export const dynamic = 'force-dynamic';

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

  const buttonSize = variant === "hero" ? "h-9 w-9" : "h-8 w-8";

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "rounded-md transition-colors", 
          buttonSize,
          isSaved && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
        )}
        onClick={handleToggle}
      >
        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-lg p-6 sm:p-8 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">Akses terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Silakan masuk terlebih dahulu untuk mengarsipkan berita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2">
            <AlertDialogCancel className="h-10">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="h-10">
              Masuk sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const NewsCarousel = ({ posts, sectionTitle, viewAllLink, isLoading }: { posts: any[], sectionTitle: string, viewAllLink: string, isLoading?: boolean }) => {
  return (
    <Section className="py-12 sm:py-16">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <TypographyH2 className="m-0 text-xl sm:text-2xl">{sectionTitle}</TypographyH2>
        <Link href={viewAllLink} className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors">
          <span>{formatCasing("Lihat semua", 'sentence')}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] rounded-lg bg-secondary animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center bg-secondary rounded-lg border border-dashed border-border">
          <MutedText className="text-sm">Belum ada konten untuk bagian ini.</MutedText>
        </div>
      ) : (
        <Carousel opts={{ align: "start", loop: posts.length > 3 }} className="w-full relative">
          <CarouselContent className="-ml-4">
            {posts.map((post, idx) => (
              <CarouselItem key={post._id || `carousel-item-${idx}`} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <Reveal delay={idx * 0.05} className="h-full">
                  <Card className="h-full flex flex-col group/card overflow-hidden">
                    <Link href={`/news/${post.slug}`}>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary">
                        <Image src={post.mainImage ? urlFor(post.mainImage).url() : PlaceHolderImages[idx % PlaceHolderImages.length].imageUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover/card:scale-105" />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium">{post.categories?.[0] || "Berita"}</Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <ReleaseDate date={post.publishedAt} className="text-xs text-muted-foreground" />
                        </div>
                        <Link href={`/news/${post.slug}`}>
                          <h3 className="font-semibold text-base leading-snug group-hover/card:text-foreground/70 transition-colors line-clamp-2">{post.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-xs font-medium text-muted-foreground">{post.author || "Redaksi PatureNews"}</span>
                        <BookmarkButton post={post} />
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              </CarouselItem>
            ))}
          </CarouselContent>
          {posts.length > 3 && (
            <div className="hidden lg:block">
              <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 h-10 w-10" />
              <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 h-10 w-10" />
            </div>
          )}
        </Carousel>
      )}
    </Section>
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
    <Container>
      <PromotionBanner />
      
      {hasError && (
        <FadeIn className="mb-12">
          <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-none">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Masalah koneksi data</AlertTitle>
            <AlertDescription className="text-xs">Gagal memuat berita dari Sanity. Mohon tambahkan domain anda ke daftar <b>CORS Origins</b> di dashboard Sanity anda.</AlertDescription>
          </Alert>
        </FadeIn>
      )}

      {isSanityLoading ? (
        <Section className="py-8"><div className="aspect-[16/9] w-full bg-secondary animate-pulse rounded-lg" /></Section>
      ) : heroPost ? (
        <Section className="py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <Reveal className="lg:col-span-8">
              <Link href={`/news/${heroPost.slug}`} className="block group">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-secondary mb-6">
                  <Image src={heroPost.mainImage ? urlFor(heroPost.mainImage).url() : PlaceHolderImages[0].imageUrl} alt="Berita utama" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" priority />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1">Unggulan</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <TypographyH1 className="text-2xl sm:text-3xl lg:text-4xl group-hover:text-foreground/70 transition-colors">{heroPost.title}</TypographyH1>
                  <p className="text-base sm:text-lg text-muted-foreground line-clamp-2 max-w-2xl">
                    {heroPost.excerpt}
                  </p>
                </div>
              </Link>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <ReleaseDate date={heroPost.publishedAt} />
                  <span>•</span>
                  <span>{heroPost.author || "Redaksi PatureNews"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookmarkButton post={heroPost} variant="hero" />
                  <Button variant="outline" size="icon" className="rounded-md h-9 w-9"><Share2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </Reveal>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <TypographyH3 className="text-lg m-0">Trending</TypographyH3>
              </div>
              <RevealGroup className="flex flex-col gap-5">
                {trendingPosts.length > 0 ? trendingPosts.map((story, idx) => (
                  <RevealItem key={story._id || `trending-${idx}`}>
                    <Link href={`/news/${story.slug}`} className="group flex gap-4 items-start">
                      <span className="text-3xl font-headline font-semibold text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors tabular-nums shrink-0 leading-none">0{idx + 1}</span>
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <Badge variant="secondary" className="w-fit text-xs">{story.categories?.[0] || "Berita"}</Badge>
                        <h4 className="font-medium text-sm leading-snug group-hover:text-foreground/70 transition-colors line-clamp-2">{story.title}</h4>
                        <ReleaseDate date={story.publishedAt} className="text-xs text-muted-foreground" />
                      </div>
                    </Link>
                  </RevealItem>
                )) : <MutedText>Belum ada berita trending.</MutedText>}
              </RevealGroup>
              <Link href="/latest" className="group flex items-center justify-center p-6 border border-dashed border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-muted-foreground hover:text-foreground">
                <span>{formatCasing("Lihat berita lainnya", 'sentence')}</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Section>
      ) : (
        <div className="py-24 text-center">
          <TypographyH2>Selamat datang di PatureNews</TypographyH2>
          <BodyText className="mt-4">Belum ada berita yang diterbitkan hari ini.</BodyText>
        </div>
      )}

      <NewsCarousel posts={curatedPosts} sectionTitle="Pilihan redaksi" viewAllLink="/editors-choice" isLoading={isSanityLoading} />
      <NewsCarousel posts={latestPosts} sectionTitle="Berita terbaru" viewAllLink="/latest" isLoading={isSanityLoading} />
    </Container>
  );
}
