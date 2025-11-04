import type { SupportCenterLocale } from './createSupportCenter.d.ts';

const es: SupportCenterLocale = {
  label: {
    pageTitle: "Centro de soporte",
    supportRequestList: "Lista de solicitudes de soporte",
    newRequest: "Nueva solicitud",
    noRequests: "No hay solicitudes de soporte",
    issueType: "Tipo de problema",
    issueTypePlaceholder: "Seleccione el tipo de problema",
    technical: "Problema técnico",
    account: "Problema de cuenta",
    billing: "Problema de pago",
    other: "Otro",
    subject: "Asunto",
    subjectPlaceholder: "Introduzca el asunto",
    description: "Detalles del problema",
    descriptionPlaceholder: "Describa los detalles del problema",
    cancel: "Cancelar",
    submit: "Enviar",
    submitting: "Enviando...",
    status: "Estado",
    creator: "Creador",
    createdAt: "Creado",
    updatedAt: "Actualizado",
    statusOpen: "Abierto",
    statusInProgress: "En progreso",
    statusClosed: "Resuelto",
    back: "← Volver",
    reply: "Responder",
    replyContent: "Contenido de la respuesta",
    inquiryContent: "Contenido de la consulta",
    attachedFiles: "Archivos adjuntos",
    messagePlaceholder: "Introduzca un mensaje",
    markResolved: "Marcar como resuelto",
    markUnresolved: "Marcar como no resuelto",
    staff: "Personal",
    problemType: "Tipo de problema",
    technicalIssue: "Problema técnico",
    accountRelated: "Relacionado con la cuenta",
    billingRelated: "Relacionado con facturación",
    deleteFile: "Eliminar archivo",
    fileRemoved: "Archivo eliminado"
  },
  alert: {
    requestReceived: "Hemos recibido su consulta. Espere el contacto del personal.",
    submitFailed: "No se pudo enviar la solicitud de soporte",
    subjectRequired: "Por favor, introduzca un asunto",
    descriptionRequired: "Por favor, introduzca una descripción",
    messageRequired: "Introduzca un mensaje",
    supportRequestError: "Error al obtener la solicitud de soporte:"
  }
};

export default es;