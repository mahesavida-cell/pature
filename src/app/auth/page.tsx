"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Heading, BodyText, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth, initiateEmailSignUp, initiateEmailSignIn, initiateGoogleSignIn } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";

export default function AuthPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (type: 'login' | 'register') => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Kesalahan Input",
        description: "Mohon Isi Semua Bidang Yang Tersedia.",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'register') {
        await initiateEmailSignUp(auth, email, password);
        toast({
          title: "Berhasil Daftar",
          description: "Akun Berhasil Dibuat! Selamat Datang Di InfoFlow.",
        });
      } else {
        await initiateEmailSignIn(auth, email, password);
        toast({
          title: "Selamat Datang Kembali",
          description: "Berhasil Masuk Ke Akun Anda.",
        });
      }
      router.push("/");
    } catch (error: any) {
      let message = error.message;
      if (error instanceof FirebaseError && error.code === 'auth/operation-not-allowed') {
        message = "Metode Masuk Ini Belum Diaktifkan Di Firebase Console. Silakan Aktifkan 'Email/Password' Di Menu Authentication.";
      }
      toast({
        variant: "destructive",
        title: "Kesalahan Autentikasi",
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
        message = "Metode Google Sign-In Belum Diaktifkan Di Firebase Console. Silakan Aktifkan Di Menu Authentication.";
      }
      toast({
        variant: "destructive",
        title: "Kesalahan Google Sign-In",
        description: message,
      });
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 space-y-2">
            <Heading level={2}>InfoFlow Reader</Heading>
            <BodyText>Dapatkan Berita Terbaru Langsung Di Genggaman Anda.</BodyText>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Masuk Sekarang</TabsTrigger>
                  <TabsTrigger value="register">Daftar Akun</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Alamat Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@contoh.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Kata Sandi</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full h-12 rounded-xl font-bold tracking-wide" 
                      onClick={() => handleAuth('login')}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sedang Memproses..." : "Masuk Ke Akun"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Alamat Email</Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="email@contoh.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Kata Sandi</Label>
                      <Input 
                        id="reg-password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full h-12 rounded-xl font-bold tracking-wide" 
                      onClick={() => handleAuth('register')}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sedang Memproses..." : "Daftar Berlangganan"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-bold tracking-wider">Atau Masuk Dengan</span>
                </div>
              </div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl font-bold tracking-wide flex items-center justify-center gap-3 border-2 border-border/50 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Masuk Dengan Akun Google
                </Button>
              </motion.div>

              <MutedText className="text-[10px] text-center block pt-6">
                Dengan Melanjutkan, Anda Setuju Untuk Menerima Update Berita Terbaru Kami.
              </MutedText>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}