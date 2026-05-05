"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, TypographyP } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            <Title>Kebijakan privasi</Title>
            <BodyText>Kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda.</BodyText>
          </div>

          <div className="prose prose-neutral max-w-none space-y-10">
            <section className="space-y-4">
              <Heading level={2}>1. Informasi yang kami kumpulkan</Heading>
              <TypographyP>
                Kami mengumpulkan alamat email dan nama Anda saat Anda mendaftar melalui email atau Google Auth. Kami juga mencatat riwayat bacaan dan artikel yang Anda arsipkan untuk personalisasi layanan.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>2. Penggunaan informasi</Heading>
              <TypographyP>
                Informasi Anda digunakan untuk menyediakan akses ke fitur akun, mengelola riwayat bacaan Anda, dan memberikan rekomendasi berita yang relevan. Kami tidak akan menjual data Anda kepada pihak ketiga.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>3. Keamanan data</Heading>
              <TypographyP>
                Kami menggunakan layanan Google Firebase yang aman untuk menyimpan data autentikasi dan database Anda. Kami melakukan upaya terbaik untuk melindungi data Anda dari akses yang tidak sah.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>4. Hak Anda</Heading>
              <TypographyP>
                Anda memiliki hak untuk melihat, memperbarui, atau menghapus data pribadi Anda kapan saja melalui halaman profil akun Anda di InfoFlow.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>5. Cookie</Heading>
              <TypographyP>
                Kami menggunakan penyimpanan lokal (local storage) untuk menjaga sesi masuk Anda tetap aktif dan menyimpan preferensi tema atau navigasi dasar Anda.
              </TypographyP>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
