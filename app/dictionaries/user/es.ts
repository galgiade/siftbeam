// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const es = {
  alert: {
    updateSuccess: "Información del usuario actualizada exitosamente.",
    updateFail: "Error al actualizar la información del usuario.",
    emailSent: "Se ha enviado un código de confirmación a su nueva dirección de correo electrónico.",
    emailUpdateSuccess: "Dirección de correo electrónico actualizada exitosamente.",
    emailUpdateFail: "Error al actualizar la dirección de correo electrónico.",
    dbUpdateFail: "Error al actualizar la base de datos.",
    dbUpdateError: "Error en la actualización de la base de datos",
    confirmFail: "El código de confirmación es incorrecto o la actualización de la base de datos falló.",
    invalidConfirmationCode: "El código de confirmación es incorrecto. Por favor ingrese el código de 6 dígitos correcto.",
    expiredConfirmationCode: "El código de confirmación ha expirado. Por favor solicite un nuevo código.",
    userAlreadyExists: "Esta dirección de correo electrónico ya está registrada. Por favor use una dirección de correo electrónico diferente.",
    usernameExists: "Este nombre de usuario ya está en uso. Por favor use un nombre de usuario diferente.",
    noEmailChange: "Sin cambios en la dirección de correo electrónico.",
    invalidEmailFormat: "Formato de correo electrónico inválido. Por favor ingrese una dirección de correo electrónico válida.",
    emailChangeCancelled: "El cambio de dirección de correo electrónico ha sido cancelado.",
    emailChangeCancelFailed: "Error al cancelar el cambio de dirección de correo electrónico.",
    emailChangeReset: "El cambio de dirección de correo electrónico no confirmado ha sido restablecido.",
    noChange: "Sin cambios en el nombre de usuario.",
    resendLimitExceeded: "Se ha excedido el límite de reenvío. Por favor intente más tarde.",
    resendFailed: "Error al reenviar el código de confirmación. Por favor intente de nuevo.",
    invalidConfirmationCodeFormat: "Por favor ingrese un código de confirmación de 6 dígitos.",
    confirmationAttemptLimitExceeded: "Se ha excedido el límite de intentos de confirmación. Por favor intente más tarde.",
    authenticationFailed: "La autenticación falló. Por favor inicie sesión nuevamente e intente.",
    invalidUsernameFormat: "Formato de nombre de usuario inválido. Por favor ingrese un nombre de usuario válido.",
    usernameChangeLimitExceeded: "Se ha excedido el límite de cambio de nombre de usuario. Por favor intente más tarde.",
    atLeastOneFieldRequired: "Al menos un campo debe ser actualizado",
    verificationCodeNotFound: "Código de verificación no encontrado o expirado",
    remainingAttempts: "Intentos restantes",
    verificationCodeStoreFailed: "Error al almacenar el código de verificación. Por favor, verifique los permisos de IAM."
  },
  label: {
    title: "Información del usuario",
    userName: "Nombre de usuario",
    department: "Departamento",
    position: "Posición",
    email: "Dirección de correo electrónico"
  },
  modal: {
    modalTitle: "Confirmación de correo electrónico",
    description: "Por favor ingrese el código de confirmación enviado a su nueva dirección de correo electrónico ({email}).",
    codeLabel: "Código de confirmación",
    cancel: "Cancelar",
    confirm: "Confirmar",
    resend: "Reenviar",
    verifying: "Verificando..."
  }
}

export default es;


