"use client";

import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, RefreshCw } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";

export default function LatestNewsPage() {
  const db = useFirestore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const latestQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(20));
  }, [db]);
  
  const { data: firestorePosts, isLoading } = useCollection(latestQuery);

  const groupedPosts = useMemo(() => {
    if (!firestorePosts) return [];
    const groups: Record<string, any[]> = {};
    
    firestorePosts.forEach(post => {
      // Menggunakan format UTC yang stabil untuk pengelompokan di server/klien
      let dateString = "Lainnya";
      try {
        const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
        if (!isNaN(date.getTime())) {
          dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        }
      } catch (e) {
        // Fallback jika tanggal tidak valid
      }
      
      if (!groups[dateString]) groups[dateString] = [];
      groups[dateString].push(post);
    });
    return Object.entries(groups).map(([date, posts]) => ({ date, posts }));
  }, [firestorePosts]);

  const formatDateLabel = (isoDate: string) => {
    if (isoDate === "Lainnya") return isoDate;
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return isoDate;
    }
  };

  if (!hasMounted) {
    return (
      <div className="space-y-16">
        <div className="space-y-4">
          <Title>Berita terbaru</Title>
          <BodyText className="max-w-2xl">Menyiapkan aliran informasi terkini...</BodyText>
        </div>
        <div className="py-20 flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin opacity-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="space-y-4">
        <Title>Berita terbaru</Title>
        <BodyText className="max-w-2xl">Aliran informasi terkini yang dikurasi secara mandiri dari berbagai kategori untuk memastikan anda tetap terhubung dengan perkembangan dunia.</BodyText>
      </div>

      {isLoading ? (
        <div className="space-y-12">
          {[1, 2].map(i => <div key={i} className="h-64 bg-primary/5 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-20">
          {groupedPosts.map((group, idx) => (
            <motion.section key={group.date} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="space-y-8">
              <div className="flex items-center gap-4">
                <div>
                  <Heading level={3} className="text-xl">Arsip harian</Heading>
                  <MutedText className="text-[10px] font-bold opacity-40 tracking-wider uppercase">
                    {formatDateLabel(group.date)}
                  </MutedText>
                </div>
                <Separator className="flex-1 opacity-10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {group.posts.map((post) => (
                  <motion.div key={post.id} whileHover={{ y: -4 }}>
                    <Card className="h-full flex flex-col group transition-all duration-500 rounded-xl overflow-hidden border-primary/5 bg-white/40 shadow-none">
                      <Link href={`/news/${post.id}`}>
                        <div className="relative h-56 w-full overflow-hidden bg-muted">
                          <Image src={post.image || `https://picsum.photos/seed/${post.id}/600/400`} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/95 backdrop-blur-md text-primary hover:bg-white text-[9px] font-bold border-none shadow-none px-3 py-1 tracking-wide uppercase">{post.category}</Badge>
                          </div>
                        </div>
                      </Link>
                      <CardContent className="p-7 flex-1 flex flex-col">
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                            <ReleaseDate date={post.createdAt} className="text-[10px] font-bold text-muted-foreground tracking-tight" />
                          </div>
                          <Link href={`/news/${post.id}`}><h4 className="text-lg font-headline font-bold mb-3 group-hover:text-primary transition-colors leading-tight">{post.title}</h4></Link>
                          <BodyText className="text-sm line-clamp-2 opacity-60">{post.excerpt}</BodyText>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                          <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.authorName || post.author}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
