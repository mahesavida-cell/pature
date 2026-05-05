
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/wrapped/Card";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Share2, ArrowLeft, Bookmark, TrendingUp, ChevronUp, Send, Heart, MessageSquare } from "lucide-react";
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
  setDocumentNonBlocking,
  deleteDocumentNonBlocking,
  addDocumentNonBlocking,
  updateDocumentNonBlocking
} from "@/firebase";
import { collection, serverTimestamp, doc, query, orderBy } from "firebase/firestore";
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

  const threadedComments = useMemo(() => {
    if (!firestoreComments) return [];
    const roots = firestoreComments.filter(c => !c.parentId);
    const replies = firestoreComments.filter(c => !!c.parentId);
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
          <Button onClick={() => router.push('/profile')} size="sm" variant="secondary" className="font-bold text-[10px] tracking-tight">
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
    toast({
      title: "Komentar Terkirim",
      description: "Terima Kasih Telah Berkontribusi Dalam Diskusi.",
    });
  };

  const handleLikeComment = (commentId: string, currentLikes: string[] = []) => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
    const likes = Array.isArray(currentLikes) ? currentLikes : [];
    const isLiked = likes.includes(user.uid);
    const newLikes = isLiked ? likes.filter(id => id !== user.uid) : [...likes, user.uid];
    const commentRef = doc(db, "posts", params.id as string, "comments", commentId);
    updateDocumentNonBlocking(commentRef, { likes: newLikes });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: any, isReply?: boolean }) => {
    const isPostAuthor = comment.authorId === post.authorId;
    const likes = Array.isArray(comment.likes) ? comment.likes : [];
    const isLiked = user && likes.includes(user.uid);
    return (
      <div className={cn("space-y-3", isReply && "ml-8 md:ml-10 border-l-2 pl-4 border-primary/10")}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="group flex gap-3 md:gap-4 p-4 rounded-md bg-white border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300"
        >
          <Avatar className={cn("h-10 w-10 shadow-sm", isReply && "h-8 w-8")}>
            <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
              {comment.authorName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary truncate">{comment.authorName}</span>
                {isPostAuthor && <Badge className="text-[8px] px-1.5 py-0 font-bold bg-primary text-white border-none">Penulis</Badge>}
                <span className="text-[9px] text-muted-foreground font-medium shrink-0">
                  {comment.createdAt?.toDate ? new Date(comment.createdAt.toDate()).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "Baru Saja"}
                </span>
              </div>
            </div>
            <BodyText className="text-sm text-foreground/80 mb-4 leading-relaxed break-words">{comment.content}</BodyText>
            <div className="flex items-center gap-5">
              <motion.button 
                whileTap={{ scale: 0.9 }} 
                onClick={() => handleLikeComment(comment.id, likes)} 
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold tracking-tight transition-colors", 
                  isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-current")} />
                <span>{likes.length > 0 ? `${likes.length} Suka` : "Suka"}</span>
              </motion.button>
              {!isReply && (
                <motion.button 
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)} 
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-bold tracking-tight transition-colors", 
                    replyToId === comment.id ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Balas Pesan</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {replyToId === comment.id && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }} 
              className="ml-8 md:ml-10 overflow-hidden mt-3"
            >
              <div className="p-4 bg-primary/5 rounded-md border border-primary/10 space-y-3">
                <Textarea 
                  placeholder={`Membalas Pesan ${comment.authorName}...`} 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)} 
                  className="bg-white border-none min-h-[80px] rounded-md text-sm shadow-sm px-4 focus-visible:ring-1 focus-visible:ring-primary/20 resize-none" 
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)} className="rounded-md h-8 px-3 font-bold text-[10px]">
                    Batal
                  </Button>
                  <Button onClick={() => handlePostComment(comment.id)} size="sm" className="rounded-md h-8 px-4 font-bold text-[10px] shadow-sm">
                    <Send className="h-3 w-3 mr-2" /> Balas
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-4 pt-2">
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
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-tight text-muted-foreground hover:text-primary mb-8 group transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali Ke Feed Berita
              </Link>
              <div className="space-y-4 mb-10">
                <Badge variant="secondary" className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-primary/5 text-primary border-none">{post.category}</Badge>
                <Title className="text-3xl md:text-4xl font-headline font-bold leading-[1.2] tracking-tight">{post.title}</Title>
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-xs text-primary tracking-tight">{post.author}</span>
                      <MutedText className="text-[10px] font-medium opacity-60">{post.date} • {post.readTime}</MutedText>
                    </div>
                  </div>
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-border/40 hover:bg-primary/5 hover:text-primary transition-all">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-md font-bold text-[10px]"><p>Bagikan Artikel</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className={cn(
                              "rounded-full h-9 w-9 transition-all border-border/40", 
                              isSaved && 'bg-primary text-primary-foreground border-primary shadow-sm'
                            )} 
                            onClick={handleToggleBookmark}
                          >
                            <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-md font-bold text-[10px]"><p>{isSaved ? "Hapus Dari Arsip" : "Simpan Artikel"}</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md mb-12 shadow-md border border-border/10">
                {post.image && <Image src={post.image} alt={post.title} fill className="object-cover" priority />}
              </div>
              <article className="prose prose-neutral max-w-none mb-20">
                {post.content.split('\n\n').map((p, i) => <BodyText key={i} className="text-lg mb-6 leading-relaxed opacity-90 font-medium">{p}</BodyText>)}
              </article>
              <Separator className="my-16 opacity-30" />
              <section id="comments" className="mb-24">
                <div className="flex items-center gap-3 mb-10">
                  <Heading level={2} className="text-xl">Diskusi Komunitas</Heading>
                  <Badge className="rounded-full px-3 py-0.5 text-[11px] font-bold bg-primary/10 text-primary border-none">
                    {firestoreComments?.length || 0}
                  </Badge>
                </div>
                {user ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mb-14 items-start p-6 rounded-md bg-primary/5 border border-primary/10">
                    <Avatar className="h-10 w-10 shadow-sm border border-white shrink-0">
                      <AvatarFallback className="bg-primary text-white font-bold text-xs">{(user.displayName || user.email || "U")[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea 
                        placeholder="Tuliskan Pendapat Anda Tentang Artikel Ini..." 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        className="bg-white border-none min-h-[100px] rounded-md text-sm shadow-sm px-6 py-4 focus-visible:ring-1 focus-visible:ring-primary/20 resize-none" 
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => handlePostComment(null)} 
                          disabled={!commentText.trim()}
                          className="rounded-md gap-2 h-10 px-8 font-bold text-[11px] shadow-sm transition-transform active:scale-95"
                        >
                          <Send className="h-3.5 w-3.5" /> Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <Card className="bg-primary/5 p-10 rounded-md text-center mb-14 border border-dashed border-primary/20">
                    <MutedText className="block mb-6 font-medium text-xs opacity-60">Silakan Masuk Terlebih Dahulu Untuk Bergabung Dalam Diskusi Komunitas Kami.</MutedText>
                    <Link href="/auth">
                      <Button className="rounded-md px-12 font-bold h-11 shadow-sm">Masuk Sekarang</Button>
                    </Link>
                  </Card>
                )}
                <div className="space-y-6">
                  {isCommentsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <MutedText className="font-medium text-xs">Memuat Diskusi...</MutedText>
                    </div>
                  ) : threadedComments.length > 0 ? (
                    threadedComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
                  ) : (
                    <div className="py-20 text-center rounded-md border-2 border-dashed border-border/40">
                      <MutedText className="text-xs opacity-50">Belum Ada Komentar. Jadilah Yang Pertama Memberikan Pendapat!</MutedText>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <div>
                <div className="flex items-center gap-2 mb-6 border-b border-border/20 pb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <Heading level={3} className="text-lg tracking-tight">Berita Terpopuler</Heading>
                </div>
                <div className="space-y-8">
                  {[{ id: "1", title: "Bagaimana Tipografi Mempengaruhi Psikologi Manusia", category: "Desain", timeAgo: "2 Jam Yang Lalu" }].map((story) => (
                    <Link key={story.id} href={`/news/${story.id}`} className="flex gap-4 group">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
                        <Image src={`https://picsum.photos/seed/${story.id}/200/200`} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex flex-col justify-center gap-1.5">
                        <span className="text-[9px] font-bold text-accent opacity-70">{story.category} • {story.timeAgo}</span>
                        <h4 className="font-headline font-bold text-sm leading-snug group-hover:text-primary transition-colors">{story.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <Card className="bg-primary text-primary-foreground p-6 rounded-md shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingUp className="h-24 w-24" />
                </div>
                <div className="relative z-10 text-center">
                  <Heading level={3} className="text-white text-lg mb-2 tracking-tight">Buletin Berita</Heading>
                  <BodyText className="text-[11px] text-white/70 mb-8 leading-relaxed font-medium">Dapatkan Ringkasan Berita Terpenting Langsung Ke Akun Anda Setiap Hari.</BodyText>
                  <Link href="/auth">
                    <Button variant="secondary" className="w-full h-11 rounded-md font-bold text-[10px] shadow-sm transition-transform active:scale-95">
                      Langganan Sekarang
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0 }} className="fixed bottom-8 right-8 z-50">
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg bg-primary text-primary-foreground hover:scale-110 transition-transform" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp className="h-6 w-6" />
        </Button>
      </motion.div>
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="rounded-md p-8 border-none shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl mb-2">Akses Terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed opacity-70 mb-2">Silakan Masuk Terlebih Dahulu Untuk Menikmati Fitur Diskusi, Memberikan Suka, Atau Menyimpan Artikel Ini Ke Arsip Anda.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-8">
            <AlertDialogCancel className="rounded-md font-bold text-[10px] h-11 px-6 border-border">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-md font-bold text-[10px] bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-sm">Masuk Sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
