import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const es: UserProfileLocale = {
  alert: {
    updateSuccess: "Información del usuario actualizada exitosamente.",
    updateFail: "Error al actualizar la información del usuario.",
    updateError: "Se produjo un error durante la actualización.",
    fieldUpdateSuccess: "{field} se ha actualizado correctamente.",
    fieldUpdateFail: "Error al actualizar {field}.",
    emailSent: "Se ha enviado un código de confirmación a su nueva dirección de correo electrónico.",
    emailUpdateSuccess: "Dirección de correo electrónico actualizada exitosamente.",
    emailUpdateFail: "Error al actualizar la dirección de correo electrónico.",
    dbUpdateFail: "Error al actualizar la base de datos.",
    dbUpdateError: "Error en la actualización de la base de datos",
    confirmFail: "El código de confirmación es incorrecto o la actualización de la base de datos falló.",
    invalidConfirmationCode: "El código de confirmación es incorrecto. Por favor ingrese el código de 6 dígitos correcto.",
    expiredConfirmationCode: "El código de confirmación ha expirado. Por favor solicite un nuevo código.",
    noEmailChange: "Sin cambios en la dirección de correo electrónico.",
    invalidEmailFormat: "Formato de correo electrónico inválido. Por favor ingrese una dirección de correo electrónico válida.",
    noChange: "Sin cambios en el nombre de usuario.",
    invalidConfirmationCodeFormat: "Por favor ingrese un código de confirmación de 6 dígitos.",
    verificationCodeNotFound: "Código de verificación no encontrado o expirado",
    remainingAttempts: "Intentos restantes",
    verificationCodeStoreFailed: "Error al almacenar el código de verificación. Por favor, verifique los permisos de IAM.",
    codeStoreFailed: "Error al guardar el código.",
    adminOnlyEdit: "Solo los administradores pueden editar este campo.",
    validEmailRequired: "Introduzca una dirección de correo válida."
  },
  label: {
    title: "Información del usuario",
    userName: "Nombre de usuario",
    department: "Departamento",
    position: "Posición",
    email: "Dirección de correo electrónico",
    locale: "Idioma",
    role: "Rol",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    adminOnly: "(Solo admin)",
    readOnly: "(No modificable)",
    editableFields: "Editable: Nombre de usuario, Idioma",
    adminOnlyFields: "Solo admin: Correo, Departamento, Puesto",
    allFieldsEditable: "Todos los campos son editables",
    newEmailSent: "Código de verificación enviado a \"{email}\".",
    roleAdmin: "Administrador",
    roleUser: "Usuario",
    lastAdminRestriction: "El cambio de rol está restringido si es el último administrador",
    lastAdminNote: "※ Si solo hay un administrador en la organización, el rol no se puede cambiar a usuario regular.",
    generalUserPermission: "Permiso de Usuario General",
    adminPermission: "Permiso de Administrador",
    verifyAndUpdate: "Verificar y Actualizar",
    verificationCodePlaceholder: "Código de verificación (6 dígitos)"
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


