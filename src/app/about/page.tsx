"use client";

import { Container, Section } from "@/components/wrapped/Layout";
import { TypographyH1, TypographyH2, TypographyH3, TypographyP, TypographyLead, BodyText } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Sparkles, Target, Users, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <Container className="max-w-[1000px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Section className="pb-16 pt-24">
          <div className="max-w-2xl">
            <TypographyH1 className="text-5xl md:text-6xl mb-8 leading-[1.05]">
              Kejernihan informasi untuk era digital yang bising.
            </TypographyH1>
            <TypographyLead className="text-2xl text-foreground/60">
              PatureNews adalah wadah bagi jurnalisme berkualitas yang disajikan dengan presisi teknis dan ketenangan visual.
            </TypographyLead>
          </div>
        </Section>

        <Section className="py-20 border-t border-primary/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <TypographyH2 className="mt-0">Misi kami</TypographyH2>
              <TypographyP>
                Kami percaya bahwa informasi bukan hanya sekadar data, melainkan pondasi dari keputusan yang tepat. Di tengah banjir informasi yang seringkali membingungkan, PatureNews hadir untuk menyaring kebisingan dan menyajikan narasi yang bermakna bagi pembaca profesional.
              </TypographyP>
              <TypographyP>
                Setiap artikel yang kami terbitkan melalui proses verifikasi yang ketat, memastikan integritas jurnalisme tetap menjadi prioritas tertinggi kami di era kecepatan digital.
              </TypographyP>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: <Target className="h-5 w-5" />, title: "Kurasi presisi", desc: "Hanya informasi yang paling relevan dan terverifikasi yang sampai ke layar Anda." },
                { icon: <Shield className="h-5 w-5" />, title: "Integritas mutlak", desc: "Kemandirian editorial adalah janji kami kepada setiap pembaca setia." },
                { icon: <Globe className="h-5 w-5" />, title: "Aksesibilitas global", desc: "Informasi berkualitas harus dapat diakses oleh semua orang, di mana saja." }
              ].map((item, i) => (
                <Card key={i} className="bg-white/40 border-primary/5 shadow-none group">
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div className="space-y-1 flex-1">
                      <TypographyH3 className="text-base mt-0 mb-1">{item.title}</TypographyH3>
                      <BodyText className="text-sm opacity-60">{item.desc}</BodyText>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        <Section className="py-20 bg-primary/5 -mx-6 lg:-mx-8 px-6 lg:px-8 rounded-3xl border border-primary/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-24 opacity-5 rotate-12 scale-150">
             <Sparkles className="h-48 w-48" />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <TypographyH2 className="mt-0 text-3xl">Filosofi desain</TypographyH2>
              <TypographyP className="text-lg opacity-70">
                Bagi kami, minimalisme bukan sekadar tren visual, melainkan bentuk penghormatan kami terhadap waktu dan fokus pembaca Anda.
              </TypographyP>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="h-px w-12 bg-primary/20" />
                <TypographyH3 className="text-base">Fokus pada konten</TypographyH3>
                <BodyText className="text-sm opacity-60">Menghilangkan elemen distraksi untuk membiarkan berita berbicara sendiri.</BodyText>
              </div>
              <div className="space-y-3">
                <div className="h-px w-12 bg-primary/20" />
                <TypographyH3 className="text-base">Tipografi tajam</TypographyH3>
                <BodyText className="text-sm opacity-60">Setiap karakter dirancang untuk keterbacaan maksimal pada setiap perangkat.</BodyText>
              </div>
              <div className="space-y-3">
                <div className="h-px w-12 bg-primary/20" />
                <TypographyH3 className="text-base">Ritme visual</TypographyH3>
                <BodyText className="text-sm opacity-60">Penggunaan ruang kosong yang terukur untuk kenyamanan mata pembaca.</BodyText>
              </div>
              <div className="space-y-3">
                <div className="h-px w-12 bg-primary/20" />
                <TypographyH3 className="text-base">Respon secepat kilat</TypographyH3>
                <BodyText className="text-sm opacity-60">Infrastruktur modern yang menjamin berita sampai dalam hitungan milidetik.</BodyText>
              </div>
            </div>
          </div>
        </Section>

        <Section className="py-24 text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-4">
             <TypographyH2 className="mt-0">Ingin berkontribusi?</TypographyH2>
             <TypographyP>Kami selalu mencari pemikir, jurnalis, dan desainer yang percaya pada kekuatan informasi yang jernih.</TypographyP>
          </div>
          <div className="flex justify-center gap-4">
            <button className="h-11 px-8 rounded-lg bg-primary text-white font-medium text-sm hover:opacity-90 transition-all shadow-sm">
              Lihat karir
            </button>
            <button className="h-11 px-8 rounded-lg border border-primary/10 font-medium text-sm hover:bg-primary/5 transition-all">
              Hubungi redaksi
            </button>
          </div>
        </Section>
      </motion.div>
    </Container>
  );
}
