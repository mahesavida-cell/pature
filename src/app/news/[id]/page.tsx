
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
import { Share2, ArrowLeft, Bookmark, TrendingUp, ChevronUp, Send, Heart, MessageSquare, CornerDownRight } from "lucide-react";
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

// Helper function for relative time with correct capitalization
const formatRelativeTime = (dateInput: any) => {
  if (!dateInput) return "Baru Saja";
  
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru Saja";
  
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} Menit yang lalu`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Jam yang lalu`;
  
  const days = Math.floor(hours / 24);
  return `${days} Hari yang lalu`;
};

const CommentItem = ({ 
  comment, 
  depth = 0, 
  user, 
  postAuthorId, 
  onLike, 
  onReply,
  replyToId,
  setReplyToId,
  replyText,
  setReplyText,
  parentAuthorName
}: { 
  comment: any; 
  depth?: number; 
  user: any; 
  postAuthorId: string;
  onLike: (id: string, likes: string[]) => void;
  onReply: (parentId: string) => void;
  replyToId: string | null;
  setReplyToId: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  parentAuthorName?: string;
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isPostAuthor = comment.authorId === postAuthorId;
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const isLiked = user && likes.includes(user.uid);

  const displayTime = mounted ? formatRelativeTime(comment.createdAt) : "---";

  return (
    <div className={cn("space-y-4", depth > 0 && "ml-4 md:ml-8 border-l border-primary/10 pl-4 md:pl-6")}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
        className="group relative flex gap-3 md:gap-4 p-4 rounded-md bg-white border border-border/50 hover:border-primary/10 transition-all duration-300 shadow-sm"
      >
        <Avatar className={cn("h-8 w-8 shadow-sm shrink-0", depth === 0 && "h-10 w-10")}>
          <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
            {comment.authorName ? comment.authorName[0].toUpperCase() : "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-primary truncate">{comment.authorName}</span>
              {isPostAuthor && <Badge className="text-[8px] px-1.5 py-0 font-bold bg-primary text-white border-none rounded-sm">Penulis</Badge>}
              <span className="text-[9px] text-muted-foreground font-medium shrink-0">
                {displayTime}
              </span>
            </div>
            {parentAuthorName && depth > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <CornerDownRight className="h-3 w-3 text-muted-foreground/40" />
                <span className="text-[9px] font-bold text-accent/60">
                  Membalas <span className="text-primary/70">@{parentAuthorName}</span>
                </span>
              </div>
            )}
          </div>
          <BodyText className="text-sm text-foreground/80 mb-4 leading-relaxed break-words font-medium">{comment.content}</BodyText>
          <div className="flex items-center gap-5">
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              onClick={() => onLike(comment.id, likes)} 
              className={cn(
                "flex items-center gap-1.5 text-[10px] font-bold tracking-tight transition-colors", 
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-current")} />
              <span>{likes.length > 0 ? `${likes.length} Suka` : "Suka"}</span>
            </motion.button>
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
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {replyToId === comment.id && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="ml-4 md:ml-8 overflow-hidden"
          >
            <div className="p-4 bg-primary/5 rounded-md border border-primary/10 space-y-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-3 w-3 text-primary/40" />
                <span className="text-[10px] font-bold opacity-60">Membalas {comment.authorName}</span>
              </div>
              <Textarea 
                placeholder={`Tulis Balasan Anda...`} 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                className="bg-white border-none min-h-[90px] rounded-sm text-sm shadow-sm px-4 focus-visible:ring-1 focus-visible:ring-primary/20 resize-none" 
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)} className="rounded-sm h-8 px-3 font-bold text-[10px]">
                  Batal
                </Button>
                <Button onClick={() => onReply(comment.id)} size="sm" className="rounded-sm h-8 px-4 font-bold text-[10px] shadow-sm">
                  <Send className="h-3.5 w-3.5 mr-2" /> Kirim Balasan
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply: any) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              depth={depth + 1} 
              user={user} 
              postAuthorId={postAuthorId} 
              onLike={onLike} 
              onReply={onReply}
              replyToId={replyToId}
              setReplyToId={setReplyToId}
              replyText={replyText}
              setReplyText={setReplyText}
              parentAuthorName={comment.authorName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const postRef = useMemoFirebase(() => params.id ? doc(db, "posts", params.id as string) : null, [db, params.id]);
  const { data: firestorePost, isLoading: isPostLoading } = useDoc(postRef);

  const staticPosts = [
    {
      id: "1",
      title: "Evolusi Desain Digital Minimalis",
      category: "Desain",
      author: "Alex Rivers",
      authorId: "author-alex-1",
      date: "24 Okt, 2024",
      readTime: "5 Menit Baca",
      excerpt: "Lansekap Desain Digital Sedang Bergeser Ke Arah Pendekatan 'Less Is More'.",
      content: "Lansekap Desain Digital Sedang Bergeser Ke Arah Pendekatan 'Less Is More'. Kami Melihat Transisi Masif Di Nama Ruang Kosong Bukan Hanya Ruang Hampa—Ini Adalah Alat Untuk Fokus. Sistem Informasi Modern Memprioritaskan Kejelasan Daripada Kompleksitas, Memastikan Bahwa Pengguna Dapat Menemukan Apa Yang Mereka Butuhkan Tanpa Kelebihan Kognitif.\n\nTipografi Juga Menjadi Pusat Perhatian. Huruf Yang Tebal Dan Mudah Didaca Menggantikan Huruf Dekoratif Untuk Meningkatkan Aksesibilitas Dan Kecepatan Konsumsi Informasi. Dalam Artikel Ini, Kami Menjelajahi Mengapa Tren Ini Bukan Sekadar Fase Sesaat Tetapi Perubahan Mendasar Dalam Cara Kita Berinteraksi Dengan Data.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl
    }
  ];

  const post = firestorePost || staticPosts.find(p => p.id === params.id) || staticPosts[0];

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
      content: "Analisis Yang Sangat Menarik. Saya Setuju Bahwa Minimalisme Adalah Kunci Untuk Mengurangi Kelelahan Digital.",
      authorName: "Dian Pratama",
      authorId: "user-1",
      likes: ["user-2", "user-3"],
      createdAt: { toDate: () => new Date(Date.now() - 3600000) },
      replies: [
        {
          id: "mock-2",
          content: "Tepat Sekali! Terkadang Kita Lupa Bahwa Desain Yang Baik Adalah Desain Yang Tidak Terlihat.",
          authorName: "Alex Rivers",
          authorId: "author-alex-1",
          likes: ["user-1"],
          createdAt: { toDate: () => new Date(Date.now() - 3000000) },
          replies: [
            {
              id: "mock-3",
              content: "Ini Menarik. Bagaimana Dengan Aksesibilitas Untuk Pengguna Dengan Gangguan Penglihatan?",
              authorName: "Rudi Hartono",
              authorId: "user-2",
              likes: [],
              createdAt: { toDate: () => new Date(Date.now() - 1500000) }
            }
          ]
        }
      ]
    }
  ];

  const threadedComments = useMemo(() => {
    if (!firestoreComments || firestoreComments.length === 0) return mockComments;
    const map = new Map();
    firestoreComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    const roots: any[] = [];
    firestoreComments.forEach(c => {
      const item = map.get(c.id);
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId).replies.push(item);
      } else {
        roots.push(item);
      }
    });
    return roots;
  }, [firestoreComments]);

  useEffect(() => {
    setMounted(true);
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
    if (!user) { setIsLoginDialogOpen(true); return; }
    if (!bookmarkRef) return;
    if (isSaved) {
      deleteDocumentNonBlocking(bookmarkRef);
      toast({ title: "Dihapus Dari Arsip", description: `"${post.title}" Berhasil Dihapus.` });
    } else {
      setDocumentNonBlocking(bookmarkRef, {
        postId: params.id,
        title: post.title,
        category: post.category,
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Berhasil Diarsipkan", description: `"${post.title}" Tersimpan Di Profil.` });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt || `Baca Berita Terbaru Di InfoFlow: ${post.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Tautan Berhasil Disalin",
          description: "Tautan Berita Telah Disalin Ke Papan Klip Anda.",
        });
      }
    } catch (err) {
      // User cancelled
    }
  };

  const handlePostComment = (parentId: string | null = null) => {
    if (!user) { setIsLoginDialogOpen(true); return; }
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;
    const colRef = collection(db, "posts", params.id as string, "comments");
    addDocumentNonBlocking(colRef, {
      content: text,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || "Pengguna InfoFlow",
      createdAt: serverTimestamp(),
      postId: params.id,
      parentId: parentId,
      likes: []
    });
    if (parentId) { setReplyText(""); setReplyToId(null); } else { setCommentText(""); }
  };

  const handleLikeComment = (commentId: string, currentLikes: string[] = []) => {
    if (!user) { setIsLoginDialogOpen(true); return; }
    const likes = Array.isArray(currentLikes) ? currentLikes : [];
    const isLiked = likes.includes(user.uid);
    const newLikes = isLiked ? likes.filter(id => id !== user.uid) : [...likes, user.uid];
    const commentRef = doc(db, "posts", params.id as string, "comments", commentId);
    updateDocumentNonBlocking(commentRef, { likes: newLikes });
  };

  const popularStories = [
    { id: "1", title: "Psikologi Tipografi Dalam Desain", category: "Desain", timeAgo: "2 Jam yang lalu" },
    { id: "2", title: "Masa Depan AI Di Media", category: "Teknologi", timeAgo: "4 Jam yang lalu" },
    { id: "3", title: "Arsitektur Kota Hijau", category: "Budaya", timeAgo: "1 Hari yang lalu" },
    { id: "4", title: "Strategi Ekonomi Digital", category: "Bisnis", timeAgo: "6 Jam yang lalu" }
  ];

  return (
    <div className="bg-background min-h-screen pb-10">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-tight text-muted-foreground hover:text-primary mb-8 group transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali Ke Feed Berita
              </Link>
              <div className="space-y-4 mb-10">
                <Badge variant="secondary" className="px-3 py-0.5 rounded-sm text-[10px] font-bold bg-primary/5 text-primary border-none">{post.category}</Badge>
                <Title className="text-3xl md:text-4xl font-headline font-bold leading-tight">{post.title}</Title>
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {post.author ? post.author.split(' ').map((n: string) => n[0]).join('') : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-xs text-primary">{post.author || "Penulis InfoFlow"}</span>
                      <MutedText className="text-[10px] opacity-60 font-medium">{post.date || "Baru Saja"} • {post.readTime || "5 Menit Baca"}</MutedText>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Bagikan Berita"
                      className="rounded-full h-9 w-9 border-border/40 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      title="Simpan Berita"
                      className={cn("rounded-full h-9 w-9 transition-all border-border/40 shadow-sm", isSaved && 'bg-primary text-primary-foreground border-primary')} 
                      onClick={handleToggleBookmark}
                    >
                      <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md mb-12 shadow-sm border border-border/10">
                <Image src={post.image || PlaceHolderImages[0].imageUrl} alt={post.title} fill className="object-cover" priority />
              </div>
              <article className="prose prose-neutral max-w-none mb-20">
                {post.content ? post.content.split('\n\n').map((p: string, i: number) => (
                  <BodyText key={i} className="text-lg mb-6 leading-relaxed opacity-90 font-medium">{p}</BodyText>
                )) : <BodyText className="text-lg mb-6 opacity-60">Memuat Konten...</BodyText>}
              </article>
              <Separator className="my-16 opacity-30" />
              <section id="comments" className="mb-24">
                <div className="flex items-center gap-3 mb-10">
                  <Heading level={2} className="text-xl">Diskusi Komunitas</Heading>
                  <Badge className="rounded-sm px-3 py-0.5 text-[11px] font-bold bg-primary/10 text-primary border-none">
                    {firestoreComments?.length || 0}
                  </Badge>
                </div>
                {user ? (
                  <div className="flex gap-4 mb-14 items-start p-6 rounded-md bg-primary/5 border border-primary/10">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary text-white font-bold text-xs">{(user.displayName || user.email || "U")[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea 
                        placeholder="Tuliskan Pendapat Anda..." 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        className="bg-white border-none min-h-[100px] rounded-sm text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20 resize-none px-4 py-3" 
                      />
                      <div className="flex justify-end">
                        <Button onClick={() => handlePostComment(null)} disabled={!commentText.trim()} className="rounded-sm gap-2 h-10 px-8 font-bold text-[11px] shadow-sm">
                          <Send className="h-3.5 w-3.5" /> Kirim Komentar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-primary/5 p-10 rounded-md text-center mb-14 border border-dashed border-primary/20">
                    <MutedText className="block mb-6 font-medium text-xs">Masuk Untuk Bergabung Dalam Diskusi.</MutedText>
                    <Link href="/auth"><Button className="rounded-sm px-12 font-bold h-11 shadow-sm">Masuk Sekarang</Button></Link>
                  </Card>
                )}
                <div className="space-y-8">
                  {isCommentsLoading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                      <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : threadedComments.length > 0 ? (
                    threadedComments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} user={user} postAuthorId={post.authorId} onLike={handleLikeComment} onReply={handlePostComment} replyToId={replyToId} setReplyToId={setReplyToId} replyText={replyText} setReplyText={setReplyText} />
                    ))
                  ) : <div className="py-20 text-center rounded-md border border-dashed border-border/40"><MutedText className="text-xs opacity-50">Belum Ada Komentar. Jadilah Yang Pertama Memberikan Pendapat!</MutedText></div>}
                </div>
              </section>
            </motion.div>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-border/20 pb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <Heading level={3} className="text-lg">Berita Terpopuler</Heading>
                </div>
                <div className="space-y-8">
                  {popularStories.map((story) => (
                    <Link key={story.id} href={`/news/${story.id}`} className="flex gap-4 group">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
                        <Image src={`https://picsum.photos/seed/${story.id}/200/200`} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-bold text-accent opacity-70 mb-1">{story.category} • {story.timeAgo}</span>
                        <h4 className="font-headline font-bold text-sm leading-tight group-hover:text-primary transition-colors">{story.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-border/10">
                  <Link href="/" className="text-[10px] font-bold text-muted-foreground hover:text-primary hover:underline transition-all">Lihat Lebih Banyak Berita</Link>
                </div>
              </section>
              
              <Card className="bg-primary text-primary-foreground p-6 rounded-md shadow-md">
                <div className="text-center">
                  <Heading level={3} className="text-white text-lg mb-2">Buletin Berita</Heading>
                  <BodyText className="text-[11px] text-white/70 mb-8 leading-relaxed font-medium">Dapatkan Ringkasan Berita Terpenting Setiap Hari Langsung Ke Email Anda.</BodyText>
                  <Link href="/auth"><Button variant="secondary" className="w-full h-11 rounded-sm font-bold text-[10px] shadow-sm">Langganan Sekarang</Button></Link>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </main>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: showBackToTop ? 1 : 0 }} className="fixed bottom-8 right-8 z-50">
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg bg-primary text-primary-foreground" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp className="h-6 w-6" />
        </Button>
      </motion.div>
      <AlertDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <AlertDialogContent className="rounded-md p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl">Akses Terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm opacity-70">Silakan Masuk Terlebih Dahulu Untuk Berpartisipasi Dalam Diskusi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8"><AlertDialogCancel className="rounded-sm font-bold text-[10px] h-11">Batal</AlertDialogCancel><AlertDialogAction onClick={() => router.push('/auth')} className="rounded-sm font-bold text-[10px] bg-primary h-11 shadow-sm">Masuk Sekarang</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
