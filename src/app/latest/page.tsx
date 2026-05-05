
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function LatestNewsPage() {
  // Mock data grouped by days (last 7 days)
  const days = [
    { label: "Hari ini", date: "24 Okt 2024" },
    { label: "Kemarin", date: "23 Okt 2024" },
    { label: "2 hari yang lalu", date: "22 Okt 2024" },
    { label: "3 hari yang lalu", date: "21 Okt 2024" },
    { label: "4 hari yang lalu", date: "20 Okt 2024" },
    { label: "5 hari yang lalu", date: "19 Okt 2024" },
    { label: "Seminggu yang lalu", date: "18 Okt 2024" },
  ];

  const mockPostsPerDay = days.map((day, idx) => ({
    ...day,
    posts: [
      {
        id: `latest-${idx}-1`,
        title: `Eksplorasi mendalam tentang ${idx % 2 === 0 ? 'Teknologi' : 'Budaya'} masa kini`,
        category: idx % 2 === 0 ? "Teknologi" : "Budaya",
        readTime: "5 mnt",
        author: "Alex Rivers",
        excerpt: "Menjelajahi bagaimana perkembangan terbaru mengubah cara kita berinteraksi dengan dunia sekitar.",
        image: PlaceHolderImages[idx % 4].imageUrl
      },
      {
        id: `latest-${idx}-2`,
        title: `Bagaimana ${idx % 2 === 0 ? 'Desain' : 'Bisnis'} beradaptasi di era baru`,
        category: idx % 2 === 0 ? "Desain" : "Bisnis",
        readTime: "4 mnt",
        author: "Maya Lin",
        excerpt: "Analisis mendalam mengenai tantangan dan peluang yang muncul di tengah transisi global.",
        image: PlaceHolderImages[(idx + 1) % 4].imageUrl
      }
    ]
  }));

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-40 pb-24">
        <div className="space-y-16">
          <div className="space-y-4">
            <Title>Berita terbaru</Title>
            <BodyText className="max-w-2xl">
              Aliran informasi terkini yang dikurasi setiap jam untuk memastikan Anda tetap terhubung dengan perkembangan dunia.
            </BodyText>
          </div>

          <div className="space-y-20">
            {mockPostsPerDay.map((day, dayIdx) => (
              <motion.section 
                key={day.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: dayIdx * 0.1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <Heading level={3} className="text-xl">{day.label}</Heading>
                    <MutedText className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{day.date}</MutedText>
                  </div>
                  <Separator className="flex-1 opacity-10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {day.posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-500 rounded-xl overflow-hidden border-primary/5">
                        <Link href={`/news/${post.id}`}>
                          <div className="relative h-56 w-full overflow-hidden bg-muted">
                            <Image 
                              src={post.image} 
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
                              <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{post.readTime}</span>
                            </div>
                            <Link href={`/news/${post.id}`}>
                              <h4 className="text-lg font-headline font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                {post.title}
                              </h4>
                            </Link>
                            <BodyText className="text-sm line-clamp-2 opacity-60">
                              {post.excerpt}
                            </BodyText>
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                            <span className="text-[10px] font-bold text-primary/60 tracking-tight">{post.author}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
