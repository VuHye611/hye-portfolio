import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  orderings: [
    {
      title: 'Thứ tự hiển thị',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Tên tác phẩm',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Ảnh tác phẩm',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'B&W Doodle', value: 'bw-doodle'},
          {title: 'Full Color', value: 'full-color'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artType',
      title: 'Loại',
      type: 'string',
      options: {
        list: [
          {title: 'Commission', value: 'commission'},
          {title: 'Cá nhân', value: 'ca-nhan'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Năm',
      type: 'number',
      validation: (rule) => rule.required().min(2020).max(2030),
    }),
    defineField({
      name: 'size',
      title: 'Kích thước',
      type: 'string',
      description: 'Ví dụ: 3000×4000px',
    }),
    defineField({
      name: 'description',
      title: 'Mô tả',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ratio',
      title: 'Tỉ lệ',
      type: 'string',
      options: {
        list: [
          {title: 'Portrait (dọc)', value: 'portrait'},
          {title: 'Landscape (ngang)', value: 'landscape'},
          {title: 'Square (vuông)', value: 'square'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Danh mục (cho filter)',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Full Color', value: 'fullcolor'},
          {title: 'B&W', value: 'bw'},
          {title: 'Commission', value: 'commission'},
          {title: 'Cá nhân', value: 'canhan'},
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Hiển thị trên Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Thứ tự hiển thị',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'style',
      media: 'image',
    },
  },
})
