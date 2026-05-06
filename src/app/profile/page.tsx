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
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { User, Bookmark, History, Settings, ChevronRight, LayoutDashboard, Sparkles, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useRouter } from "next/navigation";

const formatRelativeTime = (dateInput: any) => {
  if (!dateInput) return "baru saja";
  const date = new Date(dateInput);
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

export default function ProfilePage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => (user && db ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profileData } = useDoc(userDocRef);

  const bookmarksQuery = useMemoFirebase(() => 
    user && db ? query(collection(db, "userProfiles", user.uid, "bookmarks"), orderBy("savedAt", "desc")) : null, 
    [db, user]
  );
  const { data: bookmarks, isLoading: isBookmarksLoading } = useCollection(bookmarksQuery);

  const historyQuery = useMemoFirebase(() => 
    user && db ? query(collection(db, "userProfiles", user.uid, "history"), orderBy("viewedAt", "desc"), limit(10)) : null, 
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
    setIsUpdating(true);
    
    const updateData = {
      displayName,
      bio,
      updatedAt: new Date().toISOString(),
      email: user.email,
      id: user.uid
    };

    if (profileData) {
      updateDocumentNonBlocking(doc(db, "userProfiles", user.uid), updateData);
    } else {
      setDocumentNonBlocking(doc(db, "userProfiles", user.uid), {
        ...updateData,
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
    
    toast({ title: "Profil diperbarui", description: "Perubahan Anda telah berhasil disimpan." });
    setTimeout(() => setIsUpdating(false), 500);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
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
      { id: "rec-1", title: `Masa depan ${favoriteCategory} di era digital`, category: favoriteCategory },
      { id: "rec-2", title: `Wawasan mendalam seputar tren ${favoriteCategory}`, category: favoriteCategory }
    ];
  }, [history]);

  if (!user) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center pt-24">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-primary/40" />
            </div>
            <Heading level={2} className="mb-2 text-xl">Akses terbatas</Heading>
            <BodyText className="mb-8 text-sm">Silakan masuk untuk mengakses profil Anda.</BodyText>
            <Link href="/auth"><Button className="rounded-lg px-10 h-11 font-bold tracking-widest shadow-lg">Masuk sekarang</Button></Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4 space-y-8">
            <Card className="rounded-xl border-none shadow-md bg-white/40 backdrop-blur-xl border border-primary/5">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <Avatar className="h-24 w-24 border-2 border-white shadow-md">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback className="bg-primary text-white text-3xl font-bold uppercase">
                      {(displayName || user.email || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
                </div>
                <Heading level={2} className="mb-1 text-2xl">{displayName}</Heading>
                <MutedText className="block mb-6 font-bold text-[10px] opacity-40">{user.email}</MutedText>
                <Badge variant="secondary" className="px-6 py-1.5 rounded-full text-[9px] font-bold mb-8 bg-primary/5 text-primary border-none">Anggota aktif</Badge>
                
                <div className="flex justify-around items-center pt-8 border-t border-primary/5">
                  <div className="text-center">
                    <span className="block text-xl font-headline font-bold text-primary">{bookmarks?.length || 0}</span>
                    <MutedText className="text-[10px] font-bold opacity-40">Arsip</MutedText>
                  </div>
                  <Separator orientation="vertical" className="h-8 opacity-40" />
                  <div className="text-center">
                    <span className="block text-xl font-headline font-bold text-primary">{history?.length || 0}</span>
                    <MutedText className="text-[10px] font-bold opacity-40">Dibaca</MutedText>
                  </div>
                </div>

                <Button variant="ghost" onClick={handleSignOut} className="w-full mt-10 text-[10px] font-bold tracking-widest text-destructive hover:bg-destructive/5 hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Keluar dari akun
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-primary text-primary-foreground p-8 shadow-xl relative overflow-hidden group border-none">
              <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 transition-transform duration-1000 group-hover:rotate-12"><Sparkles className="h-24 w-24" /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8"><Sparkles className="h-4 w-4 text-white/40" /><Heading level={3} className="text-white text-lg">Rekomendasi cerdas</Heading></div>
                <div className="space-y-4">
                  {recommendations.length > 0 ? recommendations.map((rec, idx) => (
                    <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group/item">
                      <span className="text-[9px] font-bold text-white/40 mb-1.5 block uppercase tracking-widest">{rec.category}</span>
                      <h4 className="font-headline font-bold text-xs leading-snug group-hover/item:text-white transition-colors">{rec.title}</h4>
                    </motion.div>
                  )) : <div className="py-8 px-4 bg-white/5 rounded-lg text-center"><MutedText className="text-white/30 text-[10px] font-bold italic block">Baca lebih banyak berita untuk mendapatkan kurasi personal.</MutedText></div>}
                </div>
              </div>
            </Card>
          </aside>

          <section className="lg:col-span-8">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="bg-transparent border-b border-primary/5 rounded-none w-full justify-start h-auto p-0 mb-10 space-x-12">
                <TabsTrigger value="editor" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-bold tracking-widest transition-all">Editor akun</TabsTrigger>
                <TabsTrigger value="archived" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-bold tracking-widest transition-all">Berita diarsipkan</TabsTrigger>
                <TabsTrigger value="history" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-[10px] font-bold tracking-widest transition-all">Riwayat bacaan</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <TabsContent value="editor" className="mt-0">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <Card className="rounded-xl p-10 bg-white/60 backdrop-blur-md border border-primary/5">
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-[10px] font-bold opacity-40 tracking-wider">Nama lengkap tampilan</Label>
                          <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-12 rounded-lg bg-white/40 border-primary/5 shadow-none text-sm font-bold px-5 focus-visible:ring-1" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-[10px] font-bold opacity-40 tracking-wider">Biodata singkat</Label>
                          <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tuliskan sesuatu tentang diri Anda..." className="h-12 rounded-lg bg-white/40 border-primary/5 shadow-none text-sm font-bold px-5 focus-visible:ring-1" />
                        </div>
                        <Button onClick={handleUpdateProfile} className="w-full h-12 rounded-lg font-bold text-[11px] tracking-widest shadow-lg" disabled={isUpdating}>
                          {isUpdating ? "Sedang menyimpan..." : "Simpan perubahan profil"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="archived" className="mt-0">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isBookmarksLoading ? (
                      <div className="col-span-full py-24 text-center"><div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></div>
                    ) : bookmarks && bookmarks.length > 0 ? bookmarks.map((item, idx) => (
                      <motion.div key={item.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                        <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all group h-full bg-white/60 backdrop-blur-md border border-primary/5">
                          <CardContent className="p-7 flex flex-col justify-between h-full">
                            <div>
                              <Badge variant="secondary" className="text-[8px] font-bold mb-4 bg-primary/5 text-primary border-none uppercase tracking-wider">{item.category}</Badge>
                              <h3 className="mb-6 text-base font-headline font-bold leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                            </div>
                            <Link href={`/news/${item.postId}`} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary mt-4 group/link transition-colors tracking-tight">
                              Baca sekarang <ChevronRight className="h-4 w-4 transition-transform group/link:translate-x-1" />
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )) : <div className="col-span-full py-24 text-center border-2 border-dashed border-primary/5 rounded-xl bg-white/20 backdrop-blur-sm"><MutedText className="text-[11px] font-bold opacity-30">Belum ada berita yang diarsipkan.</MutedText></div>}
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {isHistoryLoading ? (
                      <div className="py-24 text-center"><div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></div>
                    ) : history && history.length > 0 ? history.map((item, idx) => (
                      <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Link href={`/news/${item.postId}`}>
                          <div className="flex items-center justify-between p-7 rounded-xl hover:bg-white/80 hover:shadow-md transition-all group bg-white/40 backdrop-blur-xl border border-primary/5">
                            <div className="flex items-center gap-6">
                              <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 shadow-inner shrink-0"><LayoutDashboard className="h-5 w-5" /></div>
                              <div className="min-w-0">
                                <h4 className="text-base font-headline font-bold group-hover:text-primary transition-colors mb-1 line-clamp-1">{item.title}</h4>
                                <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-bold opacity-30 uppercase tracking-wider">{item.category}</span>
                                  <Separator orientation="vertical" className="h-3 opacity-20" />
                                  <span className="text-[10px] font-bold opacity-30 italic">{mounted ? formatRelativeTime(item.viewedAt) : "---"}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 shrink-0" />
                          </div>
                        </Link>
                      </motion.div>
                    )) : <div className="py-24 text-center border-2 border-dashed border-primary/5 rounded-xl bg-white/20 backdrop-blur-sm"><MutedText className="text-[11px] font-bold opacity-30">Riwayat bacaan Anda masih kosong.</MutedText></div>}
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
