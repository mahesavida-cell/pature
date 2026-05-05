
import { defineQuery } from 'next-sanity';

/**
 * Query untuk mengambil semua artikel berita terbaru untuk feed utama.
 */
export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  author,
  mainImage,
  publishedAt,
  readTime,
  excerpt,
  isEditorsChoice,
  isTrending,
  "categories": categories[]->title
}[0...12]`);

/**
 * Query untuk mengambil satu artikel berdasarkan slug yang dikirim dari URL.
 */
export const POST_DETAIL_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  author,
  mainImage,
  publishedAt,
  readTime,
  excerpt,
  body,
  isEditorsChoice,
  isTrending,
  "categories": categories[]->title,
  "gallery": gallery[] {
    "url": asset->url,
    caption
  }
}`);

/**
 * Query untuk kategori navigasi di Navbar.
 */
export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description
}`);
