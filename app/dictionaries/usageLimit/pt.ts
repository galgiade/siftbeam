import type { UsageLimitLocale } from './usage-limit.d.ts';

const pt: UsageLimitLocale = {
  label: {
    // Comum
    save: "Salvar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Excluir",
    back: "Voltar",
    add: "Adicionar",
    create: "Criar",
    creating: "Salvando...",
    update: "Atualizar",
    
    // Página de criação
    createUsageLimitTitle: "Criar limite de uso",
    createUsageLimitDescription: "Configure limites de volume de processamento de dados ou despesas e selecione a ação a ser tomada quando excedido.",
    usageLimitSettings: "Configurações de limite de uso",
    exceedActionTitle: "Ação ao exceder",
    selectAction: "Selecionar ação",
    notifyOnlyOption: "Apenas notificar",
    restrictOption: "Suspender serviço",
    notifyOnlyDescription: "Um e-mail de notificação será enviado quando o limite for excedido. O serviço permanecerá disponível.",
    restrictDescription: "O serviço será suspenso quando o limite for excedido. Um e-mail de notificação também será enviado.",
    limitTypeTitle: "Tipo de limite",
    dataLimitOption: "Limite de dados",
    amountLimitOption: "Limite de valor",
    dataLimitDescription: "Definir limite baseado em volume de processamento de dados (MB/GB/TB).",
    amountLimitDescription: "Definir limite baseado em custo de processamento (USD).",
    dataLimitTitle: "Valor do limite de dados",
    enterLimitValue: "Inserir valor limite (ex: 100)",
    unit: "Unidade",
    monthlyDataLimitDescription: "A ação será executada quando o volume mensal de processamento de dados exceder este valor.",
    amountLimitTitle: "Valor do limite de valor",
    enterAmountValue: "Inserir valor limite (ex: 50)",
    monthlyAmountLimitDescription: "A ação será executada quando o custo mensal de processamento exceder este valor.",
    notificationSettingsTitle: "Configurações de notificação",
    enterEmailPlaceholder: "Inserir endereço de e-mail (ex: exemplo@empresa.com)",
    notificationEmailList: "Endereços de e-mail de notificação",
    notificationEmailCount: "Endereços de e-mail de notificação ({count})",
    notifyOnlyEmailDescription: "Quando o limite for excedido, uma notificação será enviada para os endereços de e-mail configurados aqui.",
    restrictEmailDescription: "Quando o limite for excedido, o serviço será suspenso e uma notificação será enviada para os endereços de e-mail configurados aqui.",
    cancelButton: "Cancelar",
    createNotifyLimit: "Criar limite de notificação",
    createRestrictLimit: "Criar limite de restrição",
    processingFeeOnly: "apenas taxa de processamento",
    conversionApproximate: "≈",

    // Tela principal
    limitUsageTitle: "Limites de uso",
    usageLimitManagement: "Gerenciamento de limites de uso",
    usageLimitDescription: "Configure limites de uso de dados e valores, e gerencie ações quando excedidos.",
    createLimit: "Criar limite",
    notificationTarget: "Destinatário de notificação",
    detail: "Detalhes",
    createdAt: "Criado em",
    updatedAt: "Atualizado em",
    limitValue: "Valor limite",
    notificationRecipients: "Destinatários de notificação",

    // Tipos de notificação
    notify: "Notificar",
    restrict: "Suspender",
    exceedAction: "Ação ao exceder",
    notifyOnly: "Apenas notificar",
    notifyLimit: "Limite de notificação",
    restrictLimit: "Limite de suspensão",
    notifyLimitDescription: "Quando um limite é definido, uma notificação é enviada quando excedido.",
    restrictLimitDescription: "Quando um limite é definido, o serviço é suspenso quando excedido.",
    noNotifyLimits: "Nenhum limite de notificação configurado",
    noRestrictLimits: "Nenhum limite de suspensão configurado",

    // Valor e uso
    amount: "Valor",
    usage: "Uso",
    editTarget: "Alvo de edição",
    limitType: "Tipo de limite",
    selectLimitType: "Selecionar tipo de limite",
    dataLimitValue: "Valor do limite de dados",
    amountLimitValue: "Valor do limite de valor (USD)",
    dataLimitPlaceholder: "ex: 100",
    amountLimitPlaceholder: "ex: 50",
    orSeparator: "ou",
    noLimit: "Sem limite",

    // Gerenciamento de destinatários
    recipients: "Destinatários",
    emailAddress: "Endereço de e-mail",
    emailPlaceholder: "Inserir endereço de e-mail",
    noRecipientsRegistered: "Nenhum destinatário registrado",
    addEmailAddress: "Endereço de e-mail de notificação",
    minOneEmailRequired: "Pelo menos um endereço de e-mail de notificação é necessário.",

    // Criar / Editar
    usageNotification: "Notificação de uso",
    selectNotifyOrRestrict: "Selecionar notificação ou restrição",
    selectNotificationMethod: "Selecionar método de notificação",
    amountBasedNotification: "Notificação baseada em valor",
    usageBasedNotification: "Notificação baseada em uso",
    enterAmount: "Inserir valor",
    enterUsage: "Inserir uso",
    addNewRecipient: "Adicionar novo destinatário",
    usageConversion: "Conversão de uso",
    amountConversion: "Conversão de valor",
    createNewLimit: "Criar novo limite de uso",
    editLimit: "Editar limite de uso",
    dataLimit: "Limite de dados",
    amountLimit: "Limite de valor",

    // Unidades
    yen: "JPY",
    unitKB: "KB",
    unitMB: "MB",
    unitGB: "GB",
    unitTB: "TB",
    usd: "USD",

    // Tela de erro
    errorOccurred: "Ocorreu um erro",
    errorDetails: "Detalhes do erro",
    reloadPage: "Recarregar página",
    backToAccount: "Voltar à conta",
    contactSupport: "Se o problema persistir, entre em contato com o suporte."
  },
  alert: {
    // Validação
    amountRequired: "Insira o valor de uso",
    usageRequired: "Insira o volume de uso",
    emailRequired: "Insira um endereço de e-mail",
    invalidEmail: "Insira um endereço de e-mail válido.",
    enterPositiveAmount: "Insira um número maior ou igual a 0",
    enterValidUsage: "Insira um número maior que 0 e menor que 1024",
    enterPositiveDataLimit: "O valor do limite de dados deve ser maior que 0.",
    enterPositiveAmountLimit: "O valor do limite de valor deve ser maior que 0.",
    emailAlreadyAdded: "Este endereço de e-mail já foi adicionado.",
    minOneEmail: "Pelo menos um endereço de e-mail de notificação é necessário.",
    selectExceedAction: "Por favor, selecione uma ação ao exceder.",
    selectLimitType: "Por favor, selecione um tipo de limite.",
    dataLimitValueRequired: "O valor do limite de dados deve ser maior que 0.",
    dataLimitValueMax: "O valor do limite de dados deve ser 1.000.000 ou menos.",
    amountLimitValueRequired: "O valor do limite de valor deve ser maior que 0.",
    amountLimitValueMax: "O valor do limite de valor deve ser 100.000 ou menos.",
    minOneEmailRequired: "Por favor, insira pelo menos um endereço de e-mail de notificação.",
    notifyLimitCreated: "O limite de notificação foi criado com sucesso.",
    restrictLimitCreated: "O limite de restrição foi criado com sucesso.",
    errorPrefix: "Erro:",
    unexpectedError: "Ocorreu um erro inesperado:",

    // Resultados de operação
    createFailed: "Falha ao criar limite de uso.",
    updateFailed: "Falha ao atualizar limite de uso.",
    sendingError: "Ocorreu um erro ao enviar.",
    savingInProgress: "Salvando...",
    createSuccess: "O limite de uso foi criado com sucesso.",
    updateSuccess: "O limite de uso foi atualizado com sucesso.",
    deleteSuccess: "O limite de uso foi excluído com sucesso.",
    deleteConfirm: "Excluir este limite de uso?",

    // Permissões
    adminOnlyCreateMessage: "Apenas administradores podem criar limites de uso. Entre em contato com um administrador.",
    adminOnlyEditMessage: "Apenas administradores podem editar limites de uso. Você não tem permissão.",
    adminOnlyDeleteMessage: "Apenas administradores podem excluir limites de uso. Você não tem permissão.",

    // Erros
    loginRequired: "Login necessário.",
    unknownError: "Ocorreu um erro desconhecido.",
    accessDenied: "Você não tem permissão para acessar esta página. Acessível apenas para administradores.",
    fetchFailed: "Falha ao obter dados de limite de uso."
  }
};

export default pt;
