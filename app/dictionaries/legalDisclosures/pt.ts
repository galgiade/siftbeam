import type LegalDisclosuresLocale from "./legalDisclosures";

const pt: LegalDisclosuresLocale = {
  title: "Divulgações Legais e Termos Comerciais",
  intro: "Esta divulgação é fornecida de acordo com as leis e regulamentos aplicáveis de proteção ao consumidor. ConnectTech Inc. (\"nós\", \"nosso\", \"nossa\") fornece as seguintes informações sobre nosso serviço \"siftbeam\".",
  sections: {
    company: {
      title: "Informações da Empresa",
      items: [
        "Nome da empresa: ConnectTech Inc.",
        "Representante: Kazuaki Matsui",
        "Endereço: Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japão",
        "Telefone: Disponível mediante solicitação",
        "Email: connectechceomatsui@gmail.com",
        "Suporte: Suporte por chat (geralmente responde dentro de 3 dias úteis)",
        "Site: https://siftbeam.com",
      ],
    },
    pricing: {
      title: "Preços e Taxas do Serviço",
      items: [
        "Preços de pagamento por uso (Moeda: USD)",
        "Taxa de processamento de dados: 0,001 centavos US por byte (inclui 1 ano de armazenamento)",
        "Dados processados são armazenados por 1 ano e então excluídos automaticamente",
        "Sem nível gratuito, taxa mínima de uso ou custos de configuração",
        "Os preços podem mudar com aviso prévio razoável",
      ],
    },
    payment: {
      title: "Métodos de Pagamento e Termos",
      items: [
        "Método de pagamento: Cartão de crédito (via Stripe)",
        "Ciclo de cobrança: Final do mês",
        "Data de pagamento: 5 de cada mês",
        "Arredondamento: Pode ocorrer baseado na precisão de moeda do Stripe e unidades mínimas de pagamento",
        "Impostos: Taxas adicionais podem se aplicar conforme a lei",
        "Taxas adicionais: Custos de conexão à Internet (responsabilidade do cliente)",
      ],
    },
    service: {
      title: "Entrega do Serviço",
      items: [
        "Disponibilidade do serviço: Imediatamente após confirmação do pagamento",
        "Requisitos do sistema: Versões mais recentes do Google Chrome, Microsoft Edge ou Safari recomendadas",
      ],
    },
    cancellation: {
      title: "Cancelamento e Reembolsos",
      items: [
        "Cancelamento disponível a qualquer momento através das configurações da conta",
        "Após solicitação de cancelamento, os dados do usuário são retidos por até 90 dias para conformidade legal, suporte e cobrança",
        "Durante o período de retenção, o acesso ao serviço fica desabilitado e não há taxas adicionais",
        "Exclusão imediata disponível mediante solicitação ao suporte (sem taxas de armazenamento adicionais)",
        "Exclusão completa automática após 90 dias (exclusão de backup pode requerer tempo adicional)",
        "Devido à natureza dos serviços digitais, reembolsos não estão disponíveis para serviços já fornecidos (exceto quando exigido por lei)",
      ],
    },
    environment: {
      title: "Requisitos do Sistema",
      items: [
        "Versões mais recentes do Google Chrome, Microsoft Edge ou Safari recomendadas",
        "Conexão à Internet necessária",
      ],
    },
    restrictions: {
      title: "Limitações de Uso",
      items: [
        "Sem limitações específicas",
      ],
    },
    validity: {
      title: "Período de Validade da Solicitação",
      items: [
        "Sem período de validade específico",
      ],
    },
    specialConditions: {
      title: "Condições Especiais",
      items: [
        "Testes gratuitos e ofertas especiais sujeitos aos nossos termos e condições",
      ],
    },
    businessHours: {
      title: "Horário Comercial e Suporte",
      items: [
        "Sem horário comercial fixo",
        "Suporte disponível apenas por chat, geralmente responde dentro de 3 dias úteis",
      ],
    },
    governingLaw: {
      title: "Lei Aplicável e Jurisdição",
      items: [
        "Regido pela lei japonesa",
        "Disputas sujeitas à jurisdição exclusiva do Tribunal de Distrito de Hamamatsu (conforme Termos de Serviço)",
      ],
    },
  },
  appendix: {
    lastUpdated: "21 de setembro de 2025",
    company: {
      name: "ConnectTech Inc.",
      address: "Dias Waigo 202, 315-1485 Waigo-cho, Naka-ku, Hamamatsu-shi, Shizuoka, Japão",
      representative: "Kazuaki Matsui",
      contact: "connectechceomatsui@gmail.com",
    },
  },
};

export default pt;
