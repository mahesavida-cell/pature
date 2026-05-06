'use client';

/**
 * Utilitas untuk standarisasi casing teks di seluruh aplikasi PatureNews.
 */

export type CasingType = 'sentence' | 'title' | 'upper' | 'none';

/**
 * Mengubah teks menjadi Sentence case (Hanya huruf pertama kalimat yang kapital).
 */
export function toSentenceCase(text: string): string {
  if (!text) return '';
  const lowercase = text.toLowerCase();
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
}

/**
 * Mengubah teks menjadi Title Case (Huruf pertama setiap kata kapital).
 */
export function toTitleCase(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Fungsi utama untuk memproses teks berdasarkan klasifikasi casing.
 */
export function formatCasing(text: string, type: CasingType = 'none'): string {
  if (!text || type === 'none') return text;
  
  switch (type) {
    case 'sentence':
      return toSentenceCase(text);
    case 'title':
      return toTitleCase(text);
    case 'upper':
      return text.toUpperCase();
    default:
      return text;
  }
}
