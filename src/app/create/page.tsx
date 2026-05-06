"use client";

import { Heading, BodyText, TypographyLabel } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Save, Globe, Eye, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CreatePost() {
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [readTime, setReadTime] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  const [randomSeed, setRandomSeed] = useState("");

  useEffect(() => {
    setRandomSeed(Math.random().toString(36).substring(7));
  }, []);

  const handlePublish = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Akses ditolak", description: "Silakan masuk untuk menerbitkan berita." });
      return;
    }

    if (!db) {
      toast({ variant: "destructive", title: "Masalah sistem", description: "Layanan database belum siap. Mohon tunggu sejenak." });
      return;
    }

    if (!title || !content || !category) {
      toast({ variant: "destructive", title: "Data tidak lengkap", description: "Mohon lengkapi judul, kategori, dan konten utama." });
      return;
    }

    setIsLoading(true);
    const postData = {
      title,
      content,
      category,
      excerpt: excerpt || content.slice(0, 150) + "...",
      readTime: `${readTime} mnt`,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || "Penulis PatureNews",
      createdAt: serverTimestamp(),
      image: `https://picsum.photos/seed/${randomSeed}/1200/600`
    };

    addDocumentNonBlocking(collection(db, "posts"), postData)
      .then(() => {
        toast({ title: "Berhasil diterbitkan", description: "Berita Anda kini dapat dibaca oleh komunitas PatureNews." });
        router.push("/");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <Heading level={2}>Buat postingan baru</Heading>
            <BodyText>Bagikan wawasan Anda dengan komunitas PatureNews.</BodyText>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 h-10">
              <Eye className="h-4 w-4" /> Pratinjau
            </Button>
            <Button size="sm" className="gap-2 h-10 shadow-md" onClick={handlePublish} disabled={isLoading}>
              <Globe className="h-4 w-4" /> {isLoading ? "Memproses..." : "Terbitkan"}
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="border-2 border-primary/10 bg-white/40 backdrop-blur-md">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <TypographyLabel>Judul artikel</TypographyLabel>
                <Input 
                  id="post-title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul yang menarik..." 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <TypographyLabel>Kategori</TypographyLabel>
                  <Select onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Teknologi">Teknologi</SelectItem>
                      <SelectItem value="Desain">Desain</SelectItem>
                      <SelectItem value="Bisnis">Bisnis</SelectItem>
                      <SelectItem value="Budaya">Budaya</SelectItem>
                      <SelectItem value="Sains">Sains</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <TypographyLabel>Estimasi waktu baca (menit)</TypographyLabel>
                  <Input 
                    id="read-time" 
                    type="number" 
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <TypographyLabel>Gambar utama</TypographyLabel>
                <div className="border-2 border-dashed border-primary/10 rounded-lg p-12 text-center space-y-4 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="h-6 w-6 text-primary/40" />
                  </div>
                  <div className="space-y-1">
                    <BodyText className="text-sm font-bold">Klik untuk unggah atau seret dan lepas</BodyText>
                    <BodyText className="text-[10px] opacity-40 font-bold tracking-wider">PNG, JPG atau WebP (Maks. 10MB)</BodyText>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <TypographyLabel>Ringkasan singkat</TypographyLabel>
                <Textarea 
                  id="excerpt" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkas pesan inti dari postingan Anda..." 
                />
              </div>

              <div className="space-y-2">
                <TypographyLabel>Konten utama</TypographyLabel>
                <Textarea 
                  id="content" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis cerita Anda di sini..." 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" className="gap-2 px-8">
              <Save className="h-4 w-4" /> Simpan draf
            </Button>
            <Button className="px-12 h-12 shadow-lg" onClick={handlePublish} disabled={isLoading}>
              {isLoading ? "Memproses..." : "Terbitkan sekarang"}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
