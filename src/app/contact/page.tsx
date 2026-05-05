"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Title>Kontak redaksi</Title>
              <BodyText>Kami terbuka untuk saran, kolaborasi, atau pertanyaan seputar jurnalisme kami.</BodyText>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Heading level={4} className="text-base">Email</Heading>
                  <MutedText>redaksi@infoflow.com</MutedText>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Heading level={4} className="text-base">Kantor pusat</Heading>
                  <MutedText>Jl. Minimalis No. 45, Jakarta Selatan, Indonesia</MutedText>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Heading level={4} className="text-base">Telepon</Heading>
                  <MutedText>+62 (21) 555-0123</MutedText>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-bold opacity-50">Nama lengkap</Label>
                  <Input id="name" placeholder="Masukkan nama Anda" className="bg-transparent border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold opacity-50">Alamat email</Label>
                  <Input id="email" type="email" placeholder="email@contoh.com" className="bg-transparent border-primary/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[10px] font-bold opacity-50">Pesan</Label>
                  <Textarea id="message" placeholder="Tuliskan pesan Anda di sini..." className="min-h-[150px] bg-transparent border-primary/10" />
                </div>
                <Button className="w-full h-11 font-bold text-[11px]">Kirim pesan sekarang</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
