
'use client';

import { Button } from "@/components/ui/button";

/**
 * Global error boundary to catch fatal SSR errors.
 * Prevents the app from completely unmounting and triggering Vercel 404s.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-background p-10 text-center">
        <div className="space-y-6 max-w-md">
          <h2 className="text-2xl font-headline font-bold text-primary">Sesuatu berjalan tidak semestinya</h2>
          <p className="text-sm text-muted-foreground">Terjadi kesalahan fatal pada sistem. Kami sedang berusaha memperbaikinya.</p>
          <Button 
            onClick={() => reset()}
            className="w-full h-11 font-bold text-[11px] uppercase tracking-widest"
          >
            Coba muat ulang
          </Button>
        </div>
      </body>
    </html>
  );
}
