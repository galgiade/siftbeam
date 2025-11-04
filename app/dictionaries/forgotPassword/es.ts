import type { ForgotPasswordLocale } from './forgotPassword.d.ts';

const es: ForgotPasswordLocale = {
  label: {
    back: "Atrás",
    submit: "Enviar",
    loading: "Cargando...",
    forgotPasswordTitle: "Restablecer contraseña",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "Introduce tu correo",
    codeLabel: "Código de verificación",
    codePlaceholder: "Introduce el código",
    newPasswordLabel: "Nueva contraseña",
    newPasswordPlaceholder: "Introduce la nueva contraseña",
    sendCode: "Enviar código",
    updatePassword: "Actualizar contraseña",
    backToEmail: "Atrás",
    resendCode: "Enviar nuevo código",
    emailDescription: "Introduce tu correo. Te enviaremos un código de verificación.",
    codeDescription: "Introduce el código recibido y tu nueva contraseña.",
    redirectingMessage: "Redirigiendo a la página de inicio de sesión...",
    codeExpiryTitle: "Validez del código",
    remainingTime: "Tiempo restante: {time}",
    expiredMessage: "Caducado. Solicita un nuevo código.",
    timeLimitMessage: "Introduce en 24 horas",
    expiredResendMessage: "El código ha caducado. Solicita uno nuevo."
  },
  alert: {
    emailRequired: "Introduce tu correo",
    codeRequired: "Introduce el código de verificación",
    newPasswordRequired: "Introduce la nueva contraseña",
    codeSent: "Se ha enviado un código a tu correo",
    passwordResetSuccess: "La contraseña se ha restablecido correctamente",
    passwordUpdated: "¡Contraseña actualizada correctamente!",
    codeExpired: "Caducado",
    authErrors: {
      notAuthorized: "El correo o la contraseña no son correctos",
      userNotConfirmed: "La cuenta no está confirmada. Completa la verificación por correo",
      userNotFound: "Usuario no encontrado",
      passwordResetRequired: "Se requiere restablecer la contraseña",
      invalidParameter: "Parámetro inválido",
      tooManyRequests: "Demasiadas solicitudes. Inténtalo más tarde",
      signInFailed: "Error al iniciar sesión"
    },
    passwordResetErrors: {
      codeMismatch: "El código no es válido. Inténtalo de nuevo.",
      expiredCode: "El código ha caducado. Solicita uno nuevo.",
      invalidPassword: "Contraseña inválida. Revisa los requisitos.",
      limitExceeded: "Se alcanzó el límite. Inténtalo más tarde.",
      genericError: "Ha ocurrido un error. Inténtalo de nuevo."
    }
  }
};

export default es;