
"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POSTS_BY_CATEGORY_QUERY, CATEGORY_DETAIL_QUERY } from "@/sanity/lib/queries";
import { Container, Section } from "@/components/wrapped/Layout";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight, RefreshCw } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";
import { formatCasing } from "@/lib/casing";

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const topic = searchParams.get("topic");
  
  const [category, setCategory] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [catData, postsData] = await Promise.all([
          client.fetch(CATEGORY_DETAIL_QUERY, { slug }),
          client.fetch(POSTS_BY_CATEGORY_QUERY, { slug })
        ]);
        
        setCategory(catData);
        
        // Jika ada filter topik dari sub-header, lakukan filter lokal
        if (topic) {
          const filtered = (postsData || []).filter((post: any) => 
            post.title.toLowerCase().includes(topic.toLowerCase()) || 
            post.excerpt.toLowerCase().includes(topic.toLowerCase())
          );
          setPosts(filtered);
        } else {
          setPosts(postsData || []);
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, topic]);

  if (isLoading) {
    return (
      <Container className="py-20 text-center flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20" />
        <BodyText className="text-xs opacity-40">Memuat arsip berita...</BodyText>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container className="py-32 text-center">
        <Title>Kategori tidak ditemukan</Title>
        <Link href="/">
          <button className="mt-8 text-sm font-medium underline underline-offset-4 hover:text-primary/60 transition-all">
            Kembali ke beranda
          </button>
        </Link>
      </Container>
    );
  }

  return (
    <Container>
      <Section className="pb-12">
        <div className="max-w-3xl space-y-4">
          <MutedText className="text-[10px] font-bold opacity-40 tracking-widest uppercase">Arsip kategori</MutedText>
          <Title className="text-4xl md:text-5xl lg:text-6xl">{formatCasing(category.title, 'sentence')}</Title>
          {topic && (
            <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] px-3 py-1 font-bold">
              Topik: {topic}
            </Badge>
          )}
          <BodyText className="text-xl opacity-60 leading-relaxed">
            {category.description || `Menampilkan berita dan wawasan terbaru seputar ${category.title.toLowerCase()}.`}
          </BodyText>
        </div>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-24">
        {posts.length > 0 ? (
          posts.map((post, idx) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 15 }}
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
                        {post.categories?.[0] || category.title}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-7 flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <ReleaseDate date={post.publishedAt} className="text-[10px] font-medium text-muted-foreground tracking-tight" />
                    </div>
                    <Link href={`/news/${post.slug}`}>
                      <h3 className="font-body font-medium text-lg leading-snug tracking-[-0.01em] group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <BodyText className="text-sm line-clamp-3 opacity-60 mt-3 !mb-0">
                      {post.excerpt}
                    </BodyText>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/5">
                    <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author || "Redaksi PatureNews"}</span>
                    <Link href={`/news/${post.slug}`}>
                      <ArrowRight className="h-4 w-4 text-primary hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/10">
            <MutedText className="text-xs font-bold opacity-30 tracking-widest uppercase">Belum ada artikel di kategori ini</MutedText>
          </div>
        )}
      </div>
    </Container>
  );
}
