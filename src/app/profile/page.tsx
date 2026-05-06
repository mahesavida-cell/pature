"use client";

import { Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, useAuth } from "@/firebase";
import { collection, doc, query, orderBy, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LayoutDashboard, LogOut, ChevronRight, RefreshCw } from "lucide-react";
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

  if (isUserLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin opacity-20 text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="h-8 w-8 text-primary/40" />
        </div>
        <Heading level={2} className="mb-2 text-xl">Akses terbatas</Heading>
        <BodyText className="mb-8 text-sm">Silakan masuk untuk mengakses profil Anda.</BodyText>
        <Link href="/auth">
          <Button className="px-10 h-11 font-bold tracking-widest uppercase">Masuk sekarang</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <aside className="lg:col-span-4 space-y-8">
        <Card className="rounded-xl border border-primary/5 shadow-none bg-white/40 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <Avatar size="lg" className="border border-white shadow-none">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {(displayName || user.email || "U")[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <Heading level={2} className="mb-1 text-2xl">{displayName}</Heading>
            <MutedText className="block mb-6 font-bold text-[10px] opacity-40 tracking-widest">{user.email}</MutedText>
            <Badge variant="secondary" className="px-6 py-1.5 rounded-full text-[9px] font-bold mb-8 bg-primary/5 text-primary border-none shadow-none">Anggota aktif</Badge>
            <div className="flex justify-around items-center pt-8 border-t border-primary/5">
              <div className="text-center">
                <span className="block text-xl font-headline font-bold text-primary">{bookmarks?.length || 0}</span>
                <MutedText className="text-[10px] font-bold opacity-40 tracking-widest">Arsip</MutedText>
              </div>
              <Separator orientation="vertical" className="h-8 opacity-40" />
              <div className="text-center">
                <span className="block text-xl font-headline font-bold text-primary">{history?.length || 0}</span>
                <MutedText className="text-[10px] font-bold opacity-40 tracking-widest">Dibaca</MutedText>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut} className="w-full mt-10 text-[10px] font-bold tracking-widest text-destructive hover:bg-destructive/5">
              <LogOut className="h-4 w-4 mr-2" /> Keluar dari akun
            </Button>
          </CardContent>
        </Card>
      </aside>
      <section className="lg:col-span-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-primary/5 rounded-none w-full justify-start h-auto p-0 mb-6 space-x-12 shadow-none">
            <TabsTrigger value="editor" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 py-4 text-[10px] font-bold tracking-widest shadow-none">Editor akun</TabsTrigger>
            <TabsTrigger value="archived" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 py-4 text-[10px] font-bold tracking-widest shadow-none">Berita diarsipkan</TabsTrigger>
            <TabsTrigger value="history" className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 py-4 text-[10px] font-bold tracking-widest shadow-none">Riwayat bacaan</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            {activeTab === "editor" && (
              <TabsContent key="editor" value="editor" className="mt-0">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <Card className="rounded-xl p-10 bg-white/60 backdrop-blur-md border border-primary/5 shadow-none">
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold opacity-40 tracking-widest">Nama tampilan</Label>
                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-12 bg-white/40 border-primary/5 shadow-none text-sm font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold opacity-40 tracking-widest">Biodata singkat</Label>
                        <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tulis sesuatu tentang Anda..." className="h-12 bg-white/40 border-primary/5 shadow-none text-sm font-bold" />
                      </div>
                      <Button onClick={handleUpdateProfile} className="w-full h-12 rounded-lg font-bold text-[11px] tracking-widest" disabled={isUpdating}>
                        {isUpdating ? "Menyimpan..." : "Simpan perubahan profil"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            )}
            {activeTab === "archived" && (
              <TabsContent key="archived" value="archived" className="mt-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarks?.map((item) => (
                    <Card key={item.id} className="rounded-xl border border-primary/5 shadow-none bg-white/60 h-full">
                      <CardContent className="p-7 flex flex-col justify-between h-full">
                        <div>
                          <Badge variant="secondary" className="text-[8px] font-bold mb-4 bg-primary/5 text-primary tracking-widest">{item.category}</Badge>
                          <h3 className="mb-6 text-base font-headline font-bold leading-tight">{item.title}</h3>
                        </div>
                        <Link href={`/news/${item.postId}`} className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground hover:text-primary mt-4 transition-colors tracking-widest">
                          Baca sekarang <ChevronRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                  {(!bookmarks || bookmarks.length === 0) && <div className="col-span-full py-20 text-center opacity-30 text-[10px] font-bold tracking-widest italic">Belum ada berita diarsipkan.</div>}
                </motion.div>
              </TabsContent>
            )}
            {activeTab === "history" && (
              <TabsContent key="history" value="history" className="mt-0">
                <div className="space-y-4">
                  {history?.map((item) => (
                    <Link key={item.id} href={`/news/${item.postId}`}>
                      <div className="flex items-center justify-between p-7 rounded-xl hover:bg-white/80 transition-all bg-white/40 border border-primary/5">
                        <div className="flex items-center gap-6">
                          <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                            <LayoutDashboard className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base font-headline font-bold mb-1 line-clamp-1">{item.title}</h4>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-bold opacity-30 tracking-widest">{item.category}</span>
                              <Separator orientation="vertical" className="h-3 opacity-20" />
                              <ReleaseDate date={item.viewedAt} className="text-[10px] font-bold opacity-30 italic" />
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                  {(!history || history.length === 0) && <div className="py-20 text-center opacity-30 text-[10px] font-bold tracking-widest italic">Riwayat bacaan masih kosong.</div>}
                </div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </section>
    </div>
  );
}
