
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Calendar, Share2, MessageSquare, ArrowLeft, Bookmark, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function NewsDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  
  const posts = [
    {
      id: "1",
      title: "The Evolution of Minimalist Digital Design",
      category: "Design",
      author: "Alex Rivers",
      date: "Oct 24, 2024",
      readTime: "5 min read",
      content: "The landscape of digital design is shifting towards a 'less is more' approach. We're seeing a massive transition where whitespace isn't just empty space—it's a tool for focus. Modern information systems are prioritizing clarity over complexity, ensuring that users can find what they need without cognitive overload.\n\nTypography has also taken center stage. Bold, readable fonts are replacing decorative ones to improve accessibility and speed of information consumption. In this article, we explore why this trend is not just a passing phase but a fundamental change in how we interact with data.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    },
    {
      id: "2",
      title: "Sustainable Architecture In Urban Environments",
      category: "Culture",
      author: "Maya Lin",
      date: "Oct 22, 2024",
      readTime: "8 min read",
      content: "As global temperatures rise, architects are looking at cities as living organisms. The integration of vertical gardens and carbon-sequestering materials into high-rise buildings is no longer a futuristic dream—it's a necessity.",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
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
    },
    {
      id: "3",
      title: "Navigating The Future Of AI Ethics",
      category: "Culture",
      timeAgo: "5 Hours Ago",
      image: PlaceHolderImages.find(img => img.id === "hero-news")?.imageUrl
    }
  ];

  const post = posts.find(p => p.id === params.id) || posts[0];

  return (
    <div className="bg-background min-h-screen pb-10">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Article Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-8 md:mb-12 group">
                <div className="bg-white border rounded-full p-2 shadow-sm group-hover:shadow-md transition-shadow">
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </div>
                Back to feed
              </Link>

              <div className="space-y-4 md:space-y-6 mb-10 md:mb-14">
                <Badge variant="secondary" className="px-4 py-1 rounded-full uppercase text-[10px] tracking-[0.2em] font-bold border-none shadow-sm">
                  {post.category}
                </Badge>
                <Title className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-headline font-bold tracking-tight">
                  {post.title}
                </Title>
                
                <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-sm text-primary leading-none mb-1.5 tracking-wide">
                        {post.author}
                      </span>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {post.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-11 w-11 shadow-sm hover:shadow-md transition-all">
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "rounded-full h-11 w-11 transition-all shadow-sm",
                        isSaved ? 'bg-primary text-primary-foreground border-primary' : 'hover:shadow-md'
                      )}
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>

              <motion.div 
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[32px] mb-12 shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
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

              <article className="max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-lg md:text-2xl mb-8 leading-[1.6] text-foreground/80 font-body">
                      {paragraph}
                    </p>
                  </motion.div>
                ))}
              </article>

              <Separator className="my-16 md:my-24 opacity-40" />

              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Button variant="outline" className="w-full sm:w-auto gap-3 h-12 px-8 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                  View Comments (12)
                </Button>
                <div className="flex items-center gap-4">
                  <MutedText className="text-[10px] font-bold uppercase tracking-[0.2em]">Share Story</MutedText>
                  <div className="flex gap-2">
                    {['X', 'In'].map(s => (
                      <Button key={s} variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60 hover:bg-white">{s}</Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar - responsive stacking */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="sticky top-24 space-y-12">
              <motion.div 
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="bg-primary/5 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <Heading level={3} className="text-2xl font-headline font-bold">Trending Now</Heading>
              </motion.div>

              <div className="space-y-10">
                {trendingStories.map((story, idx) => (
                  <motion.div 
                    key={story.id} 
                    className="group"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ x: 4 }}
                  >
                    <Link href={`/news/${story.id}`} className="flex gap-5">
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[20px] bg-muted shadow-lg">
                        {story.image && (
                          <Image 
                            src={story.image} 
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center gap-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="ghost" className="p-0 text-[8px] font-black uppercase tracking-widest text-accent hover:bg-transparent">
                            {story.category}
                          </Badge>
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">• {story.timeAgo}</span>
                        </div>
                        <h4 className="font-headline font-bold text-lg leading-tight group-hover:text-accent transition-colors">
                          {story.title}
                        </h4>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Newsletter Sidebar - optimized for mobile */}
              <motion.div 
                className="bg-primary p-10 rounded-[32px] text-primary-foreground relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10 space-y-6">
                  <div>
                    <h4 className="font-headline font-bold text-2xl mb-2">Weekly Insights</h4>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">
                      Deep dives delivered to your inbox every Sunday.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <Button variant="secondary" className="w-full h-12 font-bold text-xs uppercase tracking-widest rounded-2xl">
                      Subscribe
                    </Button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              </motion.div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
