"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, TypographyP } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Informasi yang kami kumpulkan",
      content: "Kami mengumpulkan informasi yang Anda berikan langsung kepada kami, seperti saat Anda membuat akun, berlangganan buletin, atau berkomunikasi dengan kami. Informasi ini dapat mencakup nama Anda, alamat email, dan preferensi konten Anda.",
    },
    {
      title: "2. Penggunaan data Anda",
      content: "Kami menggunakan informasi yang kami kumpulkan untuk menyediakan, memelihara, dan meningkatkan layanan kami. Ini termasuk personalisasi pengalaman membaca Anda, mengirimkan pembaruan teknis, dan memproses interaksi komunitas Anda (seperti komentar dan arsip).",
    },
    {
      title: "3. Keamanan informasi",
      content: "Kami mengambil langkah-langkah yang wajar untuk melindungi informasi tentang Anda dari kehilangan, pencurian, penyalahgunaan, dan akses tidak sah. Kami menggunakan infrastruktur Google Firebase yang memiliki standar keamanan tingkat tinggi untuk penyimpanan data Anda.",
    },
    {
      title: "4. Hak privasi Anda",
      content: "Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda kapan saja. Anda dapat melakukan hal ini melalui pengaturan profil Anda atau dengan menghubungi tim dukungan kami secara langsung.",
    },
    {
      title: "5. Cookie dan teknologi serupa",
      content: "Kami menggunakan teknologi seperti penyimpanan lokal (local storage) untuk meningkatkan pengalaman pengguna, mengingat preferensi Anda, dan mengumpulkan data analitik anonim untuk memahami bagaimana pembaca berinteraksi dengan platform kami.",
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="space-y-6">
            <Title className="text-4xl">Kebijakan privasi</Title>
            <div className="flex items-center gap-4">
              <MutedText className="text-[10px] font-bold opacity-40">Terakhir diperbarui: 24 Oktober 2024</MutedText>
              <Separator orientation="vertical" className="h-3" />
              <MutedText className="text-[10px] font-bold opacity-40">Versi 1.1</MutedText>
            </div>
          </div>

          <Card className="border-none shadow-none bg-white/20 backdrop-blur-md">
            <CardContent className="p-0 space-y-12">
              <BodyText className="text-sm italic opacity-60">
                Di InfoFlow, privasi Anda adalah prioritas utama kami. Kebijakan ini menjelaskan bagaimana kami mengelola data Anda untuk memberikan pengalaman membaca yang aman dan dipersonalisasi.
              </BodyText>

              {sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <Heading level={3} className="text-lg">{section.title}</Heading>
                  <TypographyP className="text-base text-foreground/70 leading-relaxed">
                    {section.content}
                  </TypographyP>
                  {idx !== sections.length - 1 && <Separator className="mt-8 opacity-5" />}
                </div>
              ))}

              <div className="pt-8 p-8 bg-primary/5 rounded-xl space-y-4 border border-primary/5">
                <Heading level={4} className="text-base">Pertanyaan tentang privasi?</Heading>
                <TypographyP className="text-sm mt-0">
                  Jika Anda memiliki pertanyaan tentang kebijakan ini, jangan ragu untuk menghubungi petugas perlindungan data kami di <span className="font-bold text-primary">privacy@infoflow.com</span>.
                </TypographyP>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

// Helper constants for internal use if wrapped/Typography is not enough
const MutedText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`text-sm text-muted-foreground/60 font-body font-medium tracking-wide ${className}`}>
    {children}
  </span>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-lg ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);
