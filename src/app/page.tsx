
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, MessageSquare, Bookmark, TrendingUp, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isSaved, setIsSaved] = useState(false);
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-news");
  
  const posts = [
    {
      id: "1",
      title: "The Evolution of Minimalist Digital Design",
      category: "Design",
      author: "Alex Rivers",
      readTime: "5 min read",
      excerpt: "Exploring how whitespace and clear typography became the standard for modern information systems.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    },
    {
      id: "2",
      title: "Sustainable Architecture In Urban Environments",
      category: "Culture",
      author: "Maya Lin",
      readTime: "8 min read",
      excerpt: "How cities are integrating green spaces into vertical living to combat rising global temperatures.",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
    },
    {
      id: "3",
      title: "Future of Decentralized Global Markets",
      category: "Business",
      author: "Jordan Lee",
      readTime: "6 min read",
      excerpt: "An in-depth look at how blockchain is reshaping traditional banking infrastructures in emerging economies.",
      image: PlaceHolderImages.find(img => img.id === "business-news")?.imageUrl
    }
  ];

  const popularPosts = [
    {
      id: "1",
      title: "Why Typography Matters More Than You Think",
      category: "Design",
      rank: "01"
    },
    {
      id: "2",
      title: "The Rise of AI in Modern Journalism",
      category: "Technology",
      rank: "02"
    },
    {
      id: "3",
      title: "10 Principles of Sustainable Living",
      category: "Culture",
      rank: "03"
    },
    {
      id: "4",
      title: "Global Economy Projections for 2025",
      category: "Business",
      rank: "04"
    }
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
        {/* Hero Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-xl bg-muted group cursor-pointer shadow-xl">
                {heroImage?.imageUrl && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Featured News"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div className="space-y-6">
                <Badge variant="secondary" className="px-3 py-1 rounded-full border-none">
                  Featured Story
                </Badge>
                <Title className="leading-tight text-4xl md:text-6xl">
                  The Silent Revolution of Professional Information Flow
                </Title>
                <BodyText className="text-xl">
                  Discover how InfoFlow is setting a new benchmark for minimalist digital journalism, focusing on clarity, depth, and user experience.
                </BodyText>
                <div className="flex items-center gap-4 py-2">
                  <Link href="/news/1">
                    <Button className="px-10 h-12 text-base font-medium">Read Full Article</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full h-12 w-12 transition-all duration-300", 
                      isSaved && "bg-primary text-primary-foreground border-primary shadow-sm"
                    )}
                    onClick={() => setIsSaved(!isSaved)}
                    title={isSaved ? "Saved" : "Save for later"}
                  >
                    <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Content Grid: Latest Feed & Popular Side by Side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Latest Feed */}
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 border-b pb-4">
              <Heading level={2}>Latest Updates</Heading>
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full px-4">All</Button>
                <Button variant="ghost" size="sm" className="rounded-full px-4">Tech</Button>
                <Button variant="ghost" size="sm" className="rounded-full px-4">Design</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="h-full flex flex-col group border border-border/40">
                  <Link href={`/news/${post.id}`}>
                    <div className="relative h-56 w-full overflow-hidden bg-muted rounded-t-lg">
                      {post.image && (
                        <Image 
                          src={post.image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <MutedText className="uppercase text-[10px] tracking-widest font-bold text-accent">
                          {post.category}
                        </MutedText>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{post.readTime}</span>
                        </div>
                      </div>
                      <Link href={`/news/${post.id}`}>
                        <Heading level={4} className="mb-3 hover:text-accent transition-colors leading-snug">
                          {post.title}
                        </Heading>
                      </Link>
                      <BodyText className="text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </BodyText>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <MutedText className="font-medium">{post.author}</MutedText>
                      <MessageSquare className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="px-8 gap-2 group">
                Load More Stories
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </section>

          {/* Popular Section Sidebar */}
          <section className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <TrendingUp className="h-5 w-5 text-accent" />
                <Heading level={3}>Popular Now</Heading>
              </div>

              <div className="space-y-6">
                {popularPosts.map((post) => (
                  <motion.div 
                    key={post.id} 
                    className="flex gap-4 group cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-2xl font-headline font-bold text-accent/20 transition-colors group-hover:text-accent">
                      {post.rank}
                    </span>
                    <div className="space-y-1">
                      <MutedText className="uppercase text-[9px] tracking-widest font-bold text-accent/60">
                        {post.category}
                      </MutedText>
                      <Link href={`/news/${post.id}`}>
                        <Heading level={4} className="text-base leading-tight group-hover:text-accent transition-colors">
                          {post.title}
                        </Heading>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Promo Card in Sidebar */}
              <div className="bg-accent/5 p-6 rounded-xl border border-accent/10 mt-12">
                <Heading level={4} className="mb-2">InfoFlow Premium</Heading>
                <BodyText className="text-sm mb-4">
                  Get exclusive access to deep-dive reports and ad-free experience.
                </BodyText>
                <Button variant="primary" size="sm" className="w-full">Upgrade Now</Button>
              </div>
            </div>
          </section>
        </div>

        {/* Newsletter / CTA */}
        <section className="mt-32 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary p-12 md:p-20 rounded-3xl text-primary-foreground text-center space-y-8 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-4">
              <Heading level={2} className="text-primary-foreground text-3xl md:text-5xl">
                Stay Ahead of the Curve
              </Heading>
              <BodyText className="text-primary-foreground/80 max-w-2xl mx-auto text-lg md:text-xl">
                Join 50,000+ professionals who start their day with InfoFlow's curated insights. No noise, just clarity.
              </BodyText>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-6">
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full h-12 px-6 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/40"
                />
                <Button variant="secondary" className="h-12 whitespace-nowrap px-10 font-bold">Subscribe</Button>
              </div>
            </div>
            {/* Subtle background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">
              InfoFlow
            </Link>
            <BodyText className="text-sm max-w-xs">
              Redefining digital journalism through minimalist design and deep insights.
            </BodyText>
            <MutedText className="block pt-4">© 2024 InfoFlow Media. All rights reserved.</MutedText>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <Heading level={4} className="text-sm uppercase tracking-widest text-accent">Platform</Heading>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-accent transition-colors">News Feed</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Archive</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <Heading level={4} className="text-sm uppercase tracking-widest text-accent">Company</Heading>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <Heading level={4} className="text-sm uppercase tracking-widest text-accent">Connect</Heading>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="h-8">Twitter</Button>
              <Button variant="ghost" size="sm" className="h-8">LinkedIn</Button>
              <Button variant="ghost" size="sm" className="h-8">Instagram</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

