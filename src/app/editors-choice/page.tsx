"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";

export default function EditorsChoicePage() {
  const db = useFirestore();

  // Mapping logic for Editors Choice - using category "Media" as a placeholder for curated content
  const editorsQuery = useMemoFirebase(() => query(collection(db, "posts"), where("category", "==", "Media"), limit(12)), [db]);
  const { data: firestorePosts, isLoading } = useCollection(editorsQuery);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-12 pb-24">
        <div className="space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Title className="text-5xl">Esei dan kurasi terbaik</Title>
            <BodyText className="text-xl">
              Pilihan mendalam yang dikurasi secara mandiri oleh tim redaksi kami untuk memberikan wawasan melampaui berita harian.
            </BodyText>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-primary/5 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
              {(firestorePosts || []).map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <Card className="h-full flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-xl overflow-hidden border-primary/5">
                    <Link href={`/news/${post.id}`}>
                      <div className="relative h-56 w-full overflow-hidden bg-muted">
                        <Image 
                          src={post.image || `https://picsum.photos/seed/${post.id}/600/400`} 
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
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/5">
                        <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.authorName || post.author}</span>
                        <Link href={`/news/${post.id}`}>
                          <ArrowRight className="h-4 w-4 text-primary hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
