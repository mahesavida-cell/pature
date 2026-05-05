"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth, initiateEmailSignUp, initiateEmailSignIn, initiateGoogleSignIn, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Newspaper } from "lucide-react";
import Image from "next/image";

/**
 * Halaman autentikasi PatureNews.
 * Menggunakan komponen Tabs murni ShadCN UI untuk stabilitas maksimal.
 */
export default function AuthPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/");
    }
  }, [user, isUserLoading, router]);

  const handleAuth = (type: 'login' | 'register') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Kesalahan input",
        description: "Mohon isi semua bidang yang tersedia.",
      });
      return;
    }

    setIsLoading(true);
    if (type === 'register') {
      initiateEmailSignUp(auth, email, password);
      toast({
        title: "Sedang memproses",
        description: "Permintaan pendaftaran anda sedang dikirim.",
      });
    } else {
      initiateEmailSignIn(auth, email, password);
      toast({
        title: "Sedang masuk",
        description: "Mencoba memverifikasi kredensial anda.",
      });
    }
  };

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-xl border border-primary/5 h-full max-h-[500px]"
        >
          {/* Sisi kiri - branding & info */}
          <div className="hidden lg:flex flex-col relative bg-primary p-6 text-white">
            <div className="absolute inset-0 opacity-10">
              <Image 
                src="https://picsum.photos/seed/patureauth/800/1200" 
                alt="Latar belakang" 
                fill 
                className="object-cover"
                data-ai-hint="minimalist journalism"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-3">
                <div className="h-7 w-7 bg-white/10 backdrop-blur-md rounded flex items-center justify-center">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-headline font-bold leading-tight">Kejernihan informasi di genggaman anda</h2>
                  <p className="text-white/60 text-[10px] leading-relaxed max-w-xs">Bergabunglah dengan komunitas pembaca PatureNews untuk mendapatkan akses eksklusif.</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: <CheckCircle2 className="h-3 w-3" />, text: "Akses artikel mendalam tanpa batas" },
                  { icon: <ShieldCheck className="h-3 w-3" />, text: "Pengalaman membaca yang aman dan privat" },
                  { icon: <Newspaper className="h-3 w-3" />, text: "Buletin harian pilihan redaksi" }
                ].map((item, i) => (
                  <div key={`benefit-${i}`} className="flex items-center gap-2.5 text-[9px] font-medium">
                    <span className="text-white/30">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-[8px] font-bold text-white/30 tracking-[0.2em]">PatureNews Media Group</p>
              </div>
            </div>
          </div>

          {/* Sisi kanan - formulir */}
          <div className="flex flex-col p-6 sm:p-7 justify-center bg-white relative">
            <div className="mb-3 lg:hidden text-center">
              <Heading level={2} className="text-base font-bold tracking-tight mb-1 text-primary">PatureNews</Heading>
              <BodyText className="text-[8px] opacity-60 font-bold tracking-widest">Jurnalisme modern dan terpercaya</BodyText>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-3 h-8 bg-primary/5 p-1 rounded-lg">
                <TabsTrigger value="login" className="text-[10px] font-bold tracking-tight rounded-md">Masuk</TabsTrigger>
                <TabsTrigger value="register" className="text-[10px] font-bold tracking-tight rounded-md">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent key="login-tab" value="login" className="mt-0 focus-visible:outline-none space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[9px] font-bold opacity-50 px-1">Alamat email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 border-none bg-primary/5 font-medium text-[11px] rounded-lg focus-visible:ring-1 focus-visible:ring-primary/10"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="password" className="text-[9px] font-bold opacity-50">Kata sandi</Label>
                    <button className="text-[9px] font-bold text-primary/60 hover:text-primary transition-colors">Lupa sandi?</button>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Masukkan sandi anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-8 border-none bg-primary/5 font-medium text-[11px] rounded-lg focus-visible:ring-1 focus-visible:ring-primary/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-9 font-bold text-[10px] tracking-tight mt-1 rounded-lg shadow-sm" 
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang memproses..." : "Masuk ke akun"}
                </Button>
              </TabsContent>

              <TabsContent key="register-tab" value="register" className="mt-0 focus-visible:outline-none space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="reg-email" className="text-[9px] font-bold opacity-50 px-1">Alamat email</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="nama@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 border-none bg-primary/5 font-medium text-[11px] rounded-lg focus-visible:ring-1 focus-visible:ring-primary/10"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reg-password" className="text-[9px] font-bold opacity-50 px-1">Kata sandi baru</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Buat sandi yang aman"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-8 border-none bg-primary/5 font-medium text-[11px] rounded-lg focus-visible:ring-1 focus-visible:ring-primary/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-9 font-bold text-[10px] tracking-tight mt-1 rounded-lg shadow-sm" 
                  onClick={() => handleAuth('register')}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang memproses..." : "Daftar sekarang"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex items-center my-3 gap-3">
              <div className="h-[1px] flex-1 bg-primary/5" />
              <span className="text-[9px] font-bold text-muted-foreground/30 whitespace-nowrap tracking-tight">Atau lanjutkan dengan</span>
              <div className="h-[1px] flex-1 bg-primary/5" />
            </div>

            <Button 
              variant="outline"
              className="w-full h-9 font-bold text-[9px] flex items-center justify-center gap-2 border-primary/10 bg-white hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </Button>

            <div className="mt-4 pt-3 flex flex-col items-center gap-0.5 border-t border-primary/5">
              <div className="flex gap-3">
                <button className="text-[8px] font-bold text-muted-foreground/50 hover:text-primary transition-colors">Ketentuan</button>
                <button className="text-[8px] font-bold text-muted-foreground/50 hover:text-primary transition-colors">Privasi</button>
              </div>
              <p className="text-[7px] text-center opacity-30 font-bold leading-relaxed tracking-tight mt-0.5">
                PatureNews Media Group © 2024.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
