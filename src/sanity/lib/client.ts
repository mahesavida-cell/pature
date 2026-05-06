import { createClient } from 'next-sanity'

/**
 * Konfigurasi Sanity Client Teroptimasi (Public-Facing).
 * Peran: Editorial truth provider.
 * Strategi: useCdn=true untuk efisiensi biaya Spark plan & performa Edge.
 */
export const client = createClient({
  projectId: "owl5t2fh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true, 
  perspective: 'published',
  staleTime: 60 * 1000, 
})
