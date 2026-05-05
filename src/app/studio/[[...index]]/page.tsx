
'use client';

/**
 * Halaman ini merender Sanity Studio secara penuh.
 * Rute ini bersifat dinamis agar Sanity UI dapat menangani routing internal.
 */

import {NextStudio} from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
