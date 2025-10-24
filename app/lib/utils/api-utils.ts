export function getApiDictionary(locale: string = 'ja') {
  const dictionaries = {
    ja: {
      fields: {
        userName: 'ユーザー名',
        email: 'メールアドレス',
        department: '部署',
        position: '役職'
      },
      errors: {
        user: {
          fieldRequired: '{field}は必須項目です'
        }
      }
    },
    en: {
      fields: {
        userName: 'Username',
        email: 'Email',
        department: 'Department',
        position: 'Position'
      },
      errors: {
        user: {
          fieldRequired: '{field} is required'
        }
      }
    }
  };

  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
}
