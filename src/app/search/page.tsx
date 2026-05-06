
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
import { Clock, Search as SearchIcon, RefreshCw, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { SEARCH_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";
import { formatCasing } from "@/lib/casing";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const queryText = searchParams.get("q") || "";
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!queryText.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    client.fetch(SEARCH_PAGE_QUERY, { searchTerm: `*${queryText}*` })
      .then((data) => {
        setResults(data || []);
      })
      .catch((err) => {
        console.error("Search fetch error:", err);
      })
      .finally(() => setIsLoading(false));
  }, [queryText]);

  return (
    <div className="space-y-12 mb-20">
      <div className="flex flex-col gap-4">
        <MutedText className="text-[10px] font-bold opacity-40 tracking-widest uppercase">Pusat pencarian</MutedText>
        <Title className="text-4xl md:text-5xl tracking-tighter">
          &ldquo;{queryText}&rdquo;
        </Title>
        <BodyText className="opacity-60">
          {isLoading ? "Sedang menelusuri arsip..." : `Ditemukan ${results.length} hasil yang relevan.`}
        </BodyText>
      </div>

      {!isLoading && results.length === 0 ? (
        <div className="py-24 px-10 rounded-3xl border-2 border-dashed border-primary/10 flex flex-col items-center text-center space-y-8 bg-white/10 backdrop-blur-sm shadow-none">
          <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center text-primary/20">
            <SearchIcon className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <Heading level={2} className="text-2xl">Hasil tidak ditemukan</Heading>
            <BodyText className="max-w-md mx-auto">
              Maaf, kami tidak menemukan berita yang sesuai dengan kata kunci tersebut. Cobalah menggunakan istilah yang lebih umum.
            </BodyText>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={() => router.push('/')}
              variant="outline" 
              className="rounded-full px-8 h-12 font-bold text-[11px] tracking-widest bg-white/40 shadow-none border-primary/10"
            >
              Kembali ke beranda
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {results.map((post, idx) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="h-full flex flex-col group hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                <Link href={`/news/${post.slug}`}>
                  <div className="relative h-56 w-full overflow-hidden bg-muted">
                    <Image 
                      src={post.mainImage ? urlFor(post.mainImage).url() : `https://picsum.photos/seed/${post._id}/600/400`} 
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 backdrop-blur-md text-primary hover:bg-white text-[9px] font-bold border-none shadow-none px-3 py-1 tracking-wide uppercase">
                        {post.categories?.[0] || "Berita"}
                      </Badge>
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
                      <h3 className="text-lg font-headline font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                    <BodyText className="text-sm line-clamp-3 opacity-60">
                      {post.excerpt}
                    </BodyText>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                    <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Redaksi PatureNews"}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
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
      <main className="max-w-7xl mx-auto px-4 pt-10 pb-24">
        <Suspense fallback={
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin opacity-20" />
            <BodyText className="text-xs opacity-40 uppercase tracking-widest font-bold">Mempersiapkan hasil pencarian...</BodyText>
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
