import { createClient } from 'next-sanity'

/**
 * Konfigurasi Sanity Client untuk PatureNews.
 * Menggunakan useCdn: true untuk performa maksimal dan stabilitas akses publik.
 * Dilengkapi dengan kebijakan revalidasi data terpusat.
 */
export const client = createClient({
  projectId: "owl5t2fh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, 
  // Cache Policy: Menjamin data tetap segar dengan revalidasi setiap 60 detik
  perspective: 'published',
  staleTime: 60 * 1000, 
})
