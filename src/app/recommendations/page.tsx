
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Filter, Heart, Clock } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, limit, orderBy } from "firebase/firestore";

export default function RecommendationsPage() {
  const db = useFirestore();
  const topics = ["Teknologi", "Desain", "Bisnis", "Budaya", "Sains", "Gaya Hidup", "Lingkungan"];
  
  // Independent mapping logic for dynamic recommendations
  const recQuery = useMemoFirebase(() => query(collection(db, "posts"), limit(12)), [db]);
  const { data: firestorePosts, isLoading } = useCollection(recQuery);

  const sections = [
    {
      title: "Berdasarkan minat Anda",
      posts: firestorePosts?.slice(0, 3) || []
    },
    {
      title: "Sedang hangat didiskusikan",
      posts: firestorePosts?.slice(3, 6) || []
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-40 pb-24">
        <div className="space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <Title>Rekomendasi untuk Anda</Title>
              <BodyText>
                Wawasan yang dikurasi secara mandiri berdasarkan algoritma mapping konten InfoFlow untuk menjaga kualitas informasi Anda.
              </BodyText>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Button key={topic} variant="outline" size="sm" className="rounded-full text-[10px] font-bold bg-white/40 border-primary/5 hover:bg-primary hover:text-white transition-all">
                  {topic}
                </Button>
              ))}
              <Button size="sm" className="rounded-full h-9 w-9 p-0 bg-primary/5 text-primary border-none shadow-none hover:bg-primary hover:text-white transition-all">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-32">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="aspect-video bg-primary/5 animate-pulse rounded-xl" />)}
              </div>
            ) : (
              sections.map((section, secIdx) => (
                <section key={section.title} className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-primary/5 pb-6">
                    <Heading level={2}>{section.title}</Heading>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {section.posts.map((post: any, idx: number) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
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
                                <h4 className="text-lg font-headline font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                  {post.title}
                                </h4>
                              </Link>
                              <BodyText className="text-sm line-clamp-3 opacity-60">
                                {post.excerpt}
                              </BodyText>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                              <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.authorName || post.author}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          <section className="bg-primary/95 text-primary-foreground rounded-3xl p-16 text-center space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-175 group-hover:rotate-45">
              <Sparkles className="h-40 w-40" />
            </div>
            <div className="relative z-10 space-y-6">
              <Heading level={2} className="text-white text-4xl">Ingin topik yang lebih spesifik?</Heading>
              <BodyText className="max-w-2xl mx-auto text-white/70">
                Sesuaikan preferensi konten Anda di pengaturan profil untuk mendapatkan kurasi berita yang lebih akurat setiap harinya.
              </BodyText>
              <div className="flex justify-center pt-4">
                <Link href="/profile">
                  <Button variant="secondary" className="font-bold text-xs rounded-full px-12 h-12 shadow-lg hover:scale-105 transition-transform">
                    Atur preferensi profil
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
