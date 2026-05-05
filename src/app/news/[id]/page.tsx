"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Title, Heading, BodyText, MutedText, TypographyP } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/wrapped/Card";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { 
  Share2, 
  ArrowLeft, 
  Bookmark, 
  TrendingUp, 
  Send, 
  Heart, 
  MessageSquare, 
  Copy, 
  RefreshCw
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
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
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_DETAIL_QUERY, TRENDING_POSTS_QUERY } from "@/sanity/lib/queries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const ShareButton = ({ post }: { post: any }) => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url
        });
      } catch (e) { /* silent */ }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Tautan disalin", description: "Tautan berita telah disalin ke papan klip." });
  };

  if (canShare) {
    return (
      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/10 bg-white/40" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/10 bg-white/40">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2 rounded-lg bg-white/90 backdrop-blur-xl border-primary/5">
        <div className="grid gap-1">
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/5 text-xs font-medium transition-colors">
            <MessageSquare className="h-4 w-4 text-green-600" /> WhatsApp
          </button>
          <button onClick={copyToClipboard} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/5 text-xs font-medium transition-colors">
            <Copy className="h-4 w-4 text-muted-foreground" /> Salin tautan
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CommentItem = ({ 
  comment, depth = 0, user, postAuthorId, onLike, onReply, replyToId, setReplyToId, replyText, setReplyText 
}: any) => {
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const isLiked = user && likes.includes(user.uid);

  return (
    <div className={cn("space-y-4", depth > 0 && "ml-6 md:ml-10 border-l-2 border-primary/5 pl-4 md:pl-6")}>
      <div className="flex gap-4 p-4 rounded-lg bg-white/40 border border-primary/10 shadow-sm">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">{comment.authorName?.[0] || "A"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-primary">{comment.authorName}</span>
            <span className="text-[9px] text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <BodyText className="text-sm text-foreground/80 mb-3 font-medium">{comment.content}</BodyText>
          <div className="flex items-center gap-4">
            <button onClick={() => onLike(comment.id, likes)} className={cn("flex items-center gap-1.5 text-[10px] font-bold", isLiked ? "text-red-500" : "text-muted-foreground hover:text-primary")}>
              <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} /> {likes.length || ""} Suka
            </button>
            <button onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)} className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary">
              <MessageSquare className="h-3.5 w-3.5" /> Balas
            </button>
          </div>
        </div>
      </div>
      
      {replyToId === comment.id && (
        <div className="ml-6 space-y-3">
          <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value.slice(0, 500))} className="bg-white/60 min-h-[80px] text-sm" placeholder="Tulis balasan..." />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)} className="h-8 text-[10px] font-bold">Batal</Button>
            <Button size="sm" onClick={() => onReply(comment.id)} className="h-8 text-[10px] font-bold">Kirim</Button>
          </div>
        </div>
      )}

      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} user={user} postAuthorId={postAuthorId} onLike={onLike} onReply={onReply} replyToId={replyToId} setReplyToId={setReplyToId} replyText={replyText} setReplyText={setReplyText} />
      ))}
    </div>
  );
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [sanityPost, setSanityPost] = useState<any>(null);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      try {
        const [postData, trendingData] = await Promise.all([
          client.fetch(POST_DETAIL_QUERY, { slug: params.id }),
          client.fetch(TRENDING_POSTS_QUERY)
        ]);
        setSanityPost(postData);
        setTrendingPosts(trendingData || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (user && db && params.id && sanityPost) {
      const historyRef = doc(db, "users", user.uid, "history", params.id as string);
      setDocumentNonBlocking(historyRef, {
        postId: params.id,
        title: sanityPost.title,
        category: sanityPost.categories?.[0] || "Berita",
        viewedAt: new Date().toISOString()
      }, { merge: true });
    }
  }, [user, db, params.id, sanityPost]);

  const bookmarkRef = useMemoFirebase(() => (user && db && params.id) ? doc(db, "users", user.uid, "bookmarks", params.id as string) : null, [db, user, params.id]);
  const { data: bookmarkData } = useDoc(bookmarkRef);
  const isSaved = !!bookmarkData;

  const commentsQuery = useMemoFirebase(() => (db && params.id) ? query(collection(db, "posts", params.id as string, "comments"), orderBy("createdAt", "asc")) : null, [db, params.id]);
  const { data: firestoreComments } = useCollection(commentsQuery);

  const threadedComments = useMemo(() => {
    if (!firestoreComments) return [];
    const map = new Map();
    firestoreComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    const roots: any[] = [];
    firestoreComments.forEach(c => {
      const item = map.get(c.id);
      if (c.parentId && map.has(c.parentId)) map.get(c.parentId).replies.push(item);
      else roots.push(item);
    });
    return roots;
  }, [firestoreComments]);

  const handleToggleBookmark = () => {
    if (!user) { router.push('/auth'); return; }
    if (!bookmarkRef || !sanityPost) return;
    if (isSaved) {
      deleteDocumentNonBlocking(bookmarkRef);
      toast({ title: "Dihapus", description: "Berita dihapus dari arsip." });
    } else {
      setDocumentNonBlocking(bookmarkRef, {
        postId: params.id,
        title: sanityPost.title,
        category: sanityPost.categories?.[0] || "Berita",
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Berhasil diarsipkan", description: "Tersimpan di profil Anda." });
    }
  };

  const handlePostComment = (parentId: string | null = null) => {
    if (!user || !db) { router.push('/auth'); return; }
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;
    addDocumentNonBlocking(collection(db, "posts", params.id as string, "comments"), {
      content: text,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || "Pengguna PatureNews",
      createdAt: serverTimestamp(),
      postId: params.id,
      parentId: parentId,
      likes: []
    });
    if (parentId) { setReplyText(""); setReplyToId(null); } else setCommentText("");
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="h-8 w-8 animate-spin opacity-20" /></div>;
  if (!sanityPost) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><Heading level={2}>Berita tidak ditemukan</Heading><Link href="/"><Button>Kembali ke beranda</Button></Link></div>;

  return (
    <div className="bg-background min-h-screen pb-10">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary mb-8 group uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke feed
            </Link>
            
            <header className="space-y-4 mb-10">
              <Badge variant="secondary" className="px-3 py-0.5 rounded-sm text-[10px] font-bold bg-primary/5 text-primary border-none uppercase">{sanityPost.categories?.[0] || "Berita"}</Badge>
              <Title className="text-3xl md:text-5xl">{sanityPost.title}</Title>
              <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">{sanityPost.author?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="block font-bold text-xs text-primary">{sanityPost.author}</span>
                    <MutedText className="text-[10px] opacity-60 uppercase">{sanityPost.readTime || "5 mnt baca"}</MutedText>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton post={sanityPost} />
                  <Button variant="outline" size="icon" className={cn("rounded-full h-9 w-9 border-primary/10 bg-white/40", isSaved && "bg-primary text-white border-primary")} onClick={handleToggleBookmark}>
                    <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                  </Button>
                </div>
              </div>
            </header>

            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/5 mb-12 shadow-sm">
              <Image src={sanityPost.mainImage ? urlFor(sanityPost.mainImage).url() : PlaceHolderImages[0].imageUrl} alt={sanityPost.title} fill className="object-cover" priority />
            </div>

            <article className="prose prose-neutral max-w-none mb-16 font-body text-lg leading-relaxed text-foreground/80">
              <PortableText value={sanityPost.body} />
            </article>

            <section id="comments" className="mb-24 pt-16 border-t border-primary/5">
              <div className="flex items-center gap-3 mb-10">
                <Heading level={2} className="text-xl">Diskusi komunitas</Heading>
                <Badge className="bg-primary/5 text-primary border-none">{firestoreComments?.length || 0}</Badge>
              </div>

              {user ? (
                <div className="p-6 rounded-xl bg-white/40 border border-primary/10 mb-12 space-y-4">
                  <Textarea placeholder="Tulis pendapat Anda..." value={commentText} onChange={(e) => setCommentText(e.target.value.slice(0, 500))} className="bg-transparent min-h-[100px] border-primary/5" />
                  <div className="flex justify-end"><Button onClick={() => handlePostComment(null)} disabled={!commentText.trim()} className="h-10 px-8 font-bold text-[11px] uppercase tracking-widest shadow-lg">Kirim komentar</Button></div>
                </div>
              ) : (
                <Card className="p-10 text-center bg-white/40 border-dashed border-primary/20 mb-12">
                  <MutedText className="block mb-6 uppercase tracking-widest text-[10px] font-bold">Masuk untuk bergabung dalam diskusi</MutedText>
                  <Link href="/auth"><Button className="px-10 h-11 font-bold text-[10px] uppercase tracking-widest shadow-lg">Masuk sekarang</Button></Link>
                </Card>
              )}

              <div className="space-y-8">
                {threadedComments.length > 0 ? threadedComments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} user={user} postAuthorId={sanityPost.authorId || ""} onLike={(id: string, current: string[]) => {
                    if (!user || !db) return;
                    const isLiked = current.includes(user.uid);
                    updateDocumentNonBlocking(doc(db, "posts", params.id as string, "comments", id), { likes: isLiked ? current.filter(uid => uid !== user.uid) : [...current, user.uid] });
                  }} onReply={handlePostComment} replyToId={replyToId} setReplyToId={setReplyToId} replyText={replyText} setReplyText={setReplyText} />
                )) : <div className="py-20 text-center border-2 border-dashed border-primary/5 rounded-xl"><MutedText className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Belum ada diskusi</MutedText></div>}
              </div>
            </section>
          </div>
          
          <aside className="lg:col-span-4 space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-primary/5 pb-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <Heading level={3} className="text-lg">Sedang populer</Heading>
              </div>
              <div className="space-y-6">
                {trendingPosts.map((trend: any) => (
                  <Link key={trend._id} href={`/news/${trend.slug}`} className="flex gap-4 group">
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-primary/5 shadow-inner">
                      <Image src={trend.mainImage ? urlFor(trend.mainImage).url() : `https://picsum.photos/seed/${trend._id}/200/200`} alt={trend.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{trend.categories?.[0] || "Berita"}</span>
                      <h4 className="font-headline font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{trend.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}