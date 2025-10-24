export default {
  label: {
    back: "Voltar",
    submit: "Enviar",
    loading: "Carregando...",
    signInTitle: "Entrar",
    signInSubtitle: "Faça login na sua conta",
    emailLabel: "E-mail",
    emailPlaceholder: "exemplo@email.com",
    passwordLabel: "Senha",
    passwordPlaceholder: "Digite sua senha",
    passwordDescription: "Pelo menos 8 caracteres com maiúsculas, minúsculas, números e símbolos",
    signIn: "Entrar",
    signingIn: "Entrando...",
    signUp: "Criar conta",
    forgotPassword: "Esqueceu a senha?",
    noAccount: "Não tem uma conta?",

    // 2FA
    verificationCodeLabel: "Código de verificação",
    verificationCodePlaceholder: "Digite o código de 6 dígitos",
    verificationCodeDescription: "Digite o código enviado ao seu e-mail registrado",
    verifyCode: "Verificar código",
    verifyingCode: "Verificando...",
    resendCode: "Reenviar código",
    resendingCode: "Reenviando...",
    codeExpired: "O código expirou",
    enterVerificationCode: "Digite o código de verificação",
    expirationTime: "Tempo de expiração",
    attemptCount: "Tentativas",
    verificationSuccess: "✅ Autenticação bem-sucedida. Redirecionando..."
  },
  alert: {
    emailRequired: "Digite seu e-mail",
    passwordRequired: "Digite sua senha",
    emailFormatInvalid: "Digite um e-mail válido",
    passwordFormatInvalid: "A senha deve ter pelo menos 8 caracteres com maiúsculas, minúsculas, números e símbolos",
    emailAndPasswordRequired: "Digite e-mail e senha",
    signInFailed: "Falha ao entrar",
    accountNotConfirmed: "Conta não confirmada. Conclua a verificação por e-mail",
    authCodeRequired: "Código de autenticação é obrigatório",
    newPasswordRequired: "É necessário definir uma nova senha",
    passwordResetRequired: "É necessário redefinir a senha",
    nextStepRequired: "Próxima etapa necessária: {step}",
    
    // 2FA errors
    verificationCodeRequired: "Digite o código de verificação",
    verificationCodeInvalid: "O código de verificação está incorreto",
    verificationCodeExpired: "O código expirou. Reenvie",
    resendCodeFailed: "Falha ao reenviar o código",
    maxAttemptsReached: "Número máximo de tentativas atingido. Solicite um novo código.",
    emailSendFailed: "Falha ao enviar e-mail",
    verificationCodeNotFound: "Código de verificação não encontrado ou expirado",
    remainingAttempts: "Tentativas restantes",
    authErrors: {
      notAuthorized: "E-mail ou senha incorretos",
      userNotConfirmed: "Conta não confirmada. Conclua a verificação por e-mail",
      userNotFound: "Usuário não encontrado",
      passwordResetRequired: "É necessário redefinir a senha",
      invalidParameter: "Parâmetro inválido",
      tooManyRequests: "Muitas solicitações. Tente novamente mais tarde"
    }
  }
} as const;


