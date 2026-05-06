"use client";

import { 
  TypographyH1, 
  TypographyH2, 
  TypographyH3, 
  TypographyP, 
  TypographyMuted, 
  TypographyBlockquote,
  TypographyList
} from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { Share2, ArrowLeft, Bookmark, TrendingUp, Heart, MessageSquare, Copy, RefreshCw } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp, doc, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { TRENDING_POSTS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchEditorialContent, createSyncMetadata } from "@/lib/data-bridge";

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
        await navigator.share({ title: post.title, text: post.excerpt, url }); 
      } catch (e) {} 
    } 
  };

  const copyToClipboard = () => { 
    navigator.clipboard.writeText(url); 
    toast({ title: "Tautan disalin", description: "Tautan telah disalin ke papan klip." }); 
  };

  if (canShare) return (
    <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/10 bg-white/40 shadow-none" onClick={handleShare}>
      <Share2 className="h-4 w-4" />
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-primary/10 bg-white/40 shadow-none">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2 rounded-lg bg-white/95 backdrop-blur-xl border border-primary/5 shadow-none">
        <div className="grid gap-1">
          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " " + url)}`)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/5 text-xs font-bold transition-colors">
            <MessageSquare className="h-4 w-4 text-green-600" /> WhatsApp
          </button>
          <button onClick={copyToClipboard} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/5 text-xs font-bold transition-colors">
            <Copy className="h-4 w-4 text-muted-foreground" /> Salin tautan
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CommentItem = ({ comment, depth = 0, user, onLike, onReply, replyToId, setReplyToId, replyText, setReplyText }: any) => {
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const isLiked = user && likes.includes(user.uid);

  return (
    <div className={cn("space-y-4", depth > 0 && "ml-6 md:ml-10 border-l-2 border-primary/5 pl-4 md:pl-6")}>
      <div className="flex gap-4 p-4 rounded-lg bg-white/40 border border-primary/10 shadow-none">
        <Avatar size="sm">
          <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">
            {comment.authorName?.[0] || "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-primary">{comment.authorName}</span>
            <ReleaseDate date={comment.createdAt} className="text-[9px] text-muted-foreground" />
          </div>
          <TypographyP className="text-sm text-foreground/80 mb-3 font-medium !mt-0">{comment.content}</TypographyP>
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
          <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value.slice(0, 500))} className="bg-white/60 min-h-[80px] text-sm shadow-none" placeholder="Tulis balasan..." />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setReplyToId(null)} className="h-8 text-[10px] font-bold uppercase">Batal</Button>
            <Button size="sm" onClick={() => onReply(comment.id)} className="h-8 text-[10px] font-bold shadow-none uppercase">Kirim</Button>
          </div>
        </div>
      )}
      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} user={user} onLike={onLike} onReply={onReply} replyToId={replyToId} setReplyToId={setReplyToId} replyText={replyText} setReplyText={setReplyText} />
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

  // Sinkronisasi Cross-Stack: Fetching & Data Bridge
  useEffect(() => {
    const initPage = async () => {
      if (!params?.id) return;
      setIsLoading(true);
      
      const [editorial, trending] = await Promise.all([
        fetchEditorialContent(params.id as string),
        client.fetch(TRENDING_POSTS_QUERY)
      ]);

      setSanityPost(editorial.data);
      setTrendingPosts(trending || []);
      setIsLoading(false);
    };
    initPage();
  }, [params?.id]);

  // Sinkronisasi Interaksi: Riwayat Bacaan
  useEffect(() => {
    if (user && db && params?.id && sanityPost) {
      const metadata = createSyncMetadata(sanityPost);
      if (!metadata) return;

      const historyRef = doc(db, "userProfiles", user.uid, "history", params.id as string);
      setDocumentNonBlocking(historyRef, { 
        postId: params.id, 
        title: metadata.title, 
        category: metadata.category, 
        viewedAt: new Date().toISOString() 
      }, { merge: true });
    }
  }, [user, db, params?.id, sanityPost]);

  const bookmarkRef = useMemoFirebase(() => 
    (user && db && params?.id) ? doc(db, "userProfiles", user.uid, "bookmarks", params.id as string) : null, 
  [db, user, params?.id]);

  const { data: bookmarkData } = useDoc(bookmarkRef);
  const isSaved = !!bookmarkData;

  const commentsQuery = useMemoFirebase(() => 
    (db && params?.id) ? query(collection(db, "posts", params.id as string, "comments"), orderBy("createdAt", "asc")) : null, 
  [db, params?.id]);

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
    
    const metadata = createSyncMetadata(sanityPost);
    if (!metadata) return;

    if (isSaved) {
      deleteDocumentNonBlocking(bookmarkRef);
      toast({ title: "Dihapus", description: "Berita dihapus dari arsip." });
    } else {
      setDocumentNonBlocking(bookmarkRef, {
        postId: params?.id,
        title: metadata.title,
        category: metadata.category,
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Berhasil diarsipkan", description: "Tersimpan di profil." });
    }
  };

  const handlePostComment = (parentId: string | null = null) => {
    if (!user || !db || !params?.id) { router.push('/auth'); return; }
    const text = parentId ? replyText : commentText;
    if (!text.trim()) return;

    addDocumentNonBlocking(collection(db, "posts", params.id as string, "comments"), {
      content: text,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || "Pengguna PatureNews",
      createdAt: serverTimestamp(),
      postId: params.id,
      parentId,
      likes: []
    });

    if (parentId) {
      setReplyText("");
      setReplyToId(null);
    } else {
      setCommentText("");
    }
  };

  if (isLoading) return <div className="min-h-[400px] flex items-center justify-center"><RefreshCw className="h-8 w-8 animate-spin opacity-20" /></div>;
  if (!sanityPost) return <div className="text-center py-20"><TypographyH2>Berita tidak ditemukan</TypographyH2><Link href="/"><Button className="mt-6 uppercase tracking-widest">Kembali ke beranda</Button></Link></div>;

  return (
    <div className="space-y-12">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left" style={{ scaleX }} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary mb-8 group uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke feed
          </Link>
          <header className="mb-10">
            <TypographyMuted className="mb-4">{sanityPost.categories?.[0] || "Berita"}</TypographyMuted>
            <TypographyH1 className="mb-4">{sanityPost.title}</TypographyH1>
            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold uppercase">
                    {sanityPost.author?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="block font-bold text-xs text-primary">{sanityPost.author}</span>
                  <ReleaseDate date={sanityPost.publishedAt} className="text-[10px] font-medium opacity-60 uppercase tracking-wider" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton post={sanityPost} />
                <Button variant="outline" size="icon" className={cn("rounded-full h-9 w-9 border-primary/10 bg-white/40 shadow-none", isSaved && "bg-primary text-white border-primary")} onClick={handleToggleBookmark}>
                  <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                </Button>
              </div>
            </div>
          </header>
          
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-primary/5 mb-12">
            <Image 
              src={sanityPost.mainImage ? urlFor(sanityPost.mainImage).url() : PlaceHolderImages[0].imageUrl} 
              alt={sanityPost.title} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>

          <article className="max-w-[65ch] mb-16">
            <PortableText 
              value={sanityPost.body} 
              components={{
                block: {
                  normal: ({children}) => <TypographyP>{children}</TypographyP>,
                  h2: ({children}) => <TypographyH2 className="mt-8 mb-3">{children}</TypographyH2>,
                  h3: ({children}) => <TypographyH3 className="mt-8 mb-3">{children}</TypographyH3>,
                  blockquote: ({children}) => <TypographyBlockquote>{children}</TypographyBlockquote>
                },
                list: {
                  bullet: ({children}) => <TypographyList>{children}</TypographyList>
                }
              }}
            />
          </article>

          <section id="comments" className="mb-24 pt-16 border-t border-primary/5">
            <div className="flex items-center gap-3 mb-10">
              <TypographyH3 className="text-xl">Diskusi komunitas</TypographyH3>
              <Badge className="bg-primary/5 text-primary border-none shadow-none">{firestoreComments?.length || 0}</Badge>
            </div>
            {user ? (
              <div className="p-6 rounded-xl bg-white/40 border border-primary/10 mb-12 space-y-4">
                <Textarea 
                  placeholder="Tulis pendapat Anda..." 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value.slice(0, 500))} 
                  className="bg-transparent min-h-[100px] border-primary/5 shadow-none" 
                />
                <div className="flex justify-end">
                  <Button onClick={() => handlePostComment(null)} disabled={!commentText.trim()} className="h-10 px-8 font-bold text-[11px] uppercase tracking-widest">Kirim komentar</Button>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center bg-white/40 border-dashed border-primary/20 mb-12 rounded-xl">
                <TypographyMuted className="block mb-6 uppercase tracking-widest text-[10px] font-bold">Masuk untuk bergabung dalam diskusi</TypographyMuted>
                <Link href="/auth">
                  <Button className="px-10 h-11 font-bold text-[10px] uppercase tracking-widest">Masuk sekarang</Button>
                </Link>
              </div>
            )}
            <div className="space-y-8">
              {threadedComments.length > 0 ? threadedComments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  user={user} 
                  onLike={(id: string, current: string[]) => { 
                    if (!user || !db || !params?.id) return; 
                    const liked = current.includes(user.uid); 
                    updateDocumentNonBlocking(doc(db, "posts", params.id as string, "comments", id), { 
                      likes: liked ? current.filter(u => u !== user.uid) : [...current, user.uid] 
                    }); 
                  }} 
                  onReply={handlePostComment} 
                  replyToId={replyToId} 
                  setReplyToId={setReplyToId} 
                  replyText={replyText} 
                  setReplyText={setReplyText} 
                />
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-primary/5 rounded-xl">
                  <TypographyMuted className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Belum ada diskusi</TypographyMuted>
                </div>
              )}
            </div>
          </section>
        </div>
        <aside className="lg:col-span-4 space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-primary/5 pb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <TypographyH3 className="text-lg">Sedang populer</TypographyH3>
            </div>
            <div className="space-y-6">
              {trendingPosts.map((trend: any) => (
                <Link key={trend._id} href={`/news/${trend.slug}`} className="flex gap-4 group">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-primary/5">
                    <Image 
                      src={trend.mainImage ? urlFor(trend.mainImage).url() : `https://picsum.photos/seed/${trend._id}/200/200`} 
                      alt={trend.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <TypographyMuted className="text-[11px] mb-1" casing="upper">{trend.categories?.[0] || "Berita"}</TypographyMuted>
                    <h4 className="font-body font-medium text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 tracking-tight">{trend.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
