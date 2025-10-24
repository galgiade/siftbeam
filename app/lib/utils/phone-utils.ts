// 国コードと電話番号の国番号のマッピング
export const COUNTRY_PHONE_CODES = {
  'JP': '+81',
  'US': '+1',
  'CA': '+1',
  'GB': '+44',
  'AU': '+61',
  'DE': '+49',
  'FR': '+33',
  'IT': '+39',
  'ES': '+34',
  'NL': '+31',
  'BE': '+32',
  'CH': '+41',
  'AT': '+43',
  'SE': '+46',
  'NO': '+47',
  'DK': '+45',
  'FI': '+358',
  'IE': '+353',
  'PT': '+351',
  'GR': '+30',
  'PL': '+48',
  'CZ': '+420',
  'HU': '+36',
  'SK': '+421',
  'SI': '+386',
  'HR': '+385',
  'RO': '+40',
  'BG': '+359',
  'LT': '+370',
  'LV': '+371',
  'EE': '+372',
  'MT': '+356',
  'CY': '+357',
  'LU': '+352',
  'IS': '+354',
  'LI': '+423',
  'MC': '+377',
  'SM': '+378',
  'VA': '+379',
  'AD': '+376',
  'KR': '+82',
  'CN': '+86',
  'TW': '+886',
  'HK': '+852',
  'MO': '+853',
  'SG': '+65',
  'MY': '+60',
  'TH': '+66',
  'VN': '+84',
  'PH': '+63',
  'ID': '+62',
  'IN': '+91',
  'PK': '+92',
  'BD': '+880',
  'LK': '+94',
  'NP': '+977',
  'BT': '+975',
  'MV': '+960',
  'AF': '+93',
  'IR': '+98',
  'IQ': '+964',
  'SA': '+966',
  'AE': '+971',
  'QA': '+974',
  'BH': '+973',
  'KW': '+965',
  'OM': '+968',
  'YE': '+967',
  'JO': '+962',
  'LB': '+961',
  'SY': '+963',
  'IL': '+972',
  'PS': '+970',
  'TR': '+90',
  'EG': '+20',
  'LY': '+218',
  'TN': '+216',
  'DZ': '+213',
  'MA': '+212',
  'SD': '+249',
  'ET': '+251',
  'KE': '+254',
  'UG': '+256',
  'TZ': '+255',
  'RW': '+250',
  'BI': '+257',
  'DJ': '+253',
  'SO': '+252',
  'ER': '+291',
  'SS': '+211',
  'CF': '+236',
  'TD': '+235',
  'CM': '+237',
  'GQ': '+240',
  'GA': '+241',
  'CG': '+242',
  'CD': '+243',
  'AO': '+244',
  'ZM': '+260',
  'ZW': '+263',
  'BW': '+267',
  'NA': '+264',
  'ZA': '+27',
  'LS': '+266',
  'SZ': '+268',
  'MZ': '+258',
  'MW': '+265',
  'MG': '+261',
  'MU': '+230',
  'SC': '+248',
  'KM': '+269',
  'YT': '+262',
  'RE': '+262',
  'BR': '+55',
  'AR': '+54',
  'CL': '+56',
  'PE': '+51',
  'EC': '+593',
  'CO': '+57',
  'VE': '+58',
  'GY': '+592',
  'SR': '+597',
  'GF': '+594',
  'UY': '+598',
  'PY': '+595',
  'BO': '+591',
  'FK': '+500',
  'MX': '+52',
  'GT': '+502',
  'BZ': '+501',
  'SV': '+503',
  'HN': '+504',
  'NI': '+505',
  'CR': '+506',
  'PA': '+507',
  'CU': '+53',
  'JM': '+1876',
  'HT': '+509',
  'DO': '+1809',
  'PR': '+1787',
  'TT': '+1868',
  'BB': '+1246',
  'GD': '+1473',
  'LC': '+1758',
  'VC': '+1784',
  'AG': '+1268',
  'DM': '+1767',
  'KN': '+1869',
  'BS': '+1242',
  'RU': '+7',
  'KZ': '+7',
  'UZ': '+998',
  'TM': '+993',
  'TJ': '+992',
  'KG': '+996',
  'MN': '+976',
  'NZ': '+64',
  'FJ': '+679',
  'PG': '+675',
  'SB': '+677',
  'VU': '+678',
  'NC': '+687',
  'PF': '+689',
  'WF': '+681',
  'CK': '+682',
  'NU': '+683',
  'TK': '+690',
  'KI': '+686',
  'TV': '+688',
  'NR': '+674',
  'PW': '+680',
  'FM': '+691',
  'MH': '+692',
  'AS': '+1684',
  'GU': '+1671',
  'MP': '+1670',
  'VI': '+1340',
  'UM': '+1',
} as const;

// 国コードから電話番号の国番号を取得
export function getPhoneCodeByCountry(countryCode: string): string {
  return COUNTRY_PHONE_CODES[countryCode as keyof typeof COUNTRY_PHONE_CODES] || '';
}

// 電話番号を国際形式に変換
export function formatPhoneNumber(phone: string, countryCode: string): string {
  if (!phone || !countryCode) return phone;
  
  const phoneCode = getPhoneCodeByCountry(countryCode);
  if (!phoneCode) return phone;
  
  // 既に国番号が付いている場合はそのまま返す
  if (phone.startsWith('+')) return phone;
  
  // 日本の場合の特別処理
  if (countryCode === 'JP') {
    // 先頭の0を削除
    const cleanPhone = phone.replace(/^0/, '').replace(/-/g, '');
    return `${phoneCode}${cleanPhone}`;
  }
  
  // その他の国の場合
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return `${phoneCode}${cleanPhone}`;
}

// 電話番号から国番号部分と番号部分を分離
export function parsePhoneNumber(phone: string): { countryCode: string; phoneCode: string; number: string } {
  if (!phone.startsWith('+')) {
    return { countryCode: '', phoneCode: '', number: phone };
  }
  
  // 国番号を検索
  for (const [countryCode, phoneCode] of Object.entries(COUNTRY_PHONE_CODES)) {
    if (phone.startsWith(phoneCode)) {
      return {
        countryCode,
        phoneCode,
        number: phone.slice(phoneCode.length)
      };
    }
  }
  
  return { countryCode: '', phoneCode: '', number: phone };
}
