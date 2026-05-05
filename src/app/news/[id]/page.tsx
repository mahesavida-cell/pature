"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Calendar, Share2, MessageSquare, ArrowLeft, Bookmark, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
      content: "As global temperatures rise, architects are looking at cities as living organisms. The integration of vertical gardens and carbon-sequestering materials into high-rise buildings is no longer a futuristic dream—it's a necessity. Cities like Singapore and Copenhagen are leading the way in creating urban jungles that actually breathe.",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
    },
    {
      id: "3",
      title: "Future of Decentralized Global Markets",
      category: "Business",
      author: "Jordan Lee",
      date: "Oct 20, 2024",
      readTime: "6 min read",
      content: "Blockchain technology is moving beyond the hype cycle of cryptocurrencies into the backbone of international trade. By reducing the reliance on central intermediaries, decentralized markets promise faster transactions and lower fees for emerging economies. This paradigm shift could redefine wealth distribution on a global scale.",
      image: PlaceHolderImages.find(img => img.id === "business-news")?.imageUrl
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
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Article Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Back Button */}
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to feed
              </Link>

              {/* Article Header */}
              <div className="space-y-6 mb-12">
                <Badge variant="secondary" className="px-3 py-1 rounded-full uppercase text-[10px] tracking-widest font-bold">
                  {post.category}
                </Badge>
                <Title className="text-3xl md:text-5xl lg:text-6xl leading-tight font-bold">
                  {post.title}
                </Title>
                
                <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <BodyText className="font-semibold text-primary leading-none mb-1">
                        {post.author}
                      </BodyText>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-full h-9 w-9 transition-colors ${isSaved ? 'bg-primary text-primary-foreground border-primary' : ''}`}
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <motion.div 
                className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-12 shadow-md"
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

              {/* Content */}
              <article className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BodyText className="text-lg md:text-xl mb-6 leading-relaxed">
                      {paragraph}
                    </BodyText>
                  </motion.div>
                ))}
              </article>

              <Separator className="my-16" />

              {/* Interaction Footer */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                    <MessageSquare className="h-5 w-5" />
                    <span>Discussion (12)</span>
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <MutedText>Share this story:</MutedText>
                  <Button variant="ghost" size="sm" className="h-8">Twitter</Button>
                  <Button variant="ghost" size="sm" className="h-8">LinkedIn</Button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Aesthetic Trending Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-10">
              <motion.div 
                className="flex items-center gap-2 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="bg-primary/5 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <Heading level={3} className="tracking-tight">Trending Stories</Heading>
              </motion.div>

              <div className="space-y-8">
                {trendingStories.map((story, idx) => (
                  <motion.div 
                    key={story.id} 
                    className="group cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ y: -2 }}
                  >
                    <Link href={`/news/${story.id}`} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
                        {story.image && (
                          <Image 
                            src={story.image} 
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center gap-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/5 px-2 py-0.5 rounded">
                            {story.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] font-medium text-muted-foreground uppercase">
                            {story.timeAgo}
                          </span>
                        </div>
                        <h4 className="font-headline font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2 uppercase-first">
                          {story.title}
                        </h4>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Newsletter Sidebar */}
              <motion.div 
                className="bg-primary p-8 rounded-2xl text-primary-foreground space-y-4 shadow-lg overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative z-10">
                  <h4 className="font-headline font-bold text-lg mb-2">Weekly Insights</h4>
                  <p className="text-primary-foreground/70 text-sm mb-4">
                    The most important stories, delivered to your inbox every Sunday.
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                    <Button variant="secondary" className="w-full h-10 font-bold text-xs uppercase tracking-widest">
                      Subscribe
                    </Button>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              </motion.div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}