
import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Skema kategori untuk PatureNews.
 * Mendukung sub-kategori yang akan ditampilkan di sub-header navigasi.
 */
export const categoryType = defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nama kategori',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
    }),
    defineField({
      name: 'subCategories',
      title: 'Sub-kategori',
      description: 'Daftar topik yang akan muncul di sub-header (misal: Gadget, AI, Mobile)',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})
