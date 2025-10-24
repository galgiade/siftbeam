import type LegalDisclosuresLocale from "./legalDisclosures";

const es: LegalDisclosuresLocale = {
  title: "Avisos Legales y Términos Comerciales",
  intro: "Esta divulgación se proporciona de acuerdo con las leyes y regulaciones aplicables de protección al consumidor. ConnectTech Inc. (\"nosotros\", \"nuestro\", \"nuestra\") proporciona la siguiente información sobre nuestro servicio \"siftbeam\".",
  sections: {
    company: {
      title: "Información de la Empresa",
      items: [
        "Nombre de la empresa: ConnectTech Inc.",
        "Representante: Kazuaki Matsui",
        "Dirección: Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japón",
        "Teléfono: Disponible bajo solicitud",
        "Correo electrónico: connectechceomatsui@gmail.com",
        "Soporte: Soporte por chat (generalmente responde dentro de 3 días hábiles)",
        "Sitio web: https://siftbeam.com",
      ],
    },
    pricing: {
      title: "Precios y Tarifas del Servicio",
      items: [
        "Precios de pago por uso (Moneda: USD)",
        "Tarifa de procesamiento de datos: 0.001 centavos US por byte (incluye 1 año de almacenamiento)",
        "Los datos procesados se almacenan durante 1 año y luego se eliminan automáticamente",
        "Sin nivel gratuito, tarifa mínima de uso o costos de configuración",
        "Los precios pueden cambiar con aviso previo razonable",
      ],
    },
    payment: {
      title: "Métodos de Pago y Términos",
      items: [
        "Método de pago: Tarjeta de crédito (a través de Stripe)",
        "Ciclo de facturación: Fin de mes",
        "Fecha de pago: 5 de cada mes",
        "Redondeo: Puede ocurrir basado en la precisión de moneda de Stripe y unidades mínimas de pago",
        "Impuestos: Pueden aplicarse cargos adicionales según la ley",
        "Tarifas adicionales: Costos de conexión a Internet (responsabilidad del cliente)",
      ],
    },
    service: {
      title: "Entrega del Servicio",
      items: [
        "Disponibilidad del servicio: Inmediatamente después de la confirmación del pago",
        "Requisitos del sistema: Se recomiendan las versiones más recientes de Google Chrome, Microsoft Edge o Safari",
      ],
    },
    cancellation: {
      title: "Cancelación y Reembolsos",
      items: [
        "Cancelación disponible en cualquier momento a través de la configuración de la cuenta",
        "Después de la solicitud de cancelación, los datos del usuario se conservan hasta 90 días para cumplimiento legal, soporte y facturación",
        "Durante el período de retención, el acceso al servicio está deshabilitado y no se aplican tarifas adicionales",
        "Eliminación inmediata disponible bajo solicitud al soporte (sin tarifas de almacenamiento adicionales)",
        "Eliminación completa automática después de 90 días (la eliminación de respaldo puede requerir tiempo adicional)",
        "Debido a la naturaleza de los servicios digitales, los reembolsos no están disponibles para servicios ya proporcionados (excepto cuando lo requiera la ley)",
      ],
    },
    environment: {
      title: "Requisitos del Sistema",
      items: [
        "Se recomiendan las versiones más recientes de Google Chrome, Microsoft Edge o Safari",
        "Conexión a Internet requerida",
      ],
    },
    restrictions: {
      title: "Limitaciones de Uso",
      items: [
        "Sin limitaciones específicas",
      ],
    },
    validity: {
      title: "Período de Validez de la Solicitud",
      items: [
        "Sin período de validez específico",
      ],
    },
    specialConditions: {
      title: "Condiciones Especiales",
      items: [
        "Pruebas gratuitas y ofertas especiales sujetas a nuestros términos y condiciones",
      ],
    },
    businessHours: {
      title: "Horario Comercial y Soporte",
      items: [
        "Sin horario comercial fijo",
        "Soporte disponible solo por chat, generalmente responde dentro de 3 días hábiles",
      ],
    },
    governingLaw: {
      title: "Ley Aplicable y Jurisdicción",
      items: [
        "Regido por la ley japonesa",
        "Las disputas están sujetas a la jurisdicción exclusiva del Tribunal de Distrito de Hamamatsu (según los Términos de Servicio)",
      ],
    },
  },
  appendix: {
    lastUpdated: "21 de septiembre de 2025",
    company: {
      name: "ConnectTech Inc.",
      address: "Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japón",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default es;
