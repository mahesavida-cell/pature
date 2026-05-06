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

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c1.61-1.31 2.54-3.23 2.54-5.32z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

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
            {mode === 'login' ? formatCasing('Selamat datang kembali', 'sentence') : formatCasing('Buat akun baru', 'sentence')}
          </h1>
          <TypographyMuted>
            {mode === 'login' 
              ? formatCasing('Masuk untuk mengakses arsip dan riwayat bacaan Anda.', 'sentence') 
              : formatCasing('Daftarkan email Anda untuk mulai berkontribusi.', 'sentence')}
          </TypographyMuted>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <TypographyLabel>{formatCasing("Alamat email", 'sentence')}</TypographyLabel>
            <Input 
              type="email" 
              placeholder="nama@contoh.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <TypographyLabel>{formatCasing("Kata sandi", 'sentence')}</TypographyLabel>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder={mode === 'login' ? formatCasing("Masukkan kata sandi", 'sentence') : formatCasing("Buat kata sandi aman", 'sentence')} 
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
                {formatCasing("Saya menyetujui", 'sentence')} <span className="underline underline-offset-2">{formatCasing("Ketentuan Layanan", 'sentence')}</span> {formatCasing("dan", 'sentence')} <span className="underline underline-offset-2">{formatCasing("Kebijakan Privasi", 'sentence')}</span> PatureNews.
              </label>
            </div>
          )}

          <Button 
            size="lg" 
            className="w-full shadow-sm" 
            onClick={handleAuth} 
            disabled={isLoading}
          >
            {isLoading ? formatCasing("Memproses...", 'sentence') : mode === 'login' ? formatCasing("Masuk ke akun", 'sentence') : formatCasing("Daftar sekarang", 'sentence')}
          </Button>

          <div className="flex items-center my-6 gap-3">
            <div className="h-[1px] flex-1 bg-primary/5" />
            <span className="text-[10px] font-bold text-muted-foreground/30 tracking-widest uppercase">{formatCasing("Atau", 'upper')}</span>
            <div className="h-[1px] flex-1 bg-primary/5" />
          </div>
          
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              className="w-full bg-[#f4f4f4] text-[#171717] rounded-lg border-none text-base font-medium shadow-[0_0_0_1px_rgb(235,235,235)] transition-all hover:bg-black/5 gap-3 h-12"
            >
              <GoogleIcon />
              {formatCasing("Masuk dengan Google", 'sentence')}
            </Button>

            <div className="text-center">
              <p className="text-[14px] text-muted-foreground font-body" style={{ fontSynthesis: 'none' }}>
                {mode === 'login' ? formatCasing('Belum punya akun? ', 'sentence') : formatCasing('Sudah punya akun? ', 'sentence')}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {mode === 'login' ? formatCasing('Daftar', 'sentence') : formatCasing('Masuk', 'sentence')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
