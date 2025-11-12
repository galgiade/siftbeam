import type { CommonLocale } from './common.d.ts';

const es: CommonLocale = {
  common: {
    navigation: {
      home: 'Inicio',
      about: 'Acerca de',
      pricing: 'Precios',
      contact: 'Contacto',
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar sesión',
      dashboard: 'Panel',
      flow: 'Flujo',
      announcement: 'Anuncios',
      services: 'Servicios',
      myPage: 'Mi página',
      supportCenter: 'Centro de soporte',
      faq: 'Preguntas Frecuentes',
    },
    footer: {
      title: 'siftbeam',
      description:
        'Una plataforma de análisis predictivo inteligente que libera el poder de los datos para dar forma al futuro de su negocio.',
      links: {
        terms: 'Términos de servicio',
        privacy: 'Política de privacidad',
        legalDisclosures: 'Divulgaciones legales',
        faq: 'Preguntas Frecuentes',
      },
      copyright: 'Connect Tech Inc.',
    },
    fileUploader: {
      dragAndDrop: 'Arrastrar y soltar archivos',
      or: 'o',
      selectFile: 'Seleccionar archivos',
      maxFilesAndSize: 'Máx. {maxFiles} archivos, {maxFileSize}MB cada uno',
      supportedFormats: 'Formatos compatibles: Imágenes, Videos, Audio, Documentos',
      pendingFiles: 'Pendientes ({count} archivos)',
      uploadStart: 'Iniciar carga',
      uploading: 'Cargando...',
      uploadedFiles: 'Cargados ({count} archivos)',
      uploadComplete: 'Carga completa',
      uploadError: 'Error de carga',
      uploadFailed: 'La carga falló',
      maxFilesExceeded: 'Puede cargar hasta {maxFiles} archivos.',
      fileSizeExceeded: 'El tamaño del archivo debe ser de {maxFileSize}MB o menos.\nArchivos demasiado grandes: {files}',
      oversizedFiles: 'Archivos demasiado grandes',
    },
  },
};

export default es;
