
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, TypographyP } from "@/components/wrapped/Typography";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Penerimaan ketentuan",
      content: "Dengan mengakses platform PatureNews, Anda setuju untuk terikat oleh ketentuan penggunaan ini, semua hukum dan peraturan yang berlaku, dan setuju bahwa Anda bertanggung jawab untuk kepatuhan terhadap hukum setempat yang berlaku. Jika Anda tidak menyetujui salah satu dari ketentuan ini, Anda dilarang menggunakan atau mengakses situs ini.",
    },
    {
      title: "2. Lisensi penggunaan",
      content: "Izin diberikan untuk mengunduh satu salinan materi secara sementara di situs web PatureNews hanya untuk tampilan transien pribadi dan non-komersial. Ini adalah pemberian lisensi, bukan transfer hak milik, dan di bawah lisensi ini Anda tidak boleh memodifikasi materi, menggunakan materi untuk tujuan komersial, atau menghapus hak cipta.",
    },
    {
      title: "3. Akun pengguna",
      content: "Saat Anda membuat akun di platform kami, Anda harus memberikan informasi yang akurat dan lengkap. Kegagalan untuk melakukan hal ini merupakan pelanggaran terhadap ketentuan kami. Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda.",
    },
    {
      title: "4. Hak kekayaan intelektual",
      content: "Seluruh konten yang disajikan di PatureNews, termasuk namun tidak terbatas pada teks, grafis, logo, ikon, dan gambar adalah milik PatureNews Media Group atau pemasok kontennya dan dilindungi oleh hukum hak cipta internasional.",
    },
    {
      title: "5. Pembatasan tanggung jawab",
      content: "Dalam keadaan apa pun PatureNews tidak bertanggung jawab atas kerugian (termasuk, tanpa batasan, kerugian karena hilangnya data atau keuntungan, atau karena gangguan bisnis) yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan materi di PatureNews.",
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
            <Title className="text-4xl">Ketentuan penggunaan</Title>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold opacity-40">Terakhir diperbarui: 24 Oktober 2024</span>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-[10px] font-bold opacity-40">Versi 2.0</span>
            </div>
          </div>

          <div className="space-y-12">
            <BodyText className="text-sm italic opacity-60">
              Mohon baca ketentuan penggunaan ini dengan teliti sebelum menggunakan layanan PatureNews. Penggunaan Anda atas layanan ini menandakan persetujuan Anda untuk terikat oleh ketentuan berikut.
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
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
