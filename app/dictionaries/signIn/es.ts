import type { SignInLocale } from './signIn.d.ts';

const es: SignInLocale = {
  label: {
    back: "Atrás",
    submit: "Enviar",
    loading: "Cargando...",
    signInTitle: "Iniciar sesión",
    signInSubtitle: "Inicia sesión en tu cuenta",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "ejemplo@email.com",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
    passwordDescription: "Al menos 8 caracteres con mayúsculas, minúsculas, números y símbolos",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando...",
    signUp: "Crear cuenta",
    forgotPassword: "¿Olvidaste tu contraseña?",
    noAccount: "¿No tienes una cuenta?",

    // 2FA
    verificationCodeLabel: "Código de verificación",
    verificationCodePlaceholder: "Ingresa el código de 6 dígitos",
    verificationCodeDescription: "Ingresa el código enviado a tu correo registrado",
    verifyCode: "Verificar código",
    verifyingCode: "Verificando...",
    resendCode: "Reenviar código",
    resendingCode: "Reenviando...",
    codeExpired: "El código ha expirado",
    enterVerificationCode: "Ingresa el código de verificación",
    twoFactorAuthTitle: "Autenticación de dos factores",
    twoFactorAuthDescription: "Introduce el código de verificación enviado a {email}",
    expirationTime: "Tiempo de expiración",
    attemptCount: "Intentos",
    verificationSuccess: "✅ Autenticación exitosa. Redirigiendo...",

    // Otros
    orDivider: "o",
    copyright: "© 2024 Todos los derechos reservados."
  },
  alert: {
    emailRequired: "Introduce tu correo electrónico",
    passwordRequired: "Introduce tu contraseña",
    emailFormatInvalid: "Introduce un formato de correo válido",
    passwordFormatInvalid: "La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números",
    emailAndPasswordRequired: "Introduce correo y contraseña",
    signInFailed: "Error al iniciar sesión",
    accountNotConfirmed: "La cuenta no está confirmada. Completa la verificación por correo",
    authCodeRequired: "Se requiere el código de autenticación",
    newPasswordRequired: "Se requiere configurar una nueva contraseña",
    passwordResetRequired: "Se requiere restablecer la contraseña",
    nextStepRequired: "Se requiere el siguiente paso: {step}",
    
    // 2FA errors
    verificationCodeRequired: "Ingresa el código de verificación",
    verificationCodeInvalid: "El código de verificación es incorrecto",
    verificationCodeExpired: "El código ha expirado. Reenviarlo",
    resendCodeFailed: "Error al reenviar el código",
    maxAttemptsReached: "Número máximo de intentos alcanzado. Solicita un nuevo código.",
    emailSendFailed: "Error al enviar el correo",
    verificationCodeNotFound: "Código de verificación no encontrado o expirado",
    remainingAttempts: "Intentos restantes",
    authErrors: {
      notAuthorized: "El correo o la contraseña no son correctos",
      userNotConfirmed: "La cuenta no está confirmada. Completa la verificación por correo",
      userNotFound: "Usuario no encontrado",
      passwordResetRequired: "Se requiere restablecer la contraseña",
      invalidParameter: "Parámetro inválido",
      tooManyRequests: "Demasiadas solicitudes. Inténtalo de nuevo más tarde"
    }
  }
};

export default es;