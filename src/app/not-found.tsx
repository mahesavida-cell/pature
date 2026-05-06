
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/wrapped/Layout';
import { Title, TypographyP } from '@/components/wrapped/Typography';
import { FileQuestion, ArrowLeft } from 'lucide-react';

/**
 * Custom 404 page to prevent Vercel-level NOT_FOUND errors.
 * Ensures Next.js handles route misses internally.
 */
export default function NotFound() {
  return (
    <Container className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="space-y-6">
        <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary/40">
          <FileQuestion className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <Title className="text-3xl">Halaman tidak ditemukan</Title>
          <TypographyP className="max-w-md mx-auto opacity-60">
            Maaf, kami tidak dapat menemukan halaman yang Anda tuju. Silakan kembali ke beranda untuk melanjutkan membaca.
          </TypographyP>
        </div>
        <Link href="/" passHref>
          <Button className="gap-2 px-8 h-11 rounded-full font-bold text-[11px] uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </Button>
        </Link>
      </div>
    </Container>
  );
}
