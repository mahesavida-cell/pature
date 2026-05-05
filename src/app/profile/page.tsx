
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText, MutedText, Title } from "@/components/wrapped/Typography";
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
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { User, Bookmark, History, Settings, ChevronRight, LayoutDashboard } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const userDocRef = useMemoFirebase(() => (user ? doc(db, "users", user.uid) : null), [db, user]);
  const { data: profileData } = useDoc(userDocRef);

  const bookmarksQuery = useMemoFirebase(() => (user ? collection(db, "users", user.uid, "bookmarks") : null), [db, user]);
  const { data: bookmarks } = useCollection(bookmarksQuery);

  const historyQuery = useMemoFirebase(() => 
    user ? query(collection(db, "users", user.uid, "history"), orderBy("viewedAt", "desc"), limit(5)) : null, 
    [db, user]
  );
  const { data: history } = useCollection(historyQuery);

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
    const categories = history.map(h => h.category);
    const mostFrequent = categories.sort((a,b) =>
      categories.filter(v => v===a).length - categories.filter(v => v===b).length
    ).pop();
    
    return [
      { id: "rec-1", title: `Kenapa ${mostFrequent} Adalah Masa Depan`, category: mostFrequent },
      { id: "rec-2", title: `5 Tren Baru Di Dunia ${mostFrequent}`, category: mostFrequent }
    ];
  }, [history]);

  if (!user) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Heading level={2} className="mb-4">Silakan Masuk Dahulu</Heading>
          <BodyText className="mb-8">Anda Perlu Masuk Untuk Mengakses Halaman Pusat Akun.</BodyText>
          <Link href="/auth">
            <Button className="rounded-xl px-12 h-12 font-bold tracking-wide">Masuk Sekarang</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside className="lg:col-span-4 space-y-8">
            <Card className="rounded-[32px] overflow-hidden border-none shadow-xl bg-white/60 backdrop-blur-md">
              <CardContent className="p-10 text-center">
                <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-white shadow-2xl">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                    {(displayName || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Heading level={2} className="mb-2">{displayName}</Heading>
                <MutedText className="block mb-6 font-bold tracking-wide">{user.email}</MutedText>
                <Badge variant="secondary" className="px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-8">
                  Anggota Aktif
                </Badge>
                <div className="flex justify-around pt-6 border-t border-border/40">
                  <div>
                    <span className="block text-xl font-headline font-bold text-primary">{bookmarks?.length || 0}</span>
                    <MutedText className="text-[10px] font-bold">Arsip</MutedText>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div>
                    <span className="block text-xl font-headline font-bold text-primary">{history?.length || 0}</span>
                    <MutedText className="text-[10px] font-bold">Dibaca</MutedText>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] bg-primary text-primary-foreground p-8 shadow-2xl">
              <Heading level={3} className="text-white text-xl mb-4">Rekomendasi Untuk Anda</Heading>
              <div className="space-y-4">
                {recommendations.length > 0 ? recommendations.map(rec => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer group">
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-70">{rec.category}</span>
                    <h4 className="font-headline font-bold text-sm leading-tight group-hover:translate-x-1 transition-transform">{rec.title}</h4>
                  </div>
                )) : (
                  <MutedText className="text-white/60 text-xs italic">Baca Lebih Banyak Artikel Untuk Mendapat Rekomendasi.</MutedText>
                )}
              </div>
            </Card>
          </aside>

          <section className="lg:col-span-8">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-10 space-x-8">
                <TabsTrigger value="editor" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-sm font-bold tracking-wide transition-all">
                  <Settings className="h-4 w-4 mr-2" /> Editor Akun
                </TabsTrigger>
                <TabsTrigger value="archived" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-sm font-bold tracking-wide transition-all">
                  <Bookmark className="h-4 w-4 mr-2" /> Berita Diarsipkan
                </TabsTrigger>
                <TabsTrigger value="history" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 text-sm font-bold tracking-wide transition-all">
                  <History className="h-4 w-4 mr-2" /> Riwayat Bacaan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <Card className="rounded-[32px] p-10 bg-white shadow-sm border border-border/40">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-xs font-bold tracking-wide">Nama Tampilan</Label>
                        <Input 
                          id="displayName" 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="h-14 rounded-2xl bg-accent/5 border-none shadow-none text-sm font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-xs font-bold tracking-wide">Biodata Singkat</Label>
                        <Input 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Ceritakan Sedikit Tentang Diri Anda..."
                          className="h-14 rounded-2xl bg-accent/5 border-none shadow-none text-sm font-medium"
                        />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full h-14 rounded-2xl font-bold tracking-widest text-xs uppercase shadow-lg shadow-primary/20">
                        Simpan Perubahan Profil
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="archived">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarks && bookmarks.length > 0 ? bookmarks.map((item) => (
                    <Card key={item.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all group">
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                          <Badge variant="secondary" className="text-[8px] font-black uppercase mb-3">{item.category}</Badge>
                          <Heading level={4} className="mb-4 text-lg leading-tight group-hover:text-accent transition-colors">
                            {item.title}
                          </Heading>
                        </div>
                        <Link href={`/news/${item.postId}`} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary mt-4 transition-colors">
                          Baca Sekarang <ChevronRight className="h-3 w-3" />
                        </Link>
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-full py-20 text-center">
                      <MutedText className="font-bold">Belum Ada Berita Yang Diarsipkan.</MutedText>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="history">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {history && history.length > 0 ? history.map((item) => (
                    <Link key={item.id} href={`/news/${item.postId}`}>
                      <div className="flex items-center justify-between p-6 rounded-3xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-border/40 group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-primary">
                            <LayoutDashboard className="h-5 w-5" />
                          </div>
                          <div>
                            <Heading level={4} className="text-sm md:text-base group-hover:text-accent transition-colors">{item.title}</Heading>
                            <MutedText className="text-[10px] font-bold tracking-wide">{item.category} • {new Date(item.viewedAt).toLocaleDateString()}</MutedText>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  )) : (
                    <div className="py-20 text-center">
                      <MutedText className="font-bold">Riwayat Bacaan Kosong.</MutedText>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}
