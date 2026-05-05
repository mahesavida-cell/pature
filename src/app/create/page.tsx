"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Save, Globe, Eye, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function CreatePost() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <Heading level={2}>Buat postingan baru</Heading>
            <BodyText>Bagikan wawasan Anda dengan komunitas InfoFlow.</BodyText>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" /> Pratinjau
            </Button>
            <Button size="sm" className="gap-2">
              <Globe className="h-4 w-4" /> Terbitkan
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="border-2 border-primary/10">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="post-title" className="text-lg font-headline">Judul artikel</Label>
                <Input 
                  id="post-title" 
                  placeholder="Masukkan judul yang menarik..." 
                  className="text-xl h-14 font-headline border-primary/10 bg-transparent focus-visible:ring-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select>
                    <SelectTrigger id="category" className="bg-transparent border-primary/10">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Teknologi</SelectItem>
                      <SelectItem value="design">Desain</SelectItem>
                      <SelectItem value="business">Bisnis</SelectItem>
                      <SelectItem value="culture">Budaya</SelectItem>
                      <SelectItem value="science">Sains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="read-time">Estimasi waktu baca (menit)</Label>
                  <Input id="read-time" type="number" placeholder="5" className="bg-transparent border-primary/10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gambar utama</Label>
                <div className="border-2 border-dashed border-primary/10 rounded-lg p-12 text-center space-y-4 hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <BodyText className="font-medium">Klik untuk unggah atau seret dan lepas</BodyText>
                    <BodyText className="text-sm">PNG, JPG atau WebP (Maks. 10MB)</BodyText>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan singkat</Label>
                <Textarea 
                  id="excerpt" 
                  placeholder="Ringkas pesan inti dari postingan Anda..." 
                  className="resize-none min-h-[100px] bg-transparent border-primary/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten utama</Label>
                <Textarea 
                  id="content" 
                  placeholder="Tulis cerita Anda di sini. Gunakan Markdown untuk format..." 
                  className="min-h-[400px] bg-transparent border-primary/10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" className="gap-2">
              <Save className="h-4 w-4" /> Simpan draf
            </Button>
            <Button className="px-12">Terbitkan sekarang</Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
