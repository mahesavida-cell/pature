
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Clock, Calendar, Share2, MessageSquare, ArrowLeft, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function NewsDetailPage() {
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);
  
  // Mock data fetching based on ID
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

  const post = posts.find(p => p.id === params.id) || posts[0];

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-8 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-12 shadow-lg">
            {post.image && (
              <Image 
                src={post.image} 
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Content */}
          <article className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <BodyText key={index} className="text-lg md:text-xl mb-6 leading-relaxed">
                {paragraph}
              </BodyText>
            ))}
          </article>

          <Separator className="my-16" />

          {/* Interaction Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
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
          </div>
        </motion.div>
      </main>
    </div>
  );
}
