
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
        image: PlaceHolderImages[idx % 4].imageUrl
      },
      {
        id: `latest-${idx}-2`,
        title: `Bagaimana ${idx % 2 === 0 ? 'Desain' : 'Bisnis'} beradaptasi di era baru`,
        category: idx % 2 === 0 ? "Desain" : "Bisnis",
        readTime: "4 mnt",
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
            <div className="flex items-center gap-3 text-primary opacity-60">
              <Clock className="h-5 w-5" />
              <span className="text-xs font-bold tracking-widest uppercase">Pembaruan kronologis</span>
            </div>
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
                    <Link key={post.id} href={`/news/${post.id}`} className="group">
                      <Card className="border-none shadow-none bg-white/40 hover:bg-white/60 transition-all overflow-hidden group">
                        <CardContent className="p-0 flex flex-col sm:flex-row gap-6">
                          <div className="relative aspect-video sm:aspect-square sm:w-40 overflow-hidden rounded-lg shrink-0">
                            <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                          </div>
                          <div className="flex flex-col justify-center py-4 pr-6 space-y-3">
                            <Badge variant="secondary" className="w-fit text-[8px] font-bold bg-primary/5 text-primary border-none">{post.category}</Badge>
                            <h4 className="text-base font-headline font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                            <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground/60">
                              <Clock className="h-3 w-3" /> {post.readTime} baca
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
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
