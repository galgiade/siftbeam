export default {
  "table": {
    "id": "ID",
    "userName": "Nombre de usuario",
    "policyName": "Nombre de política",
    "usageAmountBytes": "Uso",
    "status": "Estado",
    "errorDetail": "Error",
    "createdAt": "Fecha de inicio",
    "updatedAt": "Fecha de actualización",
    "download": "Descargar",
    "aiTraining": "Entrenamiento IA",
    "delete": "Eliminar",
    "ariaLabel": "Tabla de historial de procesamiento de datos"
  },
  "status": {
    "in_progress": "En progreso",
    "success": "Completado",
    "failed": "Fallido",
    "canceled": "Cancelado",
    "deleted": "Eliminado",
    "delete_failed": "Error al eliminar"
  },
  "notification": {
    "uploadSuccess": "Carga de archivo completada. El procesamiento de datos comenzará.",
    "uploadError": "Error en la carga.",
    "uploadProcessingError": "Ocurrió un error durante el procesamiento de la carga.",
    "uploadFailed": "Error en la carga del archivo. Por favor, inténtelo de nuevo.",
    "fetchFailed": "Error al obtener datos.",
    "aiTrainingChanged": "Se ha cambiado el permiso de entrenamiento de IA.",
    "deleteCompleted": "Eliminación de archivo completada.",
    "uploadCompleted": "Carga completada.",
    "uploadFailedGeneric": "Error en la carga.",
    "dataFetchFailed": "Error al obtener datos.",
    "notificationSent": "Correo de notificación enviado exitosamente.",
    "notificationFailed": "Error al enviar notificación.",
    "notificationError": "Ocurrió un error al enviar la notificación.",
    "dataUpdated": "Datos actualizados exitosamente."
  },
  "filter": {
    "userName": {
      "placeholder": "Buscar por nombre de usuario",
      "ariaLabel": "Búsqueda por nombre de usuario"
    },
    "policyName": {
      "placeholder": "Buscar por nombre de política",
      "ariaLabel": "Búsqueda por nombre de política"
    },
    "dateRange": {
      "label": "Rango de fechas",
      "startDate": {
        "placeholder": "Fecha de inicio",
        "ariaLabel": "Selección de fecha de inicio"
      },
      "endDate": {
        "placeholder": "Fecha de fin",
        "ariaLabel": "Selección de fecha de fin"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "Uso mínimo",
      "placeholder": "Mín",
      "ariaLabel": "Uso mínimo"
    },
    "maxUsage": {
      "label": "Uso máximo",
      "placeholder": "Máx",
      "ariaLabel": "Uso máximo"
    },
    "reset": "Restablecer filtros",
    "rangeSeparator": "~",
    "refresh": "Actualizar datos",
    "deleteSelected": "Eliminar elementos seleccionados"
  },
  "policy": {
    "select": "Seleccionar política",
    "none": "No se han creado políticas.",
    "create": "Crear política",
    "noPolicies": "No se han creado políticas.",
    "createPolicy": "Crear política"
  },
  "deleteDialog": {
    "title": "Confirmación de eliminación",
    "warn1": "Los archivos seleccionados serán eliminados permanentemente.",
    "warn2": "Una vez eliminados, los archivos procesados no se pueden descargar.",
    "warn3": "Además, no se pueden usar para entrenamiento de IA.",
    "warn4": "Esta acción no se puede deshacer. Por favor, tenga cuidado.",
    "confirm": "¿Está seguro de que desea eliminar? Por favor, escriba 'ELIMINAR'.",
    "cancel": "Cancelar",
    "delete": "Eliminar"
  },
  "limitUsage": {
    "title": "Estado de límite de uso",
    "status": {
      "normal": "Normal",
      "warning": "Advertencia",
      "exceeded": "Excedido"
    },
    "current": "Actual:",
    "limit": "Límite:",
    "noLimit": "Sin límite",
    "exceedAction": {
      "notify": "Notificar",
      "restrict": "Restringir"
    },
    "testNotification": "Enviar notificación de prueba",
    "limitTypes": {
      "usage": "Límite de uso",
      "amount": "Límite de cantidad"
    },
    "unknownCompany": "Empresa desconocida"
  },
  "tableEmpty": "No hay historial de procesamiento de datos.",
  "pagination": {
    "prev": "Anterior",
    "next": "Siguiente"
  },
  "displayCount": "Mostrando {shown} de {total} (Todos {all})"
} as const;


