
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

/**
 * Konfigurasi Sanity Client untuk PatureNews.
 * Menghubungkan frontend Next.js dengan dataset di Sanity.io.
 */
export const client = createClient({
  projectId: "owl5t2fh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false, // Disetel false untuk mendapatkan data terbaru saat pengembangan
})
