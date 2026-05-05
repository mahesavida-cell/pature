
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { User, Bookmark, History, Settings, ChevronRight, LayoutDashboard, Sparkles } from "lucide-react";

// Helper function for relative time with correct Indonesian grammar
const formatRelativeTime = (dateInput: any) => {
  if (!dateInput) return "Baru saja";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} Menit yang lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} Hari yang lalu`;
};

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => (user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: profileData } = useDoc(userDocRef);

  const bookmarksQuery = useMemoFirebase(() => 
    user ? query(collection(db, "users", user.uid, "bookmarks"), orderBy("savedAt", "desc")) : null, 
    [db, user]
  );
  const { data: bookmarks, isLoading: isBookmarksLoading } = useCollection(bookmarksQuery);

  const historyQuery = useMemoFirebase(() => 
    user ? query(collection(db, "users", user.uid, "history"), orderBy("viewedAt", "desc"), limit(10)) : null, 
    [db, user]
  );
  const { data: history, isLoading: isHistoryLoading } = useCollection(historyQuery);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || "");
      setBio(profileData.bio || "");
    } else if (user) {
      setDisplayName(user.displayName || user.email?.split('@')[0] || "");
    }
  }, [profileData, user]);

  const handleUpdateProfile = () => {
    if (!user || !db) return;
    updateDocumentNonBlocking(doc(db, "users", user.uid), {
      displayName,
      bio,
      updatedAt: new Date().toISOString()
    });
  };

  const recommendations = useMemo(() => {
    if (!history || history.length === 0) return [];
    const categoryCounts: Record<string, number> = {};
    history.forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });
    const favoriteCategory = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    if (!favoriteCategory) return [];
    return [
      { id: "rec-1", title: `Kenapa ${favoriteCategory} adalah masa depan`, category: favoriteCategory },
      { id: "rec-2", title: `Tren terbaru di industri ${favoriteCategory}`, category: favoriteCategory }
    ];
  }, [history]);

  if (!user) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-accent" />
            </div>
            <Heading level={2} className="mb-2 text-xl">Akses terbatas</Heading>
            <BodyText className="mb-8 text-sm">Silakan masuk untuk mengakses profil.</BodyText>
            <Link href="/auth"><Button className="rounded-md px-10 h-11 font-bold tracking-tight shadow-sm">Masuk sekarang</Button></Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-8">
            <Card className="rounded-lg border-none shadow-md bg-white/70 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                      {(displayName || user.email || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
                </div>
                <Heading level={2} className="mb-1 text-2xl">{displayName}</Heading>
                <MutedText className="block mb-6 font-bold text-[10px] opacity-60">{user.email}</MutedText>
                <Badge variant="secondary" className="px-5 py-1 rounded-full text-[9px] font-bold mb-8 bg-accent/5 text-accent border-none">Anggota aktif</Badge>
                <div className="flex justify-around items-center pt-8 border-t border-border/40">
                  <div className="text-center">
                    <span className="block text-xl font-headline font-bold text-primary">{bookmarks?.length || 0}</span>
                    <MutedText className="text-[10px] font-bold opacity-50">Arsip</MutedText>
                  </div>
                  <Separator orientation="vertical" className="h-8 opacity-40" />
                  <div className="text-center">
                    <span className="block text-xl font-headline font-bold text-primary">{history?.length || 0}</span>
                    <MutedText className="text-[10px] font-bold opacity-50">Dibaca</MutedText>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg bg-primary text-primary-foreground p-6 shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-105 transition-transform duration-500"><Sparkles className="h-16 w-16" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6"><Sparkles className="h-4 w-4 text-accent" /><Heading level={3} className="text-white text-lg">Rekomendasi cerdas</Heading></div>
                <div className="space-y-4">
                  {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                    <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-md bg-white/10 hover:bg-white/15 border border-white/5 transition-all cursor-pointer group/item">
                      <span className="text-[9px] font-bold text-accent mb-1.5 block">{rec.category}</span>
                      <h4 className="font-headline font-bold text-xs leading-snug group-hover/item:text-accent transition-colors">{rec.title}</h4>
                    </motion.div>
                  )) : <div className="py-6 px-4 bg-white/5 rounded-md text-center"><MutedText className="text-white/40 text-[10px] font-medium italic block">Baca lebih banyak untuk mendapatkan rekomendasi.</MutedText></div>}
                </div>
              </div>
            </Card>
          </aside>

          <section className="lg:col-span-8">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-8 space-x-10">
                <TabsTrigger value="editor" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-xs font-bold transition-all">Editor akun</TabsTrigger>
                <TabsTrigger value="archived" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-xs font-bold transition-all">Berita diarsipkan</TabsTrigger>
                <TabsTrigger value="history" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-xs font-bold transition-all">Riwayat bacaan</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <TabsContent value="editor">
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <Card className="rounded-lg p-10 bg-white shadow-sm border border-border/30">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="displayName" className="text-[10px] font-bold opacity-50">Nama lengkap tampilan</Label>
                          <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-12 rounded-md bg-accent/5 border-none shadow-inner text-sm font-bold px-5" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="bio" className="text-[10px] font-bold opacity-50">Biodata singkat</Label>
                          <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tuliskan sesuatu tentang diri Anda..." className="h-12 rounded-md bg-accent/5 border-none shadow-inner text-sm font-bold px-5" />
                        </div>
                        <Button onClick={handleUpdateProfile} className="w-full h-12 rounded-md font-bold text-[11px] shadow-sm">Simpan perubahan profil</Button>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
                <TabsContent value="archived">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isBookmarksLoading ? (
                      <div className="col-span-full py-20 text-center"><MutedText className="font-bold">Memuat arsip...</MutedText></div>
                    ) : bookmarks && bookmarks.length > 0 ? bookmarks.map((item, idx) => (
                      <motion.div key={item.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                        <Card className="rounded-lg border-none shadow-sm hover:shadow-md transition-all group h-full bg-white/80">
                          <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div>
                              <Badge variant="secondary" className="text-[9px] font-bold mb-4 bg-accent/5 text-accent border-none">{item.category}</Badge>
                              <h3 className="mb-4 text-base font-headline font-bold leading-tight group-hover:text-accent transition-colors">{item.title}</h3>
                            </div>
                            <Link href={`/news/${item.postId}`} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary mt-4 group/link transition-colors">Baca sekarang <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" /></Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )) : <div className="col-span-full py-20 text-center border border-dashed border-border/40 rounded-lg"><MutedText className="text-xs opacity-50">Belum ada berita yang diarsipkan.</MutedText></div>}
                  </motion.div>
                </TabsContent>
                <TabsContent value="history">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {isHistoryLoading ? (
                      <div className="py-20 text-center"><MutedText className="font-bold">Memuat riwayat...</MutedText></div>
                    ) : history && history.length > 0 ? history.map((item, idx) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Link href={`/news/${item.postId}`}>
                          <div className="flex items-center justify-between p-6 rounded-lg hover:bg-white hover:shadow-md transition-all group bg-white/40 backdrop-blur-sm">
                            <div className="flex items-center gap-5">
                              <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center text-primary shadow-inner"><LayoutDashboard className="h-5 w-5" /></div>
                              <div>
                                <h4 className="text-base font-headline font-bold group-hover:text-accent transition-colors mb-1">{item.title}</h4>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold opacity-50">{item.category}</span>
                                  <Separator orientation="vertical" className="h-3" />
                                  <span className="text-[10px] font-bold opacity-30">{mounted ? formatRelativeTime(item.viewedAt) : "---"}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                          </div>
                        </Link>
                      </motion.div>
                    )) : <div className="py-20 text-center border border-dashed border-border/40 rounded-lg"><MutedText className="text-xs opacity-50">Riwayat bacaan Anda masih kosong.</MutedText></div>}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}
