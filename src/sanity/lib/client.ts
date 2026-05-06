import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "owl5t2fh";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

/**
 * Konfigurasi Sanity Client Teroptimasi (Public-Facing).
 * Peran: Editorial truth provider.
 * Strategi: useCdn=true untuk efisiensi biaya Spark plan & performa Edge.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, 
  perspective: 'published',
  token: process.env.SANITY_API_READ_TOKEN,
})
