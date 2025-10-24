export default {
  "table": {
    "id": "ID",
    "userName": "Nome do usuário",
    "policyName": "Nome da política",
    "usageAmountBytes": "Uso",
    "status": "Status",
    "errorDetail": "Erro",
    "createdAt": "Data de início",
    "updatedAt": "Data de atualização",
    "download": "Baixar",
    "aiTraining": "Treinamento IA",
    "delete": "Excluir",
    "ariaLabel": "Tabela de histórico de processamento de dados"
  },
  "status": {
    "in_progress": "Em andamento",
    "success": "Concluído",
    "failed": "Falhou",
    "canceled": "Cancelado",
    "deleted": "Excluído",
    "delete_failed": "Falha na exclusão"
  },
  "notification": {
    "uploadSuccess": "Upload de arquivo concluído. O processamento de dados será iniciado.",
    "uploadError": "Falha no upload.",
    "uploadProcessingError": "Ocorreu um erro durante o processamento do upload.",
    "uploadFailed": "Falha no upload do arquivo. Por favor, tente novamente.",
    "fetchFailed": "Falha ao buscar dados.",
    "aiTrainingChanged": "A permissão de treinamento de IA foi alterada.",
    "deleteCompleted": "Exclusão de arquivo concluída.",
    "uploadCompleted": "Upload concluído.",
    "uploadFailedGeneric": "Falha no upload.",
    "dataFetchFailed": "Falha ao buscar dados.",
    "notificationSent": "E-mail de notificação enviado com sucesso.",
    "notificationFailed": "Falha ao enviar notificação.",
    "notificationError": "Ocorreu um erro ao enviar a notificação.",
    "dataUpdated": "Dados atualizados com sucesso."
  },
  "filter": {
    "userName": {
      "placeholder": "Pesquisar por nome de usuário",
      "ariaLabel": "Pesquisa por nome de usuário"
    },
    "policyName": {
      "placeholder": "Pesquisar por nome de política",
      "ariaLabel": "Pesquisa por nome de política"
    },
    "dateRange": {
      "label": "Intervalo de datas",
      "startDate": {
        "placeholder": "Data de início",
        "ariaLabel": "Seleção de data de início"
      },
      "endDate": {
        "placeholder": "Data de fim",
        "ariaLabel": "Seleção de data de fim"
      },
      "separator": "~"
    },
    "minUsage": {
      "label": "Uso mínimo",
      "placeholder": "Mín",
      "ariaLabel": "Uso mínimo"
    },
    "maxUsage": {
      "label": "Uso máximo",
      "placeholder": "Máx",
      "ariaLabel": "Uso máximo"
    },
    "reset": "Redefinir filtros",
    "rangeSeparator": "~",
    "refresh": "Atualizar dados",
    "deleteSelected": "Excluir itens selecionados"
  },
  "policy": {
    "select": "Selecionar política",
    "none": "Nenhuma política foi criada.",
    "create": "Criar política",
    "noPolicies": "Nenhuma política foi criada.",
    "createPolicy": "Criar política"
  },
  "deleteDialog": {
    "title": "Confirmação de exclusão",
    "warn1": "Os arquivos selecionados serão excluídos permanentemente.",
    "warn2": "Uma vez excluídos, os arquivos processados não podem ser baixados.",
    "warn3": "Além disso, não podem ser usados para treinamento de IA.",
    "warn4": "Esta ação não pode ser desfeita. Por favor, tenha cuidado.",
    "confirm": "Tem certeza de que deseja excluir? Por favor, digite 'EXCLUIR'.",
    "cancel": "Cancelar",
    "delete": "Excluir"
  },
  "limitUsage": {
    "title": "Status do limite de uso",
    "status": {
      "normal": "Normal",
      "warning": "Aviso",
      "exceeded": "Excedido"
    },
    "current": "Atual:",
    "limit": "Limite:",
    "noLimit": "Sem limite",
    "exceedAction": {
      "notify": "Notificar",
      "restrict": "Restringir"
    },
    "testNotification": "Enviar notificação de teste",
    "limitTypes": {
      "usage": "Limite de uso",
      "amount": "Limite de valor"
    },
    "unknownCompany": "Empresa desconhecida"
  },
  "tableEmpty": "Nenhum histórico de processamento de dados.",
  "pagination": {
    "prev": "Anterior",
    "next": "Próximo"
  },
  "displayCount": "Mostrando {shown} de {total} (Todos {all})"
} as const;


