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
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pesan terkirim",
      description: "Terima kasih! Tim kami akan segera menghubungi Anda melalui email.",
    });
  };

  const contactInfo = [
    { icon: <Mail className="h-5 w-5" />, title: "Email redaksi", detail: "redaksi@infoflow.com" },
    { icon: <MapPin className="h-5 w-5" />, title: "Kantor pusat", detail: "Jl. Minimalis No. 45, Jakarta Selatan" },
    { icon: <Phone className="h-5 w-5" />, title: "Layanan telepon", detail: "+62 (21) 555-0123" },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-40 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-12"
          >
            <div className="space-y-6">
              <Title className="text-4xl">Hubungi kami</Title>
              <BodyText>
                Kami terbuka untuk saran, kolaborasi, atau pertanyaan seputar jurnalisme dan platform kami.
              </BodyText>
            </div>

            <div className="space-y-8">
              {contactInfo.map((info, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex gap-5 items-start"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <Heading level={4} className="text-base">{info.title}</Heading>
                    <MutedText className="text-xs">{info.detail}</MutedText>
                  </div>
                </motion.div>
              ))}
            </div>

            <Card className="bg-primary/5 border-none shadow-none">
              <CardContent className="p-6 flex items-center gap-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <p className="text-[11px] font-medium leading-relaxed opacity-70">
                  Waktu respon rata-rata tim dukungan kami adalah kurang dari 24 jam pada hari kerja.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <Card className="border-primary/10 bg-white/60 backdrop-blur-xl">
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[9px] font-bold opacity-50 tracking-wider">Nama lengkap</Label>
                      <Input 
                        id="name" 
                        placeholder="Nama Anda" 
                        className="rounded-md h-11 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-xs"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[9px] font-bold opacity-50 tracking-wider">Alamat email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@contoh.com" 
                        className="rounded-md h-11 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-xs"
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[9px] font-bold opacity-50 tracking-wider">Subjek</Label>
                    <Input 
                      id="subject" 
                      placeholder="Bagaimana kami bisa membantu?" 
                      className="rounded-md h-11 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-xs"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[9px] font-bold opacity-50 tracking-wider">Pesan</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tuliskan pesan Anda secara detail..." 
                      className="min-h-[160px] rounded-md bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-xs resize-none"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 font-bold text-[11px] tracking-widest shadow-md">
                    Kirim pesan sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
