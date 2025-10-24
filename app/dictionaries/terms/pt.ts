import type TermsLocale from "./TermsLocale";

const pt: TermsLocale = {
  title: "Termos de Serviço (siftbeam)",
  intro:
    "Estes Termos de Serviço (os 'Termos') regem o uso do siftbeam (o 'Serviço'), fornecido pela Connect Tech Inc. (a 'Empresa'). Ao usar o Serviço, o usuário concorda com estes Termos.",
  sections: {
    definitions: {
      title: "Definições",
      items: [
        "Serviço: cria/melhora modelos de IA com dados do usuário, realiza previsão/agrupamento/classificação, cria estatísticas e exporta resultados (ex.: CSV).",
        "Dados do Usuário: dados fornecidos pelo usuário à Empresa (dados brutos, metadados, logs, instruções etc.).",
        "Dados de Saída: resultados gerados/processados pelo Serviço (incluindo exportações CSV).",
        "Modelo: modelos de IA criados/operados/melhorados pela Empresa (features, pesos treinados, prompts, pipelines, métricas).",
        "Cobrança por uso: cobrança baseada em ingestão/processamento/armazenamento de dados etc.",
      ],
    },
    scopeChanges: {
      title: "Escopo e Alterações",
      paragraphs: [
        "Aplica-se a todas as relações entre a Empresa e usuários relativas ao Serviço.",
        "A Empresa pode revisar os Termos e notificará alterações materiais. O uso contínuo após aviso implica concordância.",
      ],
    },
    account: {
      title: "Conta",
      items: [
        "Manter dados de registro precisos e atualizados; gerenciar credenciais com segurança.",
        "A Empresa não se responsabiliza por uso não autorizado, salvo dolo ou culpa grave.",
      ],
    },
    services: {
      title: "Descrição do Serviço",
      paragraphs: [
        "A Empresa cria modelos de IA conforme as necessidades e realiza previsão/agrupamento/classificação, ou cria estatísticas.",
        "Com fornecimento contínuo de dados, a Empresa pode aprimorar os modelos usando tais dados.",
        "Resultados processados exportados em CSV etc. (formato/itens/frequência conforme especificações).",
        "Funcionalidades podem ser adicionadas/alteradas/suspensas; recursos beta podem ser fornecidos.",
      ],
    },
    dataHandling: {
      title: "Tratamento de Dados",
      subsections: {
        ownership: {
          title: "Propriedade",
          items: [
            "Direitos sobre Dados do Usuário pertencem ao usuário.",
            "Direitos sobre Dados de Saída pertencem ao usuário (usuário assegura não violar direitos de terceiros).",
            "Direitos de PI sobre modelos/algoritmos/know-how/templates pertencem à Empresa/licenciadores.",
          ],
        },
        license: {
          title: "Licença",
          paragraphs: [
            "Direito mundial, gratuito e não exclusivo para usar Dados do Usuário para prestação do Serviço, melhoria de qualidade, treinamento/avaliação/ajuste de modelos e criação de estatísticas. Dados pessoais conforme Política de Privacidade.",
            "Estatísticas/indicadores não identificáveis podem ser criados/publicados/usados.",
          ],
        },
        storageDeletion: {
          title: "Armazenamento e Exclusão",
          paragraphs: [
            "Região padrão: Japão (Tóquio). Mudanças notificadas, em princípio, com 30 dias de antecedência (e-mail e/ou aviso no produto), salvo emergências/exigência legal.",
            "Usuário pode excluir dados individualmente. Após solicitação de exclusão de conta: exclusão lógica e, após 90 dias, exclusão definitiva (backups podem levar mais tempo).",
          ],
        },
        incidents: {
          title: "Incidentes",
          paragraphs: [
            "Para solução de problemas, acesso/uso mínimo sob controle de acesso e auditoria; exclusão/anonimização após resolução.",
          ],
        },
        learningOptOut: {
          title: "Opt-out de Aprendizado",
          paragraphs: [
            "Opt-out por conta ou por arquivo processado; pode afetar qualidade/precisão.",
          ],
        },
      },
    },
    privacy: {
      title: "Dados Pessoais (Japão)",
      paragraphs: [
        "A Empresa trata informações pessoais contidas nos Dados do Usuário em conformidade com a APPI e leis/diretrizes aplicáveis.",
      ],
      items: [
        "Finalidades: prestação, operação/manutenção, atendimento, melhoria, segurança, conformidade.",
        "Terceirização/subprocessamento: AWS (infra) e Stripe (pagamentos); sem adicionais sem consentimento prévio (salvo manutenção/substituição inevitáveis com salvaguardas equivalentes e aviso).",
        "Transferência internacional com salvaguardas legais conforme necessário.",
        "Segurança: controle de acesso, criptografia, logs, segregação de funções, gestão de vulnerabilidades.",
        "Solicitações conforme procedimentos da Empresa (verificação de identidade).",
        "Retenção: exclusão em prazo razoável após finalidade/encerramento (ver Seção 5).",
      ],
    },
    prohibited: {
      title: "Atividades Proibidas",
      items: [
        "Violações legais/morais; violação de direitos de terceiros.",
        "Envio de dados pessoais/sensíveis sem base legal.",
        "Acesso não autorizado, engenharia reversa, carga excessiva, spam, malware.",
        "Dano de reputação, declarações falsas.",
        "Uso para construir serviços concorrentes sem consentimento escrito prévio.",
      ],
    },
    serviceChange: {
      title: "Alterações/Suspensão",
      paragraphs: [
        "Alteração/interrupção/encerramento total ou parcial por manutenção, falhas, conformidade, segurança ou força maior.",
        "Salvo emergência, aviso prévio em âmbito razoável.",
      ],
    },
    fees: {
      title: "Taxas/Cobrança/Pagamento (Uso)",
      subsections: {
        currencyUnit: {
          title: "Moeda/Unidade",
          items: [
            "Moeda: USD (centavos).",
            "Medição por byte. Calculado por byte.",
          ],
        },
        unitPrices: {
          title: "Preços Unitários",
          items: [
            "Processamento: 0,001 centavo/B.",
            "Armazenamento: 0,0001 centavo/B/mês.",
            "Sem franquia, taxa mínima ou instalação.",
          ],
        },
        measurementMethod: {
          title: "Medição",
          items: [
            "Processamento com base no total de uploads mensais (inclui expansão temporária, intermediários, tentativas).",
            "Armazenamento por média diária ou máximo mensal (o maior).",
          ],
        },
        billingPayment: {
          title: "Cobrança/Pagamento",
          items: [
            "Fechamento: fim do mês; Pagamento: dia 5.",
            "Pagamento: cartão de crédito (Stripe).",
            "Arredondamento por precisão/unidade mínima Stripe (regras da Empresa).",
            "Impostos conforme lei.",
            "Sem reembolso para serviços já prestados (salvo exigência legal).",
            "Juros de mora: 14,6% a.a.",
          ],
        },
        priceChange: {
          title: "Alterações de Preço",
          paragraphs: [
            "Aviso prévio razoável; aplica-se após a notificação.",
          ],
        },
      },
    },
    ipAndDeliverables: {
      title: "Propriedade Intelectual e Entregáveis",
      paragraphs: [
        "A Empresa mantém os direitos de PI sobre modelos, templates, scripts e fluxos de trabalho.",
        "Durante o prazo contratual, o usuário pode usar os Dados de Saída de forma não exclusiva para seus fins de negócio.",
        "Para modelos personalizados, a Empresa pode usar insights/pesos/recursos não identificáveis do usuário para aprimorar outros serviços (havendo acordo específico, este prevalece).",
      ],
    },
    representations: {
      title: "Declarações e Garantias",
      paragraphs: [
        "O usuário declara possuir autoridade/consentimento/permissão contratual sobre os Dados do Usuário, não violar direitos de terceiros e cumprir as leis aplicáveis.",
        "Dada a natureza da IA, a Empresa não garante exatidão, completude, utilidade, adequação ou reprodutibilidade dos resultados.",
      ],
    },
    disclaimer: {
      title: "Isenção de Responsabilidade",
      paragraphs: [
        "A Empresa não se responsabiliza por danos decorrentes de eventos fora de seu controle razoável (desastres, falhas de rede/nuvem, mudanças legais, atos ilícitos de terceiros).",
        "Recursos beta/experimentais, códigos de exemplo e valores recomendados são fornecidos no estado em que se encontram (as-is).",
      ],
    },
    liabilityLimit: {
      title: "Limitação de Responsabilidade",
      paragraphs: [
        "Salvo dolo/culpa grave, a responsabilidade total da Empresa limita-se ao total pago pelo usuário nos 12 meses anteriores.",
        "Exceções: lesão corporal, infração intencional de PI, violação de confidencialidade.",
      ],
    },
    thirdParty: {
      title: "Serviços de Terceiros",
      paragraphs: [
        "Serviços/APIs de terceiros integrados (ex.: AWS, Stripe) seguem seus próprios termos; mudanças/suspensões podem afetar funcionalidades.",
      ],
    },
    confidentiality: {
      title: "Confidencialidade",
      paragraphs: [
        "As partes tratarão informações não públicas como confidenciais, sem divulgar a terceiros nem usar fora da finalidade; obrigação que subsiste após o término.",
      ],
    },
    support: {
      title: "Suporte",
      items: [
        "Suporte apenas via chat; sem chamadas telefônicas/vídeo.",
        "Meta de resposta: até 3 dias úteis; sem compromisso de horários/dias específicos.",
      ],
    },
    termTermination: {
      title: "Prazo/Rescisão",
      items: [
        "O uso inicia na data de solicitação; rescisão pelo método definido pela Empresa (para o mês corrente, respeitar o prazo interno).",
        "Em caso de violação material, inadimplência ou envolvimento com forças antissociais, a Empresa pode suspender/encerrar sem aviso.",
      ],
    },
    antisocialForces: {
      title: "Exclusão de Forças Antissociais",
      paragraphs: [
        "As partes declaram não pertencer/estar envolvidas com forças antissociais; em caso de violação, encerramento imediato sem aviso.",
      ],
    },
    assignment: {
      title: "Vedação à Cessão",
      paragraphs: [
        "Sem consentimento escrito prévio da Empresa, o usuário não pode ceder/onerar sua posição contratual ou seus direitos/obrigações.",
      ],
    },
    severabilityEntire: {
      title: "Divisibilidade/Contrato Integral",
      paragraphs: [
        "Se alguma cláusula for inválida/inexequível, as demais permanecem em vigor.",
        "Estes Termos constituem o acordo integral sobre o Serviço; havendo acordo específico, este prevalece.",
      ],
    },
    governingLawJurisdiction: {
      title: "Lei/Foro",
      paragraphs: [
        "Lei japonesa.",
        "Foro exclusivo: Tribunal Distrital de Hamamatsu (1ª instância).",
      ],
    },
    notices: {
      title: "Avisos",
      paragraphs: [
        "Avisos via aplicativo, e-mail ou outros meios apropriados.",
        "Contato do usuário: connectechceomatsui@gmail.com.",
      ],
    },
  },
  appendix: {
    lastUpdated: "14 de agosto de 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japão",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default pt;