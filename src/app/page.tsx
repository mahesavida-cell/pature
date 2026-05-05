
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, MessageSquare, Bookmark } from "lucide-react";
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

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
        {/* Hero Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[16/9] lg:aspect-square overflow-hidden rounded-lg bg-muted group cursor-pointer">
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
                <Badge variant="secondary" className="bg-white/80 text-primary px-3 py-1 rounded-full border-none">
                  Featured Story
                </Badge>
                <Title className="leading-tight">
                  The Silent Revolution of Professional Information Flow
                </Title>
                <BodyText className="text-lg">
                  Discover how InfoFlow is setting a new benchmark for minimalist digital journalism, focusing on clarity, depth, and user experience.
                </BodyText>
                <div className="flex items-center gap-4 py-2">
                  <Link href="/news/1">
                    <Button className="px-8 font-medium">Read Full Article</Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={cn(
                      "rounded-full transition-all duration-300", 
                      isSaved && "bg-primary text-primary-foreground border-primary shadow-sm"
                    )}
                    onClick={() => setIsSaved(!isSaved)}
                    title={isSaved ? "Saved" : "Save for later"}
                  >
                    <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Latest Feed */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <Heading level={2}>Latest Updates</Heading>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full">All</Button>
              <Button variant="ghost" size="sm" className="rounded-full">Tech</Button>
              <Button variant="ghost" size="sm" className="rounded-full">Design</Button>
              <Button variant="ghost" size="sm" className="rounded-full">Business</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="h-full flex flex-col">
                <Link href={`/news/${post.id}`}>
                  <div className="relative h-48 w-full overflow-hidden bg-muted group">
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
                      <Heading level={4} className="mb-3 hover:text-accent transition-colors cursor-pointer">
                        {post.title}
                      </Heading>
                    </Link>
                    <BodyText className="text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </BodyText>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <MutedText className="font-medium">{post.author}</MutedText>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="mt-24 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary p-12 rounded-2xl text-primary-foreground text-center space-y-6"
          >
            <Heading level={2} className="text-primary-foreground">Stay Updated with InfoFlow</Heading>
            <BodyText className="text-primary-foreground/80 max-w-xl mx-auto">
              Get the most relevant news and media updates delivered to your inbox every morning. No noise, just information.
            </BodyText>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder:text-white/50"
              />
              <Button variant="secondary" className="whitespace-nowrap px-8">Join Now</Button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4">
            <Link href="/" className="font-headline text-2xl font-bold text-primary">
              InfoFlow
            </Link>
            <MutedText className="block">© 2024 InfoFlow Media Group. All rights reserved.</MutedText>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
