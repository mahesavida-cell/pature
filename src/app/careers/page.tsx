"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heading, BodyText, Title, MutedText } from "@/components/wrapped/Typography";
import { Card, CardContent } from "@/components/wrapped/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    { title: "Redaktur Senior", type: "Full-time", location: "Jakarta / Remote", dept: "Redaksi" },
    { title: "UI/UX Designer", type: "Full-time", location: "Jakarta", dept: "Produk" },
    { title: "Frontend Engineer (React)", type: "Contract", location: "Remote", dept: "Produk" },
    { title: "Spesialis Media Sosial", type: "Full-time", location: "Jakarta", dept: "Pemasaran" },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 pt-40 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Title className="text-4xl">Mari berkarya bersama</Title>
            <BodyText>Kami selalu mencari individu kreatif yang percaya pada kekuatan informasi yang jelas dan bermakna.</BodyText>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <Heading level={2} className="text-xl">Posisi terbuka</Heading>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:border-primary/30 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-bold">{job.dept}</Badge>
                        <span className="text-[9px] font-bold text-muted-foreground/60">{job.type}</span>
                      </div>
                      <Heading level={4} className="text-lg mb-2 group-hover:text-primary transition-colors">{job.title}</Heading>
                      <div className="flex items-center justify-between mt-6">
                        <MutedText className="text-[10px]">{job.location}</MutedText>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl p-12 text-center space-y-6">
            <Heading level={3}>Belum menemukan posisi yang pas?</Heading>
            <BodyText className="max-w-xl mx-auto text-sm">
              Jika Anda merasa memiliki visi yang sama dengan InfoFlow namun tidak melihat posisi yang sesuai, kirimkan portofolio Anda ke talent@infoflow.com.
            </BodyText>
            <Button variant="outline" className="font-bold text-[10px] rounded-full px-8">Kirim aplikasi umum</Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
