
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Title, Heading, BodyText, MutedText, TypographyP } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/wrapped/Card";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { 
  Share2, 
  ArrowLeft, 
  Bookmark, 
  TrendingUp, 
  ChevronUp, 
  Send, 
  Heart, 
  MessageSquare, 
  CornerDownRight, 
  Copy, 
  Facebook,
  Info
} from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MAX_COMMENT_CHARS = 1000;

const formatRelativeTime = (dateInput: any) => {
  if (!dateInput) return "baru saja";
  
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "baru saja";
  
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} menit yang lalu`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
};

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ShareButton = ({ post }: { post: any }) => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || `Baca berita terbaru di InfoFlow: ${post.title}`,
          url: url,
        });
      } else {
        copyToClipboard();
      }
    } catch (err) {
      // User cancelled
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Tautan disalin",
      description: "Tautan berita telah berhasil disalin ke papan klip Anda.",
    });
  };

  const shareLinks = [
    { name: "WhatsApp", icon: <MessageSquare className="h-4 w-4" />, href: `https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}` },
    { name: "Facebook", icon: <Facebook className="h-4 w-4" />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "X", icon: <XIcon />, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}` },
  ];

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-9 w-9 border-white/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm bg-white/40 backdrop-blur-md"
        onClick={handleNativeShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-9 w-9 border-white/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm bg-white/40 backdrop-blur-md"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2 bg-white/90 backdrop-blur-xl border-white/20 rounded-lg shadow-xl">
        <div className="grid gap-1">
          <MutedText className="px-2 py-1.5 text-[10px] font-bold opacity-40 uppercase tracking-wider">Bagikan melalui</MutedText>
          {shareLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/5 text-xs font-medium transition-colors group"
            >
              <span className="text-muted-foreground group-hover:text-primary">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
          <Separator className="my-1 opacity-40" />
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/5 text-xs font-medium transition-colors group text-left w-full"
          >
            <span className="text-muted-foreground group-hover:text-primary"><Copy className="h-4 w-4" /></span>
            <span>Salin tautan</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
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
  const isPostAuthor = comment.authorId === postAuthorId;
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const isLiked = user && likes.includes(user.uid);

  return (
    <div className={cn("space-y-4", depth > 0 && "ml-4 md:ml-8 border-l-2 border-primary/5 pl-4 md:pl-6")}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="group relative flex gap-3 md:gap-4 p-4 rounded-lg bg-white/40 backdrop-blur-md border border-white/20 hover:border-primary/10 transition-all duration-300 shadow-sm"
      >
        <Avatar className={cn("h-8 w-8 shadow-sm shrink-0", depth === 0 && "h-10 w-10")}>
          <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary uppercase">
            {comment.authorName ? comment.authorName[0] : "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-primary truncate">{comment.authorName}</span>
              {isPostAuthor && <Badge className="text-[8px] px-1.5 py-0 font-bold bg-primary text-white border-none rounded-sm">Penulis</Badge>}
              <span className="text-[9px] text-muted-foreground font-medium shrink-0">
                {formatRelativeTime(comment.createdAt)}
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
              <span>{likes.length > 0 ? `${likes.length} suka` : "Suka"}</span>
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
              <span>Balas pesan</span>
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
            <div className="p-4 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10 space-y-3 mb-4">
              <div className="relative">
                <Textarea 
                  placeholder="Tulis balasan Anda..." 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value.slice(0, MAX_COMMENT_CHARS))} 
                  className="bg-white/60 border-none min-h-[90px] rounded-sm text-sm shadow-sm px-4 focus-visible:ring-1 focus-visible:ring-primary/20 resize-none" 
                />
                <div className="flex justify-end mt-1">
                  <span className={cn(
                    "text-[9px] font-bold opacity-40",
                    replyText.length >= MAX_COMMENT_CHARS && "text-destructive opacity-100"
                  )}>
                    {replyText.length}/{MAX_COMMENT_CHARS} karakter tersisa
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)} className="rounded-sm h-8 px-3 font-bold text-[10px]">Batal</Button>
                <Button onClick={() => onReply(comment.id)} size="sm" className="rounded-sm h-8 px-4 font-bold text-[10px] shadow-sm">Kirim balasan</Button>
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
  const { data: firestorePost } = useDoc(postRef);

  const staticPosts = [
    {
      id: "1",
      title: "Evolusi Desain Digital Minimalis",
      category: "Desain",
      author: "Alex Rivers",
      authorId: "author-alex-1",
      date: "24 Okt 2024",
      readTime: "5 menit baca",
      excerpt: "Menjelajahi bagaimana ruang kosong dan tipografi yang jelas menjadi standar untuk sistem informasi modern.",
      content: "Lansekap desain digital sedang bergeser ke arah pendekatan 'less is more'. Kami melihat transisi masif di mana ruang kosong bukan hanya ruang hampa—ini adalah alat untuk fokus. Sistem informasi modern memprioritaskan kejelasan daripada kompleksitas, memastikan bahwa pengguna dapat menemukan apa yang mereka butuhkan tanpa kelebihan kognitif.\n\nTipografi juga menjadi pusat perhatian. Huruf yang tebal dan mudah dibaca menggantikan huruf dekoratif untuk meningkatkan aksesibilitas dan kecepatan konsumsi informasi. Dalam artikel ini, kami menjelajahi mengapa tren ini bukan sekadar fase sesaat tetapi perubahan mendasar dalam cara kita berinteraksi dengan data.",
      image: PlaceHolderImages.find(img => img.id === "tech-news")?.imageUrl,
      imageCaption: "Ruang kosong yang tertata memberikan kejelasan informasi.",
      imageCredit: "Foto oleh Alex Rivers",
      galleryTitle: "Evolusi antarmuka modern",
      gallerySubtitle: "Melihat lebih dekat bagaimana elemen visual minimalis diterapkan dalam berbagai studi kasus desain.",
      gallery: [
        { url: PlaceHolderImages[0].imageUrl, caption: "Evolusi antarmuka dari masa ke masa." },
        { url: PlaceHolderImages[1].imageUrl, caption: "Contoh tipografi yang efektif." },
        { url: PlaceHolderImages[2].imageUrl, caption: "Penerapan warna minimalis pada dashboard." }
      ]
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

  const threadedComments = useMemo(() => {
    if (!firestoreComments) return [];
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
      toast({ title: "Dihapus dari arsip", description: `"${post.title}" berhasil dihapus.` });
    } else {
      setDocumentNonBlocking(bookmarkRef, {
        postId: params.id,
        title: post.title,
        category: post.category,
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Berhasil diarsipkan", description: `"${post.title}" tersimpan di profil.` });
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

  return (
    <div className="bg-background min-h-screen pb-10">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-8 md:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-tight text-muted-foreground hover:text-primary mb-8 group transition-colors">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke feed berita
              </Link>
              
              <div className="space-y-4 mb-10">
                <Badge variant="secondary" className="px-3 py-0.5 rounded-sm text-[10px] font-bold bg-primary/5 text-primary border-none">{post.category}</Badge>
                <Title className="text-3xl md:text-4xl font-headline font-bold leading-tight">{post.title}</Title>
                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white shadow-sm">
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                        {post.author ? post.author.split(' ').map((n: string) => n[0]).join('') : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="block font-bold text-xs text-primary">{post.author || "Penulis InfoFlow"}</span>
                      <MutedText className="text-[10px] opacity-60 font-medium">
                        {mounted ? (post.date || "Baru saja") : "---"} • {post.readTime || "5 menit baca"}
                      </MutedText>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShareButton post={post} />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "rounded-full h-9 w-9 transition-all border-white/20 shadow-sm bg-white/40 backdrop-blur-md", 
                        isSaved && 'bg-primary text-primary-foreground border-primary'
                      )} 
                      onClick={handleToggleBookmark}
                    >
                      <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main image with details */}
              <div className="mb-12">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-sm border border-border/10 mb-3">
                  <Image src={post.image || PlaceHolderImages[0].imageUrl} alt={post.title} fill className="object-cover" priority />
                </div>
                {(post.imageCaption || post.imageCredit) && (
                  <div className="flex items-start gap-3 px-1">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      {post.imageCaption && <p className="text-[11px] leading-snug text-foreground/70 font-medium">{post.imageCaption}</p>}
                      {post.imageCredit && <p className="text-[10px] text-muted-foreground italic">{post.imageCredit}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Typography content area */}
              <article className="prose prose-neutral max-w-none mb-16">
                {post.content ? post.content.split('\n\n').map((p: string, i: number) => {
                  const parts = p.split(/(\*\*.*?\*\*)/g);
                  return (
                    <TypographyP key={i} className="text-lg opacity-95 font-medium">
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j} className="text-primary font-bold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </TypographyP>
                  );
                }) : <TypographyP className="text-lg opacity-60">Memuat konten...</TypographyP>}
              </article>

              {/* Image carousel / Gallery mode */}
              {post.gallery && post.gallery.length > 0 && (
                <section className="mb-20">
                  <div className="space-y-2 mb-8">
                    <Heading level={3} className="text-lg">{post.galleryTitle || "Galeri foto"}</Heading>
                    {post.gallerySubtitle && (
                      <BodyText className="text-sm opacity-70 max-w-2xl">{post.gallerySubtitle}</BodyText>
                    )}
                  </div>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {post.gallery.map((img: any, idx: number) => (
                        <CarouselItem key={idx}>
                          <div className="space-y-3">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                              <Image src={img.url} alt={`Galeri foto ${idx}`} fill className="object-cover" />
                            </div>
                            {img.caption && <p className="text-[11px] text-center text-muted-foreground font-medium px-4">{img.caption}</p>}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </section>
              )}

              <Separator className="my-16 opacity-30" />

              {/* Discussion community */}
              <section id="comments" className="mb-24">
                <div className="flex items-center gap-3 mb-10">
                  <Heading level={2} className="text-xl">Diskusi komunitas</Heading>
                  <Badge className="rounded-sm px-3 py-0.5 text-[11px] font-bold bg-primary/10 text-primary border-none">
                    {firestoreComments?.length || 0}
                  </Badge>
                </div>
                {user ? (
                  <div className="flex flex-col gap-4 mb-14 p-6 rounded-lg bg-white/40 backdrop-blur-md border border-white/20">
                    <div className="flex gap-4 items-start">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary text-white font-bold text-xs uppercase">{(user.displayName || user.email || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea 
                          placeholder="Tuliskan pendapat Anda..." 
                          value={commentText} 
                          onChange={(e) => setCommentText(e.target.value.slice(0, MAX_COMMENT_CHARS))} 
                          className="bg-white/60 border-none min-h-[100px] rounded-sm text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary/20 resize-none px-4 py-3" 
                        />
                        <div className="flex justify-between items-center">
                          <span className={cn(
                            "text-[10px] font-bold opacity-40",
                            commentText.length >= MAX_COMMENT_CHARS && "text-destructive opacity-100"
                          )}>
                            {commentText.length}/{MAX_COMMENT_CHARS} karakter tersisa
                          </span>
                          <Button onClick={() => handlePostComment(null)} disabled={!commentText.trim()} className="rounded-sm gap-2 h-10 px-8 font-bold text-[11px] shadow-sm">
                            <Send className="h-3.5 w-3.5" /> Kirim komentar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-white/40 backdrop-blur-md p-10 rounded-lg text-center mb-14 border border-dashed border-primary/20">
                    <MutedText className="block mb-6 font-medium text-xs">Masuk untuk bergabung dalam diskusi.</MutedText>
                    <Link href="/auth"><Button className="rounded-sm px-12 font-bold h-11 shadow-sm">Masuk sekarang</Button></Link>
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
                  ) : <div className="py-20 text-center rounded-lg border border-dashed border-border/40 bg-white/20 backdrop-blur-sm"><MutedText className="text-xs opacity-50">Belum ada komentar. Jadilah yang pertama memberikan pendapat!</MutedText></div>}
                </div>
              </section>
            </motion.div>
          </div>
          
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-border/20 pb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <Heading level={3} className="text-lg">Berita terpopuler</Heading>
                </div>
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((id) => (
                    <Link key={id} href={`/news/${id}`} className="flex gap-4 group">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
                        <Image src={`https://picsum.photos/seed/${id}/200/200`} alt="Pop" fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[9px] font-bold text-accent opacity-70 mb-1">Berita • {id} jam yang lalu</span>
                        <h4 className="font-headline font-bold text-sm leading-tight group-hover:text-primary transition-colors">Analisis Mendalam Tren Industri Modern</h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-border/10">
                  <Link href="/" className="text-[10px] font-bold text-muted-foreground hover:text-primary hover:underline transition-all">Lihat lebih banyak berita</Link>
                </div>
              </section>
              
              <Card className="bg-primary/95 text-primary-foreground p-6 rounded-lg shadow-md border-none">
                <div className="text-center">
                  <Heading level={3} className="text-white text-lg mb-2">Buletin berita</Heading>
                  <BodyText className="text-[11px] text-white/70 mb-8 leading-relaxed font-medium">Dapatkan ringkasan berita terpenting setiap hari langsung ke email Anda.</BodyText>
                  <Link href="/auth"><Button variant="secondary" className="w-full h-11 rounded-sm font-bold text-[10px] shadow-sm">Langganan sekarang</Button></Link>
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
        <AlertDialogContent className="rounded-lg p-8 bg-white/90 backdrop-blur-xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline font-bold text-xl">Akses terbatas</AlertDialogTitle>
            <AlertDialogDescription className="text-sm opacity-70">Silakan masuk terlebih dahulu untuk berpartisipasi dalam diskusi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8">
            <AlertDialogCancel className="rounded-sm font-bold text-[10px] h-11">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/auth')} className="rounded-sm font-bold text-[10px] bg-primary h-11 shadow-sm">Masuk sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
