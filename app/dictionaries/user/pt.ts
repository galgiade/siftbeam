// 当面は英語を転用（将来の完全翻訳に備えてファイルを分離）
export const pt = {
  alert: {
    updateSuccess: "Informações do usuário atualizadas com sucesso.",
    updateFail: "Falha ao atualizar informações do usuário.",
    emailSent: "Um código de confirmação foi enviado para seu novo endereço de email.",
    emailUpdateSuccess: "Endereço de email atualizado com sucesso.",
    emailUpdateFail: "Falha ao atualizar endereço de email.",
    dbUpdateFail: "Falha ao atualizar banco de dados.",
    dbUpdateError: "Falha na atualização do banco de dados",
    confirmFail: "O código de confirmação está incorreto ou a atualização do banco de dados falhou.",
    invalidConfirmationCode: "O código de confirmação está incorreto. Por favor, insira o código de 6 dígitos correto.",
    expiredConfirmationCode: "O código de confirmação expirou. Por favor, solicite um novo código.",
    userAlreadyExists: "Este endereço de email já está registrado. Por favor, use um endereço de email diferente.",
    usernameExists: "Este nome de usuário já está em uso. Por favor, use um nome de usuário diferente.",
    noEmailChange: "Nenhuma mudança no endereço de email.",
    invalidEmailFormat: "Formato de email inválido. Por favor, insira um endereço de email válido.",
    emailChangeCancelled: "A mudança de endereço de email foi cancelada.",
    emailChangeCancelFailed: "Falha ao cancelar a mudança de endereço de email.",
    emailChangeReset: "A mudança de endereço de email não confirmada foi redefinida.",
    noChange: "Nenhuma mudança no nome de usuário.",
    resendLimitExceeded: "O limite de reenvio foi excedido. Por favor, tente novamente mais tarde.",
    resendFailed: "Falha ao reenviar o código de confirmação. Por favor, tente novamente.",
    invalidConfirmationCodeFormat: "Por favor, insira um código de confirmação de 6 dígitos.",
    confirmationAttemptLimitExceeded: "O limite de tentativas de confirmação foi excedido. Por favor, tente novamente mais tarde.",
    authenticationFailed: "A autenticação falhou. Por favor, faça login novamente e tente.",
    invalidUsernameFormat: "Formato de nome de usuário inválido. Por favor, insira um nome de usuário válido.",
    usernameChangeLimitExceeded: "O limite de mudança de nome de usuário foi excedido. Por favor, tente novamente mais tarde.",
    atLeastOneFieldRequired: "Pelo menos um campo deve ser atualizado",
    verificationCodeNotFound: "Código de verificação não encontrado ou expirado",
    remainingAttempts: "Tentativas restantes",
    verificationCodeStoreFailed: "Falha ao armazenar o código de verificação. Por favor, verifique as permissões do IAM."
  },
  label: {
    title: "Informações do Usuário",
    userName: "Nome do Usuário",
    department: "Departamento",
    position: "Cargo",
    email: "Endereço de Email"
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


