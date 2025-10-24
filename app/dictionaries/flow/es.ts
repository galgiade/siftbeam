import type { FlowLocale } from './flow.d';

const es: FlowLocale = {
  flow: {
    hero: {
      badge: 'Flujo',
      title: 'Primeros pasos – Cómo empezar',
      subtitle:
        'Desde registrarte hasta descargar los datos procesados, en 5 pasos sencillos.',
    },
    steps: {
      step1: {
        badge: 'PASO 1',
        tag: 'Empezar ahora',
        title: 'Registro',
        description:
          'Crea tu cuenta con correo y contraseña. La autenticación se gestiona de forma segura.',
      },
      step2: {
        badge: 'PASO 2',
        tag: 'Nueva orden',
        title: 'Levantamiento de requerimientos',
        description:
          'Cuéntanos tus necesidades de análisis en la página de nueva orden: objetivos, datos a usar y formato de salida.',
      },
      step3: {
        badge: 'PASO 3',
        tag: 'Aproximadamente 2 semanas',
        title: 'Configuración del procesamiento',
        description:
          'Diseñamos el flujo óptimo de procesamiento. Puedes ver el progreso en el panel.',
      },
      step4: {
        badge: 'PASO 4',
        tag: 'Tras la configuración',
        title: 'Elegir procesamiento y subir',
        description:
          'Selecciona el procesamiento deseado y sube los archivos. Se admiten archivos grandes.',
      },
      step5: {
        badge: 'PASO 5',
        tag: 'Notificación automática',
        title: 'Completar y descargar',
        description:
          'Serás notificado cuando finalice el procesamiento. Descarga los resultados; puedes reejecutar si es necesario.',
      },
    },
    notice:
      'El plazo es orientativo y puede variar según la complejidad y el volumen de datos. Tu contacto te guiará.',
    cta: {
      title: 'Empezar ahora',
      description: 'Crea una cuenta y solicita tu análisis preferido.',
      button: 'Ir al registro',
    },
  },
};

export default es;
