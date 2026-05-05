
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
import { Share2, ArrowLeft, Bookmark, TrendingUp, ChevronUp, Send, Reply, Heart } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking
} from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";

export default function NewsDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const db = useFirestore();
  const [isSaved, setIsSaved] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Mock comments integrated for prototype
  const mockComments = [
    {
      id: "mock-1",
      authorId: "mock-author-1",
      authorName: "Sarah Jenkins",
      content: "Artikel Ini Memberikan Wawasan Yang Luar Biasa Tentang Tren Desain Modern. Minimalisme Benar-Benar Masa Depan Informasi Digital.",
      createdAt: "2 Jam Yang Lalu",
      parentId: null,
      likes: []
    },
    {
      id: "mock-2",
      authorId: "mock-author-2",
      authorName: "David Chen",
      content: "Saya Sangat Setuju Dengan Poin Tentang Ruang Kosong. Ini Sangat Penting Untuk Fokus Pengguna Dan Mengurangi Beban Kognitif.",
      createdAt: "5 Jam Yang Lalu",
      parentId: "mock-1",
      likes: []
    }
  ];

  // Fetch comments from Firestore
  const commentsQuery = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return collection(db, "posts", params.id as string, "comments");
  }, [db, params.id]);

  const { data: firestoreComments, isLoading: isCommentsLoading } = useCollection(commentsQuery);

  // Group comments into threads
  const threadedComments = useMemo(() => {
    const all = [...(firestoreComments || []), ...mockComments];
    const roots = all.filter(c => !c.parentId);
    const replies = all.filter(c => !!c.parentId);

    return roots.map(root => ({
      ...root,
      replies: replies.filter(r => r.parentId === root.id)
    }));
  }, [firestoreComments]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePostComment = (parentId: string | null = null) => {
    if (!user) return;
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;

    const colRef = collection(db, "posts", params.id as string, "comments");
    addDocumentNonBlocking(colRef, {
      content: text,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || "Pengguna Anonim",
      createdAt: serverTimestamp(),
      postId: params.id,
      parentId: parentId,
      likes: []
    });

    if (parentId) {
      setReplyText("");
      setReplyToId(null);
    } else {
      setCommentText("");
    }
  };

  const handleLikeComment = (commentId: string, currentLikes: string[] = []) => {
    if (!user) return;
    
    const isLiked = currentLikes.includes(user.uid);
    const newLikes = isLiked 
      ? currentLikes.filter(id => id !== user.uid)
      : [...currentLikes, user.uid];

    const commentRef = doc(db, "posts", params.id as string, "comments", commentId);
    updateDocumentNonBlocking(commentRef, {
      likes: newLikes
    });
  };

  const posts = [
    {
      id: "1",
      title: "Evolusi Desain Digital Minimalis",
      category: "Desain",
      author: "Alex Rivers",
      authorId: "author-alex-1",
      date: "24 Okt, 2024",
      readTime: "5 Menit Baca",
      content: "Lansekap Desain Digital Sedang Bergeser Ke Arah Pendekatan 'Less Is More'. Kami Melihat Transisi Masif Di Mana Ruang Kosong Bukan Hanya Ruang Hampa—Ini Adalah Alat Untuk Fokus. Sistem Informasi Modern Memprioritaskan Kejelasan Daripada Kompleksitas, Memastikan Bahwa Pengguna Dapat Menemukan Apa Yang Mereka Butuhkan Tanpa Kelebihan Kognitif.\n\nTipografi Juga Menjadi Pusat Perhatian. Huruf Yang Tebal Dan Mudah Dibaca Menggantikan Huruf Dekoratif Untuk Meningkatkan Aksesibilitas Dan Kecepatan Konsumsi Informasi. Dalam Artikel Ini, Kami Menjelajahi Mengapa Tren Ini Bukan Sekadar Fase Sesaat Tetapi Perubahan Mendasar Dalam Cara Kita Berinteraksi Dengan Data.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    }
  ];

  const trendingStories = [
    {
      id: "1",
      title: "Bagaimana Tipografi Mempengaruhi Psikologi Manusia",
      category: "Desain",
      timeAgo: "2 Jam Yang Lalu",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    },
    {
      id: "2",
      title: "Masa Depan Keberlanjutan Dalam Arsitektur",
      category: "Budaya",
      timeAgo: "4 Jam Yang Lalu",
      image: PlaceHolderImages.find(img => img.id === "culture-news")?.imageUrl
    }
  ];

  const post = posts.find(p => p.id === params.id) || posts[0];

  const CommentItem = ({ comment, isReply = false }: { comment: any, isReply?: boolean }) => {
    const isPostAuthor = comment.authorId === post.authorId;
    const likes = comment.likes || [];
    const isLiked = user && likes.includes(user.uid);

    return (
      <div className={cn("space-y-4", isReply && "ml-12 border-l pl-4 border-border/50")}>
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 p-4 rounded-2xl hover:bg-accent/5 transition-colors"
        >
          <Avatar className={cn("h-8 w-8", isReply && "h-6 w-6")}>
            <AvatarFallback className="text-[10px] font-bold">{comment.authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">{comment.authorName}</span>
              {isPostAuthor && <Badge variant="default" className="text-[7px] px-1.5 py-0 uppercase font-bold tracking-tighter">Penulis</Badge>}
              <span className="text-[8px] text-muted-foreground uppercase font-bold">
                {typeof comment.createdAt === 'string' ? comment.createdAt : "Baru Saja"}
              </span>
            </div>
            <BodyText className="text-sm opacity-80 mb-3">{comment.content}</BodyText>
            
            <div className="flex items-center gap-4">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleLikeComment(comment.id, likes)}
                className={cn(
                  "flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors",
                  isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
                {likes.length > 0 ? `${likes.length} Suka` : "Suka"}
              </motion.button>

              {!isReply && user && (
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Balas Pesan
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reply Input Field */}
        <AnimatePresence>
          {replyToId === comment.id && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-12 pr-4 overflow-hidden"
            >
              <div className="flex gap-3 items-start py-2">
                <Input 
                  placeholder={`Membalas ${comment.authorName}...`} 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="bg-accent/5 border-none h-10 rounded-xl text-xs"
                />
                <Button onClick={() => handlePostComment(comment.id)} size="sm" className="rounded-xl h-10 px-4">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
            {comment.replies.map((reply: any) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    );
  };

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
                Kembali Ke Feed
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
                <Heading level={3} className="mb-8">Diskusi ({threadedComments.length})</Heading>
                
                {user ? (
                  <div className="flex gap-4 mb-10 items-start">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-accent text-white">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Input 
                        placeholder="Tulis Pendapat Anda..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="bg-accent/5 border-none h-12 rounded-xl"
                      />
                      <div className="flex justify-end">
                        <Button onClick={() => handlePostComment(null)} className="rounded-xl gap-2 h-10">
                          <Send className="h-4 w-4" /> Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-accent/5 p-6 rounded-2xl text-center mb-10 border border-dashed">
                    <MutedText className="block mb-4">Silakan Masuk Untuk Ikut Berdiskusi.</MutedText>
                    <Link href="/auth">
                      <Button variant="outline" className="rounded-xl px-8">Masuk / Daftar</Button>
                    </Link>
                  </div>
                )}

                <div className="space-y-10">
                  {isCommentsLoading && firestoreComments === null ? (
                    <MutedText>Memuat Diskusi...</MutedText>
                  ) : (
                    threadedComments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
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
                <Heading level={3} className="text-xl">Trending Stories</Heading>
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
                <p className="text-xs opacity-70 mb-6">Jangan Ketinggalan Berita Terpenting Hari Ini.</p>
                <div className="space-y-3">
                  <Input placeholder="Email Anda" className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-10 rounded-xl" />
                  <Button variant="secondary" className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[10px]">Langganan Sekarang</Button>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }}
        className="fixed bottom-6 right-6 z-50"
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
