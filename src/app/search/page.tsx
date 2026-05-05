'use client';

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
import { Clock, Search as SearchIcon, RefreshCw } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { useMemo, Suspense } from "react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

function SearchResults() {
  const searchParams = useSearchParams();
  const queryText = searchParams.get("q") || "";
  const db = useFirestore();
  const router = useRouter();

  const postsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "posts"), limit(50));
  }, [db]);
  
  const { data: firestorePosts, isLoading } = useCollection(postsQuery);

  const filteredResults = useMemo(() => {
    if (!queryText.trim() || !firestorePosts) return [];
    return firestorePosts.filter(post => 
      post.title?.toLowerCase().includes(queryText.toLowerCase()) ||
      post.category?.toLowerCase().includes(queryText.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(queryText.toLowerCase())
    );
  }, [queryText, firestorePosts]);

  return (
    <div className="space-y-12 mb-20">
      <div className="flex flex-col gap-4">
        <MutedText className="text-[10px] font-bold opacity-40 tracking-widest">Hasil pencarian</MutedText>
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
              Coba gunakan kata kunci lain yang lebih umum atau periksa kembali ejaan anda.
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
                      src={post.image || PlaceHolderImages[idx % PlaceHolderImages.length].imageUrl} 
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
                    <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.authorName || "Redaksi PatureNews"}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-40 pb-24">
        <Suspense fallback={<div className="py-20 text-center"><RefreshCw className="h-8 w-8 animate-spin mx-auto opacity-20" /></div>}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
