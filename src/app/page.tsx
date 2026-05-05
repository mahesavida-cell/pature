
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
import { Clock, Bookmark, TrendingUp, ChevronRight, Share2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
            <AlertDialogTitle className="font-headline font-bold text-xl">Akses terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm opacity-70">Silakan masuk terlebih dahulu untuk mengarsipkan berita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="rounded-sm font-bold text-[10px] h-11">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-sm font-bold text-[10px] bg-primary h-11 shadow-sm">Masuk sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroPost = {
    id: "hero-1",
    title: "Revolusi senyap informasi profesional",
    category: "Media",
    readTime: "5 menit baca",
    author: "Alex Rivers"
  };

  const trendingStories = [
    { id: "t1", title: "Kebangkitan ekonomi kreatif digital di Asia Tenggara", category: "Bisnis", readTime: "4 mnt" },
    { id: "t2", title: "Bagaimana remote work mengubah lanskap perkotaan", category: "Budaya", readTime: "5 mnt" },
    { id: "t3", title: "Inovasi baterai ramah lingkungan untuk masa depan", category: "Sains", readTime: "6 mnt" },
    { id: "t4", title: "Seni generatif: antara kreativitas dan algoritma", category: "Teknologi", readTime: "4 mnt" },
    { id: "t5", title: "Minimalisme dalam arsitektur modern", category: "Desain", readTime: "3 mnt" },
  ];

  const curatedStories = [
    { id: "h1", title: "Terobosan AI dalam diagnosa medis terkini", category: "Sains", readTime: "4 mnt", image: PlaceHolderImages[0].imageUrl },
    { id: "h2", title: "Startup lokal raih pendanaan seri B", category: "Bisnis", readTime: "3 mnt", image: PlaceHolderImages[1].imageUrl },
    { id: "h3", title: "Pameran seni digital di Jakarta", category: "Budaya", readTime: "5 mnt", image: PlaceHolderImages[2].imageUrl },
  ];

  const posts = [
    {
      id: "1",
      title: "Evolusi desain digital minimalis",
      category: "Desain",
      author: "Alex Rivers",
      readTime: "5 menit baca",
      excerpt: "Menjelajahi bagaimana ruang kosong dan tipografi yang jelas menjadi standar untuk sistem informasi modern.",
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

  const recommendedPosts = [
    {
      id: "r1",
      title: "Penerapan ekonomi sirkular pada industri kreatif",
      category: "Bisnis",
      readTime: "4 mnt",
      image: "https://picsum.photos/seed/rec1/400/250"
    },
    {
      id: "r2",
      title: "Eksplorasi material ramah lingkungan untuk hunian",
      category: "Desain",
      readTime: "6 mnt",
      image: "https://picsum.photos/seed/rec2/400/250"
    },
    {
      id: "r3",
      title: "Potensi pariwisata berkelanjutan di pedesaan",
      category: "Budaya",
      readTime: "5 mnt",
      image: "https://picsum.photos/seed/rec3/400/250"
    }
  ];

  if (!mounted) return null;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-48 lg:pt-56 pb-20">
        {/* Hero & Trending Section */}
        <section className="mb-24 lg:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Hero Left */}
            <motion.div 
              className="lg:col-span-8 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Link href="/news/1" className="block group">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted shadow-sm mb-8 border border-primary/5">
                  <Image 
                    src={PlaceHolderImages[0].imageUrl} 
                    alt="Berita utama"
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    priority
                  />
                  <div className="absolute top-6 left-6">
                    <Badge variant="secondary" className="px-4 py-1.5 rounded-sm border-none font-bold text-[10px] shadow-sm bg-white/95 backdrop-blur-md text-primary tracking-wider">
                      Unggulan hari ini
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <Title className="group-hover:text-primary/80 transition-colors">
                    {heroPost.title}
                  </Title>
                  <BodyText className="line-clamp-2 max-w-3xl">
                    Temukan bagaimana InfoFlow menjadi standar baru untuk jurnalisme digital minimalis yang memprioritaskan kejelasan di atas segalanya.
                  </BodyText>
                </div>
              </Link>
              <div className="flex items-center gap-6 pt-4 border-t border-primary/5">
                <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground tracking-tight">
                  <Clock className="h-3.5 w-3.5" /> {heroPost.readTime} • {heroPost.author}
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <BookmarkButton post={heroPost} variant="hero" />
                  <Button variant="outline" size="icon" className="rounded-full h-11 w-11 border-primary/10 hover:bg-primary/5">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Trending Right */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3 border-b border-primary/5 pb-5">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-lg">Trending</Heading>
              </div>
              <div className="space-y-8">
                {trendingStories.map((story, idx) => (
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
                        <Badge variant="secondary" className="px-2 py-0 h-auto text-[8px] font-bold bg-primary/5 text-primary border-none rounded-sm shadow-none tracking-tight">
                          {story.category}
                        </Badge>
                        <h4 className="text-sm font-headline font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {story.title}
                        </h4>
                        <MutedText className="text-[9px] font-bold block">{story.readTime} baca</MutedText>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Link href="/latest" className="block">
                <Button variant="ghost" className="w-full justify-between text-[10px] font-bold hover:underline rounded-lg px-5 py-7 border border-dashed border-primary/20 mt-4 tracking-widest">
                  Lihat berita lainnya <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pilihan Redaksi Section */}
        <section className="mb-24 lg:mb-32">
          <div className="flex items-center justify-between mb-10 border-b border-primary/5 pb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <Heading level={2}>Pilihan redaksi</Heading>
            </div>
            <Link href="/editors-choice">
              <Button variant="ghost" className="text-[10px] font-bold tracking-widest hover:underline">Lihat semua</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {curatedStories.map((story, idx) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <Link href={`/news/${story.id}`} className="group block space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-primary/5 shadow-sm bg-muted">
                    <Image 
                      src={story.image} 
                      alt={story.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="px-2 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border-none rounded-sm tracking-tight">
                      {story.category}
                    </Badge>
                    <h4 className="text-base font-headline font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {story.title}
                    </h4>
                    <MutedText className="text-[10px] font-bold block">{story.readTime} baca</MutedText>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Berita Terbaru Section */}
        <section className="mb-24 lg:mb-32">
          <div className="flex items-center justify-between mb-12 border-b border-primary/5 pb-6">
            <Heading level={2}>Berita terbaru</Heading>
            <Link href="/latest">
              <Button variant="ghost" className="text-[10px] font-bold tracking-widest hover:underline px-6">Lihat semua</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15 }}
              >
                <Card className="h-full flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5">
                  <Link href={`/news/${post.id}`}>
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      {post.image && (
                        <Image 
                          src={post.image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
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
                        <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{post.readTime}</span>
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
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/5">
                      <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author}</span>
                      <BookmarkButton post={post} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Rekomendasi Section */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12 border-b border-primary/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <Heading level={2}>Rekomendasi untuk anda</Heading>
            </div>
            <Link href="/recommendations">
              <Button variant="ghost" className="text-[10px] font-bold tracking-widest hover:underline px-6">Lihat semua</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {recommendedPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/news/${post.id}`} className="group block">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-primary/5 shadow-sm">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="px-2 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border-none rounded-sm tracking-tight">
                      {post.category}
                    </Badge>
                    <h4 className="text-base font-headline font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <MutedText className="text-[10px] font-bold block tracking-tight">{post.readTime} baca</MutedText>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
