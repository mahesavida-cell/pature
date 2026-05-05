"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth, initiateEmailSignUp, initiateEmailSignIn, initiateGoogleSignIn } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Newspaper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleAuth = async (type: 'login' | 'register') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Kesalahan input",
        description: "Mohon isi semua bidang yang tersedia.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'register') {
        await initiateEmailSignUp(auth, email, password);
        toast({
          title: "Berhasil mendaftar",
          description: "Akun berhasil dibuat! Selamat datang di PatureNews.",
        });
      } else {
        await initiateEmailSignIn(auth, email, password);
        toast({
          title: "Selamat datang kembali",
          description: "Berhasil masuk ke akun Anda.",
        });
      }
      router.push("/");
    } catch (error: any) {
      let message = error.message;
      if (error instanceof FirebaseError && error.code === 'auth/operation-not-allowed') {
        message = "Metode masuk ini belum diaktifkan. Silakan hubungi administrator.";
      }
      toast({
        variant: "destructive",
        title: "Kesalahan autentikasi",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await initiateGoogleSignIn(auth);
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Kesalahan masuk Google",
        description: error.message,
      });
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-xl border border-primary/5 min-h-[500px] lg:max-h-[550px]"
        >
          {/* Sisi kiri - branding & info */}
          <div className="hidden lg:flex flex-col relative bg-primary p-8 text-white">
            <div className="absolute inset-0 opacity-10">
              <Image 
                src="https://picsum.photos/seed/patureauth/800/1200" 
                alt="Background" 
                fill 
                className="object-cover"
                data-ai-hint="minimalist journalism"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="h-8 w-8 bg-white/10 backdrop-blur-md rounded flex items-center justify-center">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-headline font-bold leading-tight">Kejernihan informasi di genggaman Anda</h2>
                  <p className="text-white/60 text-[11px] leading-relaxed max-w-xs">Bergabunglah dengan komunitas pembaca PatureNews untuk mendapatkan akses eksklusif ke jurnalisme berkualitas.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <CheckCircle2 className="h-3 w-3" />, text: "Akses artikel mendalam tanpa batas" },
                  { icon: <ShieldCheck className="h-3 w-3" />, text: "Pengalaman membaca yang aman dan privat" },
                  { icon: <Newspaper className="h-3 w-3" />, text: "Buletin harian pilihan redaksi" }
                ].map((item, i) => (
                  <div key={`benefit-${i}`} className="flex items-center gap-3 text-[10px] font-medium">
                    <span className="text-white/30">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase">PatureNews Media Group</p>
              </div>
            </div>
          </div>

          {/* Sisi kanan - formulir */}
          <div className="flex flex-col p-6 sm:p-8 justify-center bg-white relative">
            <div className="mb-4 lg:hidden">
              <Heading level={2} className="text-lg font-bold tracking-tight mb-1">PatureNews</Heading>
              <BodyText className="text-[9px] opacity-60 font-bold uppercase tracking-widest">Jurnalisme modern dan terpercaya</BodyText>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 h-8">
                <TabsTrigger value="login" className="text-[10px] font-bold tracking-widest transition-all">Masuk</TabsTrigger>
                <TabsTrigger value="register" className="text-[10px] font-bold tracking-widest transition-all">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-0 focus-visible:outline-none space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[9px] font-bold opacity-40 uppercase tracking-widest px-1">Alamat email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 border-primary/10 bg-primary/5 border-none font-medium text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="password" className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Kata sandi</Label>
                    <button className="text-[9px] font-bold text-primary/60 hover:text-primary">Lupa sandi?</button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Masukkan sandi anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 border-primary/10 bg-primary/5 border-none font-medium text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-9 font-bold text-[10px] tracking-widest mt-1" 
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang memproses..." : "Masuk ke akun"}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="mt-0 focus-visible:outline-none space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="reg-email" className="text-[9px] font-bold opacity-40 uppercase tracking-widest px-1">Alamat email</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="nama@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 border-primary/10 bg-primary/5 border-none font-medium text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-password" className="text-[9px] font-bold opacity-40 uppercase tracking-widest px-1">Kata sandi baru</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Buat sandi yang aman"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-9 border-primary/10 bg-primary/5 border-none font-medium text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-9 font-bold text-[10px] tracking-widest mt-1" 
                  onClick={() => handleAuth('register')}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang memproses..." : "Daftar sekarang"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex items-center my-4 gap-3">
              <div className="h-[1px] flex-1 bg-primary/5" />
              <span className="text-[9px] font-bold text-muted-foreground/40 whitespace-nowrap tracking-widest uppercase">Atau</span>
              <div className="h-[1px] flex-1 bg-primary/5" />
            </div>

            <Button 
              variant="outline"
              className="w-full h-9 font-bold text-[9px] flex items-center justify-center gap-2 border-primary/10 hover:bg-primary/5 tracking-widest"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </Button>

            <div className="mt-6 pt-4 flex flex-col items-center gap-1 border-t border-primary/5">
              <div className="flex gap-4">
                <button onClick={() => setIsTermsOpen(true)} className="text-[9px] font-bold text-muted-foreground/50 hover:text-primary">Ketentuan penggunaan</button>
                <button onClick={() => setIsPrivacyOpen(true)} className="text-[9px] font-bold text-muted-foreground/50 hover:text-primary">Kebijakan privasi</button>
              </div>
              <p className="text-[8px] text-center opacity-30 font-bold leading-relaxed max-w-[200px] uppercase tracking-tighter">
                PatureNews Media Group © 2024. Seluruh hak cipta dilindungi.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Dialog Ketentuan Penggunaan */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="max-w-xl max-h-[70vh] flex flex-col p-0 overflow-hidden border-none bg-white rounded-lg shadow-2xl">
          <DialogHeader className="p-6 border-b border-primary/5">
            <DialogTitle className="font-headline font-bold text-lg">Ketentuan penggunaan</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 text-sm leading-relaxed text-foreground/70">
              <section>
                <h4 className="font-bold text-primary mb-2">1. Penerimaan ketentuan</h4>
                <p>Dengan mengakses PatureNews, Anda setuju untuk terikat oleh ketentuan ini dan semua hukum yang berlaku di wilayah hukum Republik Indonesia.</p>
              </section>
              <section>
                <h4 className="font-bold text-primary mb-2">2. Penggunaan platform</h4>
                <p>Platform ini disediakan untuk konsumsi informasi pribadi. Penggunaan komersial tanpa izin tertulis dari PatureNews Media Group dilarang keras.</p>
              </section>
              <section>
                <h4 className="font-bold text-primary mb-2">3. Akun dan keamanan</h4>
                <p>Anda bertanggung jawab penuh atas kerahasiaan kredensial akun Anda dan semua aktivitas yang terjadi di bawah akun tersebut.</p>
              </section>
            </div>
          </ScrollArea>
          <div className="p-4 bg-primary/5 flex justify-end">
            <Button onClick={() => setIsTermsOpen(false)} size="sm" className="font-bold text-[10px] px-6">Mengerti</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Kebijakan Privasi */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogContent className="max-w-xl max-h-[70vh] flex flex-col p-0 overflow-hidden border-none bg-white rounded-lg shadow-2xl">
          <DialogHeader className="p-6 border-b border-primary/5">
            <DialogTitle className="font-headline font-bold text-lg">Kebijakan privasi</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 text-sm leading-relaxed text-foreground/70">
              <section>
                <h4 className="font-bold text-primary mb-2">1. Data yang dikumpulkan</h4>
                <p>Kami mengumpulkan data minimal seperti email dan nama profil untuk personalisasi pengalaman membaca Anda di PatureNews.</p>
              </section>
              <section>
                <h4 className="font-bold text-primary mb-2">2. Keamanan data</h4>
                <p>Data Anda disimpan menggunakan infrastruktur Google Firebase dengan standar keamanan enkripsi industri.</p>
              </section>
              <section>
                <h4 className="font-bold text-primary mb-2">3. Hak pengguna</h4>
                <p>Anda berhak meminta penghapusan data pribadi Anda kapan saja melalui pengaturan profil akun.</p>
              </section>
            </div>
          </ScrollArea>
          <div className="p-4 bg-primary/5 flex justify-end">
            <Button onClick={() => setIsPrivacyOpen(false)} size="sm" className="font-bold text-[10px] px-6">Mengerti</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
