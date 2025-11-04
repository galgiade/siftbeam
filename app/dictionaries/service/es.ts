import type { ServiceLocale } from './ServiceLocale.d.ts';

const es: ServiceLocale = {
  page: {
    title: "Servicios",
    description:
      "Seleccione una política, cargue archivos y ejecute el procesamiento. Los datos procesados se almacenan gratis durante un año.",
    loading: "Cargando..."
  },
  error: {
    title: "Se produjo un error",
    loginRequired: "Es necesario iniciar sesión.",
    processingHistoryFetchFailed: "No se pudo obtener el historial de procesamiento.",
    policiesFetchFailed: "No se pudieron obtener las políticas.",
    usageLimitsFetchFailed: "No se pudieron obtener los límites de uso.",
    pageLoadFailed: "No se pudo cargar la página de servicios.",
    suggestion1: "Vuelva a cargar la página.",
    suggestion2: "Si el problema continúa, comuníquese con el soporte."
  },
  limits: {
    notifyLimit: {
      title: "Límites de notificación",
      limitValue: "Valor límite:",
      exceedAction: "Acción al exceder:",
      currentUsage: "Uso actual:",
      notSet: "No hay límites de notificación configurados",
      currentUsageLabel: "Uso actual:",
      settingsCount: "Límites de notificación configurados: {count}",
      dataLimit: "Límite de datos: {value} {unit} ({bytes})",
      amountLimit: "Límite de monto: ${amount}",
      noLimitValue: "No se definió un valor límite",
      amountConversionNote:
        "Nota: El límite de monto se muestra convertido a uso de datos (tarifa de procesamiento: $0.00001/Byte, incluye 1 año de almacenamiento)."
    },
    restrictLimit: {
      title: "Límites de suspensión",
      limitValue: "Valor límite:",
      exceedAction: "Acción al exceder:",
      currentUsage: "Uso actual:",
      notSet: "No hay límites de suspensión configurados",
      currentUsageLabel: "Uso actual:",
      settingsCount: "Límites de suspensión configurados: {count}",
      dataLimit: "Límite de datos: {value} {unit} ({bytes})",
      amountLimit: "Límite de monto: ${amount}",
      noLimitValue: "No se definió un valor límite",
      amountConversionNote:
        "Nota: El límite de monto se muestra convertido a uso de datos (tarifa de procesamiento: $0.00001/Byte, incluye 1 año de almacenamiento)."
    },
    perMonth: "/mes",
    notifyAction: "Notificar",
    restrictAction: "Suspender"
  },
  policySelection: {
    title: "Selección de políticas",
    label: "Seleccione una política de procesamiento",
    placeholder: "Seleccione una política",
    noPolicies: "No hay políticas disponibles"
  },
  fileUpload: {
    title: "Carga de archivos",
    selectPolicyFirst: "Seleccione primero una política",
    noPoliciesAvailable: "No hay políticas disponibles",
    dragAndDrop: "Arrastre y suelte archivos",
    orClickToSelect: "o haga clic para seleccionar",
    maxFiles: "Hasta {max} archivos, cada uno de hasta 100 MB",
    supportedFormats: "Formatos admitidos: use los formatos especificados en {formats}",
    selectedFiles: "Archivos seleccionados ({count}/{max})",
    deleteAll: "Eliminar todo",
    fileSizeLimit: "{name} es demasiado grande. Seleccione un archivo de 100 MB o menos.",
    pending: "Pendiente",
    uploading: "Cargando",
    completed: "Completado",
    error: "Error",
    startProcessing: "Iniciar procesamiento",
    processing: "Iniciando procesamiento...",
    uploadComplete: "Carga completa",
    uploadCompletedMessage: "¡Se cargaron {count} archivos y se inició el procesamiento de IA!",
    uploadNotAllowed: "Carga no permitida",
    notifyLimitReached: "Se alcanzó el límite de notificación",
    notifyLimitReachedMessage: "Se alcanzó el límite de notificación ({limit}). Se enviaron {count} correos de notificación."
  },
  table: {
    id: "ID",
    userName: "Nombre de usuario",
    policyName: "Nombre de la política",
    usageAmountBytes: "Uso",
    status: "Estado",
    errorDetail: "Error",
    createdAt: "Fecha de inicio",
    updatedAt: "Fecha de actualización",
    download: "Descargar",
    aiTraining: "Uso de IA",
    delete: "Eliminar",
    ariaLabel: "Tabla del historial de procesamiento de datos"
  },
  status: {
    in_progress: "En progreso",
    success: "Completado",
    failed: "Fallido",
    canceled: "Cancelado",
    deleted: "Eliminado",
    delete_failed: "Error al eliminar"
  },
  notification: {
    uploadSuccess: "La carga del archivo se completó. El procesamiento de datos comenzará.",
    uploadError: "La carga falló.",
    uploadProcessingError: "Ocurrió un error durante el procesamiento de la carga.",
    uploadFailed: "La carga del archivo falló. Intente nuevamente.",
    fetchFailed: "Error al obtener los datos.",
    aiTrainingChanged: "Se cambió el permiso de entrenamiento de IA.",
    deleteCompleted: "Se completó la eliminación del archivo.",
    uploadCompleted: "Carga completada.",
    uploadFailedGeneric: "La carga falló.",
    dataFetchFailed: "Error al obtener los datos.",
    notificationSent: "Se envió el correo de notificación.",
    notificationFailed: "No se pudo enviar la notificación.",
    notificationError: "Ocurrió un error al enviar la notificación.",
    dataUpdated: "Datos actualizados."
  },
  filter: {
    userName: {
      placeholder: "Buscar por nombre de usuario",
      ariaLabel: "Búsqueda por nombre de usuario"
    },
    policyName: {
      placeholder: "Buscar por nombre de política",
      ariaLabel: "Búsqueda por nombre de política"
    },
    dateRange: {
      label: "Rango de fechas",
      startDate: {
        placeholder: "Fecha de inicio",
        ariaLabel: "Selección de fecha de inicio"
      },
      endDate: {
        placeholder: "Fecha de fin",
        ariaLabel: "Selección de fecha de fin"
      },
      separator: "~"
    },
    minUsage: {
      label: "Uso mínimo",
      placeholder: "Mín",
      ariaLabel: "Uso mínimo"
    },
    maxUsage: {
      label: "Uso máximo",
      placeholder: "Máx",
      ariaLabel: "Uso máximo"
    },
    reset: "Restablecer filtros",
    rangeSeparator: "~",
    refresh: "Actualizar datos",
    deleteSelected: "Eliminar elementos seleccionados"
  },
  policy: {
    select: "Seleccionar política",
    none: "No se han creado políticas.",
    create: "Crear política",
    noPolicies: "No se han creado políticas.",
    createPolicy: "Crear política"
  },
  deleteDialog: {
    title: "Confirmación de eliminación",
    warn1: "Los archivos seleccionados se eliminarán permanentemente.",
    warn2: "Una vez eliminados, los archivos procesados no podrán descargarse.",
    warn3: "Tampoco podrán utilizarse para entrenamiento de IA.",
    warn4: "Esta acción no se puede deshacer. Por favor, tenga cuidado.",
    confirm: "¿Seguro que desea eliminar? Escriba \"DELETE\".",
    cancel: "Cancelar",
    delete: "Eliminar"
  },
  limitUsage: {
    title: "Estado del límite de uso",
    status: {
      normal: "Normal",
      warning: "Advertencia",
      exceeded: "Excedido"
    },
    current: "Actual:",
    limit: "Límite:",
    noLimit: "Sin límite",
    exceedAction: {
      notify: "Notificar",
      restrict: "Restringir"
    },
    testNotification: "Enviar notificación de prueba",
    limitTypes: {
      usage: "Límite de uso",
      amount: "Límite de monto"
    },
    unknownCompany: "Empresa desconocida"
  },
  tableEmpty: "No hay historial de procesamiento de datos.",
  pagination: {
    prev: "Anterior",
    next: "Siguiente"
  },
  displayCount: "Mostrando {shown} de {total} (Total {all})",
  processingHistory: {
    title: "Historial de procesamiento",
    count: "({count} elementos)",
    refresh: "Actualizar",
    empty: "No hay historial de procesamiento.",
    emptyDescription: "Cargue archivos y comience el procesamiento para ver el historial aquí.",
    noDownloadableFiles: "No hay archivos descargables.",
    noOutputFiles: "No hay archivos de salida descargables.",
    downloadFailed: "Error al descargar.",
    aiTrainingUpdateFailed: "No se pudo actualizar el uso de entrenamiento de IA.",
    fileExpiredTooltip: "El archivo se eliminó porque superó el período de almacenamiento (1 año).",
    unknownUser: "Usuario desconocido",
    allow: "Permitir",
    deny: "Rechazar",
    columns: {
      policy: "Política",
      user: "Usuario",
      status: "Estado",
      startTime: "Hora de inicio",
      fileSize: "Tamaño de archivo",
      aiTraining: "Uso de IA",
      errorDetail: "Detalle del error",
      download: "Descargar"
    }
  }
};

export default es;