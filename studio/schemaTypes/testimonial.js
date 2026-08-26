import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Feedback khách hàng',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tên khách',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Nội dung feedback',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'screenshot',
      title: 'Ảnh chụp màn hình',
      type: 'image',
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
      subtitle: 'quote',
    },
  },
})
