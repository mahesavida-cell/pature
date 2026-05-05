
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth, initiateEmailSignUp, initiateEmailSignIn, initiateGoogleSignIn, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Newspaper } from "lucide-react";
import Image from "next/image";

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
    if (auth) {
      if (type === 'register') {
        initiateEmailSignUp(auth, email, password);
      } else {
        initiateEmailSignIn(auth, email, password);
      }
    }
    
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleGoogleSignIn = () => {
    if (auth) initiateGoogleSignIn(auth);
  };

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-xl border border-primary/5 h-full max-h-[520px]">
          {/* Sisi kiri - branding & info */}
          <div className="hidden lg:flex flex-col relative bg-primary p-8 text-white">
            <div className="absolute inset-0 opacity-10">
              <Image 
                src="https://picsum.photos/seed/patureauth/800/1200" 
                alt="Latar belakang jurnalisme minimalis" 
                fill 
                className="object-cover"
                data-ai-hint="minimalist journalism"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline font-bold leading-tight text-white">Kejernihan informasi di genggaman anda</h2>
                  <p className="text-white/60 text-xs leading-relaxed max-w-xs">Bergabunglah dengan komunitas pembaca PatureNews untuk mendapatkan akses eksklusif.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: <CheckCircle2 className="h-4 w-4" />, text: "Akses artikel mendalam tanpa batas" },
                  { icon: <ShieldCheck className="h-4 w-4" />, text: "Pengalaman membaca yang aman dan privat" },
                  { icon: <Newspaper className="h-4 w-4" />, text: "Buletin harian pilihan redaksi" }
                ].map((item, i) => (
                  <div key={`benefit-${i}`} className="flex items-center gap-3 text-xs font-medium">
                    <span className="text-white/30">{item.icon}</span>
                    <span className="text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sisi kanan - formulir */}
          <div className="flex flex-col p-8 sm:p-10 justify-center bg-white relative">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-primary/5 p-1 rounded-lg">
                <TabsTrigger value="login" className="text-xs font-bold tracking-tight py-2">Masuk</TabsTrigger>
                <TabsTrigger value="register" className="text-xs font-bold tracking-tight py-2">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 outline-none">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold opacity-50 px-1">Alamat email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold opacity-50 px-1">Kata sandi</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Masukkan sandi anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-11 font-bold text-xs tracking-tight rounded-lg shadow-sm" 
                  onClick={() => handleAuth('login')}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang memproses..." : "Masuk ke akun"}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 outline-none">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-xs font-bold opacity-50 px-1">Alamat email</Label>
                  <Input 
                    id="reg-email" 
                    type="email" 
                    placeholder="nama@contoh.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-xs font-bold opacity-50 px-1">Kata sandi baru</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Buat sandi yang aman"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button 
                  className="w-full h-11 font-bold text-xs tracking-tight rounded-lg shadow-sm" 
                  onClick={() => handleAuth('register')}
                  disabled={isLoading}
                >
                  {isLoading ? "Sedang memproses..." : "Daftar sekarang"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex items-center my-6 gap-3">
              <div className="h-[1px] flex-1 bg-primary/5" />
              <span className="text-[10px] font-bold text-muted-foreground/30 whitespace-nowrap tracking-tight">Atau lanjutkan dengan</span>
              <div className="h-[1px] flex-1 bg-primary/5" />
            </div>

            <Button 
              variant="outline"
              className="w-full h-11 font-bold text-xs flex items-center justify-center gap-2 border-primary/10 bg-white hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
              onClick={handleGoogleSignIn}
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
