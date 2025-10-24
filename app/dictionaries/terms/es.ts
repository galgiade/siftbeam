import type TermsLocale from "./TermsLocale";

const es: TermsLocale = {
  title: "Términos del Servicio (siftbeam)",
  intro:
    "Estos Términos del Servicio (los \"Términos\") rigen el uso de siftbeam (el \"Servicio\") proporcionado por Connect Tech Inc. (la \"Compañía\"). Al utilizar el Servicio, el usuario acepta estos Términos.",
  sections: {
    definitions: {
      title: "Definiciones",
      items: [
        "Servicio: Crea/mejora modelos de IA a partir de los datos proporcionados por el usuario, realiza predicción/agrupación/clasificación, elabora estadísticas y exporta resultados como CSV.",
        "Datos del Usuario: Datos proporcionados por los usuarios a la Compañía (datos brutos, metadatos, registros, instrucciones, etc.).",
        "Datos de Salida: Resultados generados/procesados por el Servicio (incluidas exportaciones en CSV).",
        "Modelo: Modelos de IA creados/operados/mejorados por la Compañía (características, pesos entrenados, prompts, canalizaciones, métricas).",
        "Facturación por uso: Facturación basada en volúmenes de ingesta, procesamiento y almacenamiento de datos, etc.",
      ],
    },
    scopeChanges: {
      title: "Ámbito y Cambios",
      paragraphs: [
        "Estos Términos se aplican a todas las relaciones relativas al Servicio entre la Compañía y los usuarios.",
        "La Compañía podrá revisar estos Términos y notificará los cambios materiales. El uso continuado tras la notificación implica consentimiento.",
      ],
    },
    account: {
      title: "Cuenta",
      items: [
        "Mantener la información de registro precisa y actualizada; administrar de forma segura las credenciales.",
        "La Compañía no es responsable del uso no autorizado de la cuenta salvo en casos de dolo o negligencia grave.",
      ],
    },
    services: {
      title: "Descripción del Servicio",
      paragraphs: [
        "La Compañía construye modelos de IA según las necesidades del usuario y realiza predicción/agrupación/clasificación, o elabora estadísticas.",
        "Con la provisión continua de datos, la Compañía puede mejorar los modelos utilizando dichos datos.",
        "Los resultados procesados se exportan en formatos como CSV (formato/campos/frecuencia según especificaciones separadas).",
        "Se pueden añadir/cambiar/suspender funciones; se pueden ofrecer funciones beta.",
      ],
    },
    dataHandling: {
      title: "Tratamiento de Datos",
      subsections: {
        ownership: {
          title: "Titularidad",
          items: [
            "Los derechos sobre los Datos del Usuario pertenecen a los usuarios.",
            "Los derechos sobre los Datos de Salida pertenecen en principio a los usuarios (el usuario garantiza que no infringe derechos de terceros).",
            "Los derechos de propiedad intelectual sobre modelos/algoritmos/saber hacer/plantillas pertenecen a la Compañía o a sus licenciantes.",
          ],
        },
        license: {
          title: "Licencia",
          paragraphs: [
            "Los usuarios otorgan a la Compañía un derecho mundial, gratuito y no exclusivo para usar los Datos del Usuario a fin de prestar el servicio, mejorar la calidad, entrenar/evaluar/ajustar modelos y elaborar estadísticas. Los datos personales se tratan conforme a la Política de Privacidad.",
            "La Compañía puede crear/publicar/utilizar estadísticas e indicadores que no identifiquen a usuarios ni a individuos.",
          ],
        },
        storageDeletion: {
          title: "Almacenamiento y Eliminación",
          paragraphs: [
            "La región de almacenamiento por defecto es Japón (Tokio). En principio, los cambios se notificarán con al menos 30 días de antelación por correo y/o aviso en el producto.",
            "El usuario puede eliminar datos individualmente. Tras solicitar la eliminación de la cuenta, se realizará una eliminación lógica y la eliminación permanente se efectuará después de 90 días (las copias de seguridad pueden requerir más tiempo).",
          ],
        },
        incidents: {
          title: "Incidencias",
          paragraphs: [
            "Para la resolución de problemas, la Compañía podrá acceder/usar los Datos del Usuario en la medida mínima necesaria bajo control de accesos y registro de auditoría, y eliminar/anonimizar con prontitud tras la resolución.",
          ],
        },
        learningOptOut: {
          title: "Exclusión de Aprendizaje",
          paragraphs: [
            "El usuario puede optar por excluir del aprendizaje para mejora de modelos a nivel de cuenta o por archivo procesado. La exclusión puede afectar a la calidad/precisión.",
          ],
        },
      },
    },
    privacy: {
      title: "Tratamiento de Datos Personales (Japón)",
      paragraphs: [
        "La Compañía trata la información personal contenida en los Datos del Usuario conforme a la APPI y a las leyes y directrices relacionadas.",
      ],
      items: [
        "Fines: prestación del servicio, operación/mantenimiento, consultas, mejora de calidad, seguridad y cumplimiento legal.",
        "Encargos/subencargados: socios principales AWS (infraestructura) y Stripe (pagos). No habrá subprocesamiento adicional sin consentimiento previo (salvo mantenimiento/substitución inevitables con salvaguardas equivalentes y aviso oportuno).",
        "Transferencias internacionales con salvaguardas legales cuando sea necesario.",
        "Seguridad: control de accesos, cifrado, registros, segregación de funciones y gestión de vulnerabilidades.",
        "Solicitudes a través de los procedimientos de la Compañía (requiere verificación de identidad).",
        "Retención: eliminación dentro de un período razonable tras alcanzar el propósito o finalizar el contrato (véase la Sección 5 con prioridad).",
      ],
    },
    prohibited: {
      title: "Actividades Prohibidas",
      items: [
        "Violaciones de leyes/orden público; infracción de derechos de terceros.",
        "Envío de datos personales/sensibles sin base legal.",
        "Acceso no autorizado, ingeniería inversa, carga excesiva, spam, malware.",
        "Difamación/daño a la credibilidad, declaraciones falsas.",
        "Uso para construir servicios competidores sin consentimiento escrito previo.",
      ],
    },
    serviceChange: {
      title: "Cambios/Suspensión del Servicio",
      paragraphs: [
        "La Compañía puede cambiar/interrumpir/terminar todo o parte del Servicio por mantenimiento, fallos, cumplimiento, seguridad o fuerza mayor.",
        "Salvo emergencias, se dará aviso previo dentro de un alcance razonable.",
      ],
    },
    fees: {
      title: "Tarifas/Facturación/Pago (por uso)",
      subsections: {
        currencyUnit: {
          title: "Moneda/Unidad",
          items: [
            "Moneda: USD (centavos de dólar).",
            "Medición por byte. Calculado por byte.",
          ],
        },
        unitPrices: {
          title: "Precios Unitarios",
          items: [
            "Procesamiento: 0,001 centavo de US por B.",
            "Almacenamiento: 0,0001 centavo de US por B por mes.",
            "Sin tarifa mínima, sin cuota de alta, ni plan gratuito.",
          ],
        },
        measurementMethod: {
          title: "Medición",
          items: [
            "El procesamiento se basa en las cargas mensuales totales, incluyendo expansiones temporales, intermedios y reintentos.",
            "El almacenamiento se calcula por promedio diario o máximo mensual, el que sea mayor.",
          ],
        },
        billingPayment: {
          title: "Facturación/Pago",
          items: [
            "Ciclo de facturación: fin de mes; Fecha de pago: día 5 de cada mes.",
            "Pago mediante tarjeta de crédito (Stripe).",
            "Redondeos conforme a la precisión/unidad mínima de Stripe.",
            "Impuestos añadidos según ley aplicable.",
            "Sin reembolsos por servicios ya prestados (salvo que la ley lo exija).",
            "Intereses por demora: 14,6% anual.",
          ],
        },
        priceChange: {
          title: "Cambios de Precio",
          paragraphs: [
            "Los precios pueden cambiarse con aviso previo razonable y aplicarán después del aviso.",
          ],
        },
      },
    },
    ipAndDeliverables: {
      title: "Propiedad Intelectual y Entregables",
      paragraphs: [
        "La Compañía conserva los derechos de propiedad intelectual sobre modelos, plantillas, scripts y flujos de trabajo.",
        "Durante la vigencia del contrato, el usuario puede usar los Datos de Salida de forma no exclusiva para sus propios fines comerciales.",
        "Para modelos personalizados, la Compañía puede utilizar conocimientos, pesos y características obtenidos sin identificar al usuario para mejorar otros servicios (si existe un acuerdo separado, prevalecerá).",
      ],
    },
    representations: {
      title: "Manifiestos y Garantías",
      paragraphs: [
        "El usuario declara y garantiza que (i) tiene autoridad/consentimiento/permiso contractual para los Datos del Usuario, (ii) no infringe derechos de terceros y (iii) no viola leyes aplicables.",
        "Dada la naturaleza de la IA, la Compañía no garantiza la exactitud, integridad, utilidad, idoneidad o reproducibilidad de las salidas.",
      ],
    },
    disclaimer: {
      title: "Descargo de Responsabilidad",
      paragraphs: [
        "La Compañía no responde por daños causados por eventos fuera de su control razonable, incluyendo desastres naturales, interrupciones de red/nube, cambios legislativos o actos ilícitos de terceros.",
        "Las funciones beta/experimentales, código de muestra y valores recomendados se proporcionan \"tal cual\".",
      ],
    },
    liabilityLimit: {
      title: "Limitación de Responsabilidad",
      paragraphs: [
        "Salvo dolo o negligencia grave, la responsabilidad total de la Compañía se limita al importe total pagado por el usuario a la Compañía en los 12 meses anteriores.",
        "Esta limitación no se aplica a lesiones personales, infracción intencional de PI o violaciones de confidencialidad.",
      ],
    },
    thirdParty: {
      title: "Servicios de Terceros",
      paragraphs: [
        "Los servicios/API de terceros integrados con el Servicio (por ejemplo, AWS, Stripe) están sujetos a sus propios términos. Sus cambios o suspensiones pueden afectar ciertas funciones.",
      ],
    },
    confidentiality: {
      title: "Confidencialidad",
      paragraphs: [
        "Cada parte tratará la información no pública de la otra parte como confidencial, no la divulgará ni filtrará a terceros y no la utilizará para fines distintos al previsto. Esta obligación subsiste tras la terminación.",
      ],
    },
    support: {
      title: "Soporte",
      items: [
        "El soporte se presta sólo por chat. No se ofrecen llamadas telefónicas o de video.",
        "Tiempo objetivo de respuesta: dentro de 3 días hábiles. Sin compromiso de horarios/días específicos.",
      ],
    },
    termTermination: {
      title: "Plazo/Terminación",
      items: [
        "El uso comienza en la fecha de solicitud. El usuario puede terminar conforme al método designado por la Compañía (para terminar en el mes en curso, presentar la solicitud antes de la fecha límite de la Compañía).",
        "En caso de incumplimiento material, impago o implicación con fuerzas antisociales, la Compañía podrá suspender o terminar sin aviso.",
      ],
    },
    antisocialForces: {
      title: "Exclusión de Fuerzas Antisociales",
      paragraphs: [
        "Cada parte declara y garantiza que no es ni estará involucrada con fuerzas antisociales; en caso de incumplimiento, la otra parte podrá resolver inmediatamente sin aviso.",
      ],
    },
    assignment: {
      title: "Prohibición de Cesión",
      paragraphs: [
        "El usuario no podrá ceder ni gravar su posición contractual o derechos/obligaciones sin el consentimiento previo por escrito de la Compañía.",
      ],
    },
    severabilityEntire: {
      title: "Divisibilidad/Acuerdo Íntegro",
      paragraphs: [
        "Si alguna disposición de estos Términos es inválida o inaplicable, las disposiciones restantes seguirán en pleno vigor y efecto.",
        "Estos Términos constituyen el acuerdo íntegro respecto del Servicio. Si existe un acuerdo separado, dicho acuerdo prevalecerá.",
      ],
    },
    governingLawJurisdiction: {
      title: "Ley Aplicable/Jurisdicción",
      paragraphs: [
        "Estos Términos se rigen por las leyes de Japón.",
        "Jurisdicción exclusiva: Tribunal del Distrito de Hamamatsu (primera instancia).",
      ],
    },
    notices: {
      title: "Avisos",
      paragraphs: [
        "La Compañía enviará comunicaciones mediante avisos en el producto, correo electrónico u otros medios apropiados.",
        "Contacto del usuario: connectechceomatsui@gmail.com.",
      ],
    },
  },
  appendix: {
    lastUpdated: "14 de agosto de 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japón",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default es;


