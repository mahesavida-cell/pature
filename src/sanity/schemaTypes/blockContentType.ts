
import {defineType, defineArrayMember} from 'sanity'

/**
 * Definisi skema untuk konten blok editorial PatureNews.
 * Menggunakan standar Sanity Studio v3.
 */
export const blockContentType = defineType({
  title: 'Konten blok',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Blok',
      type: 'block',
      // Gaya teks yang tersedia untuk editor
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Kutipan', value: 'blockquote'},
      ],
      lists: [{title: 'Poin', value: 'bullet'}],
      marks: {
        // Dekorator teks dasar
        decorators: [
          {title: 'Tebal', value: 'strong'},
          {title: 'Miring', value: 'em'},
        ],
        // Anotasi untuk tautan (sebelumnya salah menggunakan properti 'links')
        annotations: [
          {
            title: 'Tautan URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'Alamat URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // Memungkinkan penyisipan gambar di dalam konten teks
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks alternatif',
        },
      ],
    }),
  ],
})
