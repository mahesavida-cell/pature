
import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Artikel berita',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Judul',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Penulis editorial',
      type: 'string',
      initialValue: 'Redaksi PatureNews',
    }),
    defineField({
      name: 'mainImage',
      title: 'Gambar utama',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks alternatif',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Keterangan gambar',
        },
        {
          name: 'credit',
          type: 'string',
          title: 'Kredit foto',
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Kategori',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal terbit',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Estimasi waktu baca',
      type: 'string',
      description: 'Contoh: 5 menit baca',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan artikel',
      type: 'text',
      rows: 3,
      description: 'Digunakan untuk kartu berita dan metadata SEO.',
    }),
    defineField({
      name: 'body',
      title: 'Isi berita',
      type: 'blockContent',
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri foto',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Keterangan' }
          ]
        }
      ]
    }),
    defineField({
      name: 'isEditorsChoice',
      title: 'Pilihan redaksi (Pinned)',
      type: 'boolean',
      description: 'Tandai jika artikel ini ingin disematkan sebagai pilihan redaksi unggulan.',
      initialValue: false,
    }),
    defineField({
      name: 'isTrending',
      title: 'Berita trending',
      type: 'boolean',
      description: 'Tandai jika artikel ini sedang populer atau banyak dibaca.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `Oleh ${author}`}
    },
  },
})
