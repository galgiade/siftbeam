import type { UserProfileLocale } from './user.d.ts';

// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
const pt: UserProfileLocale = {
  alert: {
    updateSuccess: "Informações do usuário atualizadas com sucesso.",
    updateFail: "Falha ao atualizar informações do usuário.",
    updateError: "Ocorreu um erro durante a atualização.",
    fieldUpdateSuccess: "{field} foi atualizado com sucesso.",
    fieldUpdateFail: "Falha ao atualizar {field}.",
    emailSent: "Um código de confirmação foi enviado para seu novo endereço de email.",
    emailUpdateSuccess: "Endereço de email atualizado com sucesso.",
    emailUpdateFail: "Falha ao atualizar endereço de email.",
    dbUpdateFail: "Falha ao atualizar banco de dados.",
    dbUpdateError: "Falha na atualização do banco de dados",
    confirmFail: "O código de confirmação está incorreto ou a atualização do banco de dados falhou.",
    invalidConfirmationCode: "O código de confirmação está incorreto. Por favor, insira o código de 6 dígitos correto.",
    expiredConfirmationCode: "O código de confirmação expirou. Por favor, solicite um novo código.",
    noEmailChange: "Nenhuma mudança no endereço de email.",
    invalidEmailFormat: "Formato de email inválido. Por favor, insira um endereço de email válido.",
    noChange: "Nenhuma mudança no nome de usuário.",
    invalidConfirmationCodeFormat: "Por favor, insira um código de confirmação de 6 dígitos.",
    verificationCodeNotFound: "Código de verificação não encontrado ou expirado",
    remainingAttempts: "Tentativas restantes",
    verificationCodeStoreFailed: "Falha ao armazenar o código de verificação. Por favor, verifique as permissões do IAM.",
    codeStoreFailed: "Falha ao salvar o código.",
    adminOnlyEdit: "Somente administradores podem editar este campo.",
    validEmailRequired: "Digite um endereço de e-mail válido."
  },
  label: {
    title: "Informações do Usuário",
    userName: "Nome do Usuário",
    department: "Departamento",
    position: "Cargo",
    email: "Endereço de Email",
    locale: "Idioma",
    role: "Função",
    edit: "Editar",
    save: "Salvar",
    cancel: "Cancelar",
    adminOnly: "(Somente admin)",
    readOnly: "(Não modificável)",
    editableFields: "Editável: Nome de usuário, Idioma",
    adminOnlyFields: "Somente admin: E-mail, Departamento, Cargo",
    allFieldsEditable: "Todos os campos são editáveis",
    newEmailSent: "Código de verificação enviado para \"{email}\".",
    roleAdmin: "Administrador",
    roleUser: "Usuário",
    lastAdminRestriction: "A mudança de função é restrita se você for o último administrador",
    lastAdminNote: "※ Se houver apenas um administrador na organização, a função não poderá ser alterada para usuário regular.",
    generalUserPermission: "Permissão de Usuário Geral",
    adminPermission: "Permissão de Administrador",
    verifyAndUpdate: "Verificar e Atualizar",
    verificationCodePlaceholder: "Código de verificação (6 dígitos)",
    retryAfter: "Tentar novamente disponível após"
  },
  modal: {
    modalTitle: "Confirmação de Email",
    description: "Por favor, insira o código de confirmação enviado para seu novo endereço de email ({email}).",
    codeLabel: "Código de Confirmação",
    cancel: "Cancelar",
    confirm: "Confirmar",
    resend: "Reenviar",
    verifying: "Verificando..."
  }
}

export default pt;


