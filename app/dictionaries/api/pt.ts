const pt = {
  errors: {
    general: {
      serverError: "Ocorreu um erro no servidor",
      networkError: "Ocorreu um erro de rede",
      unauthorized: "Autenticação necessária",
      forbidden: "Acesso negado",
      notFound: "Recurso não encontrado",
      validationError: "Dados de entrada inválidos",
      conflict: "Ocorreu um conflito de dados",
      unexpectedError: "Ocorreu um erro inesperado",
      unknownError: "Ocorreu um erro desconhecido",
      targetNotFound: "Alvo para atualização não encontrado",
      operationFailed: "Falha na operação",
      processingError: "Ocorreu um erro durante o processamento",
      relatedResourceDeleteError: "Erro ao excluir recursos relacionados",
      partialOperationFailed: "Algumas operações falharam",
      rollbackFailed: "Falha ao reverter"
    },
    auth: {
      notAuthenticated: "Não autenticado",
      insufficientPermissions: "Permissões insuficientes",
      accessDenied: "Acesso negado",
      companyNotSet: "As informações da empresa não estão definidas",
      adminRightsRequired: "Privilégios de administrador necessários",
      adminPermissionRequired: "Permissão de administrador necessária",
      codeIncorrect: "O código de verificação está incorreto",
      codeExpired: "O código de verificação expirou",
      userNotFound: "Usuário não encontrado",
      signInFailed: "Falha ao entrar",
      credentialsIncorrect: "E-mail ou senha incorretos",
      accountNotConfirmed: "Conta não confirmada. Conclua a verificação por e-mail",
      passwordResetRequired: "É necessário redefinir a senha",
      userNotAuthenticated: "Usuário não autenticado",
      getCurrentUserFailed: "Falha ao obter usuário atual",
      missingParameters: "Parâmetros obrigatórios ausentes: userId, email",
      check2FAStatusFailed: "Falha ao verificar o status 2FA",
      missingEmailParameters: "Parâmetros obrigatórios ausentes: userId, newEmail, userPoolId",
      invalidEmailFormat: "Formato de email inválido",
      cognitoEmailUpdateSuccess: "Email do Cognito atualizado com sucesso",
      cognitoEmailUpdateFailed: "Falha ao atualizar email do Cognito",
      userNotFoundInCognito: "Usuário não encontrado no Cognito",
      invalidEmailOrUserId: "Formato de email inválido ou ID de usuário",
      notAuthorizedToUpdateUser: "Não autorizado a atualizar usuário",
      missingUsernameParameters: "Parâmetros obrigatórios ausentes: userId, newUsername, userPoolId",
      invalidUsernameFormat: "Formato de nome de usuário inválido",
      cognitoUsernameUpdateSuccess: "Nome de usuário do Cognito atualizado com sucesso",
      cognitoUsernameUpdateFailed: "Falha ao atualizar nome de usuário do Cognito",
      invalidUsernameOrUserId: "Formato de nome de usuário inválido ou ID de usuário",
      usernameAlreadyExists: "Nome de usuário já existe",
      missingVerificationParameters: "Parâmetros obrigatórios ausentes: userId, email, code, userPoolId",
      verificationCodeNotFound: "Código de verificação não encontrado ou expirado",
      verificationCodeExpired: "O código de verificação expirou",
      tooManyFailedAttempts: "Muitas tentativas falharam",
      invalidVerificationCode: "Código de verificação inválido",
      emailVerificationSuccess: "Verificação de email bem-sucedida e Cognito atualizado",
      emailVerificationFailed: "Falha ao verificar o código de email",
      missingStoreParameters: "Parâmetros obrigatórios ausentes: userId, email, code, userType",
      verificationCodeStoredSuccess: "Código de verificação armazenado com sucesso",
      verificationCodeStoreFailed: "Falha ao armazenar o código de verificação"
    },
    validation: {
      userIdRequired: "ID do usuário é obrigatório",
      customerIdRequired: "ID do cliente é obrigatório",
      groupIdRequired: "ID do grupo é obrigatório",
      policyIdRequired: "ID da política é obrigatório",
      supportRequestIdRequired: "ID da solicitação de suporte é obrigatório",
      newOrderRequestIdRequired: "ID da nova solicitação é obrigatório",
      statusRequired: "Status é obrigatório",
      userGroupIdRequired: "ID do grupo de usuários é obrigatório",
      groupIdRequiredForValidation: "ID do grupo é obrigatório",
      userIdRequiredForValidation: "ID do usuário é obrigatório",
      fieldRequired: "Este campo é obrigatório",
      validEmailRequired: "Digite um e-mail válido",
      minLength: "São necessários pelo menos {count} caracteres",
      maxLength: "São permitidos no máximo {count} caracteres",
      passwordMinLength: "A senha deve ter pelo menos 8 caracteres",
      passwordUppercase: "Deve incluir letras maiúsculas",
      passwordLowercase: "Deve incluir letras minúsculas",
      passwordNumber: "Deve incluir números",
      passwordSpecialChar: "Deve incluir caracteres especiais",
      passwordMismatch: "As senhas não coincidem",
      userNameRequired: "Nome de usuário é obrigatório",
      emailRequired: "E-mail é obrigatório",
      companyIdRequired: "ID da empresa é obrigatório",
      departmentRequired: "Departamento é obrigatório",
      positionRequired: "Cargo é obrigatório",
      roleRequired: "Papel é obrigatório",
      usageMinZero: "O uso deve ser 0 ou maior",
      positiveNumber: "Deve ser um valor positivo",
      nonNegativeNumber: "Deve ser 0 ou maior",
      invalidEmail: "Digite um e-mail válido",
      required: "Este campo é obrigatório",
      policyIdsMinOne: "Selecione pelo menos uma política",
      userIdsMinOne: "Selecione pelo menos um usuário",
      emailsMinOne: "Especifique pelo menos um e-mail",
      emailsValid: "Digite um e-mail válido",
      invalidExceedAction: "Selecione notificar ou restringir",
      invalidNotifyType: "Selecione valor ou uso",
      invalidUnit: "Selecione KB, MB, GB ou TB",
      invalidAiTrainingUsage: "Selecione permitir ou negar",
      invalidStatus: "Selecione OPEN, IN_PROGRESS ou CLOSED",
      invalidIssueType: "Selecione técnico, conta, faturamento ou outro",
      invalidAction: "Selecione READ, CREATE, UPDATE, DELETE, ATTACH ou DETACH",
      invalidResource: "Tipo de recurso inválido",
      invalidDataType: "Selecione tabela, imagem ou texto",
      invalidModelType: "Selecione clustering, prediction ou classification",
      notifyTypeAmountRequired: "Digite valor ou uso conforme o método",
      notifyTypeUsageRequired: "Ao selecionar notificação por uso, a unidade é obrigatória",
      usageUnitRequired: "Ao selecionar notificação por uso, a unidade é obrigatória",
      companyNameRequired: "Nome da empresa é obrigatório",
      stateRequired: "Estado/Província é obrigatório",
      cityRequired: "Cidade é obrigatória",
      streetAddressRequired: "Endereço é obrigatório",
      groupNameRequired: "Nome do grupo é obrigatório",
      policyNameRequired: "Nome da política é obrigatório",
      subjectRequired: "Assunto é obrigatório",
      descriptionRequired: "Descrição é obrigatória",
      messageRequired: "Mensagem é obrigatória",
      resourceNameRequired: "Nome do recurso é obrigatório",
      preferredUsernameRequired: "Nome de usuário é obrigatório",
      localeRequired: "Configuração regional é obrigatória",
      confirmationCodeRequired: "Código de verificação é obrigatório",
      challengeResponseRequired: "Resposta de desafio é obrigatória",
      limitUsageIdRequired: "ID do limite de uso é obrigatório",
      isStaffInvalid: "A marca de funcionário deve ser booleana"
    },
    user: {
      fetchFailed: "Falha ao obter informações do usuário",
      accessDenied: "Acesso negado a estas informações do usuário",
      notFound: "Usuário não encontrado",
      companyAccessDenied: "Acesso negado às informações de usuários desta empresa",
      batchFetchFailed: "Erro ao obter múltiplas informações de usuário",
      updateFailed: "Falha ao atualizar informações do usuário",
      createFailed: "Falha ao criar usuário",
      deleteFailed: "Falha ao excluir usuário",
      userGroupFetchFailed: "Falha ao obter informações do grupo de usuários",
      userGroupDeleteFailed: "Falha ao excluir grupo de usuários",
      rollbackFailed: "Falha ao reverter exclusão",
      noUpdateFields: "Nenhum campo de atualização especificado",
      updateError: "Erro ao atualizar usuário",
      userNameEmpty: "O nome de usuário não pode estar vazio",
      emailEmpty: "O email não pode estar vazio",
      departmentEmpty: "O departamento não pode estar vazio",
      positionEmpty: "A posição não pode estar vazia",
      roleEmpty: "O papel não pode estar vazio",
      fieldRequired: "{field} é obrigatório"
    },
    policy: {
      fetchFailed: "Falha ao obter informações da política",
      accessDenied: "Acesso negado a estas informações da política",
      batchFetchFailed: "Erro ao obter múltiplas informações de política do cliente",
      createFailed: "Falha ao criar política",
      updateFailed: "Falha ao atualizar política",
      deleteFailed: "Falha ao excluir política",
      idRequired: "ID de política válido é obrigatório",
      notFound: "Política especificada não encontrada",
      noUpdateFields: "Nenhum campo de atualização especificado",
      updateError: "Erro ao atualizar política"
    },
    group: {
      fetchFailed: "Falha ao obter grupo",
      accessDenied: "Acesso negado",
      listFetchFailed: "Falha ao obter lista de grupos",
      updateFailed: "Falha ao atualizar grupo",
      createFailed: "Falha ao criar grupo",
      deleteFailed: "Falha ao excluir grupo",
      userGroupDeleteFailed: "Falha ao excluir grupo de usuários",
      groupPolicyDeleteFailed: "Falha ao excluir política de grupo",
      rollbackFailed: "Falha ao reverter"
    },
    userGroup: {
      fetchFailed: "Falha ao obter informações do grupo de usuários",
      accessDenied: "Acesso negado a estas informações do grupo de usuários",
      batchFetchFailed: "Erro ao obter múltiplas informações do grupo de usuários",
      companyFetchFailed: "Falha ao obter por ID do cliente",
      groupFetchFailed: "Falha ao obter por ID do grupo",
      userFetchFailed: "Falha ao obter por ID do usuário",
      membershipCheckFailed: "Falha ao verificar associação",
      createFailed: "Falha ao criar grupo de usuários",
      updateFailed: "Falha ao atualizar grupo de usuários",
      deleteFailed: "Falha ao excluir grupo de usuários",
      noUpdateFields: "Nenhum campo de atualização especificado",
      updateError: "Erro ao atualizar grupo de usuários"
    },
    groupPolicy: {
      fetchFailed: "Falha ao obter informações da política de grupo",
      accessDenied: "Acesso negado a estas informações",
      batchFetchFailed: "Erro ao obter múltiplas informações da política de grupo",
      policyFetchFailed: "Falha ao obter por ID da política",
      groupFetchFailed: "Falha ao obter por ID do grupo",
      createFailed: "Falha ao criar política de grupo",
      deleteFailed: "Falha ao excluir política de grupo"
    },
    supportRequest: {
      fetchFailed: "Falha ao obter solicitação de suporte",
      accessDenied: "Acesso negado a esta solicitação",
      notFound: "Solicitação especificada não encontrada",
      otherCompanyAccessDenied: "Acesso negado a solicitações de outras empresas",
      userAccessDenied: "Acesso negado a solicitações deste usuário",
      batchFetchFailed: "Erro ao obter múltiplas solicitações",
      statusBatchFetchFailed: "Erro ao obter múltiplos status",
      userBatchFetchFailed: "Erro ao obter múltiplos usuários",
      customerBatchFetchFailed: "Erro ao obter múltiplos clientes",
      createFailed: "Falha ao criar solicitação",
      updateFailed: "Falha ao atualizar solicitação",
      deleteFailed: "Falha ao excluir solicitação",
      validationError: "Há um problema com a entrada",
      updateError: "Erro ao atualizar solicitação",
      noUpdateFields: "Nenhum campo de atualização especificado"
    },
    supportReply: {
      fetchFailed: "Falha ao obter resposta de suporte",
      accessDenied: "Acesso negado a esta resposta",
      createFailed: "Falha ao criar resposta",
      updateFailed: "Falha ao atualizar resposta",
      deleteFailed: "Falha ao excluir resposta",
      notFound: "Resposta especificada não encontrada",
      updateError: "Erro ao atualizar resposta",
      noUpdateFields: "Nenhum campo de atualização especificado"
    },
    newOrder: {
      fetchFailed: "Falha ao obter nova solicitação",
      accessDenied: "Acesso negado a estas informações",
      notFound: "Nova solicitação especificada não encontrada",
      otherCompanyAccessDenied: "Acesso negado a novas solicitações de outras empresas",
      batchFetchFailed: "Erro ao obter múltiplas novas solicitações",
      customerBatchFetchFailed: "Erro ao obter múltiplos clientes"
    },
    newOrderRequest: {
      createFailed: "Falha ao criar nova solicitação",
      updateFailed: "Falha ao atualizar nova solicitação",
      deleteFailed: "Falha ao excluir nova solicitação"
    },
    newOrderReply: {
      fetchFailed: "Falha ao obter resposta",
      createFailed: "Falha ao criar resposta",
      updateFailed: "Falha ao atualizar resposta",
      deleteFailed: "Falha ao excluir resposta"
    },
    auditLog: {
      customerIdRequired: "ID do cliente é obrigatório",
      userIdOrCustomerIdRequired: "ID do usuário ou do cliente é obrigatório",
      resourceNameOrCustomerIdRequired: "Nome do recurso ou ID do cliente é obrigatório",
      createFailed: "Falha ao criar registro de auditoria",
      validationFailed: "Falha na validação de auditoria",
      recordFailed: "Falha ao registrar auditoria"
    },
    dataUsage: {
      userIdRequired: "ID do usuário é obrigatório",
      customerIdRequired: "ID do cliente é obrigatório",
      fetchFailed: "Falha ao obter uso de dados",
      createFailed: "Falha ao criar registro de uso de dados",
      updateFailed: "Falha ao atualizar uso de dados",
      noUpdateFields: "Nenhum campo de atualização especificado",
      updateFieldRequired: "Especifique pelo menos um campo para atualizar",
      notFound: "Registro de uso de dados para atualizar não encontrado",
      updateError: "Erro ao atualizar uso de dados"
    },
    limitUsage: {
      createFailed: "Falha ao criar limite de uso",
      updateFailed: "Falha ao atualizar limite de uso",
      deleteFailed: "Falha ao excluir limite de uso",
      deleteOperationFailed: "Falha na exclusão do limite de uso",
      deleteProcessingError: "Erro durante o processamento da exclusão",
      unknownResource: "Desconhecido"
    },
    recipient: {
      fetchFailed: "Falha ao obter destinatário",
      accessDenied: "Acesso negado a estas informações",
      notFound: "Destinatário não encontrado",
      createFailed: "Falha ao criar destinatário",
      updateFailed: "Falha ao atualizar destinatário",
      deleteFailed: "Falha ao excluir destinatário",
      limitUsageIdRequired: "ID do limite de uso é obrigatório",
      noUpdateFields: "Nenhum campo de atualização especificado",
      updateError: "Erro ao atualizar destinatário",
      createError: "Erro ao criar destinatário",
      partialUpdateFailed: "Falha ao atualizar alguns destinatários"
    },
    delete: {
      userDeleteFailed: "Falha ao excluir usuário",
      cognitoUserDeleteFailed: "Falha ao excluir usuário do Cognito",
      partialDeleteFailed: "Falha ao cancelar a exclusão de alguns ou todos os usuários",
      authDeleteFailed: "Falha ao excluir informações de autenticação",
      dbDeleteFailed: "Falha ao excluir usuário do banco de dados",
      cancelRequestFailed: "Erro ao cancelar solicitação de exclusão",
      cancelRequestProcessingError: "Erro ao processar cancelamento",
      userDeleteSuccess: "Usuário excluído com sucesso",
      cognitoUserDeleteSuccess: "Usuário do Cognito excluído com sucesso",
      relatedResourceDeleteError: "Erro ao excluir recursos relacionados",
      userNotFoundForDeletion: "Usuário a ser excluído não encontrado",
      bulkDeleteNoTargets: "Nenhum alvo de exclusão especificado",
      bulkDeletePartialFailure: "Falha ao excluir alguns usuários",
      cancelDeletionSuccess: "Cancelamento da exclusão concluído para {count} usuários",
      cancelDeletionPartialFailure: "Sucesso: {successCount}, Falha: {failCount}",
      lastAdminDeleteNotAllowed: "Não é possível excluir o último usuário administrador"
    },
    cognito: {
      usernameExists: "Usuário já registrado",
      invalidParameter: "Parâmetro inválido",
      invalidPassword: "Senha inválida",
      confirmationCodeIncorrect: "O código está incorreto",
      confirmationCodeExpired: "O código expirou",
      userCreationFailed: "Falha ao criar usuário do Cognito",
      confirmationFailed: "Falha ao confirmar registro",
      userNotFound: "Usuário não encontrado",
      emailSendFailed: "Falha ao enviar e-mail",
      signInFailed: "Falha no login",
      passwordResetRequired: "Redefinição de senha necessária",
      accountNotConfirmed: "Conta não confirmada. Complete a verificação por e-mail"
    },
    stripe: {
      customerCreationFailed: "Falha ao criar cliente Stripe",
      customerNotFound: "Cliente não encontrado",
      setupIntentCreationFailed: "Falha ao criar Setup Intent",
      paymentMethodNotFound: "Método de pagamento não encontrado",
      paymentMethodDetachFailed: "Falha ao desassociar método de pagamento",
      paymentHistoryFetchFailed: "Falha ao obter histórico de pagamentos",
      defaultPaymentMethodSetFailed: "Falha ao definir método de pagamento padrão",
      addressUpdateFailed: "Falha ao atualizar endereço",
      invalidLocale: "Configuração regional inválida",
      customerIdRequired: "ID do cliente é obrigatório",
      paymentMethodIdRequired: "ID do método de pagamento é obrigatório",
      addressRequired: "Endereço é obrigatório",
      nameRequired: "Nome é obrigatório",
      emailRequired: "E-mail é obrigatório",
      userAttributesRequired: "Atributos do usuário são obrigatórios",
      invalidAddress: "Formato de endereço inválido",
      stripeError: "Ocorreu um erro na API do Stripe",
      updateFailed: "Falha na atualização",
      validationError: "Há problemas com a entrada",
      cardError: "Erro de cartão",
      requestError: "Erro de solicitação",
      apiError: "Erro de API",
      connectionError: "Ocorreu um erro de conexão",
      authenticationError: "Ocorreu um erro de autenticação"
    },
    api: {
      invalidRequest: "Solicitação inválida",
      missingParameters: "Parâmetros obrigatórios ausentes",
      serverError: "Erro interno do servidor",
      validationFailed: "Falha na validação da solicitação",
      authenticationRequired: "Autenticação necessária",
      accessDenied: "Acesso negado",
      notFound: "Recurso não encontrado",
      methodNotAllowed: "Método não permitido",
      conflictError: "Conflito de recursos",
      rateLimitExceeded: "Limite de solicitação excedido"
    },
    verificationEmail: {
      sendFailed: "Falha ao enviar e-mail de verificação",
      templateNotFound: "Modelo de e-mail não encontrado",
      messageRejected: "E-mail rejeitado (destino possivelmente inválido)",
      sendingPaused: "Envio de e-mails temporariamente pausado",
      mailFromDomainNotVerified: "Domínio do remetente não verificado",
      configurationSetNotFound: "Conjunto de configuração do SES não encontrado",
      invalidTemplate: "Modelo de e-mail inválido",
      invalidAwsCredentials: "Credenciais da AWS inválidas",
      invalidParameters: "Parâmetros inválidos"
    }
  },
  "fields": {
    "userName": "Nome de usuário",
    "email": "Email",
    "department": "Departamento",
    "position": "Posição",
    "role": "Papel"
  },
  messages: {
    dataUsage: {
      createSuccess: "Registro de uso de dados criado com sucesso",
      updateSuccess: "Uso de dados atualizado com sucesso"
    },
    policy: {
      createSuccess: "Política criada com sucesso",
      updateSuccess: "Política atualizada com sucesso",
      deleteSuccess: "Política excluída com sucesso"
    },
    user: {
      createSuccess: "Usuário criado com sucesso",
      updateSuccess: "Informações do usuário atualizadas com sucesso",
      deleteSuccess: "Usuário excluído com sucesso"
    },
    group: {
      createSuccess: "Grupo criado com sucesso",
      updateSuccess: "Grupo atualizado com sucesso",
      deleteSuccess: "Grupo excluído com sucesso"
    },
    groupPolicy: {
      createSuccess: "Política de grupo criada com sucesso",
      deleteSuccess: "Política de grupo excluída com sucesso"
    },
    userGroup: {
      createSuccess: "Grupo de usuários criado com sucesso",
      updateSuccess: "Grupo de usuários atualizado com sucesso",
      deleteSuccess: "Grupo de usuários excluído com sucesso"
    },
    newOrderRequest: {
      createSuccess: "Nova solicitação criada com sucesso",
      updateSuccess: "Nova solicitação atualizada com sucesso",
      deleteSuccess: "Nova solicitação excluída com sucesso"
    },
    newOrderReply: {
      createSuccess: "Resposta criada com sucesso",
      updateSuccess: "Resposta atualizada com sucesso",
      deleteSuccess: "Resposta excluída com sucesso"
    },
    supportRequest: {
      createSuccess: "Solicitação de suporte criada com sucesso",
      updateSuccess: "Solicitação de suporte atualizada com sucesso",
      deleteSuccess: "Solicitação de suporte excluída com sucesso"
    },
    supportReply: {
      createSuccess: "Resposta de suporte criada com sucesso",
      updateSuccess: "Resposta de suporte atualizada com sucesso",
      deleteSuccess: "Resposta de suporte excluída com sucesso"
    },
    limitUsage: {
      createSuccess: "Limite de uso criado com sucesso",
      updateSuccess: "Limite de uso atualizado com sucesso",
      deleteSuccess: "Limite de uso excluído com sucesso"
    },
    recipient: {
      createSuccess: "Destinatário criado com sucesso",
      updateSuccess: "Destinatário atualizado com sucesso",
      deleteSuccess: "Destinatário excluído com sucesso",
      bulkUpdateSuccess: "{count} destinatários atualizados com sucesso"
    },
    auditLog: {
      createSuccess: "Registro de auditoria criado com sucesso",
      recordSuccess: "Registro de auditoria salvo com sucesso"
    },
    stripe: {
      customerCreateSuccess: "Cliente criado com sucesso",
      setupIntentCreateSuccess: "Setup Intent criado com sucesso",
      paymentMethodDeleteSuccess: "Método de pagamento excluído com sucesso",
      paymentHistoryFetchSuccess: "Histórico de pagamentos obtido com sucesso",
      defaultPaymentMethodSetSuccess: "Método de pagamento padrão definido com sucesso",
      addressUpdateSuccess: "Endereço atualizado com sucesso"
    },
    api: {
      requestSuccess: "Solicitação concluída com sucesso",
      operationCompleted: "Operação concluída com sucesso"
    },
    verificationEmail: {
      sendSuccess: "E-mail de verificação enviado"
    },
    cognito: {
      emailVerificationCompleted: "Verificação por e-mail concluída",
      signInStarted: "Processo de login iniciado"
    }
  }
} as const;

export default pt;


