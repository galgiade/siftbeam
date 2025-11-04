import type { SupportCenterLocale } from './createSupportCenter.d.ts';

const pt: SupportCenterLocale = {
  label: {
    pageTitle: "Central de suporte",
    supportRequestList: "Lista de solicitações de suporte",
    newRequest: "Nova solicitação",
    noRequests: "Não há solicitações de suporte",
    issueType: "Tipo de problema",
    issueTypePlaceholder: "Selecione o tipo de problema",
    technical: "Problema técnico",
    account: "Problema de conta",
    billing: "Problema de pagamento",
    other: "Outro",
    subject: "Assunto",
    subjectPlaceholder: "Digite o assunto",
    description: "Detalhes do problema",
    descriptionPlaceholder: "Descreva os detalhes do problema",
    cancel: "Cancelar",
    submit: "Enviar",
    submitting: "Enviando...",
    status: "Status",
    creator: "Autor",
    createdAt: "Criado",
    updatedAt: "Atualizado",
    statusOpen: "Aberto",
    statusInProgress: "Em andamento",
    statusClosed: "Resolvido",
    back: "← Voltar",
    reply: "Responder",
    replyContent: "Conteúdo da resposta",
    inquiryContent: "Conteúdo da consulta",
    attachedFiles: "Arquivos anexados",
    messagePlaceholder: "Digite uma mensagem",
    markResolved: "Marcar como resolvido",
    markUnresolved: "Marcar como não resolvido",
    staff: "Equipe",
    problemType: "Tipo de problema",
    technicalIssue: "Problema técnico",
    accountRelated: "Relacionado à conta",
    billingRelated: "Relacionado à cobrança",
    deleteFile: "Excluir arquivo",
    fileRemoved: "Arquivo excluído"
  },
  alert: {
    requestReceived: "Recebemos sua solicitação. Aguarde o contato da equipe.",
    submitFailed: "Falha ao enviar a solicitação de suporte",
    subjectRequired: "Por favor, insira um assunto",
    descriptionRequired: "Por favor, insira uma descrição",
    messageRequired: "Digite uma mensagem",
    supportRequestError: "Erro ao obter a solicitação de suporte:"
  }
};

export default pt;