
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
import { collection, serverTimestamp, doc } from "firebase/firestore";
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
    return collection(db, "posts", params.id as string, "comments");
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
  }, [user, db, params.id, post]);

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
          <Button onClick={() => router.push('/profile')} size="sm" variant="secondary" className="font-bold text-[10px]">
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
      <div className={cn("space-y-4", isReply && "ml-12 border-l pl-4 border-border/50")}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 p-4 rounded-2xl hover:bg-accent/5 transition-colors">
          <Avatar className={cn("h-8 w-8 shadow-sm", isReply && "h-6 w-6")}>
            <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
              {comment.authorName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">{comment.authorName}</span>
              {isPostAuthor && <Badge variant="default" className="text-[7px] px-1.5 py-0 font-bold tracking-tight">Penulis</Badge>}
              <span className="text-[9px] text-muted-foreground font-bold">{typeof comment.createdAt === 'string' ? comment.createdAt : "Baru Saja"}</span>
            </div>
            <BodyText className="text-sm opacity-80 mb-3">{comment.content}</BodyText>
            <div className="flex items-center gap-6">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleLikeComment(comment.id, likes)} className={cn("flex items-center gap-1.5 text-[10px] font-bold tracking-wide transition-colors", isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary")}>
                <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
                <span>{likes.length > 0 ? `${likes.length} Suka` : "Suka"}</span>
              </motion.button>
              {!isReply && (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)} className={cn("flex items-center gap-1.5 text-[10px] font-bold tracking-wide transition-colors", replyToId === comment.id ? "text-primary" : "text-muted-foreground hover:text-primary")}>
                  <Reply className="h-3.5 w-3.5" />
                  <span>Balas Pesan</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {replyToId === comment.id && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="ml-12 pr-4 overflow-hidden">
              <div className="flex gap-3 items-center py-4 bg-accent/5 rounded-2xl px-4 border border-dashed border-border/50">
                <Input placeholder={`Membalas Pesan ${comment.authorName}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="bg-white border-none h-10 rounded-xl text-xs shadow-sm" />
                <Button onClick={() => handlePostComment(comment.id)} size="sm" className="rounded-xl h-10 px-6 font-bold text-[10px] tracking-wide">
                  <Send className="h-3 w-3 mr-2" /> Kirim
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4">
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
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-wide text-muted-foreground hover:text-primary mb-8 group">
                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Kembali Ke Feed
              </Link>
              <div className="space-y-4 mb-10">
                <Badge variant="secondary" className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide">{post.category}</Badge>
                <Title className="text-3xl md:text-6xl font-headline font-bold leading-tight">{post.title}</Title>
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-xs text-primary">{post.author}</span>
                      <MutedText className="text-[10px] tracking-wide font-bold">{post.date} • {post.readTime}</MutedText>
                    </div>
                  </div>
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Bagikan Artikel</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className={cn("rounded-full h-10 w-10 transition-all", isSaved && 'bg-primary text-primary-foreground border-primary')} onClick={handleToggleBookmark}>
                            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>{isSaved ? "Hapus Dari Arsip" : "Simpan Artikel"}</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-[24px] mb-12 shadow-xl">
                {post.image && <Image src={post.image} alt={post.title} fill className="object-cover" priority />}
              </div>
              <article className="prose prose-neutral max-w-none">
                {post.content.split('\n\n').map((p, i) => <BodyText key={i} className="text-base md:text-xl mb-6 leading-relaxed opacity-90">{p}</BodyText>)}
              </article>
              <Separator className="my-16" />
              <section id="comments" className="mb-16">
                <Heading level={3} className="mb-8">Diskusi ({threadedComments.length})</Heading>
                {user ? (
                  <div className="flex gap-4 mb-10 items-start">
                    <Avatar className="h-10 w-10 shadow-sm">
                      <AvatarFallback className="bg-accent text-white font-bold">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Input placeholder="Tulis Pendapat Anda..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="bg-accent/5 border-none h-12 rounded-xl text-sm shadow-inner" />
                      <div className="flex justify-end">
                        <Button onClick={() => handlePostComment(null)} className="rounded-xl gap-2 h-10 px-8 font-bold tracking-wide text-[11px]">
                          <Send className="h-4 w-4" /> Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-accent/5 p-8 rounded-[24px] text-center mb-10 border border-dashed border-border/50">
                    <MutedText className="block mb-6 font-bold tracking-wide">Silakan Masuk Untuk Ikut Berdiskusi.</MutedText>
                    <Link href="/auth"><Button className="rounded-xl px-12 font-bold tracking-wide h-12">Masuk Sekarang</Button></Link>
                  </Card>
                )}
                <div className="space-y-10">
                  {isCommentsLoading ? <div className="flex justify-center py-10"><MutedText className="animate-pulse font-bold">Memuat Diskusi...</MutedText></div> 
                  : threadedComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)}
                </div>
              </section>
            </motion.div>
          </div>
          <aside className="lg:col-span-4"><div className="sticky top-24 space-y-12">
            <div className="flex items-center gap-3 mb-6"><TrendingUp className="h-4 w-4 text-primary" /><Heading level={3} className="text-xl">Berita Terpopuler</Heading></div>
            <div className="space-y-8">
              {[{ id: "1", title: "Bagaimana Tipografi Mempengaruhi Psikologi Manusia", category: "Desain", timeAgo: "2 Jam Yang Lalu" }].map((story) => (
                <Link key={story.id} href={`/news/${story.id}`} className="flex gap-4 group">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-muted shadow-sm">
                    <Image src={`https://picsum.photos/seed/${story.id}/200/200`} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <span className="text-[10px] font-bold tracking-wide text-accent">{story.category} • {story.timeAgo}</span>
                    <h4 className="font-headline font-bold text-sm leading-snug group-hover:text-accent transition-colors">{story.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
            <Card className="bg-primary text-primary-foreground p-8 rounded-[24px] shadow-2xl">
              <h4 className="font-headline font-bold text-xl mb-2">Buletin Berita</h4>
              <p className="text-xs opacity-70 mb-6 leading-relaxed">Jangan Ketinggalan Berita Terpenting Hari Ini.</p>
              <Link href="/auth"><Button variant="secondary" className="w-full h-12 rounded-xl font-bold tracking-wide text-[11px] shadow-lg">Langganan Sekarang</Button></Link>
            </Card>
          </div></aside>
        </div>
      </main>
      <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }} className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full h-12 w-12 shadow-2xl bg-primary text-primary-foreground hover:scale-110 transition-transform" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp className="h-6 w-6" />
        </Button>
      </motion.div>
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-2xl">Akses Terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-base">Silakan Masuk Terlebih Dahulu Untuk Menikmati Fitur Diskusi Dan Berikan Apresiasi Anda Pada Artikel Ini.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl font-bold text-[11px] tracking-wide">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-xl font-bold text-[11px] tracking-wide bg-primary text-primary-foreground hover:bg-primary/90">Masuk Sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
