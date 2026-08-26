import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Cài đặt chung',
  type: 'document',
  fields: [
    defineField({
      name: 'commissionOpen',
      title: 'Commission đang mở?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Phụ đề trang chủ',
      type: 'string',
      initialValue: 'Digital artist · B&W Doodle · Full Color',
    }),
    defineField({
      name: 'ctaText',
      title: 'Nội dung CTA',
      type: 'string',
      initialValue: 'Commission hiện đang mở. B&W Doodle từ 200K, Full Color từ 350K.',
    }),
    defineField({
      name: 'aboutBio',
      title: 'Giới thiệu bản thân',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'aboutAvatar',
      title: 'Ảnh avatar trang About',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'revisionFee',
      title: 'Phí chỉnh sửa',
      type: 'string',
      initialValue: '50k/lần',
    }),
    defineField({
      name: 'rushMultiplier',
      title: 'Hệ số gấp',
      type: 'string',
      initialValue: '×2',
    }),
    defineField({
      name: 'extraCharacterRate',
      title: 'Phụ thu thêm nhân vật',
      type: 'string',
      initialValue: '+80%/character',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Liên kết mạng xã hội',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'string',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
        defineField({
          name: 'behance',
          title: 'Behance',
          type: 'url',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Cài đặt chung',
      }
    },
  },
})
