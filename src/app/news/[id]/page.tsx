
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
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  useUser, 
  useFirestore, 
  useCollection, 
  useDoc,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  setDocumentNonBlocking,
  deleteDocumentNonBlocking
} from "@/firebase";
import { collection, serverTimestamp, doc, query, orderBy, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const posts = [
    {
      id: "1",
      title: "Evolusi Desain Digital Minimalis",
      category: "Desain",
      author: "Alex Rivers",
      authorId: "author-alex-1",
      date: "24 Okt, 2024",
      readTime: "5 Menit Baca",
      content: "Lansekap Desain Digital Sedang Bergeser Ke Arah Pendekatan 'Less Is More'. Kami Melihat Transisi Masif Di Nama Ruang Kosong Bukan Hanya Ruang Hampa—Ini Adalah Alat Untuk Fokus. Sistem Informasi Modern Memprioritaskan Kejelasan Daripada Kompleksitas, Memastikan Bahwa Pengguna Dapat Menemukan Apa Yang Mereka Butuhkan Tanpa Kelebihan Kognitif.\n\nTipografi Juga Menjadi Pusat Perhatian. Huruf Yang Tebal Dan Mudah Didaca Menggantikan Huruf Dekoratif Untuk Meningkatkan Aksesibilitas Dan Kecepatan Konsumsi Informasi. Dalam Artikel Ini, Kami Menjelajahi Mengapa Tren Ini Bukan Sekadar Fase Sesaat Tetapi Perubahan Mendasar Dalam Cara Kita Berinteraksi Dengan Data.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    }
  ];
  const post = posts.find(p => p.id === params.id) || posts[0];

  const bookmarkRef = useMemoFirebase(() => 
    user && params.id ? doc(db, "users", user.uid, "bookmarks", params.id as string) : null, 
    [db, user, params.id]
  );
  const { data: bookmarkData } = useDoc(bookmarkRef);
  const isSaved = !!bookmarkData;

  const commentsQuery = useMemoFirebase(() => {
    if (!db || !params.id) return null;
    return query(collection(db, "posts", params.id as string, "comments"), orderBy("createdAt", "asc"));
  }, [db, params.id]);

  const { data: firestoreComments, isLoading: isCommentsLoading } = useCollection(commentsQuery);

  const mockComments = [
    {
      id: "mock-1",
      authorId: "mock-author-1",
      authorName: "Sarah Jenkins",
      content: "Artikel Ini Memberikan Wawasan Yang Luar Biasa Tentang Tren Desain Modern. Minimalisme Benar-Benar Masa Depan Informasi Digital.",
      createdAt: "2 Jam Yang Lalu",
      parentId: null,
      likes: ["user-1", "user-2"]
    }
  ];

  const threadedComments = useMemo(() => {
    const all = firestoreComments && firestoreComments.length > 0 
      ? [...firestoreComments] 
      : [...mockComments];
      
    const roots = all.filter(c => !c.parentId);
    const replies = all.filter(c => !!c.parentId);

    return roots.map(root => ({
      ...root,
      replies: replies.filter(r => r.parentId === root.id)
    }));
  }, [firestoreComments]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    
    // Logika Pencatatan Riwayat Bacaan yang Akurat
    if (user && db && params.id) {
      const historyRef = doc(db, "users", user.uid, "history", params.id as string);
      setDocumentNonBlocking(historyRef, {
        postId: params.id,
        title: post.title,
        category: post.category,
        viewedAt: new Date().toISOString()
      }, { merge: true });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, db, params.id, post.title, post.category]);

  const handleToggleBookmark = () => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
    if (!bookmarkRef) return;

    if (isSaved) {
      deleteDocumentNonBlocking(bookmarkRef);
      toast({
        title: "Dihapus Dari Arsip",
        description: `"${post.title}" Telah Dihapus Dari Daftar Simpanan Anda.`,
      });
    } else {
      setDocumentNonBlocking(bookmarkRef, {
        postId: params.id,
        title: post.title,
        category: post.category,
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({
        title: "Berhasil Diarsipkan",
        description: `"${post.title}" Berhasil Ditambahkan Ke Arsip.`,
        action: (
          <Button onClick={() => router.push('/profile')} size="sm" variant="secondary" className="font-bold text-[10px] uppercase tracking-widest">
            Lihat Arsip
          </Button>
        ),
      });
    }
  };

  const handlePostComment = (parentId: string | null = null) => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
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
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
    if (!db || commentId.startsWith('mock-')) return;
    
    const isLiked = currentLikes.includes(user.uid);
    const newLikes = isLiked 
      ? currentLikes.filter(id => id !== user.uid)
      : [...currentLikes, user.uid];

    const commentRef = doc(db, "posts", params.id as string, "comments", commentId);
    updateDocumentNonBlocking(commentRef, { likes: newLikes });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: any, isReply?: boolean }) => {
    const isPostAuthor = comment.authorId === post.authorId;
    const likes = comment.likes || [];
    const isLiked = user && likes.includes(user.uid);

    return (
      <div className={cn("space-y-4", isReply && "ml-12 border-l-2 pl-6 border-border/30")}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 p-5 rounded-[24px] hover:bg-accent/5 transition-colors border border-transparent hover:border-border/20">
          <Avatar className={cn("h-10 w-10 shadow-sm", isReply && "h-8 w-8")}>
            <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
              {comment.authorName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-bold text-primary">{comment.authorName}</span>
              {isPostAuthor && <Badge variant="default" className="text-[7px] px-2 py-0 font-black tracking-widest uppercase bg-primary text-white border-none">Penulis</Badge>}
              <span className="text-[10px] text-muted-foreground font-bold tracking-tight">{typeof comment.createdAt === 'string' ? comment.createdAt : "Baru Saja"}</span>
            </div>
            <BodyText className="text-sm opacity-80 mb-4 leading-relaxed">{comment.content}</BodyText>
            <div className="flex items-center gap-6">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleLikeComment(comment.id, likes)} className={cn("flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors", isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary")}>
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                <span>{likes.length > 0 ? `${likes.length} Suka` : "Suka"}</span>
              </motion.button>
              {!isReply && (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)} className={cn("flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors", replyToId === comment.id ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                  <Reply className="h-4 w-4" />
                  <span>Balas Pesan</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {replyToId === comment.id && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="ml-12 pr-4 overflow-hidden">
              <div className="flex gap-3 items-center py-5 bg-accent/5 rounded-[24px] px-5 border border-dashed border-border/50">
                <Input placeholder={`Membalas Pesan ${comment.authorName}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="bg-white border-none h-12 rounded-2xl text-xs shadow-sm" />
                <Button onClick={() => handlePostComment(comment.id)} size="sm" className="rounded-2xl h-12 px-8 font-black text-[10px] tracking-widest uppercase">
                  <Send className="h-4 w-4 mr-2" /> Kirim
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-6">
            {comment.replies.map((reply: any) => <CommentItem key={reply.id} comment={reply} isReply />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen pb-10">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground hover:text-primary mb-10 group transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali Ke Feed
              </Link>
              <div className="space-y-6 mb-12">
                <Badge variant="secondary" className="px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-accent/5 text-accent border-none">{post.category}</Badge>
                <Title className="text-4xl md:text-7xl font-headline font-bold leading-[1.1] tracking-tighter">{post.title}</Title>
                <div className="flex flex-wrap items-center justify-between gap-8 pt-8 border-t border-border/30">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-xl">
                      <AvatarFallback className="bg-primary/5 text-primary text-sm font-black">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-black text-sm text-primary tracking-tight">{post.author}</span>
                      <MutedText className="text-[10px] tracking-[0.1em] font-bold uppercase opacity-60">{post.date} • {post.readTime}</MutedText>
                    </div>
                  </div>
                  <TooltipProvider>
                    <div className="flex items-center gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-border/50 hover:bg-accent/5 transition-all">
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-xl font-bold text-[10px] uppercase tracking-widest"><p>Bagikan Artikel</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className={cn("rounded-full h-12 w-12 transition-all border-border/50", isSaved && 'bg-primary text-primary-foreground border-primary shadow-xl')} onClick={handleToggleBookmark}>
                            <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-xl font-bold text-[10px] uppercase tracking-widest"><p>{isSaved ? "Hapus Dari Arsip" : "Simpan Artikel"}</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-[40px] mb-16 shadow-2xl">
                {post.image && <Image src={post.image} alt={post.title} fill className="object-cover" priority />}
              </div>
              <article className="prose prose-neutral max-w-none mb-24">
                {post.content.split('\n\n').map((p, i) => <BodyText key={i} className="text-lg md:text-2xl mb-8 leading-relaxed opacity-90 font-medium">{p}</BodyText>)}
              </article>
              <Separator className="my-20 opacity-40" />
              <section id="comments" className="mb-24">
                <div className="flex items-center gap-4 mb-12">
                  <Heading level={2} className="text-3xl">Diskusi Komunitas</Heading>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-bold">{threadedComments.length}</Badge>
                </div>
                {user ? (
                  <div className="flex gap-5 mb-16 items-start">
                    <Avatar className="h-12 w-12 shadow-xl border-2 border-white">
                      <AvatarFallback className="bg-accent text-white font-black text-sm">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Input placeholder="Tuliskan Pendapat Anda..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="bg-accent/5 border-none h-16 rounded-[24px] text-sm shadow-inner px-8" />
                      <div className="flex justify-end">
                        <Button onClick={() => handlePostComment(null)} className="rounded-[20px] gap-3 h-12 px-10 font-black tracking-widest text-[11px] uppercase shadow-lg shadow-primary/10">
                          <Send className="h-4 w-4" /> Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-accent/5 p-12 rounded-[40px] text-center mb-16 border border-dashed border-border/50">
                    <MutedText className="block mb-8 font-black uppercase tracking-[0.2em] text-xs opacity-50">Silakan Masuk Untuk Bergabung Dalam Diskusi.</MutedText>
                    <Link href="/auth"><Button className="rounded-2xl px-14 font-black tracking-widest uppercase h-14 shadow-xl">Masuk Sekarang</Button></Link>
                  </Card>
                )}
                <div className="space-y-12">
                  {isCommentsLoading ? <div className="flex justify-center py-20"><MutedText className="animate-pulse font-black uppercase tracking-[0.2em]">Memuat Diskusi...</MutedText></div> 
                  : threadedComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
                </div>
              </section>
            </motion.div>
          </div>
          <aside className="lg:col-span-4"><div className="sticky top-28 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-8 border-b border-border/30 pb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-xl tracking-tight">Berita Terpopuler</Heading>
              </div>
              <div className="space-y-10">
                {[{ id: "1", title: "Bagaimana Tipografi Mempengaruhi Psikologi Manusia", category: "Desain", timeAgo: "2 Jam Yang Lalu" }].map((story) => (
                  <Link key={story.id} href={`/news/${story.id}`} className="flex gap-5 group">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-[24px] bg-muted shadow-md">
                      <Image src={`https://picsum.photos/seed/${story.id}/200/200`} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-accent opacity-70">{story.category} • {story.timeAgo}</span>
                      <h4 className="font-headline font-bold text-base leading-snug group-hover:text-accent transition-colors">{story.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <Card className="bg-primary text-primary-foreground p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h4 className="font-headline font-bold text-2xl mb-3 tracking-tight">Buletin Berita</h4>
                <p className="text-sm opacity-70 mb-8 leading-relaxed font-medium">Jangan Ketinggalan Berita Terpenting Hari Ini.</p>
                <Link href="/auth"><Button variant="secondary" className="w-full h-14 rounded-[20px] font-black tracking-widest text-[11px] uppercase shadow-lg transition-transform active:scale-95">Langganan Sekarang</Button></Link>
              </div>
            </Card>
          </div></aside>
        </div>
      </main>
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }} className="fixed bottom-10 right-10 z-50">
        <Button size="icon" className="rounded-full h-14 w-14 shadow-2xl bg-primary text-primary-foreground hover:scale-110 transition-transform" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp className="h-7 w-7" />
        </Button>
      </motion.div>
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="rounded-[40px] p-12 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-3xl mb-2">Akses Terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-lg leading-relaxed opacity-70">Silakan Masuk Terlebih Dahulu Untuk Menikmati Fitur Diskusi Dan Memberikan Apresiasi Anda Pada Artikel Ini.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 mt-8">
            <AlertDialogCancel className="rounded-2xl font-black text-[11px] tracking-widest uppercase h-14 px-8">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-2xl font-black text-[11px] tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 shadow-xl shadow-primary/20">Masuk Sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
