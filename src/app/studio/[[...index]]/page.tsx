'use client';

/**
 * Halaman ini merender Sanity Studio secara penuh.
 * Menambahkan mekanisme untuk menekan peringatan prop React 19 yang tidak dikenali
 * yang sering muncul dari internal Studio (seperti disableTransition).
 */

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import config from '../../../../sanity.config';

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  useEffect(() => {
    // Menekan peringatan prop tidak dikenal dari pihak ketiga yang sering muncul di React 19
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('disableTransition')) return;
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return <NextStudio config={config} />;
}
