
"use client";

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
    if (user && !isUserLoading) router.push("/");
  }, [user, isUserLoading, router]);

  const handleAuth = (type: 'login' | 'register') => {
    if (!email || !password) {
      toast({ variant: "destructive", title: "Kesalahan input", description: "Mohon isi semua bidang yang tersedia." });
      return;
    }
    setIsLoading(true);
    if (auth) {
      if (type === 'register') initiateEmailSignUp(auth, email, password);
      else initiateEmailSignIn(auth, email, password);
    }
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleGoogleSignIn = () => {
    if (auth) initiateGoogleSignIn(auth);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl overflow-hidden border border-primary/5 min-h-[520px]">
      <div className="hidden lg:flex flex-col relative bg-primary p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://picsum.photos/seed/patureauth/800/1200" alt="Latar belakang jurnalisme" fill className="object-cover" data-ai-hint="minimalist journalism" />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="space-y-4">
            <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center"><Newspaper className="h-5 w-5" /></div>
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold leading-tight text-white">Kejernihan informasi di genggaman Anda</h2>
              <p className="text-white/60 text-xs leading-relaxed max-w-xs">Bergabunglah dengan komunitas pembaca PatureNews untuk mendapatkan akses eksklusif.</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: <CheckCircle2 className="h-4 w-4" />, text: "Akses artikel mendalam tanpa batas" },
              { icon: <ShieldCheck className="h-4 w-4" />, text: "Pengalaman membaca yang aman dan privat" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-medium"><span className="text-white/30">{item.icon}</span><span className="text-white/90">{item.text}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col p-8 sm:p-10 justify-center bg-white">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-primary/5 p-1 rounded-lg shadow-none">
            <TabsTrigger value="login" className="text-xs font-bold tracking-tight py-2 uppercase">Masuk</TabsTrigger>
            <TabsTrigger value="register" className="text-xs font-bold tracking-tight py-2 uppercase">Daftar</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4 outline-none">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold opacity-50 px-1 uppercase tracking-tighter">Alamat email</Label>
              <Input id="email" type="email" placeholder="nama@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg shadow-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold opacity-50 px-1 uppercase tracking-tighter">Kata sandi</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg shadow-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <Button className="w-full h-11 font-bold text-xs tracking-tight rounded-lg shadow-none uppercase" onClick={() => handleAuth('login')} disabled={isLoading}>{isLoading ? "Memproses..." : "Masuk ke akun"}</Button>
          </TabsContent>
          <TabsContent value="register" className="space-y-4 outline-none">
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-xs font-bold opacity-50 px-1 uppercase tracking-tighter">Alamat email</Label>
              <Input id="reg-email" type="email" placeholder="nama@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg shadow-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-xs font-bold opacity-50 px-1 uppercase tracking-tighter">Kata sandi baru</Label>
              <div className="relative">
                <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Buat kata sandi aman" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 border-none bg-primary/5 font-medium text-xs rounded-lg shadow-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary p-1">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <Button className="w-full h-11 font-bold text-xs tracking-tight rounded-lg shadow-none uppercase" onClick={() => handleAuth('register')} disabled={isLoading}>{isLoading ? "Memproses..." : "Daftar sekarang"}</Button>
          </TabsContent>
        </Tabs>
        <div className="flex items-center my-6 gap-3"><div className="h-[1px] flex-1 bg-primary/5" /><span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Atau</span><div className="h-[1px] flex-1 bg-primary/5" /></div>
        <Button variant="outline" className="w-full h-11 font-bold text-xs border border-primary/10 bg-white hover:bg-primary/5 rounded-lg shadow-none uppercase tracking-widest" onClick={handleGoogleSignIn}>Google</Button>
      </div>
    </div>
  );
}
