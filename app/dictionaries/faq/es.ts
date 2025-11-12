import type FAQLocale from './faq.d';

const es: FAQLocale = {
  title: 'Preguntas Frecuentes (FAQ)',
  description: 'Encuentre respuestas a preguntas comunes sobre el servicio de procesamiento de datos siftbeam.',
  categories: {
    service: {
      title: 'Descripción del Servicio',
      items: [
        {
          question: '¿Qué es siftbeam?',
          answer: 'siftbeam es un servicio B2B de procesamiento de datos para empresas. Proporcionamos flujos de trabajo de procesamiento de datos personalizables para cada cliente, permitiendo la transformación, procesamiento y gestión automatizados de archivos en una infraestructura en la nube segura.'
        },
        {
          question: '¿Para qué tipos de empresas es adecuado?',
          answer: [
            'Ideal para:',
            '• Empresas que requieren procesamiento de datos personalizado',
            '• Compañías con necesidades complejas de transformación de datos',
            '• Organizaciones que buscan soluciones escalables de procesamiento de datos',
            '• Empresas que necesitan flujos de trabajo de datos seguros basados en la nube'
          ]
        },
        {
          question: '¿En qué se diferencia siftbeam de otros servicios de procesamiento de datos?',
          answer: [
            'Características clave:',
            '• Personalización por cliente: A diferencia de las herramientas genéricas, siftbeam ofrece flujos de trabajo completamente personalizables',
            '• Fiabilidad de nivel empresarial: Construido sobre infraestructura en la nube probada',
            '• Sin bloqueo de proveedor: Formatos de datos estándar y APIs abiertas',
            '• Precios transparentes: Pague solo por lo que usa'
          ]
        }
      ]
    },
    features: {
      title: 'Características y Especificaciones',
      items: [
        {
          question: '¿Qué características están disponibles?',
          answer: [
            'Características principales:',
            '• Gestión flexible de datos: Carga y gestión de archivos basada en políticas',
            '• Monitoreo y control de uso: Monitoreo en tiempo real con notificaciones y restricciones automáticas',
            '• Análisis de resultados de procesamiento: Métricas detalladas e informes para optimización operativa',
            '• Almacenamiento seguro de archivos: Procesamiento de archivos cifrados con retención automática de 1 año',
            '• Soporte multilingüe: Disponible en 9 idiomas (japonés, inglés, chino, coreano, francés, alemán, español, portugués, indonesio)'
          ]
        },
        {
          question: '¿Cuánto tiempo se almacenan los datos?',
          answer: 'Los datos cargados se almacenan automáticamente durante 1 año después del procesamiento. Los datos se eliminan automáticamente después de 1 año. No se aplican tarifas de almacenamiento adicionales.'
        },
        {
          question: '¿Qué formatos de datos son compatibles?',
          answer: 'Admitimos los principales formatos de datos, incluidos CSV, JSON y más. Como ofrecemos personalización por cliente, contáctenos si necesita soporte para un formato específico.'
        },
        {
          question: '¿Qué tan personalizable es el procesamiento de datos?',
          answer: 'Totalmente personalizable para cada cliente. Puede crear flujos de trabajo de procesamiento de datos complejos y definir reglas de procesamiento de manera flexible utilizando políticas.'
        }
      ]
    },
    pricing: {
      title: 'Precios y Pago',
      items: [
        {
          question: '¿Cuál es la estructura de precios?',
          answer: [
            'Precios de pago por uso:',
            '• Tarifa de procesamiento de datos: $0.00001 por byte (0.001 centavos por byte)',
            '• Almacenamiento de 1 año incluido: Sin cargos adicionales',
            '• Sin costos iniciales: Sin tarifas de configuración ni cargos mínimos',
            '• Facturación mensual: Uso del 1 al último día del mes, facturado el 1 del mes siguiente',
            '',
            'Ejemplos de precios:',
            '• Archivo pequeño (100B): $0.001',
            '• Archivo grande (2MB × 3 archivos = 6,291,456B): $62.91'
          ]
        },
        {
          question: '¿Qué métodos de pago están disponibles?',
          answer: 'Solo pago con tarjeta de crédito (a través de Stripe). La moneda es USD. Los cargos mensuales se facturan automáticamente el 1 de cada mes por el uso del mes anterior.'
        },
        {
          question: '¿Hay una prueba gratuita?',
          answer: 'Actualmente no ofrecemos una prueba gratuita. Con nuestros precios de pago por uso, solo paga por lo que usa. No hay tarifas mínimas de uso.'
        },
        {
          question: '¿Pueden cambiar los precios?',
          answer: 'Los precios pueden cambiar con aviso previo razonable. Consulte la página de precios para obtener la información más reciente.'
        }
      ]
    },
    security: {
      title: 'Seguridad y Cumplimiento',
      items: [
        {
          question: '¿Cómo se garantiza la seguridad de los datos?',
          answer: [
            'Implementamos las siguientes medidas de seguridad:',
            '• Autenticación: Sistema de autenticación seguro con soporte de autenticación multifactor (MFA)',
            '• Cifrado: TLS para datos en tránsito, AES-256 para datos en reposo',
            '• Control de acceso: Control de acceso basado en roles según el principio de privilegio mínimo',
            '• Registros de auditoría: Registro de auditoría a prueba de manipulaciones',
            '• Gestión de vulnerabilidades: Monitoreo continuo de seguridad y respuesta a vulnerabilidades'
          ]
        },
        {
          question: '¿Dónde se almacenan los datos?',
          answer: 'Los datos se almacenan en una infraestructura en la nube de nivel empresarial. Todos los datos están cifrados y se gestionan bajo controles de acceso estrictos.'
        },
        {
          question: '¿Qué pasa con el cumplimiento?',
          answer: [
            'Cumplimos con las siguientes regulaciones de protección de datos:',
            '• RGPD: Cumple con el Reglamento General de Protección de Datos de la UE',
            '• CCPA/CPRA: Cumple con las leyes de privacidad de California',
            '• Ley japonesa: Cumple con la Ley de Protección de Información Personal',
            '• Transferencia internacional de datos: Medidas de protección apropiadas como las Cláusulas Contractuales Estándar (SCC) de la UE',
            '',
            'Proporcionamos una Política de Privacidad integral y un Acuerdo de Procesamiento de Datos (DPA). Consulte nuestra Política de Privacidad para obtener más detalles.'
          ]
        }
      ]
    },
    support: {
      title: 'Soporte y Otros',
      items: [
        {
          question: '¿Cómo puedo obtener soporte?',
          answer: [
            'Opciones de soporte:',
            '• Método de contacto: Soporte por chat (disponible a través del panel de servicio)',
            '• Idiomas: Soporte en 9 idiomas (japonés, inglés, chino, coreano, francés, alemán, español, portugués, indonesio)',
            '• Tiempo de respuesta: Normalmente responde dentro de 3 días hábiles',
            '• Horario comercial: Hora estándar de Japón (JST)'
          ]
        },
        {
          question: '¿Cómo empiezo?',
          answer: [
            'Comience en 3 sencillos pasos:',
            '1. Regístrese (https://siftbeam.com/es/signup/auth)',
            '2. Cargue sus archivos de datos',
            '3. Configure su flujo de trabajo de procesamiento',
            '4. Monitoree el procesamiento en tiempo real',
            '5. Descargue los resultados procesados'
          ]
        },
        {
          question: '¿Se proporciona una API?',
          answer: 'Sí, proporcionamos APIs para la carga de datos y la gestión del procesamiento. La documentación detallada y el código de muestra están disponibles después del registro.'
        }
      ]
    }
  }
};

export default es;

