
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

/**
 * Konfigurasi Sanity Client untuk PatureNews.
 * Menggunakan useCdn: true untuk performa maksimal dan stabilitas akses publik.
 */
export const client = createClient({
  projectId: "owl5t2fh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, 
})
