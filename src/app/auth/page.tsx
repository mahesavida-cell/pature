"use client";

import { TypographyLabel, TypographyMuted } from "@/components/wrapped/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useAuth, initiateEmailSignUp, initiateEmailSignIn, initiateGoogleSignIn, useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Newspaper } from "lucide-react";
import Image from "next/image";
import { formatCasing } from "@/lib/casing";

export default function AuthPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) router.push("/");
  }, [user, isUserLoading, router]);

  const handleAuth = () => {
    if (!email || !password) {
      toast({ variant: "destructive", title: "Kesalahan input", description: "Mohon isi semua bidang yang tersedia." });
      return;
    }
    
    if (mode === 'register' && !agreed) {
      toast({ variant: "destructive", title: "Persetujuan diperlukan", description: "Anda harus menyetujui ketentuan layanan kami." });
      return;
    }

    setIsLoading(true);
    if (auth) {
      if (mode === 'register') initiateEmailSignUp(auth, email, password);
      else initiateEmailSignIn(auth, email, password);
    }
    setTimeout(() => setIsLoading(false), 1200);
  };

  const handleGoogleSignIn = () => {
    if (auth) initiateGoogleSignIn(auth);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 bg-white rounded-xl overflow-hidden border border-primary/5 min-h-[580px] shadow-2xl">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:col-span-5 flex-col relative bg-primary p-10 text-white">
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://picsum.photos/seed/patureauth/800/1200" 
            alt="Latar belakang jurnalisme" 
            fill 
            className="object-cover" 
            data-ai-hint="minimalist journalism" 
          />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Newspaper className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-headline font-semibold leading-tight text-white" style={{ fontSynthesis: 'none' }}>
                {formatCasing("Kejernihan informasi di genggaman Anda", 'sentence')}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs font-body">
                {formatCasing("Bergabunglah dengan komunitas pembaca PatureNews untuk mendapatkan akses eksklusif.", 'sentence')}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: <CheckCircle2 className="h-4 w-4" />, text: "Akses artikel mendalam tanpa batas" },
              { icon: <ShieldCheck className="h-4 w-4" />, text: "Pengalaman membaca yang aman dan privat" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium tracking-tight font-body">
                <span className="text-white/30">{item.icon}</span>
                <span className="text-white/90">{formatCasing(item.text, 'sentence')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col lg:col-span-7 p-8 sm:p-12 justify-center bg-white">
        <div className="mb-10">
          <h1 className="text-2xl font-body font-semibold text-primary mb-2" style={{ fontSynthesis: 'none' }}>
            {mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}
          </h1>
          <TypographyMuted>
            {mode === 'login' 
              ? 'Masuk untuk mengakses arsip dan riwayat bacaan Anda.' 
              : 'Daftarkan email Anda untuk mulai berkontribusi.'}
          </TypographyMuted>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <TypographyLabel>Alamat email</TypographyLabel>
            <Input 
              type="email" 
              placeholder="nama@contoh.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <TypographyLabel>Kata sandi</TypographyLabel>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder={mode === 'login' ? "Masukkan kata sandi" : "Buat kata sandi aman"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="flex items-start gap-3 mt-4">
              <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-0.5"
              />
              <label 
                htmlFor="terms" 
                className="text-[12px] leading-tight text-muted-foreground font-body cursor-pointer select-none"
                style={{ fontSynthesis: 'none' }}
              >
                Saya menyetujui <span className="underline underline-offset-2">Ketentuan Layanan</span> dan <span className="underline underline-offset-2">Kebijakan Privasi</span> PatureNews.
              </label>
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full shadow-sm" 
            onClick={handleAuth} 
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : mode === 'login' ? "Masuk ke akun" : "Daftar sekarang"}
          </Button>

          <div className="flex items-center my-8 gap-3">
            <div className="h-[1px] flex-1 bg-primary/5" />
            <span className="text-[10px] font-bold text-muted-foreground/30 tracking-widest">ATAU</span>
            <div className="h-[1px] flex-1 bg-primary/5" />
          </div>
          
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              className="w-full bg-[#f4f4f4] text-[#171717] rounded-lg border-none text-base font-medium shadow-[0_0_0_1px_rgb(235,235,235)] transition-all hover:bg-black/5"
            >
              Masuk dengan Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground font-body" style={{ fontSynthesis: 'none' }}>
                {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {mode === 'login' ? 'Daftar' : 'Masuk'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
