"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
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
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          description: "Akun berhasil dibuat! Selamat datang di InfoFlow.",
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
        message = "Metode masuk ini belum diaktifkan di Firebase Console. Silakan aktifkan email/kata sandi di menu Authentication.";
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
      let message = error.message;
      if (error instanceof FirebaseError && error.code === 'auth/operation-not-allowed') {
        message = "Metode Google Sign-In belum diaktifkan di Firebase Console. Silakan aktifkan di menu Authentication.";
      }
      toast({
        variant: "destructive",
        title: "Kesalahan masuk Google",
        description: message,
      });
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-body">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-6 space-y-1 px-2">
            <Heading level={2} className="text-xl sm:text-2xl font-bold tracking-tighter">Pembaca InfoFlow</Heading>
            <BodyText className="text-[10px] sm:text-xs opacity-60 font-medium">Dapatkan berita terbaru langsung di genggaman Anda.</BodyText>
          </div>

          <Card className="rounded-lg border-2 border-primary/10 shadow-none bg-background/20 backdrop-blur-md">
            <CardContent className="pt-5 px-5 pb-6 sm:pt-6 sm:px-6 sm:pb-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-primary/5 p-1 rounded-md">
                  <TabsTrigger value="login" className="text-[10px] sm:text-[11px] font-bold py-1.5 transition-all">Masuk sekarang</TabsTrigger>
                  <TabsTrigger value="register" className="text-[10px] sm:text-[11px] font-bold py-1.5 transition-all">Daftar akun</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[9px] font-bold opacity-50">Alamat email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@contoh.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-md h-9 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-[9px] font-bold opacity-50">Kata sandi</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Masukkan kata sandi"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-md h-9 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all pr-10 font-medium text-xs"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors focus:outline-none p-1.5"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-10 rounded-md font-bold text-[11px] shadow-sm mt-1" 
                      onClick={() => handleAuth('login')}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sedang memproses..." : "Masuk ke akun"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="mt-0 focus-visible:outline-none">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-email" className="text-[9px] font-bold opacity-50">Alamat email</Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="email@contoh.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-md h-9 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="reg-password" className="text-[9px] font-bold opacity-50">Kata sandi</Label>
                      <div className="relative">
                        <Input 
                          id="reg-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Buat kata sandi baru"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-md h-9 bg-transparent border-primary/10 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all pr-10 font-medium text-xs"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors focus:outline-none p-1.5"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      className="w-full h-10 rounded-md font-bold text-[11px] shadow-sm mt-1" 
                      onClick={() => handleAuth('register')}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sedang memproses..." : "Daftar berlangganan"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center my-6 gap-3">
                <div className="h-[1px] flex-1 bg-primary/10" />
                <span className="text-[9px] font-bold text-muted-foreground/40 whitespace-nowrap">Atau masuk dengan</span>
                <div className="h-[1px] flex-1 bg-primary/10" />
              </div>

              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}>
                <Button 
                  className="w-full h-10 rounded-md font-bold text-[10px] flex items-center justify-center gap-3 border border-primary/10 bg-white/60 hover:bg-white transition-all duration-300 shadow-sm text-primary group"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="group-hover:text-primary transition-colors">Masuk dengan akun Google</span>
                </Button>
              </motion.div>

              <div className="mt-6 pt-5 border-t border-primary/5 space-y-3">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
                  <button className="text-[9px] font-bold text-muted-foreground/50 hover:text-primary transition-colors">Ketentuan penggunaan</button>
                  <button className="text-[9px] font-bold text-muted-foreground/50 hover:text-primary transition-colors">Kebijakan privasi</button>
                </div>
                <MutedText className="text-[9px] text-center block opacity-30 font-medium leading-relaxed">
                  Dengan melanjutkan, Anda setuju dengan ketentuan penggunaan dan kebijakan privasi InfoFlow.
                </MutedText>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
