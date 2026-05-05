
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Calendar, Share2, MessageSquare, ArrowLeft, Bookmark, TrendingUp, ChevronUp } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function NewsDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const posts = [
    {
      id: "1",
      title: "The Evolution of Minimalist Digital Design",
      category: "Design",
      author: "Alex Rivers",
      date: "Oct 24, 2024",
      readTime: "5 min read",
      content: "The landscape of digital design is shifting towards a 'less is more' approach. We're seeing a massive transition where whitespace isn't just empty space—it's a tool for focus. Modern information systems are prioritizing clarity over complexity, ensuring that users can find what they need without cognitive overload.\n\nTypography has also taken center stage. Bold, readable fonts are replacing decorative ones to improve accessibility and speed of information consumption. In this article, we explore why this trend is not just a passing phase but a fundamental change in how we interact with data.\n\nAs we look deeper, the psychological impact of clean interfaces cannot be ignored. Users report feeling less anxious and more productive when interacting with tools that don't clutter their visual field. This is particularly true in mobile environments where screen real estate is at a premium and every pixel must justify its existence.\n\nThe future of InfoFlow lies in this philosophy. We are building a platform that respects the user's attention, delivering high-quality journalism through a lens of extreme clarity and purposeful design.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    }
  ];

  const trendingStories = [
    {
      id: "1",
      title: "How Typography Influences Human Psychology",
      category: "Design",
      timeAgo: "2 Hours Ago",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    },
    {
      id: "2",
      title: "The Silent Shift In Remote Work Culture",
      category: "Technology",
      timeAgo: "4 Hours Ago",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
    }
  ];

  const post = posts.find(p => p.id === params.id) || posts[0];

  return (
    <div className="bg-background min-h-screen pb-10">
      {/* Reading Progress Bar - Mobile Friendly Interaction */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div whileTap={{ x: -5 }} className="inline-block mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group">
                  <div className="bg-white border rounded-full p-2 shadow-sm group-hover:shadow-md transition-shadow">
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                  </div>
                  Back to feed
                </Link>
              </motion.div>

              <div className="space-y-4 mb-10">
                <Badge variant="secondary" className="px-3 py-0.5 rounded-full uppercase text-[9px] tracking-widest font-bold border-none shadow-sm">
                  {post.category}
                </Badge>
                <Title className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight font-headline font-bold tracking-tight">
                  {post.title}
                </Title>
                
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-xs text-primary leading-none mb-1 tracking-wide">
                        {post.author}
                      </span>
                      <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button variant="outline" size="icon" className="rounded-full h-10 w-10 shadow-sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className={cn(
                          "rounded-full h-10 w-10 transition-all shadow-sm",
                          isSaved ? 'bg-primary text-primary-foreground border-primary' : 'hover:shadow-md'
                        )}
                        onClick={() => setIsSaved(!isSaved)}
                      >
                        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>

              <motion.div 
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[24px] mb-12 shadow-xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {post.image && (
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </motion.div>

              <article className="max-w-none prose prose-neutral">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <motion.p 
                    key={index}
                    className="text-base md:text-xl mb-6 leading-relaxed text-foreground/80 font-body"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </article>

              <Separator className="my-16 opacity-30" />

              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
              >
                <motion.div whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 h-12 px-8 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm">
                    <MessageSquare className="h-4 w-4" />
                    Comments (12)
                  </Button>
                </motion.div>
                <div className="flex items-center gap-4">
                  <MutedText className="text-[10px] font-bold uppercase tracking-[0.2em]">Share</MutedText>
                  <div className="flex gap-2">
                    {['TW', 'LI'].map(s => (
                      <motion.div key={s} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border/60 text-[10px] font-bold">{s}</Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/5 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <Heading level={3} className="text-xl font-headline font-bold">Trending</Heading>
              </div>

              <div className="space-y-8">
                {trendingStories.map((story, idx) => (
                  <motion.div 
                    key={story.id} 
                    className="group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link href={`/news/${story.id}`} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[16px] bg-muted shadow-sm">
                        {story.image && (
                          <Image 
                            src={story.image} 
                            alt={story.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center gap-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black uppercase tracking-widest text-accent">{story.category}</span>
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">• {story.timeAgo}</span>
                        </div>
                        <h4 className="font-headline font-bold text-sm leading-snug group-hover:text-accent transition-colors">
                          {story.title}
                        </h4>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="bg-primary p-8 rounded-[24px] text-primary-foreground relative overflow-hidden shadow-xl"
                whileHover={{ y: -5 }}
              >
                <div className="relative z-10 space-y-4">
                  <h4 className="font-headline font-bold text-xl">Newsletter</h4>
                  <p className="text-primary-foreground/70 text-xs leading-relaxed">
                    The best stories, delivered weekly.
                  </p>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="Email" 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs focus:outline-none"
                    />
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button variant="secondary" className="w-full h-10 font-bold text-[10px] uppercase tracking-widest rounded-xl">
                        Subscribe
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </main>

      {/* Back to Top - Mobile Interaction */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }}
        className="fixed bottom-6 right-6 z-50 md:hidden"
      >
        <Button
          size="icon"
          className="rounded-full h-12 w-12 shadow-2xl bg-primary text-primary-foreground"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
