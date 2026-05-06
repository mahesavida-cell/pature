"use client";

import { TypographyH2, TypographyH3, TypographyP, TypographyMuted, TypographySmall, TypographyLarge, TypographyLabel } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, useAuth } from "@/firebase";
import { collection, doc, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LayoutDashboard, LogOut, ChevronRight, RefreshCw, Bookmark as BookmarkIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ReleaseDate } from "@/components/wrapped/ReleaseDate";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userDocRef = useMemoFirebase(() => (user && db ? doc(db, "userProfiles", user.uid) : null), [db, user]);
  const { data: profileData } = useDoc(userDocRef);
  
  const bookmarksQuery = useMemoFirebase(() => user && db ? query(collection(db, "userProfiles", user.uid, "bookmarks"), orderBy("savedAt", "desc")) : null, [db, user]);
  const { data: bookmarks } = useCollection(bookmarksQuery);
  
  const historyQuery = useMemoFirebase(() => user && db ? query(collection(db, "userProfiles", user.uid, "history"), orderBy("viewedAt", "desc"), limit(10)) : null, [db, user]);
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
    setIsUpdating(true);
    const updateData = { displayName, bio, updatedAt: new Date().toISOString(), email: user.email, id: user.uid };
    if (profileData) {
      updateDocumentNonBlocking(doc(db, "userProfiles", user.uid), updateData);
    } else {
      setDocumentNonBlocking(doc(db, "userProfiles", user.uid), { ...updateData, createdAt: new Date().toISOString() }, { merge: true });
    }
    toast({ title: "Profil diperbarui", description: "Perubahan berhasil disimpan." });
    setTimeout(() => setIsUpdating(false), 500);
  };

  const handleSignOut = async () => { 
    await signOut(auth); 
    router.push("/"); 
  };

  if (!mounted || isUserLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
          <User className="h-8 w-8 text-primary/40" />
        </div>
        <div className="space-y-2">
          <TypographyH2>Akses terbatas</TypographyH2>
          <TypographyP className="text-sm">Silakan masuk untuk mengakses profil Anda.</TypographyP>
        </div>
        <Link href="/auth">
          <Button size="lg" className="px-12">Masuk sekarang</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <aside className="lg:col-span-4">
        <Card className="rounded-xl border-primary/5 bg-white/40 backdrop-blur-xl shadow-none">
          <CardContent className="p-10 text-center space-y-8">
            <div className="space-y-4">
              <Avatar size="lg" className="mx-auto border-2 border-white shadow-none h-24 w-24">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {(displayName || user.email || "U")[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <TypographyH3 className="!mt-0 font-semibold">{displayName}</TypographyH3>
                <TypographyMuted className="text-xs opacity-40">{user.email}</TypographyMuted>
              </div>
              <Badge variant="secondary" className="px-4 py-1 rounded-full bg-primary/5 text-primary border-none shadow-none text-[9px] font-bold tracking-wider">
                Anggota aktif
              </Badge>
            </div>

            <div className="flex justify-around items-center pt-8 border-t border-primary/5">
              <div className="text-center space-y-1">
                <TypographyH3 className="border-none pb-0 leading-none !mt-0 font-semibold">{bookmarks?.length || 0}</TypographyH3>
                <TypographyMuted className="text-[10px] font-bold opacity-40 tracking-wider">Arsip</TypographyMuted>
              </div>
              <Separator orientation="vertical" className="h-10 opacity-10" />
              <div className="text-center space-y-1">
                <TypographyH3 className="border-none pb-0 leading-none !mt-0 font-semibold">{history?.length || 0}</TypographyH3>
                <TypographyMuted className="text-[10px] font-bold opacity-40 tracking-wider">Dibaca</TypographyMuted>
              </div>
            </div>

            <Button variant="ghost" onClick={handleSignOut} className="w-full text-destructive hover:bg-destructive/5 hover:text-destructive h-10 text-[14px] font-medium">
              <LogOut className="h-4 w-4 mr-2" /> Keluar dari akun
            </Button>
          </CardContent>
        </Card>
      </aside>

      <section className="lg:col-span-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <TabsList className="bg-transparent border-b border-primary/5 rounded-none w-full justify-start h-auto p-0 space-x-10">
            {[
              { id: "editor", label: "Editor akun" },
              { id: "archived", label: "Berita diarsipkan" },
              { id: "history", label: "Riwayat bacaan" }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 py-4 text-[13px] text-[#4D4D4D] font-body capitalize shadow-none transition-all"
                style={{ fontSynthesis: 'none' }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "editor" && (
              <TabsContent key="editor" value="editor" className="mt-0 focus-visible:ring-0 outline-none">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="rounded-xl border-primary/5 bg-white/60 backdrop-blur-md shadow-none">
                    <CardContent className="p-8 lg:p-12 space-y-10">
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <TypographyLabel>Nama tampilan</TypographyLabel>
                          <Input 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)} 
                            placeholder="Nama Anda..."
                          />
                        </div>
                        <div className="space-y-2">
                          <TypographyLabel>Biodata singkat</TypographyLabel>
                          <Textarea 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            placeholder="Tulis sesuatu tentang Anda..." 
                          />
                        </div>
                      </div>
                      <Button size="lg" onClick={handleUpdateProfile} className="w-full" disabled={isUpdating}>
                        {isUpdating ? "Menyimpan..." : "Simpan perubahan profil"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "archived" && (
              <TabsContent key="archived" value="archived" className="mt-0 focus-visible:ring-0 outline-none">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarks?.map((item) => (
                    <Card key={item.id} className="rounded-xl border-primary/5 bg-white/60 h-full hover:border-primary/20 transition-all shadow-none">
                      <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                        <div className="space-y-4">
                          <Badge variant="secondary" className="text-[8px] px-2 py-0.5 font-bold bg-primary/5 text-primary tracking-wider border-none shadow-none">
                            {item.category}
                          </Badge>
                          <TypographyLarge className="leading-tight text-lg font-semibold">{item.title}</TypographyLarge>
                        </div>
                        <Link href={`/news/${item.postId}`} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase">
                          Baca sekarang <ChevronRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                  {(!bookmarks || bookmarks.length === 0) && (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-primary/5 rounded-xl space-y-4">
                      <BookmarkIcon className="h-8 w-8 mx-auto text-primary/10" />
                      <TypographyMuted className="text-[10px] font-bold opacity-30 tracking-widest">Belum ada berita diarsipkan</TypographyMuted>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "history" && (
              <TabsContent key="history" value="history" className="mt-0 focus-visible:ring-0 outline-none">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {history?.map((item) => (
                    <Link key={item.id} href={`/news/${item.postId}`}>
                      <div className="flex items-center justify-between p-8 rounded-xl hover:bg-white/90 transition-all bg-white/40 border border-primary/5 group">
                        <div className="flex items-center gap-8 min-w-0">
                          <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary/30 shrink-0">
                            <Clock className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <TypographyLarge className="text-base line-clamp-1 group-hover:text-primary transition-colors font-semibold">{item.title}</TypographyLarge>
                            <div className="flex items-center gap-4">
                              <TypographySmall className="text-[10px] font-bold opacity-40 tracking-wider">{item.category}</TypographySmall>
                              <Separator orientation="vertical" className="h-3 opacity-10" />
                              <ReleaseDate date={item.viewedAt} className="text-[10px] font-bold opacity-30 tracking-widest" />
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-all" />
                      </div>
                    </Link>
                  ))}
                  {(!history || history.length === 0) && (
                    <div className="py-24 text-center border-2 border-dashed border-primary/5 rounded-xl space-y-4">
                      <LayoutDashboard className="h-8 w-8 mx-auto text-primary/10" />
                      <TypographyMuted className="text-[10px] font-bold opacity-30 tracking-widest">Riwayat bacaan kosong</TypographyMuted>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </section>
    </div>
  );
}
