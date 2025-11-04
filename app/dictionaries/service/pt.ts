import type { ServiceLocale } from './ServiceLocale.d.ts';

const pt: ServiceLocale = {
  page: {
    title: "Serviços",
    description:
      "Selecione uma política, envie arquivos e execute o processamento. Os dados processados são armazenados gratuitamente por um ano.",
    loading: "Carregando..."
  },
  error: {
    title: "Ocorreu um erro",
    loginRequired: "É necessário fazer login.",
    processingHistoryFetchFailed: "Não foi possível obter o histórico de processamento.",
    policiesFetchFailed: "Não foi possível obter as políticas.",
    usageLimitsFetchFailed: "Não foi possível obter os limites de uso.",
    pageLoadFailed: "Não foi possível carregar a página de serviços.",
    suggestion1: "Atualize a página.",
    suggestion2: "Se o problema persistir, contate o suporte."
  },
  limits: {
    notifyLimit: {
      title: "Limites de notificação",
      limitValue: "Valor limite:",
      exceedAction: "Ação quando excedido:",
      currentUsage: "Uso atual:",
      notSet: "Nenhum limite de notificação configurado",
      currentUsageLabel: "Uso atual:",
      settingsCount: "Limites de notificação configurados: {count}",
      dataLimit: "Limite de dados: {value} {unit} ({bytes})",
      amountLimit: "Limite de valor: ${amount}",
      noLimitValue: "Nenhum valor limite definido",
      amountConversionNote:
        "Observação: o limite de valor é mostrado convertido em uso de dados (taxa de processamento: US$ 0,00001/byte, inclui 1 ano de armazenamento)."
    },
    restrictLimit: {
      title: "Limites de suspensão",
      limitValue: "Valor limite:",
      exceedAction: "Ação quando excedido:",
      currentUsage: "Uso atual:",
      notSet: "Nenhum limite de suspensão configurado",
      currentUsageLabel: "Uso atual:",
      settingsCount: "Limites de suspensão configurados: {count}",
      dataLimit: "Limite de dados: {value} {unit} ({bytes})",
      amountLimit: "Limite de valor: ${amount}",
      noLimitValue: "Nenhum valor limite definido",
      amountConversionNote:
        "Observação: o limite de valor é mostrado convertido em uso de dados (taxa de processamento: US$ 0,00001/byte, inclui 1 ano de armazenamento)."
    },
    perMonth: "/mês",
    notifyAction: "Notificar",
    restrictAction: "Suspender"
  },
  policySelection: {
    title: "Seleção de política",
    label: "Selecione uma política de processamento",
    placeholder: "Selecione uma política",
    noPolicies: "Nenhuma política disponível"
  },
  fileUpload: {
    title: "Envio de arquivos",
    selectPolicyFirst: "Selecione uma política primeiro",
    noPoliciesAvailable: "Nenhuma política disponível",
    dragAndDrop: "Arraste e solte os arquivos",
    orClickToSelect: "ou clique para selecionar",
    maxFiles: "Até {max} arquivos, cada um com até 100 MB",
    supportedFormats: "Formatos suportados: utilize os formatos especificados em {formats}",
    selectedFiles: "Arquivos selecionados ({count}/{max})",
    deleteAll: "Excluir tudo",
    fileSizeLimit: "{name} é muito grande. Escolha um arquivo de até 100 MB.",
    pending: "Pendente",
    uploading: "Enviando",
    completed: "Concluído",
    error: "Erro",
    startProcessing: "Iniciar processamento",
    processing: "Iniciando processamento...",
    uploadComplete: "Envio concluído",
    uploadCompletedMessage: "{count} arquivos enviados e o processamento de IA foi iniciado!",
    uploadNotAllowed: "Envio não permitido",
    notifyLimitReached: "Limite de notificação atingido",
    notifyLimitReachedMessage: "Limite de notificação ({limit}) atingido. {count} e-mails de notificação enviados."
  },
  table: {
    id: "ID",
    userName: "Nome do usuário",
    policyName: "Nome da política",
    usageAmountBytes: "Uso",
    status: "Status",
    errorDetail: "Erro",
    createdAt: "Data de início",
    updatedAt: "Data de atualização",
    download: "Download",
    aiTraining: "Uso de IA",
    delete: "Excluir",
    ariaLabel: "Tabela de histórico de processamento de dados"
  },
  status: {
    in_progress: "Em andamento",
    success: "Concluído",
    failed: "Falhou",
    canceled: "Cancelado",
    deleted: "Excluído",
    delete_failed: "Falha ao excluir"
  },
  notification: {
    uploadSuccess: "O envio do arquivo foi concluído. O processamento de dados será iniciado.",
    uploadError: "Falha no envio.",
    uploadProcessingError: "Ocorreu um erro durante o processamento do envio.",
    uploadFailed: "Falha ao enviar o arquivo. Tente novamente.",
    fetchFailed: "Não foi possível obter os dados.",
    aiTrainingChanged: "A permissão de uso para treinamento de IA foi alterada.",
    deleteCompleted: "O arquivo foi excluído com sucesso.",
    uploadCompleted: "Envio concluído.",
    uploadFailedGeneric: "O envio falhou.",
    dataFetchFailed: "Não foi possível obter os dados.",
    notificationSent: "E-mail de notificação enviado.",
    notificationFailed: "Não foi possível enviar a notificação.",
    notificationError: "Ocorreu um erro ao enviar a notificação.",
    dataUpdated: "Dados atualizados."
  },
  filter: {
    userName: {
      placeholder: "Pesquisar por nome de usuário",
      ariaLabel: "Pesquisa por nome de usuário"
    },
    policyName: {
      placeholder: "Pesquisar por nome de política",
      ariaLabel: "Pesquisa por nome de política"
    },
    dateRange: {
      label: "Intervalo de datas",
      startDate: {
        placeholder: "Data de início",
        ariaLabel: "Seleção de data de início"
      },
      endDate: {
        placeholder: "Data de fim",
        ariaLabel: "Seleção de data de fim"
      },
      separator: "~"
    },
    minUsage: {
      label: "Uso mínimo",
      placeholder: "Mín",
      ariaLabel: "Uso mínimo"
    },
    maxUsage: {
      label: "Uso máximo",
      placeholder: "Máx",
      ariaLabel: "Uso máximo"
    },
    reset: "Redefinir filtros",
    rangeSeparator: "~",
    refresh: "Atualizar dados",
    deleteSelected: "Excluir itens selecionados"
  },
  policy: {
    select: "Selecionar política",
    none: "Nenhuma política foi criada.",
    create: "Criar política",
    noPolicies: "Nenhuma política foi criada.",
    createPolicy: "Criar política"
  },
  deleteDialog: {
    title: "Confirmação de exclusão",
    warn1: "Os arquivos selecionados serão excluídos permanentemente.",
    warn2: "Depois de excluídos, os arquivos processados não poderão ser baixados.",
    warn3: "Eles também não poderão ser usados para treinamento de IA.",
    warn4: "Essa ação não pode ser desfeita. Tenha cuidado.",
    confirm: "Tem certeza de que deseja excluir? Digite \"DELETE\".",
    cancel: "Cancelar",
    delete: "Excluir"
  },
  limitUsage: {
    title: "Status do limite de uso",
    status: {
      normal: "Normal",
      warning: "Aviso",
      exceeded: "Excedido"
    },
    current: "Atual:",
    limit: "Limite:",
    noLimit: "Sem limite",
    exceedAction: {
      notify: "Notificar",
      restrict: "Suspender"
    },
    testNotification: "Enviar notificação de teste",
    limitTypes: {
      usage: "Limite de uso",
      amount: "Limite de valor"
    },
    unknownCompany: "Empresa desconhecida"
  },
  tableEmpty: "Nenhum histórico de processamento de dados.",
  pagination: {
    prev: "Anterior",
    next: "Próximo"
  },
  displayCount: "Exibindo {shown} de {total} (Total {all})",
  processingHistory: {
    title: "Histórico de processamento",
    count: "({count} itens)",
    refresh: "Atualizar",
    empty: "Nenhum histórico de processamento.",
    emptyDescription: "Envie arquivos e inicie o processamento para ver o histórico aqui.",
    noDownloadableFiles: "Nenhum arquivo disponível para download.",
    noOutputFiles: "Nenhum arquivo de saída disponível para download.",
    downloadFailed: "Falha ao baixar.",
    aiTrainingUpdateFailed: "Falha ao atualizar o uso de treinamento de IA.",
    fileExpiredTooltip: "O arquivo foi excluído porque o período de armazenamento (1 ano) expirou.",
    unknownUser: "Usuário desconhecido",
    allow: "Permitir",
    deny: "Negar",
    columns: {
      policy: "Política",
      user: "Usuário",
      status: "Status",
      startTime: "Hora de início",
      fileSize: "Tamanho do arquivo",
      aiTraining: "Uso de IA",
      errorDetail: "Detalhe do erro",
      download: "Download"
    }
  }
};

export default pt;