"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, TypographyP } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-40 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <Title>Ketentuan penggunaan</Title>
            <BodyText>Patuhi aturan main kami untuk pengalaman membaca yang lebih baik bagi semua.</BodyText>
          </div>

          <div className="prose prose-neutral max-w-none space-y-10">
            <section className="space-y-4">
              <Heading level={2}>1. Penerimaan ketentuan</Heading>
              <TypographyP>
                Dengan mengakses platform InfoFlow, Anda setuju untuk terikat oleh ketentuan penggunaan ini, semua hukum dan peraturan yang berlaku, dan setuju bahwa Anda bertanggung jawab untuk kepatuhan terhadap hukum setempat yang berlaku.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>2. Penggunaan platform</Heading>
              <TypographyP>
                InfoFlow disediakan untuk konsumsi informasi pribadi Anda. Anda dilarang menggunakan platform ini untuk tujuan komersial yang tidak sah atau aktivitas ilegal yang dapat merugikan sistem atau pengguna lain.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>3. Akun pengguna</Heading>
              <TypographyP>
                Saat membuat akun, Anda wajib memberikan informasi yang akurat. Anda bertanggung jawab penuh atas keamanan kata sandi Anda dan setiap aktivitas yang terjadi di bawah akun Anda.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>4. Hak kekayaan intelektual</Heading>
              <TypographyP>
                Seluruh konten di InfoFlow, termasuk teks, gambar, dan desain, adalah milik InfoFlow atau pemberi lisensi kami. Anda tidak diperkenankan menyalin atau mendistribusikan konten kami tanpa izin tertulis.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>5. Pembatasan tanggung jawab</Heading>
              <TypographyP>
                InfoFlow tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan layanan kami.
              </TypographyP>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
