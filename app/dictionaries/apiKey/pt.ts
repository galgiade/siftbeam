import type { APIKeyLocale } from './apiKey.d';

const pt: APIKeyLocale = {
  title: 'Gerenciamento de Chaves API',
  actions: {
    create: 'Criar',
    edit: 'Editar',
    delete: 'Excluir',
    save: 'Salvar',
    cancel: 'Cancelar',
    back: 'Voltar',
  },
  table: {
    apiName: 'Nome da API',
    description: 'Descrição',
    createdAt: 'Criado em',
    endpoint: 'Endpoint',
    actions: 'Ações',
  },
  modal: {
    title: 'Editar Chave API',
    apiName: 'Nome da API',
    description: 'Descrição',
  },
  messages: {
    noData: 'Sem dados',
    updateFailed: 'Falha ao atualizar',
    deleteFailed: 'Falha ao excluir',
    confirmDelete: 'Excluir esta chave API? Esta ação não pode ser desfeita.',
    createFailed: 'Falha ao criar',
    idRequired: 'id é obrigatório',
    deleteSuccess: 'Excluído com sucesso',
    functionNameNotSet: 'APIGW_KEY_ISSUER_FUNCTION_NAME não está definido',
    apiGatewayDeleteFailed: 'Falha ao excluir a chave do API Gateway',
    idAndApiNameRequired: 'id e apiName são obrigatórios',
    updateSuccess: 'Atualizado com sucesso',
  },
  alerts: {
    adminOnlyCreate: 'Apenas administradores podem criar',
    adminOnlyEdit: 'Apenas administradores podem editar',
    adminOnlyDelete: 'Apenas administradores podem excluir',
  },
  create: {
    title: 'Emitir Chave API',
    fields: {
      apiName: 'Nome da API',
      apiDescription: 'Descrição da API',
      policy: 'Tipo de API (Política)',
    },
    submit: 'Emitir Chave API',
    issuedNote: 'A chave é mostrada apenas uma vez. Salve-a com segurança.',
    endpointLabel: 'Endpoint de Upload',
    instructions: 'Configure o seguinte no seu dispositivo.',
    apiKeyHeaderLabel: 'Chave API (cabeçalho x-api-key)',
    uploadExampleTitle: 'Exemplo de upload (PowerShell / PNG)',
    csvNote: 'Para CSV, defina Content-Type como text/csv. Ajuste para outros tipos de arquivo.',
    filePathNote: 'Especifique o caminho para seu arquivo',
  },
};

export default pt;

