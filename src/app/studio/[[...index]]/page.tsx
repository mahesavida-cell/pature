'use client';

/**
 * Halaman ini merender Sanity Studio secara penuh.
 * Menggunakan dynamic import dengan ssr: false untuk menghindari masalah hidrasi
 * dan kebocoran prop internal yang tidak dikenali oleh React 19.
 */

import dynamic from 'next/dynamic';
import config from '../../../../sanity.config';

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}
