import type { APIKeyLocale } from './apiKey.d';

const es: APIKeyLocale = {
  title: 'Gestión de Claves API',
  actions: {
    create: 'Crear',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    back: 'Volver',
  },
  table: {
    apiName: 'Nombre API',
    description: 'Descripción',
    createdAt: 'Creado en',
    endpoint: 'Endpoint',
    actions: 'Acciones',
  },
  modal: {
    title: 'Editar Clave API',
    apiName: 'Nombre API',
    description: 'Descripción',
  },
  messages: {
    noData: 'Sin datos',
    updateFailed: 'Error al actualizar',
    deleteFailed: 'Error al eliminar',
    confirmDelete: '¿Eliminar esta clave API? Esta acción no se puede deshacer.',
    createFailed: 'Error al crear',
    idRequired: 'id es requerido',
    deleteSuccess: 'Eliminado exitosamente',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME no está configurado',
    apiGatewayDeleteFailed: 'Error al eliminar la clave de API Gateway',
    idAndApiNameRequired: 'id y apiName son requeridos',
    updateSuccess: 'Actualizado exitosamente',
  },
  alerts: {
    adminOnlyCreate: 'Solo los administradores pueden crear',
    adminOnlyEdit: 'Solo los administradores pueden editar',
    adminOnlyDelete: 'Solo los administradores pueden eliminar',
  },
  create: {
    title: 'Emitir Clave API',
    fields: {
      apiName: 'Nombre API',
      apiDescription: 'Descripción API',
      policy: 'Tipo API (Política)',
    },
    submit: 'Emitir Clave API',
    issuedNote: 'La clave se muestra solo una vez. Guárdela de forma segura.',
    endpointLabel: 'Endpoint de Carga',
    instructions: 'Configure lo siguiente en su dispositivo.',
    apiKeyHeaderLabel: 'Clave API (encabezado x-api-key)',
    uploadExampleTitle: 'Ejemplo de carga (PowerShell / PNG)',
    csvNote: 'Para CSV, establezca Content-Type como text/csv. Ajuste para otros tipos de archivo.',
    filePathNote: 'Especifique la ruta a su archivo',
  },
};

export default es;