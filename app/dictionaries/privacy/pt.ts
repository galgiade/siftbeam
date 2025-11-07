import type PrivacyLocale from "./PrivacyLocale";

const pt: PrivacyLocale = {
  title: "Política de Privacidade (inclui DPA) | siftbeam",
  intro:
    "Esta Política de Privacidade (a 'Política') explica como a Connect Tech Inc. ('Empresa') trata informações/dados pessoais no serviço 'siftbeam' ('Serviço'). Está em conformidade com a lei japonesa (APPI). As disposições relativas ao Data Processing Agreement (DPA) constam nos anexos abaixo.",
  sections: {
    definitions: {
      title: "Definições",
      items: [
        "Informações/Dados pessoais: conforme definido pela APPI.",
        "Dados do Usuário: dados fornecidos pelos usuários à Empresa (dados brutos, logs, instruções, metadados, etc.), podendo incluir informações pessoais.",
        "Dados de Saída: resultados gerados/processados pelo Serviço (incluindo exportações como CSV).",
        "Tratamento: qualquer operação incluindo coleta, registro, edição, armazenamento, uso, fornecimento, exclusão, etc.",
        "Processadores/Subprocessadores: fornecedores contratados pela Empresa (ex.: AWS, Stripe).",
      ],
    },
    company: {
      title: "Informações da Empresa",
      items: [
        "Nome: Connect Tech Inc.",
        "Endereço: Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu-shi, Shizuoka, Japão",
        "Representante: Kazuaki Matsui",
        "Contato: connectechceomatsui@gmail.com",
      ],
    },
    dataCollected: {
      title: "Categorias de Informações Coletadas",
      items: [
        "Informações de conta (nome, e-mail, organização, cargo, etc.)",
        "Informações de autenticação e logs (ID de autenticação, logs de acesso, endereço IP, informações do dispositivo, cookies/tecnologias similares)",
        "Informações de pagamento (processadas via Stripe; dados de cartão gerenciados pela Stripe)",
        "Dados do Usuário (dados enviados, dados para processamento/aprendizado, instruções)",
        "Comunicações de suporte (conteúdo de chat)",
      ],
    },
    purposes: {
      title: "Finalidades de Uso",
      items: [
        "Prestação, operação, melhoria de funcionalidades e da qualidade do Serviço (incluindo treinamento, avaliação e ajuste de modelos)",
        "Autenticação, segurança, resposta a incidentes e análise de logs",
        "Faturamento, cobrança e prevenção de fraudes",
        "Suporte (chat), notificações e atualizações de políticas/termos",
        "Criação e publicação de informações estatísticas (apenas de forma que não identifique indivíduos ou usuários específicos)",
        "Conformidade legal e proteção de direitos",
      ],
    },
    storageDeletion: {
      title: "Local de Armazenamento, Retenção e Exclusão",
      paragraphs: [
        "Região de armazenamento: em princípio, Japão (região de Tóquio). Mudanças serão notificadas com antecedência.",
        "Para mudanças de região, a Empresa notificará, em princípio, com pelo menos 30 dias de antecedência por e-mail e/ou aviso no produto (exceto em emergências/exigências legais).",
        "Período de retenção: dados processados são armazenados por 1 ano e depois excluídos automaticamente. Os usuários podem excluir dados individualmente.",
        "Faturamento e Pagamento: Fechamento mensal no final do mês (uso do dia 1 ao último dia do mês). Data de emissão da fatura: dia 1 do mês seguinte. Data de vencimento do pagamento: dia 15 do mês seguinte.",
        "Exclusão de conta: exclusão lógica mediante solicitação e exclusão permanente após 90 dias (backups podem demandar tempo adicional).",
        "Em caso de problemas técnicos: a Empresa pode acessar/utilizar o mínimo necessário dos Dados do Usuário para investigação e solução; após resolvido, excluirá ou anonimizará prontamente.",
      ],
    },
    thirdParties: {
      title: "Fornecimento a Terceiros, Uso Conjunto e Subprocessamento",
      items: [
        "Fornecimento a terceiros: não será realizado sem consentimento, salvo exigência legal.",
        "Subcontratação: principais processadores são AWS (infraestrutura) e Stripe (pagamentos). A Empresa exerce supervisão adequada.",
        "Subprocessamento adicional: não haverá além do mencionado sem permissão prévia do usuário (quando manutenção/substituição for inevitável, garantias equivalentes ou mais rígidas serão aplicadas e haverá notificação prévia).",
        "Transferências internacionais: devido a Stripe etc., os dados podem ser armazenados/processados fora do Japão (ex.: EUA), aplicando-se as salvaguardas legais.",
      ],
      paragraphs: [
        "Havendo transferências internacionais, a Empresa adota salvaguardas adequadas como as SCC da UE, o IDTA/Addendum do Reino Unido e o Addendum FDPIC da Suíça, conforme aplicável (ver Anexo B).",
      ],
    },
    learningOptOut: {
      title: "Uso para Aprendizado e Opt-out",
      items: [
        "Os Dados do Usuário podem ser usados para melhoria de modelos.",
        "Opt-out: o usuário pode excluir dados do aprendizado no nível da conta ou por 'arquivo processado'. Isso pode afetar a qualidade do Serviço.",
      ],
    },
    security: {
      title: "Segurança",
      items: [
        "Implementação de salvaguardas como controle de acesso, criptografia em trânsito/em repouso, separação de funções, logs de auditoria e gestão de vulnerabilidades.",
        "Imposição de obrigações de confidencialidade e treinamento para pessoal e processadores.",
        "Em caso de violação significativa, serão tomadas medidas e as autoridades/indivíduos serão notificados conforme exigido por lei.",
      ],
    },
    userRights: {
      title: "Direitos do Usuário",
      paragraphs: [
        "Os usuários podem solicitar acesso, correção, adição, exclusão, suspensão de uso ou cessação de fornecimento a terceiros (é necessária verificação de identidade). Contato: connectechceomatsui@gmail.com",
      ],
    },
    legalBasisAndRoles: {
      title: "Base Legal e Papéis (Controlador/Processador)",
      items: [
        "Para informações pessoais relacionadas à gestão de contas, faturamento e operação do Serviço, a Empresa atua como 'operadora de negócios' (equivalente a controlador).",
        "Para os Dados do Usuário confiados pelos clientes (dados pessoais processados dentro das finalidades do cliente), a Empresa atua como 'processadora'.",
        "Quando aplicáveis as leis estaduais dos EUA (ex.: CCPA/CPRA), a Empresa cumpre suas obrigações como 'fornecedora de serviços/processadora' (ver Anexo C).",
        "Esta Política baseia-se na lei japonesa; quando o Serviço estiver sujeito a outras jurisdições (ex.: UE/EEE), medidas adicionais (ex.: SCC) serão implementadas conforme necessário.",
      ],
    },
    cookies: {
      title: "Cookies e Tecnologias Semelhantes",
      paragraphs: [
        "Podemos utilizar cookies/tecnologias semelhantes para usabilidade, segurança e análises. É possível desativá-los nas configurações do navegador, mas algumas funções podem ser afetadas.",
      ],
    },
    minors: {
      title: "Dados Pessoais de Menores",
      paragraphs: [
        "Em regra, o Serviço não se destina a menores sem consentimento dos pais/responsáveis.",
      ],
    },
    policyChanges: {
      title: "Alterações nesta Política",
      paragraphs: [
        "Alterações materiais serão notificadas com antecedência. O uso contínuo após a notificação constitui consentimento às alterações.",
      ],
    },
    contact: {
      title: "Contato",
      paragraphs: [
        "Para questões sobre o tratamento de informações pessoais, contate: connectechceomatsui@gmail.com. Suporte apenas via chat; objetivo de resposta em até três dias úteis.",
      ],
    },
  },
  annexes: {
    annexA_DPA: {
      title: "Anexo A | Cláusulas do Acordo de Processamento de Dados (DPA)",
      subsections: {
        roles: {
          title: "A-1. Papéis",
          paragraphs: [
            "O Cliente é o controlador; a Empresa é a processadora e processa os Dados do Usuário de acordo com as instruções do Cliente.",
          ],
        },
        scope: {
          title: "A-2. Finalidade e Escopo",
          items: [
            "Finalidade: fornecimento do siftbeam, criação/melhoria de modelos, geração de saídas, manutenção/suporte, segurança e faturamento.",
            "Dados objeto: dados pessoais submetidos pelo Cliente (p. ex., nomes, identificadores, dados de contato, atributos, logs).",
            "Titulares: clientes, usuários e funcionários do Cliente.",
          ],
        },
        processorDuties: {
          title: "A-3. Deveres da Processadora",
          items: [
            "Processar apenas conforme as instruções escritas (inclusive eletrônicas) do Cliente.",
            "Assegurar a confidencialidade.",
            "Manter medidas técnicas e organizacionais de segurança adequadas.",
            "Caso receba diretamente solicitações de titulares, encaminhá-las sem demora ao Cliente e cooperar.",
            "Notificar o Cliente sem demora indevida em caso de incidente e cooperar na remediação.",
            "Cooperar com auditorias/obrigações de prestação de contas razoáveis do Cliente sob salvaguardas adequadas de confidencialidade/segurança.",
            "Ao término do processamento, excluir ou devolver os dados pessoais, conforme escolha do Cliente (salvo obrigação legal de retenção).",
          ],
        },
        subProcessors: {
          title: "A-4. Subprocessadores",
          items: [
            "Subprocessadores existentes: AWS (infraestrutura), Stripe (pagamentos).",
            "Sem subprocessamento adicional além do acima sem permissão prévia do Cliente; quando a substituição for inevitável, assegurar salvaguardas equivalentes ou superiores e aviso prévio.",
            "Impor obrigações de proteção de dados equivalentes às deste DPA aos subprocessadores.",
          ],
        },
        internationalTransfer: {
          title: "A-5. Transferências Internacionais",
          paragraphs: [
            "Quando o processamento ocorrer fora do Japão, implementar salvaguardas exigidas pela lei aplicável (p. ex., cláusulas contratuais, notificações legais).",
          ],
        },
        retentionDeletion: {
          title: "A-6. Retenção e Exclusão",
          paragraphs: [
            "Após instrução do Cliente ou término do contrato, excluir ou devolver os dados pessoais em prazo razoável; backups serão sobrescritos/apagados com segurança.",
          ],
        },
        auditReporting: {
          title: "A-7. Auditoria e Relatórios",
          paragraphs: [
            "O Cliente pode realizar auditorias (p. ex., revisão documental) mediante aviso prévio razoável e escopo adequado; a Empresa cooperará.",
          ],
        },
        liability: {
          title: "A-8. Responsabilidade",
          paragraphs: [
            "A alocação de responsabilidades segue os Termos de Uso e este DPA. Em caso de danos decorrentes de dolo ou culpa grave (p. ex., violação de obrigações de segurança), a responsabilidade da Empresa é limitada nos termos dos Termos de Uso.",
          ],
        },
        learningInstruction: {
          title: "A-9. Instruções de Aprendizado",
          paragraphs: [
            "O Cliente pode especificar se o uso para aprendizado é permitido no nível de conta ou por arquivo específico; a Empresa seguirá tais instruções.",
          ],
        },
      },
    },
    annexB_InternationalTransfer: {
      title: "Anexo B | Cláusulas de Transferência Internacional (SCC/Reino Unido/Suíça)",
      subsections: {
        applicability: {
          title: "B-1. Aplicabilidade",
          paragraphs: [
            "Para transferências provenientes da UE/EEE, adotam-se as SCC (2021/914).",
            "Módulos: Controlador→Processador (Módulo 2) e Processador→Processador (Módulo 3), conforme aplicável.",
            "Para o Reino Unido, aplica-se o UK IDTA ou o Addendum das SCC do Reino Unido; para a Suíça, o Addendum do FDPIC.",
          ],
        },
        keyChoices: {
          title: "B-2. Principais Escolhas",
          items: [
            "Cláusula 7 (Docking Clause): aplicável.",
            "Cláusula 9 (Subprocessador): autorização geral; subprocessadores atuais (AWS, Stripe). Novos/alterações serão, em princípio, notificados com ~15 dias de antecedência.",
            "Cláusula 11 (Redress): não aplicável (conforme a lei).",
            "Cláusula 17 (Lei aplicável): direito irlandês.",
            "Cláusula 18 (Foro): tribunais da Irlanda.",
          ],
        },
        dpa: {
          title: "B-3. Autoridade Supervisora",
          paragraphs: [
            "Autoridade supervisora líder pretendida: DPC irlandês, salvo acordo em contrário.",
          ],
        },
        annexI: {
          title: "B-4. Anexo I (Detalhes da Transferência)",
          items: [
            "Partes: exportador de dados (Cliente) e importador de dados (Empresa).",
            "Titulares: clientes, usuários e funcionários do Cliente.",
            "Categorias de dados: identificadores, dados de contato, logs comportamentais, transações, instruções/metadados (conforme instruções do Cliente).",
            "Categorias especiais: em princípio, não previstas; se incluídas, exige acordo prévio.",
            "Finalidades: siftbeam, criação/melhoria de modelos (opt-out disponível), manutenção/segurança, faturamento e suporte.",
            "Retenção: até o alcance das finalidades; após o término contratual, exclusão/devolução (salvo retenção legal).",
            "Frequência: contínua/adhoc.",
          ],
        },
        annexII: {
          title: "B-5. Anexo II (Medidas Técnicas e Organizacionais)",
          items: [
            "Controle de acesso (privilégio mínimo, MFA, segregação de funções)",
            "Criptografia (TLS em trânsito, AES-256 em repouso)",
            "Gestão de chaves (rotação, KMS)",
            "Registro/auditoria (resistência a adulteração, alertas)",
            "Desenvolvimento/Operação seguros (SDLC seguro, gestão de vulnerabilidades, monitoramento de dependências)",
            "Disponibilidade (backups, redundância intra-região, DR)",
            "Gestão de fornecedores (avaliação/contratos de subprocessadores)",
            "Processos de direitos dos titulares",
            "Resposta a incidentes (detecção, contenção, análise de causa raiz, notificação)",
          ],
        },
        annexIII: {
          title: "B-6. Anexo III (Subprocessadores)",
          items: [
            "AWS (infraestrutura/hospedagem, região de Tóquio como primária)",
            "Stripe (pagamentos)",
            "Havendo adições, haverá aviso prévio e salvaguardas equivalentes ou superiores.",
          ],
        },
        govRequests: {
          title: "B-7. Solicitações Governamentais",
          paragraphs: [
            "Salvo proibição legal, notificar prontamente o exportador; analisar a legalidade da solicitação e minimizar seu escopo; relatórios de transparência poderão ser fornecidos.",
          ],
        },
        tia: {
          title: "B-8. TIA (Avaliação de Impacto de Transferência)",
          paragraphs: [
            "Quando necessário, a Empresa cooperará de forma razoável com a TIA do exportador e fornecerá as informações relevantes.",
          ],
        },
      },
    },
    annexC_USStateLaw: {
      title: "Anexo C | Addendum de Leis Estaduais dos EUA (CCPA/CPRA etc.)",
      subsections: {
        c1: {
          title: "C-1. Papéis e Limitação de Finalidade",
          paragraphs: [
            "A Empresa atua como 'fornecedora de serviços/processadora' e processa informações pessoais apenas para os fins comerciais do Cliente.",
          ],
        },
        c2: {
          title: "C-2. Proibição de Venda/Compartilhamento",
          paragraphs: [
            "A Empresa não 'vende' nem 'compartilha' informações pessoais (incluindo publicidade comportamental entre contextos).",
          ],
        },
        c3: {
          title: "C-3. Proibição de Uso Secundário",
          paragraphs: [
            "A Empresa não utiliza informações pessoais para fins próprios (exceto uso estatístico/anonimizado permitido pela lei aplicável).",
          ],
        },
        c4: {
          title: "C-4. Segurança",
          paragraphs: [
            "A Empresa mantém segurança razoável e, em caso de violação, notificará e auxiliará o Cliente.",
          ],
        },
        c5: {
          title: "C-5. Cooperação com Direitos dos Consumidores",
          paragraphs: [
            "Cooperará de forma razoável com solicitações de acesso, exclusão, correção e opt-out; respeitará sinais GPC quando aplicável.",
          ],
        },
        c6: {
          title: "C-6. Subprocessadores",
          paragraphs: [
            "Imporá obrigações equivalentes aos subprocessadores e fornecerá aviso razoável sobre alterações.",
          ],
        },
        c7: {
          title: "C-7. Registros e Auditorias",
          paragraphs: [
            "Manterá registros necessários ao cumprimento do CCPA/CPRA e cooperará de forma razoável com auditorias do Cliente.",
          ],
        },
      },
    },
  },
  appendix: {
    lastUpdated: "6 de novembro de 2025",
    company: {
      name: "Connect Tech Inc.",
      address: "Dias Wago 202, 315-1485 Wago-cho, Chuo-ku, Hamamatsu, Shizuoka, Japão",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};
export default pt;