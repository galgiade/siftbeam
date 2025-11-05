export const accessDeniedDictionaries = {
  ja: {
    title: "このページにアクセスする権限がありません。管理者のみアクセス可能です。",
    message: "このページは管理者のみアクセス可能です。",
    backButton: "ユーザープロフィールに戻る"
  },
  en: {
    title: "You do not have permission to access this page. Only administrators can access.",
    message: "This page is only accessible to administrators.",
    backButton: "Back to User Profile"
  },
  ko: {
    title: "이 페이지에 접근할 권한이 없습니다. 관리자만 접근 가능합니다.",
    message: "이 페이지는 관리자만 접근할 수 있습니다.",
    backButton: "사용자 프로필로 돌아가기"
  },
  zh: {
    title: "您无权访问此页面。仅限管理员访问。",
    message: "此页面仅限管理员访问。",
    backButton: "返回用户资料"
  },
  es: {
    title: "No tiene permiso para acceder a esta página. Solo accesible para administradores.",
    message: "Esta página solo es accesible para administradores.",
    backButton: "Volver al perfil de usuario"
  },
  fr: {
    title: "Vous n'avez pas l'autorisation d'accéder à cette page. Accessible uniquement aux administrateurs.",
    message: "Cette page est uniquement accessible aux administrateurs.",
    backButton: "Retour au profil utilisateur"
  },
  de: {
    title: "Sie haben keine Berechtigung, auf diese Seite zuzugreifen. Nur für Administratoren zugänglich.",
    message: "Diese Seite ist nur für Administratoren zugänglich.",
    backButton: "Zurück zum Benutzerprofil"
  },
  pt: {
    title: "Você não tem permissão para acessar esta página. Acessível apenas para administradores.",
    message: "Esta página é acessível apenas para administradores.",
    backButton: "Voltar ao perfil do usuário"
  },
  id: {
    title: "Anda tidak memiliki izin untuk mengakses halaman ini. Hanya dapat diakses oleh administrator.",
    message: "Halaman ini hanya dapat diakses oleh administrator.",
    backButton: "Kembali ke profil pengguna"
  }
} as const;

export type AccessDeniedLocale = typeof accessDeniedDictionaries['ja'];

