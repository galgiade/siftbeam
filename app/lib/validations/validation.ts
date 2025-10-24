import { z } from 'zod';

export function validationSchema(locale: string = 'ja') {
  const messages = {
    ja: {
      required: 'この項目は必須です',
      email: '有効なメールアドレスを入力してください',
      minLength: '最低{min}文字以上入力してください',
      maxLength: '最大{max}文字以下で入力してください'
    },
    en: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      minLength: 'Please enter at least {min} characters',
      maxLength: 'Please enter no more than {max} characters'
    }
  };

  const msg = messages[locale as keyof typeof messages] || messages.en;

  return {
    updateUserSchema: z.object({
      id: z.string().min(1, msg.required),
      userName: z.string().min(1, msg.required).max(50, msg.maxLength.replace('{max}', '50')),
      email: z.string().email(msg.email),
      customerId: z.string().min(1, msg.required),
      department: z.string().min(1, msg.required).max(100, msg.maxLength.replace('{max}', '100')),
      position: z.string().min(1, msg.required).max(100, msg.maxLength.replace('{max}', '100')),
      role: z.string().min(1, msg.required)
    })
  };
}
