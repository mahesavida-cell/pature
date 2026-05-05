
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/wrapped/Card";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Share2, ArrowLeft, Bookmark, TrendingUp, ChevronUp, Send } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useMemoFirebase,
  addDocumentNonBlocking 
} from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";

export default function NewsDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const [isSaved, setIsSaved] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Fetch comments from Firestore
  const commentsQuery = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return collection(db, "posts", params.id as string, "comments");
  }, [db, params.id]);

  const { data: comments, isLoading: isCommentsLoading } = useCollection(commentsQuery);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePostComment = () => {
    if (!user) return;
    if (!commentText.trim()) return;

    const colRef = collection(db, "posts", params.id as string, "comments");
    addDocumentNonBlocking(colRef, {
      content: commentText,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || "Anonymous",
      createdAt: serverTimestamp(),
      postId: params.id
    });
    setCommentText("");
  };

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
    }
  ];

  const trendingStories = [
    {
      id: "1",
      title: "How Typography Influences Human Psychology",
      category: "Design",
      timeAgo: "2 Hours Ago",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    }
  ];

  const post = posts.find(p => p.id === params.id) || posts[0];

  return (
    <div className="bg-background min-h-screen pb-10">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-8 group">
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                Kembali ke feed
              </Link>

              <div className="space-y-4 mb-10">
                <Badge variant="secondary" className="px-3 py-0.5 rounded-full uppercase text-[9px] font-bold tracking-widest">{post.category}</Badge>
                <Title className="text-3xl md:text-6xl font-headline font-bold leading-tight">{post.title}</Title>
                
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-xs text-primary">{post.author}</span>
                      <MutedText className="text-[9px] uppercase tracking-widest font-bold">{post.date} • {post.readTime}</MutedText>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn("rounded-full h-10 w-10 transition-all", isSaved && 'bg-primary text-primary-foreground border-primary')}
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-[24px] mb-12 shadow-xl">
                {post.image && <Image src={post.image} alt={post.title} fill className="object-cover" priority />}
              </div>

              <article className="prose prose-neutral max-w-none">
                {post.content.split('\n\n').map((p, i) => (
                  <BodyText key={i} className="text-base md:text-xl mb-6 leading-relaxed opacity-90">{p}</BodyText>
                ))}
              </article>

              <Separator className="my-16" />

              {/* Comments Section */}
              <section id="comments" className="mb-16">
                <Heading level={3} className="mb-8">Diskusi ({comments?.length || 0})</Heading>
                
                {user ? (
                  <div className="flex gap-4 mb-10 items-start">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-accent text-white">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Input 
                        placeholder="Tulis pendapat Anda..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="bg-accent/5 border-none h-12 rounded-xl"
                      />
                      <div className="flex justify-end">
                        <Button onClick={handlePostComment} className="rounded-xl gap-2 h-10">
                          <Send className="h-4 w-4" /> Kirim
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-accent/5 p-6 rounded-2xl text-center mb-10 border border-dashed">
                    <MutedText className="block mb-4">Silakan masuk untuk ikut berdiskusi.</MutedText>
                    <Link href="/auth">
                      <Button variant="outline" className="rounded-xl px-8">Masuk / Daftar</Button>
                    </Link>
                  </div>
                )}

                <div className="space-y-6">
                  {isCommentsLoading ? (
                    <MutedText>Memuat komentar...</MutedText>
                  ) : (
                    comments?.map((comment) => (
                      <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 p-4 rounded-2xl hover:bg-accent/5 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-[10px] font-bold">{comment.authorName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-primary">{comment.authorName}</span>
                            <span className="text-[8px] text-muted-foreground uppercase font-bold">Baru saja</span>
                          </div>
                          <BodyText className="text-sm opacity-80">{comment.content}</BodyText>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </section>
            </motion.div>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-xl">Trending</Heading>
              </div>

              <div className="space-y-8">
                {trendingStories.map((story) => (
                  <Link key={story.id} href={`/news/${story.id}`} className="flex gap-4 group">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                      {story.image && <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />}
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-accent">{story.category} • {story.timeAgo}</span>
                      <h4 className="font-headline font-bold text-sm leading-snug group-hover:text-accent transition-colors">{story.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>

              <Card className="bg-primary text-primary-foreground p-8 rounded-[24px]">
                <h4 className="font-headline font-bold text-xl mb-2">Newsletter</h4>
                <p className="text-xs opacity-70 mb-6">Jangan ketinggalan berita terpenting hari ini.</p>
                <div className="space-y-3">
                  <Input placeholder="Email Anda" className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10 rounded-xl" />
                  <Button variant="secondary" className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[10px]">Langganan</Button>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>

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
