'use client';

/**
 * @fileOverview Smart Data Bridge Service
 * Mengelola koordinasi data antara Sanity (Editorial) dan Firebase (Interactive).
 * Memastikan tidak ada tabrakan data (collusion) dan sinkronisasi tetap akurat.
 */

import { client } from '@/sanity/lib/client';
import { POST_DETAIL_QUERY } from '@/sanity/lib/queries';

export interface ContentMetadata {
  id: string;
  slug: string;
  category: string;
  title: string;
}

/**
 * Menghasilkan metadata standar untuk sinkronisasi antar platform.
 */
export function createSyncMetadata(sanityPost: any): ContentMetadata | null {
  if (!sanityPost) return null;
  return {
    id: sanityPost._id,
    slug: sanityPost.slug,
    category: sanityPost.categories?.[0] || 'Berita',
    title: sanityPost.title,
  };
}

/**
 * Fetcher terpusat dengan penanganan error lintas stack.
 */
export async function fetchEditorialContent(slug: string) {
  try {
    const data = await client.fetch(POST_DETAIL_QUERY, { slug });
    return { data, error: null };
  } catch (err) {
    console.error("Data Bridge: Editorial Fetch Error:", err);
    return { data: null, error: err };
  }
}
