
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
    <div className="bg-background min-h-screen pb-10">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12">
        {/* Hero Section */}
        <section className="mb-12 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-2xl bg-muted group shadow-2xl">
                {heroImage?.imageUrl && (
                  <Image 
                    src={heroImage.imageUrl} 
                    alt="Featured News"
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                    priority
                  />
                )}
              </div>
              <motion.div 
                className="space-y-4 md:space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full border-none font-bold text-[10px] tracking-widest uppercase">
                    Featured Story
                  </Badge>
                  <MutedText className="text-[10px] uppercase tracking-widest font-bold">Oct 28, 2024</MutedText>
                </div>
                <Title className="leading-tight text-3xl sm:text-4xl md:text-6xl font-headline tracking-tighter">
                  The Silent Revolution of Professional Information Flow
                </Title>
                <BodyText className="text-lg md:text-xl text-foreground/70">
                  Discover how InfoFlow is setting a new benchmark for minimalist digital journalism, focusing on clarity and UX.
                </BodyText>
                <div className="flex items-center gap-3 py-2">
                  <Link href="/news/1" className="flex-1 sm:flex-none">
                    <Button className="w-full sm:px-10 h-12 text-sm font-bold uppercase tracking-widest">
                      Read Article
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full h-12 w-12 transition-all duration-300", 
                      isSaved && "bg-primary text-primary-foreground border-primary shadow-lg"
                    )}
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          {/* Latest Feed */}
          <section className="lg:col-span-8">
            <motion.div 
              className="flex items-center justify-between mb-8 border-b border-border/60 pb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Heading level={2} className="text-2xl md:text-3xl font-headline font-bold">Latest Updates</Heading>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-bold uppercase">View All</Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col group bg-white/40 hover:bg-white transition-all duration-500 border border-border/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl">
                    <Link href={`/news/${post.id}`}>
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
                        {post.image && (
                          <Image 
                            src={post.image} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 backdrop-blur-sm text-primary hover:bg-white text-[9px] font-bold uppercase tracking-wider border-none shadow-sm">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                    <CardContent className="p-5 md:p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{post.readTime}</span>
                          </div>
                        </div>
                        <Link href={`/news/${post.id}`}>
                          <h3 className="text-xl font-headline font-bold mb-3 hover:text-accent transition-colors leading-tight">
                            {post.title}
                          </h3>
                        </Link>
                        <BodyText className="text-sm line-clamp-2 text-foreground/60 mb-4">
                          {post.excerpt}
                        </BodyText>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-wide">{post.author}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Button variant="outline" className="w-full sm:w-auto px-12 h-12 font-bold text-xs uppercase tracking-widest rounded-full group">
                Load More
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </section>

          {/* Popular Section Sidebar */}
          <section className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <motion.div 
                className="flex items-center gap-3 mb-6 border-b border-border/60 pb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/5 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <Heading level={3} className="text-xl font-headline font-bold">Popular Now</Heading>
              </motion.div>

              <div className="space-y-8">
                {popularPosts.map((post, idx) => (
                  <motion.div 
                    key={post.id} 
                    className="flex gap-5 group cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="text-3xl font-headline font-bold text-primary/10 transition-colors group-hover:text-primary/30">
                      {post.rank}
                    </span>
                    <div className="space-y-1">
                      <Badge variant="ghost" className="p-0 text-[9px] tracking-widest font-bold text-accent uppercase hover:bg-transparent">
                        {post.category}
                      </Badge>
                      <Link href={`/news/${post.id}`}>
                        <h4 className="text-base font-headline font-bold leading-tight group-hover:text-accent transition-colors">
                          {post.title}
                        </h4>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Promo Card */}
              <motion.div 
                className="bg-primary p-8 rounded-2xl text-primary-foreground mt-12 relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10">
                  <h4 className="font-headline font-bold text-xl mb-3">InfoFlow Premium</h4>
                  <p className="text-sm text-primary-foreground/70 mb-6 leading-relaxed">
                    Get exclusive deep-dive reports and an ad-free experience.
                  </p>
                  <Button variant="secondary" className="w-full font-bold text-xs uppercase tracking-widest h-11">
                    Upgrade Now
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              </motion.div>
            </div>
          </section>
        </div>

        {/* Newsletter - optimized for mobile */}
        <section className="mt-24 md:mt-40 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary/5 border border-primary/10 p-10 md:p-24 rounded-[32px] text-center space-y-8"
          >
            <div className="space-y-4">
              <Heading level={2} className="text-3xl md:text-5xl font-headline tracking-tighter">
                Stay Ahead of the Curve
              </Heading>
              <BodyText className="max-w-xl mx-auto text-lg text-foreground/60">
                Join 50,000+ professionals who start their day with InfoFlow's curated insights.
              </BodyText>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full h-14 px-6 rounded-2xl bg-white border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              <Button className="w-full sm:w-auto h-14 px-10 font-bold uppercase tracking-widest rounded-2xl shadow-lg">
                Join Now
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t py-16 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">
              InfoFlow
            </Link>
            <BodyText className="text-sm max-w-xs mx-auto md:mx-0">
              Redefining digital journalism through minimalist design and deep insights.
            </BodyText>
            <MutedText className="block pt-4">© 2024 InfoFlow Media. All rights reserved.</MutedText>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent">Platform</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="#" className="hover:text-primary transition-colors text-muted-foreground">News Feed</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors text-muted-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors text-muted-foreground">Archive</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent">Company</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link href="#" className="hover:text-primary transition-colors text-muted-foreground">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors text-muted-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors text-muted-foreground">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent">Social</h4>
            <div className="flex justify-center md:justify-start gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                <Button key={social} variant="ghost" size="sm" className="h-9 px-4 font-bold text-[10px] uppercase tracking-wider rounded-full border border-border hover:bg-white transition-all">
                  {social}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
