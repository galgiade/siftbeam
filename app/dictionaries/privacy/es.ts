import type PrivacyLocale from "./PrivacyLocale";

const es: PrivacyLocale = {
  title: "Política de Privacidad (incluye DPA) | siftbeam",
  intro:
    "Esta Política de Privacidad (la 'Política') explica cómo Connect Tech Inc. (la 'Compañía') trata la información y los datos personales en el servicio 'siftbeam' (el 'Servicio'). Cumple la legislación japonesa, incluida la Ley de Protección de la Información Personal (APPI). Las cláusulas del Acuerdo de Tratamiento de Datos (DPA) se recogen en los anexos.",
  sections: {
    definitions: {
      title: "Definiciones",
      items: [
        "Información/Datos Personales: según la definición de la APPI.",
        "Datos del Usuario: datos proporcionados por los usuarios a la Compañía (datos brutos, registros, instrucciones, metadatos, etc.), que pueden incluir datos personales.",
        "Datos de Salida: resultados generados/procesados por el Servicio (incluidas exportaciones como CSV).",
        "Tratamiento: cualquier operación, incluida la recopilación, registro, edición, almacenamiento, uso, provisión y eliminación.",
        "Encargados/Subencargados: proveedores contratados por la Compañía (p. ej., AWS, Stripe).",
      ],
    },
    company: {
      title: "Información de la Compañía",
      items: [
        "Nombre: Connect Tech Inc.",
        "Dirección: Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japón",
        "Representante: Kazuaki Matsui",
        "Contacto: connectechceomatsui@gmail.com",
      ],
    },
    dataCollected: {
      title: "Categorías de Información Recopilada",
      items: [
        "Información de cuenta (nombre, correo, organización, rol, etc.)",
        "Autenticación y registros (ID de autenticación, accesos, IP, datos del dispositivo, cookies/tecnologías similares)",
        "Información de pago (procesada a través de Stripe; los datos de la tarjeta son gestionados por Stripe)",
        "Datos del Usuario (datos cargados, datos para procesamiento/aprendizaje, instrucciones)",
        "Comunicaciones de soporte (contenido de chat)",
      ],
    },
    purposes: {
      title: "Fines del Tratamiento",
      items: [
        "Prestación, operación, mejora de funciones y calidad del Servicio (incluido entrenamiento, evaluación y ajuste de modelos)",
        "Autenticación, seguridad, respuesta a incidentes y análisis de registros",
        "Facturación, cobros y prevención de fraude",
        "Soporte (chat), notificaciones y actualización de políticas/términos",
        "Creación y publicación de información estadística (solo en forma no identificable)",
        "Cumplimiento legal y protección de derechos",
      ],
    },
    storageDeletion: {
      title: "Ubicación de Almacenamiento, Retención y Eliminación",
      paragraphs: [
        "Región de almacenamiento: en principio, Japón (región de Tokio). Los cambios se notificarán con antelación.",
        "En cambios de región, la Compañía, en principio, notificará con al menos 30 días de antelación por correo y/o aviso en el producto (salvo emergencias o requisitos legales).",
        "Periodo de retención: los datos procesados se almacenan durante 1 año y luego se eliminan automáticamente. El usuario puede eliminar datos individualmente.",
        "Eliminación de cuenta: eliminación lógica a solicitud y eliminación permanente tras 90 días (las copias de seguridad pueden requerir más tiempo).",
        "En caso de incidencias técnicas: la Compañía podrá acceder/usar el mínimo necesario de Datos del Usuario para investigar y resolver, y eliminar/anonimizar con prontitud tras la resolución.",
      ],
    },
    thirdParties: {
      title: "Provisión a Terceros, Uso Conjunto y Encargos",
      items: [
        "Provisión a terceros: no sin consentimiento salvo exigencia legal.",
        "Encargos: principales encargados AWS (infraestructura) y Stripe (pagos). La Compañía ejerce la debida supervisión.",
        "Subencargados: no se ampliarán más allá de lo anterior sin permiso previo del usuario (si es inevitable la sustitución, se impondrán salvaguardas equivalentes y se notificará con prontitud).",
        "Transferencias internacionales: debido a servicios como Stripe, los datos pueden almacenarse/procesarse fuera de Japón (p. ej., en EE. UU.), aplicándose salvaguardas legales.",
      ],
      paragraphs: [
        "En transferencias internacionales, la Compañía adopta salvaguardas apropiadas como las SCC de la UE, el IDTA/Anexo SCC del Reino Unido y el Anexo FDPIC de Suiza, según corresponda (véase Anexo B).",
      ],
    },
    learningOptOut: {
      title: "Uso para Aprendizaje y Exclusión",
      items: [
        "Los Datos del Usuario pueden usarse para mejorar los modelos.",
        "Exclusión: el usuario puede excluir datos del aprendizaje a nivel de cuenta o por \"archivo procesado\". Esto puede afectar la calidad del Servicio.",
      ],
    },
    security: {
      title: "Seguridad",
      items: [
        "Salvaguardas como control de accesos, cifrado en tránsito/en reposo, segregación de funciones, registros de auditoría y gestión de vulnerabilidades.",
        "Obligaciones de confidencialidad y formación para personal y encargados.",
        "En caso de brecha significativa, se tomarán medidas y se notificará a autoridades/interesados según la ley.",
      ],
    },
    userRights: {
      title: "Derechos del Usuario",
      paragraphs: [
        "El usuario puede solicitar acceso, corrección, adición, eliminación, suspensión de uso o cese de provisión a terceros (requiere verificación de identidad). Contacto: connectechceomatsui@gmail.com",
      ],
    },
    legalBasisAndRoles: {
      title: "Base Legal y Roles (Responsable/Encargado)",
      items: [
        "Para datos personales relativos a gestión de cuentas, facturación y operación del Servicio, la Compañía actúa como 'operador comercial' (equivalente a responsable).",
        "Para Datos del Usuario confiados por clientes (datos personales tratados dentro de los fines del cliente), la Compañía actúa como 'encargado'.",
        "Donde apliquen leyes estatales de EE. UU. (p. ej., CCPA/CPRA), la Compañía cumplirá las obligaciones como 'proveedor de servicios/encargado' (véase Anexo C).",
        "Esta Política se basa en ley japonesa; si el Servicio está sujeto a otras jurisdicciones (p. ej., UE/EEE), se implementarán medidas adicionales (como SCC) según se requiera.",
      ],
    },
    cookies: {
      title: "Cookies y Tecnologías Similares",
      paragraphs: [
        "Podemos usar cookies y tecnologías similares para usabilidad, seguridad y analítica. Puede deshabilitarlas en la configuración del navegador, pero algunas funciones podrían verse afectadas.",
      ],
    },
    minors: {
      title: "Información Personal de Menores",
      paragraphs: [
        "Por regla general, el Servicio no está destinado a menores sin el consentimiento de sus tutores.",
      ],
    },
    policyChanges: {
      title: "Cambios en esta Política",
      paragraphs: [
        "Los cambios materiales se notificarán con antelación. El uso continuado tras la notificación constituye aceptación de los cambios.",
      ],
    },
    contact: {
      title: "Contacto",
      paragraphs: [
        "Para consultas sobre el tratamiento de información personal: connectechceomatsui@gmail.com. El soporte es solo por chat; objetivo de respuesta en tres días hábiles.",
      ],
    },
  },
  annexes: {
    annexA_DPA: {
      title: "Anexo A | Cláusulas del Acuerdo de Tratamiento de Datos (DPA)",
      subsections: {
        roles: {
          title: "A-1. Roles",
          paragraphs: [
            "El cliente es el responsable; la Compañía es el encargado y trata los Datos del Usuario conforme a las instrucciones del cliente.",
          ],
        },
        scope: {
          title: "A-2. Finalidad y Alcance",
          items: [
            "Finalidad: prestación de siftbeam, creación y mejora de modelos, generación de resultados, mantenimiento y soporte, seguridad y facturación.",
            "Datos objeto: datos personales enviados por el cliente (incluidos nombres, identificadores, datos de contacto, atributos, registros).",
            "Interesados: clientes, usuarios y empleados del cliente, etc.",
          ],
        },
        processorDuties: {
          title: "A-3. Obligaciones del Encargado",
          items: [
            "Tratar solo conforme a instrucciones (incluidas las electrónicas) del cliente.",
            "Mantener la confidencialidad.",
            "Mantener medidas técnicas y organizativas adecuadas de seguridad.",
            "Si la Compañía recibe solicitudes de interesados, las reenvía y coopera con el cliente.",
            "En caso de brecha, notificar sin demora indebida y cooperar en la remediación.",
            "Cooperar con auditorías razonables y solicitudes de responsabilidad del cliente bajo confidencialidad y salvaguardas de seguridad.",
            "Al terminar el tratamiento, suprimir o devolver los datos personales según decida el cliente (salvo obligación legal de conservación).",
          ],
        },
        subProcessors: {
          title: "A-4. Subencargados",
          items: [
            "Subencargados actuales: AWS (infraestructura) y Stripe (pagos).",
            "No habrá subtratamiento adicional sin permiso previo del cliente. Cuando la sustitución sea inevitable, se impondrán salvaguardas equivalentes o superiores y se dará aviso previo.",
            "Imponer obligaciones equivalentes a este DPA a todos los subencargados.",
          ],
        },
        internationalTransfer: {
          title: "A-5. Transferencias Internacionales",
          paragraphs: [
            "Cuando el tratamiento tenga lugar fuera de Japón, la Compañía implementará las salvaguardas exigidas por la ley aplicable (p. ej., cláusulas contractuales y avisos legalmente requeridos).",
          ],
        },
        retentionDeletion: {
          title: "A-6. Conservación y Supresión",
          paragraphs: [
            "A instrucción del cliente o al finalizar el contrato, la Compañía suprimirá o devolverá los datos en un plazo razonable. Las copias de seguridad se sobrescribirán/borrarán de forma segura.",
          ],
        },
        auditReporting: {
          title: "A-7. Auditoría e Informes",
          paragraphs: [
            "El cliente puede realizar auditorías (p. ej., revisión documental) con notificación y alcance razonables. La Compañía cooperará proporcionando la información necesaria.",
          ],
        },
        liability: {
          title: "A-8. Responsabilidad",
          paragraphs: [
            "Las responsabilidades siguen los Términos del Servicio y este DPA. Por daños causados por dolo o negligencia grave (p. ej., incumplimiento de obligaciones de seguridad), la responsabilidad de la Compañía se limita conforme a los Términos del Servicio.",
          ],
        },
        learningInstruction: {
          title: "A-9. Instrucciones de Aprendizaje",
          paragraphs: [
            "El cliente puede indicar si se permite el uso para aprendizaje a nivel de cuenta o por archivo específico. La Compañía cumplirá dichas instrucciones.",
          ],
        },
      },
    },
    annexB_InternationalTransfer: {
      title: "Anexo B | Cláusulas de Transferencia Internacional (SCC/Reino Unido/Suiza)",
      subsections: {
        applicability: {
          title: "B-1. Aplicabilidad",
          paragraphs: [
            "Para transferencias desde la UE/EEE, la Compañía adopta las SCC (2021/914).",
            "Módulos: Controlador→Encargado (Módulo 2) y Encargado→Encargado (Módulo 3), según proceda.",
            "Para el Reino Unido, se aplicará el IDTA o el Anexo SCC del Reino Unido; para Suiza, el Anexo FDPIC.",
          ],
        },
        keyChoices: {
          title: "B-2. Selecciones Clave (opciones del texto SCC)",
          items: [
            "Cláusula 7 (Cláusula de Acoplamiento): aplicable.",
            "Cláusula 9 (Subencargados): autorización general; subencargados actuales (AWS, Stripe). Los nuevos/cambiados se notificarán, en principio, con 15 días de antelación.",
            "Cláusula 11 (Recurso): no aplicable (salvo disposición legal).",
            "Cláusula 17 (Ley aplicable): leyes de Irlanda.",
            "Cláusula 18 (Tribunales): tribunales de Irlanda.",
          ],
        },
        dpa: {
          title: "B-3. Autoridad de Control",
          paragraphs: [
            "La autoridad de control principal prevista es la Comisión de Protección de Datos de Irlanda (DPC), salvo acuerdo en contrario.",
          ],
        },
        annexI: {
          title: "B-4. Anexo I (Detalles de la Transferencia)",
          items: [
            "Partes: exportador de datos (cliente) e importador de datos (Compañía).",
            "Interesados: clientes finales, usuarios, empleados del cliente, etc.",
            "Categorías de datos: identificadores, datos de contacto, registros de comportamiento, transacciones, instrucciones/metadatos, etc. (según instrucciones del cliente).",
            "Categorías especiales: no previstas en principio; si se incluyen, se requiere acuerdo previo.",
            "Finalidad: prestación de siftbeam, creación/mejora de modelos (con opción de exclusión), mantenimiento y seguridad, facturación y soporte.",
            "Conservación: hasta lograr los fines. Tras la finalización del contrato, los datos se eliminarán/devolverán (salvo obligación legal de conservación).",
            "Frecuencia: continua y/o puntual.",
          ],
        },
        annexII: {
          title: "B-5. Anexo II (Medidas Técnicas y Organizativas)",
          items: [
            "Control de acceso (privilegios mínimos, MFA, segregación de funciones)",
            "Cifrado de datos (TLS en tránsito, AES-256 en reposo)",
            "Gestión de claves (rotación, KMS)",
            "Registro/auditoría (resistencia a manipulación, alertas)",
            "Desarrollo/operación seguros (SDLC seguro, gestión de vulnerabilidades, monitoreo de dependencias)",
            "Disponibilidad (copias de seguridad, redundancia intra-región, recuperación ante desastres)",
            "Gestión de proveedores (evaluación/contratos con subencargados)",
            "Procesos para derechos de interesados",
            "Respuesta a incidentes (detección, contención, análisis de causa raíz, notificación)",
          ],
        },
        annexIII: {
          title: "B-6. Anexo III (Subencargados)",
          items: [
            "AWS (infraestructura/alojamiento, región de Tokio como principal)",
            "Stripe (pagos)",
            "Cuando se agreguen subencargados adicionales, se dará aviso previo e impondrán salvaguardas equivalentes o superiores.",
          ],
        },
        govRequests: {
          title: "B-7. Requerimientos Gubernamentales",
          paragraphs: [
            "Salvo prohibición legal, la Compañía notificará sin demora indebida al exportador, examinará la legalidad de la solicitud y minimizará su alcance. Podrán emitirse informes de transparencia.",
          ],
        },
        tia: {
          title: "B-8. Evaluación del Impacto de Transferencia (TIA)",
          paragraphs: [
            "Cuando sea necesario, la Compañía cooperará razonablemente con la TIA del exportador y proporcionará información pertinente.",
          ],
        },
      },
    },
    annexC_USStateLaw: {
      title: "Anexo C | Anexo de Leyes Estatales de EE. UU. (CCPA/CPRA, etc.)",
      subsections: {
        c1: {
          title: "C-1. Roles y Limitación de Finalidades",
          paragraphs: [
            "La Compañía actúa como 'proveedor de servicios/encargado' y trata la información personal solo para los fines comerciales del cliente.",
          ],
        },
        c2: {
          title: "C-2. Prohibición de Venta/Compartición",
          paragraphs: [
            "La Compañía no 'vende' ni 'comparte' información personal (incluida la publicidad conductual entre contextos).",
          ],
        },
        c3: {
          title: "C-3. Prohibición de Uso Secundario",
          paragraphs: [
            "La Compañía no utiliza la información personal para fines propios e independientes (salvo uso estadístico/anónimo permitido por ley).",
          ],
        },
        c4: {
          title: "C-4. Seguridad",
          paragraphs: [
            "La Compañía mantiene medidas de seguridad razonables y, en caso de brecha, notificará y asistirá al cliente.",
          ],
        },
        c5: {
          title: "C-5. Cooperación con Derechos del Consumidor",
          paragraphs: [
            "La Compañía cooperará razonablemente con solicitudes de acceso, eliminación, corrección y exclusión. Cuando aplique, respetará señales GPC (Global Privacy Control).",
          ],
        },
        c6: {
          title: "C-6. Subencargados",
          paragraphs: [
            "La Compañía trasladará obligaciones equivalentes a los subencargados y notificará razonablemente cualquier cambio.",
          ],
        },
        c7: {
          title: "C-7. Registros y Auditorías",
          paragraphs: [
            "La Compañía mantendrá los registros necesarios para el cumplimiento de CCPA/CPRA y cooperará razonablemente con auditorías del cliente.",
          ],
        },
      },
    },
  },
  appendix: {
    lastUpdated: "14 de agosto de 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japón",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default es;


