import type { CancelDeleteAccountLocale } from './cancelDeleteAccount.d.ts';

const es: CancelDeleteAccountLocale = {
  label: {
    back: "Volver",
    submit: "Enviar",
    loading: "Cargando...",
    cancelDeleteTitle: "Cancelar la solicitud de eliminación de cuenta",
    signIn: "Iniciar sesión",
    supportEmail: "connectechceomatsui@gmail.com",
    supportContact: "Si necesita soporte, póngase en contacto con el correo abajo.",
    cancelDelete: "Cancelar la solicitud de eliminación",
    accountDeleteRequested: "Se ha solicitado la eliminación de la cuenta",
    requestedUser: "Usuario solicitante",
    requestDate: "Fecha de solicitud",
    userNameNotFound: "Nombre de usuario no encontrado",
    confirmationMessage: "Se cancelará la solicitud de eliminación de cuenta.\n¿Desea continuar?"
  },
  alert: {
    authenticationFailed: "No se pudo autenticar.",
    insufficientPermissions: "Sin permisos.",
    adminRequired: "Inicie sesión con un usuario con permisos de administrador.",
    cancelSuccess: "La cancelación de la solicitud se completó.",
    cancelError: "Ocurrió un error. Inténtelo de nuevo."
  }
};

export default es;