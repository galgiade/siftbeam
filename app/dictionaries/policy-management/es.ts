export default {
  "label": {
    "policyList": "Lista de políticas",
    "policyNotRegistered": "No hay políticas registradas",
    "policyName": "Nombre de la política",
    "policyNamePlaceholder": "Nombre de la política",
    "description": "Descripción de la política",
    "descriptionPlaceholder": "Descripción de la política",
    "allowedFileTypes": "Tipos de archivo permitidos:",
    "selectFileTypes": "Seleccione tipos de archivo (múltiples)",
    "fileTypes": {
      "image/jpeg": "Imagen JPEG",
      "image/png": "Imagen PNG",
      "image/gif": "Imagen GIF",
      "image/webp": "Imagen WebP",
      "application/pdf": "Archivo PDF",
      "text/csv": "Archivo CSV",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Archivo de Excel (.xlsx)",
      "application/vnd.ms-excel": "Archivo de Excel (.xls)",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Archivo de Word (.docx)",
      "application/msword": "Archivo de Word (.doc)",
      "text/plain": "Archivo de texto",
      "application/json": "Archivo JSON",
      "application/zip": "Archivo ZIP"
    }
  },
  "alert": {
    "required": "Este campo es obligatorio",
    "invalidEmail": "Introduzca un correo electrónico válido",
    "fileTypeRequired": "Seleccione al menos un tipo de archivo",
    "adminOnlyEditMessage": "Solo los administradores pueden editar. No tiene permisos.",
    "adminOnlyCreateMessage": "Solo los administradores pueden crear políticas. Contacte con el administrador.",
    "updateSuccess": "Política actualizada exitosamente",
    "updateFailed": "Error al actualizar la política",
    "validationError": "Por favor, verifique su entrada"
  },
  "analysis": {
    "title": "Análisis",
    "description": "Resultados de evaluación Modelo × Conjunto de datos",
    "noDataMessage": "No hay datos de análisis disponibles",
    "noDataForPolicyMessage": "No hay datos de análisis disponibles para la política seleccionada",
    "paginationAriaLabel": "Paginación",
    "displayCount": "Mostrar",
    "columns": {
      "evaluationDate": "Fecha de evaluación",
      "policy": "Política",
      "accuracy": "Precisión",
      "defectDetectionRate": "Tasa de detección de defectos",
      "reliability": "Confiabilidad",
      "responseTime": "Tiempo de respuesta",
      "stability": "Estabilidad",
      "actions": "Acciones"
    },
    "actions": {
      "view": "Ver"
    }
  }
} as const;


