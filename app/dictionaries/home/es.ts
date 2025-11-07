const es = {
  hero: {
    title: "siftbeam",
    subtitle: "Una plataforma para el procesamiento y gestión eficiente de datos",
    contact: "Contáctanos",
    buttons: {
      howTo: "Ver cómo funciona",
      pricing: "Ver precios",
    }
  },
  features: {
    title: "Tres funcionalidades principales de la plataforma de procesamiento de datos",
    dataAnalysis: {
      title: "Gestión flexible de datos",
      description: "Carga y gestiona archivos con controles basados en políticas. Rastrea el historial de procesamiento en detalle.",
      points: [
        "Selección de políticas y cargas masivas",
        "Barra de uso mensual y alertas de exceso",
        "Filtros por usuario/política/fecha/uso",
        "Descarga ZIP masiva, eliminar, alternar permiso de aprendizaje",
      ]
    },
    anomalyDetection: {
      title: "Monitoreo y control de uso",
      description: "Monitorea el uso de datos en tiempo real y ejecuta notificaciones o restricciones automáticas según los límites configurados.",
      points: [
        "Dos modos: notificar o restringir",
        "Umbrales basados en uso o costo",
        "Notificar o restringir automáticamente al excederse",
        "Mostrar automáticamente límites adecuados según el uso actual",
      ]
    },
    customAI: {
      title: "Análisis de resultados de procesamiento e informes",
      description: "Revisa los datos de análisis detallados de los resultados de procesamiento y utilízalos para la optimización operativa.",
      points: [
        "Revisa las métricas detalladas de los resultados de procesamiento",
        "Indicadores de rendimiento operativo como latencia",
        "Ver y validar informes detallados",
        "Filtrar y ordenar por política",
      ]
    }
  },
  steps: {
    title: "Comienza en 3 pasos sencillos",
    step1: {
      title: "Configuración de política y carga de datos",
      description: "Crea políticas que definan los formatos de archivo permitidos, luego carga datos por arrastrar y soltar o API. La autenticación de dos factores garantiza la seguridad."
    },
    step2: {
      title: "Ejecución automatizada del procesamiento",
      description: "Los datos cargados se procesan automáticamente según la política seleccionada. Los resultados del procesamiento se almacenan durante un año."
    },
    step3: {
      title: "Gestión del historial de procesamiento y evaluación del rendimiento",
      description: "Revisa el historial de procesamiento con un panel intuitivo. Monitorea las métricas de rendimiento del modelo de procesamiento en tiempo real para operaciones óptimas. Pago por uso optimiza costes."
    }
  },
  cta: {
    title: "Comienza el procesamiento eficiente de datos ahora",
    description: "Define reglas de procesamiento con políticas y gestiona grandes volúmenes de datos de manera eficiente. El precio por uso elimina costos innecesarios.",
    button: "Contáctanos",
    secondaryButton: "Primero ver los pasos de configuración"
  }
} as const;

export default es;


