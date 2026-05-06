
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
 * Query untuk mengambil artikel berdasarkan kategori slug.
 */
export const POSTS_BY_CATEGORY_QUERY = defineQuery(`*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  author,
  mainImage,
  publishedAt,
  readTime,
  excerpt,
  "categories": categories[]->title
}`);

/**
 * Query untuk mengambil detail kategori berdasarkan slug.
 */
export const CATEGORY_DETAIL_QUERY = defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  description
}`);

/**
 * Query untuk berita trending (terpopuler) yang ditampilkan di sidebar.
 */
export const TRENDING_POSTS_QUERY = defineQuery(`*[_type == "post" && isTrending == true && defined(slug.current)] | order(publishedAt desc) [0...5] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  readTime,
  "categories": categories[]->title
}`);

/**
 * Query untuk kategori navigasi di Navbar termasuk sub-kategorinya.
 */
export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  subCategories
}`);

/**
 * Query pencarian instan untuk instant feedback di Navbar.
 */
export const SEARCH_SUGGESTIONS_QUERY = defineQuery(`*[_type == "post" && (title match $searchTerm || excerpt match $searchTerm || categories[]->title match $searchTerm)] | order(publishedAt desc) [0...5] {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  publishedAt,
  "categories": categories[]->title
}`);
