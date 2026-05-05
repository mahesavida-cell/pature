"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, TypographyP } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-40 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <Title>Tentang kami</Title>
            <BodyText className="text-xl">InfoFlow adalah wadah bagi informasi berkualitas yang disajikan dengan kejernihan maksimal.</BodyText>
          </div>

          <div className="prose prose-neutral max-w-none space-y-8">
            <section className="space-y-4">
              <Heading level={2}>Misi kami</Heading>
              <TypographyP>
                Di era di mana informasi mengalir tanpa henti, kami percaya bahwa kualitas jauh lebih penting daripada kuantitas. InfoFlow hadir untuk menyaring kebisingan digital dan menyajikan narasi yang bermakna bagi pembaca profesional dan antusias desain di seluruh dunia.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>Filosofi desain</Heading>
              <TypographyP>
                Minimalisme bukan sekadar gaya visual bagi kami; itu adalah cara kami menghormati waktu pembaca. Dengan antarmuka yang bersih dan fokus pada tipografi, kami memastikan pesan utama dari setiap berita tersampaikan tanpa distraksi yang tidak perlu.
              </TypographyP>
            </section>

            <section className="space-y-4">
              <Heading level={2}>Tim redaksi</Heading>
              <TypographyP>
                Kami terdiri dari jurnalis, desainer, dan pemikir yang berdedikasi untuk menjaga standar integritas informasi. Setiap konten yang Anda baca di InfoFlow telah melalui proses kurasi yang ketat untuk memastikan keakuratan dan nilai wawasan yang ditawarkan.
              </TypographyP>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
