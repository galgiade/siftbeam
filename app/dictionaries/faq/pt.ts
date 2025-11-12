import type FAQLocale from './faq.d';

const pt: FAQLocale = {
  title: 'Perguntas Frequentes (FAQ)',
  description: 'Encontre respostas para perguntas comuns sobre o serviço de processamento de dados siftbeam.',
  categories: {
    service: {
      title: 'Visão Geral do Serviço',
      items: [
        {
          question: 'O que é siftbeam?',
          answer: 'siftbeam é um serviço B2B de processamento de dados para empresas. Fornecemos fluxos de trabalho de processamento de dados personalizáveis para cada cliente, permitindo transformação, processamento e gerenciamento automatizados de arquivos em infraestrutura de nuvem segura.'
        },
        {
          question: 'Para que tipos de empresas é adequado?',
          answer: [
            'Ideal para:',
            '• Empresas que exigem processamento de dados personalizado',
            '• Empresas com necessidades complexas de transformação de dados',
            '• Organizações que buscam soluções escaláveis de processamento de dados',
            '• Empresas que precisam de fluxos de trabalho de dados seguros baseados em nuvem'
          ]
        },
        {
          question: 'Como o siftbeam difere de outros serviços de processamento de dados?',
          answer: [
            'Características principais:',
            '• Personalização por cliente: Ao contrário de ferramentas genéricas, o siftbeam oferece fluxos de trabalho totalmente personalizáveis',
            '• Confiabilidade de nível empresarial: Construído sobre infraestrutura de nuvem comprovada',
            '• Sem bloqueio de fornecedor: Formatos de dados padrão e APIs abertas',
            '• Preços transparentes: Pague apenas pelo que você usa'
          ]
        }
      ]
    },
    features: {
      title: 'Recursos e Especificações',
      items: [
        {
          question: 'Quais recursos estão disponíveis?',
          answer: [
            'Recursos principais:',
            '• Gerenciamento flexível de dados: Upload e gerenciamento de arquivos baseados em políticas',
            '• Monitoramento e controle de uso: Monitoramento em tempo real com notificações e restrições automáticas',
            '• Análise de resultados de processamento: Métricas detalhadas e relatórios para otimização operacional',
            '• Armazenamento seguro de arquivos: Processamento de arquivos criptografados com retenção automática de 1 ano',
            '• Suporte multilíngue: Disponível em 9 idiomas (japonês, inglês, chinês, coreano, francês, alemão, espanhol, português, indonésio)'
          ]
        },
        {
          question: 'Por quanto tempo os dados são armazenados?',
          answer: 'Os dados carregados são armazenados automaticamente por 1 ano após o processamento. Os dados são excluídos automaticamente após 1 ano. Não há taxas de armazenamento adicionais.'
        },
        {
          question: 'Quais formatos de dados são suportados?',
          answer: 'Suportamos os principais formatos de dados, incluindo CSV, JSON e mais. Como oferecemos personalização por cliente, entre em contato conosco se precisar de suporte para um formato específico.'
        },
        {
          question: 'Quão personalizável é o processamento de dados?',
          answer: 'Totalmente personalizável para cada cliente. Você pode criar fluxos de trabalho de processamento de dados complexos e definir regras de processamento de forma flexível usando políticas.'
        }
      ]
    },
    pricing: {
      title: 'Preços e Pagamento',
      items: [
        {
          question: 'Qual é a estrutura de preços?',
          answer: [
            'Preços de pagamento conforme o uso:',
            '• Taxa de processamento de dados: $0.00001 por byte (0.001 centavos por byte)',
            '• Armazenamento de 1 ano incluído: Sem cobranças adicionais',
            '• Sem custos iniciais: Sem taxas de configuração ou cobranças mínimas',
            '• Faturamento mensal: Uso do dia 1 ao último dia do mês, faturado no dia 1 do mês seguinte',
            '',
            'Exemplos de preços:',
            '• Arquivo pequeno (100B): $0.001',
            '• Arquivo grande (2MB × 3 arquivos = 6,291,456B): $62.91'
          ]
        },
        {
          question: 'Quais métodos de pagamento estão disponíveis?',
          answer: 'Apenas pagamento com cartão de crédito (via Stripe). A moeda é USD. As cobranças mensais são faturadas automaticamente no dia 1 de cada mês pelo uso do mês anterior.'
        },
        {
          question: 'Existe um teste gratuito?',
          answer: 'Atualmente não oferecemos um teste gratuito. Com nossos preços de pagamento conforme o uso, você paga apenas pelo que usa. Não há taxas mínimas de uso.'
        },
        {
          question: 'Os preços podem mudar?',
          answer: 'Os preços podem mudar com aviso prévio razoável. Consulte a página de preços para obter as informações mais recentes.'
        }
      ]
    },
    security: {
      title: 'Segurança e Conformidade',
      items: [
        {
          question: 'Como a segurança dos dados é garantida?',
          answer: [
            'Implementamos as seguintes medidas de segurança:',
            '• Autenticação: Sistema de autenticação seguro com suporte de autenticação multifator (MFA)',
            '• Criptografia: TLS para dados em trânsito, AES-256 para dados em repouso',
            '• Controle de acesso: Controle de acesso baseado em função com base no princípio do menor privilégio',
            '• Logs de auditoria: Registro de log de auditoria à prova de adulteração',
            '• Gerenciamento de vulnerabilidades: Monitoramento contínuo de segurança e resposta a vulnerabilidades'
          ]
        },
        {
          question: 'Onde os dados são armazenados?',
          answer: 'Os dados são armazenados em infraestrutura de nuvem de nível empresarial. Todos os dados são criptografados e gerenciados sob controles de acesso rigorosos.'
        },
        {
          question: 'E quanto à conformidade?',
          answer: [
            'Estamos em conformidade com os seguintes regulamentos de proteção de dados:',
            '• GDPR: Em conformidade com o Regulamento Geral de Proteção de Dados da UE',
            '• CCPA/CPRA: Em conformidade com as leis de privacidade da Califórnia',
            '• Lei japonesa: Em conformidade com a Lei de Proteção de Informações Pessoais',
            '• Transferência internacional de dados: Medidas de proteção apropriadas, como Cláusulas Contratuais Padrão (SCC) da UE',
            '',
            'Fornecemos uma Política de Privacidade abrangente e um Acordo de Processamento de Dados (DPA). Consulte nossa Política de Privacidade para obter mais detalhes.'
          ]
        }
      ]
    },
    support: {
      title: 'Suporte e Outros',
      items: [
        {
          question: 'Como posso obter suporte?',
          answer: [
            'Opções de suporte:',
            '• Método de contato: Suporte por chat (disponível através do painel de serviço)',
            '• Idiomas: Suporte em 9 idiomas (japonês, inglês, chinês, coreano, francês, alemão, espanhol, português, indonésio)',
            '• Tempo de resposta: Normalmente responde dentro de 3 dias úteis',
            '• Horário comercial: Horário Padrão do Japão (JST)'
          ]
        },
        {
          question: 'Como começo?',
          answer: [
            'Comece em 3 etapas simples:',
            '1. Inscreva-se (https://siftbeam.com/pt/signup/auth)',
            '2. Carregue seus arquivos de dados',
            '3. Configure seu fluxo de trabalho de processamento',
            '4. Monitore o processamento em tempo real',
            '5. Baixe os resultados processados'
          ]
        },
        {
          question: 'Uma API é fornecida?',
          answer: 'Sim, fornecemos APIs para upload de dados e gerenciamento de processamento. Documentação detalhada e código de exemplo estão disponíveis após o registro.'
        }
      ]
    }
  }
};

export default pt;

