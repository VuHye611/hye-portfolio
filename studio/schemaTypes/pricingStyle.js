import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pricingStyle',
  title: 'Bảng giá Commission',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tên style',
      type: 'string',
      description: 'Ví dụ: B&W Doodle',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
    }),
    defineField({
      name: 'description',
      title: 'Mô tả phong cách',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'sampleImage',
      title: 'Ảnh minh họa',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'grayscale',
      title: 'Hiển thị ảnh đen trắng',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badgeColor',
      title: 'Màu badge',
      type: 'string',
      options: {
        list: [
          {title: 'B&W', value: 'bw'},
          {title: 'Color', value: 'color'},
        ],
      },
    }),
    defineField({
      name: 'prices',
      title: 'Bảng giá',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'frame',
              title: 'Kiểu khung',
              type: 'string',
              options: {
                list: [
                  {title: 'Headshot', value: 'headshot'},
                  {title: 'Waist-up', value: 'waist-up'},
                  {title: 'Full body', value: 'full-body'},
                ],
              },
            }),
            defineField({
              name: 'price',
              title: 'Giá',
              type: 'string',
              description: 'Ví dụ: 200.000đ',
            }),
          ],
          preview: {
            select: {
              title: 'frame',
              subtitle: 'price',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'extraCharacterRate',
      title: 'Phụ thu thêm nhân vật',
      type: 'string',
      initialValue: '+80%/character',
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
      title: 'name',
      media: 'sampleImage',
    },
  },
})
