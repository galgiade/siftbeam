const es = {
  errors: {
    general: {
      serverError: "Ocurrió un error del servidor",
      networkError: "Ocurrió un error de red",
      unauthorized: "Se requiere autenticación",
      forbidden: "Acceso denegado",
      notFound: "Recurso no encontrado",
      validationError: "Datos de entrada inválidos",
      conflict: "Ocurrió un conflicto de datos",
      unexpectedError: "Ocurrió un error inesperado",
      unknownError: "Ocurrió un error desconocido",
      targetNotFound: "No se encontró el objetivo a actualizar",
      operationFailed: "La operación falló",
      processingError: "Ocurrió un error durante el procesamiento",
      relatedResourceDeleteError: "Error al eliminar recursos relacionados",
      partialOperationFailed: "Algunas operaciones fallaron",
      rollbackFailed: "Error al revertir"
    },
    auth: {
      notAuthenticated: "No autenticado",
      insufficientPermissions: "Permisos insuficientes",
      accessDenied: "Acceso denegado",
      companyNotSet: "La información de la empresa no está configurada",
      adminRightsRequired: "Se requieren privilegios de administrador",
      adminPermissionRequired: "Se requiere permiso de administrador",
      codeIncorrect: "El código de verificación es incorrecto",
      codeExpired: "El código de verificación ha expirado",
      userNotFound: "Usuario no encontrado",
      signInFailed: "Fallo al iniciar sesión",
      credentialsIncorrect: "El correo o la contraseña son incorrectos",
      accountNotConfirmed: "Cuenta no confirmada. Completa la verificación por correo",
      passwordResetRequired: "Se requiere restablecer la contraseña",
      userNotAuthenticated: "Usuario no autenticado",
      getCurrentUserFailed: "Error al obtener el usuario actual",
      missingParameters: "Faltan parámetros requeridos: userId, email",
      check2FAStatusFailed: "Error al verificar el estado de 2FA",
      missingEmailParameters: "Faltan parámetros requeridos: userId, newEmail, userPoolId",
      invalidEmailFormat: "Formato de email inválido",
      cognitoEmailUpdateSuccess: "Email de Cognito actualizado exitosamente",
      cognitoEmailUpdateFailed: "Error al actualizar el email de Cognito",
      userNotFoundInCognito: "Usuario no encontrado en Cognito",
      invalidEmailOrUserId: "Formato de email inválido o ID de usuario",
      notAuthorizedToUpdateUser: "No autorizado para actualizar usuario",
      missingUsernameParameters: "Faltan parámetros requeridos: userId, newUsername, userPoolId",
      invalidUsernameFormat: "Formato de nombre de usuario inválido",
      cognitoUsernameUpdateSuccess: "Nombre de usuario de Cognito actualizado exitosamente",
      cognitoUsernameUpdateFailed: "Error al actualizar el nombre de usuario de Cognito",
      invalidUsernameOrUserId: "Formato de nombre de usuario inválido o ID de usuario",
      usernameAlreadyExists: "El nombre de usuario ya existe",
      missingVerificationParameters: "Faltan parámetros requeridos: userId, email, code, userPoolId",
      verificationCodeNotFound: "Código de verificación no encontrado o expirado",
      verificationCodeExpired: "El código de verificación ha expirado",
      tooManyFailedAttempts: "Demasiados intentos fallidos",
      invalidVerificationCode: "Código de verificación inválido",
      emailVerificationSuccess: "Verificación de email exitosa y Cognito actualizado",
      emailVerificationFailed: "Error al verificar el código de email",
      missingStoreParameters: "Faltan parámetros requeridos: userId, email, code, userType",
      verificationCodeStoredSuccess: "Código de verificación almacenado exitosamente",
      verificationCodeStoreFailed: "Error al almacenar el código de verificación"
    },
    validation: {
      userIdRequired: "Se requiere ID de usuario",
      customerIdRequired: "Se requiere ID de cliente",
      groupIdRequired: "Se requiere ID de grupo",
      policyIdRequired: "Se requiere ID de política",
      supportRequestIdRequired: "Se requiere ID de solicitud de soporte",
      newOrderRequestIdRequired: "Se requiere ID de nueva solicitud",
      statusRequired: "Se requiere estado",
      userGroupIdRequired: "Se requiere ID de grupo de usuarios",
      groupIdRequiredForValidation: "Se requiere ID de grupo",
      userIdRequiredForValidation: "Se requiere ID de usuario",
      fieldRequired: "Este campo es obligatorio",
      validEmailRequired: "Introduce un correo válido",
      minLength: "Se requieren al menos {count} caracteres",
      maxLength: "Se permiten como máximo {count} caracteres",
      passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
      passwordUppercase: "Debe incluir mayúsculas",
      passwordLowercase: "Debe incluir minúsculas",
      passwordNumber: "Debe incluir números",
      passwordSpecialChar: "Debe incluir caracteres especiales",
      passwordMismatch: "Las contraseñas no coinciden",
      userNameRequired: "Se requiere nombre de usuario",
      emailRequired: "Se requiere correo",
      companyIdRequired: "Se requiere ID de empresa",
      departmentRequired: "Se requiere departamento",
      positionRequired: "Se requiere cargo",
      roleRequired: "Se requiere rol",
      usageMinZero: "El uso debe ser 0 o mayor",
      positiveNumber: "Debe ser un valor positivo",
      nonNegativeNumber: "Debe ser 0 o mayor",
      invalidEmail: "Introduce un correo válido",
      required: "Este campo es obligatorio",
      policyIdsMinOne: "Selecciona al menos una política",
      userIdsMinOne: "Selecciona al menos un usuario",
      emailsMinOne: "Especifica al menos un correo",
      emailsValid: "Introduce un correo válido",
      invalidExceedAction: "Selecciona notificar o restringir",
      invalidNotifyType: "Selecciona importe o uso",
      invalidUnit: "Selecciona KB, MB, GB o TB",
      invalidAiTrainingUsage: "Selecciona permitir o denegar",
      invalidStatus: "Selecciona OPEN, IN_PROGRESS o CLOSED",
      invalidIssueType: "Selecciona técnico, cuenta, facturación u otro",
      invalidAction: "Selecciona READ, CREATE, UPDATE, DELETE, ATTACH o DETACH",
      invalidResource: "Tipo de recurso inválido",
      invalidDataType: "Selecciona tabla, imagen o texto",
      invalidModelType: "Selecciona clustering, prediction o classification",
      notifyTypeAmountRequired: "Introduce importe o uso según el método",
      notifyTypeUsageRequired: "Al seleccionar notificación por uso, la unidad es obligatoria",
      usageUnitRequired: "Al seleccionar notificación por uso, la unidad es obligatoria",
      companyNameRequired: "Se requiere nombre de empresa",
      stateRequired: "Se requiere estado/provincia",
      cityRequired: "Se requiere ciudad",
      streetAddressRequired: "Se requiere dirección",
      groupNameRequired: "Se requiere nombre de grupo",
      policyNameRequired: "Se requiere nombre de política",
      subjectRequired: "Se requiere asunto",
      descriptionRequired: "Se requiere descripción",
      messageRequired: "Se requiere mensaje",
      resourceNameRequired: "Se requiere nombre de recurso",
      preferredUsernameRequired: "Se requiere nombre de usuario",
      localeRequired: "Se requiere configuración regional",
      confirmationCodeRequired: "Se requiere código de verificación",
      challengeResponseRequired: "Se requiere respuesta de desafío",
      limitUsageIdRequired: "Se requiere ID de límite de uso",
      isStaffInvalid: "La marca de personal debe ser booleana"
    },
    user: {
      fetchFailed: "Error al obtener la información del usuario",
      accessDenied: "Acceso denegado a esta información de usuario",
      notFound: "Usuario no encontrado",
      companyAccessDenied: "Acceso denegado a la información de usuarios de esta empresa",
      batchFetchFailed: "Error al obtener múltiples informaciones de usuario",
      updateFailed: "Error al actualizar la información del usuario",
      createFailed: "Error al crear usuario",
      deleteFailed: "Error al eliminar usuario",
      userGroupFetchFailed: "Error al obtener información del grupo de usuarios",
      userGroupDeleteFailed: "Error al eliminar grupo de usuarios",
      rollbackFailed: "Error al revertir la eliminación",
      noUpdateFields: "No se especificaron campos a actualizar",
      updateError: "Error al actualizar usuario",
      userNameEmpty: "El nombre de usuario no puede estar vacío",
      emailEmpty: "El correo electrónico no puede estar vacío",
      departmentEmpty: "El departamento no puede estar vacío",
      positionEmpty: "La posición no puede estar vacía",
      roleEmpty: "El rol no puede estar vacío",
      fieldRequired: "{field} es requerido"
    },
    policy: {
      fetchFailed: "Error al obtener información de política",
      accessDenied: "Acceso denegado a esta información de política",
      batchFetchFailed: "Error al obtener múltiples informaciones de política de clientes",
      createFailed: "Error al crear política",
      updateFailed: "Error al actualizar política",
      deleteFailed: "Error al eliminar política",
      idRequired: "Se requiere un ID de política válido",
      notFound: "Política especificada no encontrada",
      noUpdateFields: "No se especificaron campos a actualizar",
      updateError: "Error al actualizar política"
    },
    group: {
      fetchFailed: "Error al obtener grupo",
      accessDenied: "Acceso denegado",
      listFetchFailed: "Error al obtener la lista de grupos",
      updateFailed: "Error al actualizar grupo",
      createFailed: "Error al crear grupo",
      deleteFailed: "Error al eliminar grupo",
      userGroupDeleteFailed: "Error al eliminar grupo de usuarios",
      groupPolicyDeleteFailed: "Error al eliminar política de grupo",
      rollbackFailed: "Error al revertir"
    },
    userGroup: {
      fetchFailed: "Error al obtener información del grupo de usuarios",
      accessDenied: "Acceso denegado a esta información del grupo de usuarios",
      batchFetchFailed: "Error al obtener múltiples informaciones del grupo de usuarios",
      companyFetchFailed: "Error al obtener información por ID de cliente",
      groupFetchFailed: "Error al obtener información por ID de grupo",
      userFetchFailed: "Error al obtener información por ID de usuario",
      membershipCheckFailed: "Error al comprobar membresía",
      createFailed: "Error al crear grupo de usuarios",
      updateFailed: "Error al actualizar grupo de usuarios",
      deleteFailed: "Error al eliminar grupo de usuarios",
      noUpdateFields: "No se especificaron campos a actualizar",
      updateError: "Error al actualizar grupo de usuarios"
    },
    groupPolicy: {
      fetchFailed: "Error al obtener información de política de grupo",
      accessDenied: "Acceso denegado a esta información",
      batchFetchFailed: "Error al obtener múltiples informaciones de política de grupo",
      policyFetchFailed: "Error al obtener por ID de política",
      groupFetchFailed: "Error al obtener por ID de grupo",
      createFailed: "Error al crear política de grupo",
      deleteFailed: "Error al eliminar política de grupo"
    },
    supportRequest: {
      fetchFailed: "Error al obtener solicitud de soporte",
      accessDenied: "Acceso denegado a esta solicitud",
      notFound: "Solicitud especificada no encontrada",
      otherCompanyAccessDenied: "Acceso denegado a solicitudes de otras empresas",
      userAccessDenied: "Acceso denegado a solicitudes de este usuario",
      batchFetchFailed: "Error al obtener múltiples solicitudes",
      statusBatchFetchFailed: "Error al obtener múltiples estados",
      userBatchFetchFailed: "Error al obtener múltiples usuarios",
      customerBatchFetchFailed: "Error al obtener múltiples clientes",
      createFailed: "Error al crear solicitud",
      updateFailed: "Error al actualizar solicitud",
      deleteFailed: "Error al eliminar solicitud",
      validationError: "Hay un problema con la entrada",
      updateError: "Error al actualizar la solicitud",
      noUpdateFields: "No se especificaron campos a actualizar"
    },
    supportReply: {
      fetchFailed: "Error al obtener respuesta de soporte",
      accessDenied: "Acceso denegado a esta respuesta",
      createFailed: "Error al crear respuesta",
      updateFailed: "Error al actualizar respuesta",
      deleteFailed: "Error al eliminar respuesta",
      notFound: "Respuesta especificada no encontrada",
      updateError: "Error al actualizar la respuesta",
      noUpdateFields: "No se especificaron campos a actualizar"
    },
    newOrder: {
      fetchFailed: "Error al obtener nueva solicitud",
      accessDenied: "Acceso denegado a esta información",
      notFound: "Nueva solicitud especificada no encontrada",
      otherCompanyAccessDenied: "Acceso denegado a solicitudes de otras empresas",
      batchFetchFailed: "Error al obtener múltiples nuevas solicitudes",
      customerBatchFetchFailed: "Error al obtener múltiples clientes"
    },
    newOrderRequest: {
      createFailed: "Error al crear nueva solicitud",
      updateFailed: "Error al actualizar nueva solicitud",
      deleteFailed: "Error al eliminar nueva solicitud"
    },
    newOrderReply: {
      fetchFailed: "Error al obtener respuesta",
      createFailed: "Error al crear respuesta",
      updateFailed: "Error al actualizar respuesta",
      deleteFailed: "Error al eliminar respuesta"
    },
    auditLog: {
      customerIdRequired: "Se requiere ID de cliente",
      userIdOrCustomerIdRequired: "Se requiere ID de usuario o cliente",
      resourceNameOrCustomerIdRequired: "Se requiere nombre de recurso o ID de cliente",
      createFailed: "Error al crear registro de auditoría",
      validationFailed: "Error de validación de auditoría",
      recordFailed: "Error al registrar auditoría"
    },
    dataUsage: {
      userIdRequired: "Se requiere ID de usuario",
      customerIdRequired: "Se requiere ID de cliente",
      fetchFailed: "Error al obtener uso de datos",
      createFailed: "Error al crear registro de uso de datos",
      updateFailed: "Error al actualizar uso de datos",
      noUpdateFields: "No se especificaron campos a actualizar",
      updateFieldRequired: "Especifica al menos un campo a actualizar",
      notFound: "Registro de uso de datos a actualizar no encontrado",
      updateError: "Error al actualizar uso de datos"
    },
    limitUsage: {
      createFailed: "Error al crear límite de uso",
      updateFailed: "Error al actualizar límite de uso",
      deleteFailed: "Error al eliminar límite de uso",
      deleteOperationFailed: "Error al eliminar límite de uso",
      deleteProcessingError: "Error al procesar eliminación",
      unknownResource: "Desconocido"
    },
    recipient: {
      fetchFailed: "Error al obtener destinatario",
      accessDenied: "Acceso denegado a esta información",
      notFound: "Destinatario no encontrado",
      createFailed: "Error al crear destinatario",
      updateFailed: "Error al actualizar destinatario",
      deleteFailed: "Error al eliminar destinatario",
      limitUsageIdRequired: "Se requiere ID de límite de uso",
      noUpdateFields: "No se especificaron campos a actualizar",
      updateError: "Error al actualizar destinatario",
      createError: "Error al crear destinatario",
      partialUpdateFailed: "Error al actualizar algunos destinatarios"
    },
    delete: {
      userDeleteFailed: "Error al eliminar usuario",
      cognitoUserDeleteFailed: "Error al eliminar usuario de Cognito",
      partialDeleteFailed: "Error al cancelar eliminación de algunos o todos los usuarios",
      authDeleteFailed: "Error al eliminar la información de autenticación",
      dbDeleteFailed: "Error al eliminar usuario de base de datos",
      cancelRequestFailed: "Error al cancelar solicitud de eliminación",
      cancelRequestProcessingError: "Error al procesar la cancelación",
      userDeleteSuccess: "Usuario eliminado correctamente",
      cognitoUserDeleteSuccess: "Usuario de Cognito eliminado correctamente",
      relatedResourceDeleteError: "Error al eliminar recursos relacionados",
      userNotFoundForDeletion: "Usuario a eliminar no encontrado",
      bulkDeleteNoTargets: "No se especificaron objetivos de eliminación",
      bulkDeletePartialFailure: "Error al eliminar algunos usuarios",
      cancelDeletionSuccess: "Se cancelaron {count} solicitudes de eliminación",
      cancelDeletionPartialFailure: "Éxito: {successCount}, Fallo: {failCount}",
      lastAdminDeleteNotAllowed: "No se puede eliminar al último usuario administrador"
    },
    cognito: {
      usernameExists: "El usuario ya está registrado",
      invalidParameter: "Parámetro inválido",
      invalidPassword: "Contraseña inválida",
      confirmationCodeIncorrect: "El código es incorrecto",
      confirmationCodeExpired: "El código ha expirado",
      userCreationFailed: "Error al crear usuario de Cognito",
      confirmationFailed: "Error al confirmar el registro",
      userNotFound: "Usuario no encontrado",
      emailSendFailed: "Error al enviar correo",
      signInFailed: "Error al iniciar sesión",
      passwordResetRequired: "Se requiere restablecer la contraseña",
      accountNotConfirmed: "Cuenta no confirmada. Completa la verificación por correo"
    },
    stripe: {
      customerCreationFailed: "Error al crear cliente de Stripe",
      customerNotFound: "Cliente no encontrado",
      setupIntentCreationFailed: "Error al crear Setup Intent",
      paymentMethodNotFound: "Método de pago no encontrado",
      paymentMethodDetachFailed: "Error al desvincular método de pago",
      paymentHistoryFetchFailed: "Error al obtener historial de pagos",
      defaultPaymentMethodSetFailed: "Error al establecer método de pago predeterminado",
      addressUpdateFailed: "Error al actualizar dirección",
      invalidLocale: "Configuración regional inválida",
      customerIdRequired: "Se requiere ID de cliente",
      paymentMethodIdRequired: "Se requiere ID de método de pago",
      addressRequired: "Se requiere dirección",
      nameRequired: "Se requiere nombre",
      emailRequired: "Se requiere correo",
      userAttributesRequired: "Se requieren atributos de usuario",
      invalidAddress: "Formato de dirección inválido",
      stripeError: "Ocurrió un error de la API de Stripe",
      updateFailed: "Error en la actualización",
      validationError: "Hay problemas con la entrada",
      cardError: "Error de tarjeta",
      requestError: "Error de solicitud",
      apiError: "Error de API",
      connectionError: "Ocurrió un error de conexión",
      authenticationError: "Ocurrió un error de autenticación"
    },
    api: {
      invalidRequest: "Solicitud inválida",
      missingParameters: "Faltan parámetros obligatorios",
      serverError: "Error interno del servidor",
      validationFailed: "Error de validación de la solicitud",
      authenticationRequired: "Se requiere autenticación",
      accessDenied: "Acceso denegado",
      notFound: "Recurso no encontrado",
      methodNotAllowed: "Método no permitido",
      conflictError: "Conflicto de recursos",
      rateLimitExceeded: "Se excedió el límite de solicitudes"
    },
    verificationEmail: {
      sendFailed: "No se pudo enviar el correo de verificación",
      templateNotFound: "Plantilla de correo no encontrada",
      messageRejected: "El correo fue rechazado (destino posiblemente inválido)",
      sendingPaused: "El envío de correos está temporalmente pausado",
      mailFromDomainNotVerified: "El dominio del remitente no está verificado",
      configurationSetNotFound: "Conjunto de configuración de SES no encontrado",
      invalidTemplate: "La plantilla de correo es inválida",
      invalidAwsCredentials: "Las credenciales de AWS son inválidas",
      invalidParameters: "Parámetros inválidos"
    }
  },
  "fields": {
    "userName": "Nombre de usuario",
    "email": "Correo electrónico",
    "department": "Departamento",
    "position": "Posición",
    "role": "Rol"
  },
  messages: {
    dataUsage: {
      createSuccess: "Registro de uso de datos creado correctamente",
      updateSuccess: "Uso de datos actualizado correctamente"
    },
    policy: {
      createSuccess: "Política creada correctamente",
      updateSuccess: "Política actualizada correctamente",
      deleteSuccess: "Política eliminada correctamente"
    },
    user: {
      createSuccess: "Usuario creado correctamente",
      updateSuccess: "Información de usuario actualizada correctamente",
      deleteSuccess: "Usuario eliminado correctamente"
    },
    group: {
      createSuccess: "Grupo creado correctamente",
      updateSuccess: "Grupo actualizado correctamente",
      deleteSuccess: "Grupo eliminado correctamente"
    },
    groupPolicy: {
      createSuccess: "Política de grupo creada correctamente",
      deleteSuccess: "Política de grupo eliminada correctamente"
    },
    userGroup: {
      createSuccess: "Grupo de usuarios creado correctamente",
      updateSuccess: "Grupo de usuarios actualizado correctamente",
      deleteSuccess: "Grupo de usuarios eliminado correctamente"
    },
    newOrderRequest: {
      createSuccess: "Nueva solicitud creada correctamente",
      updateSuccess: "Nueva solicitud actualizada correctamente",
      deleteSuccess: "Nueva solicitud eliminada correctamente"
    },
    newOrderReply: {
      createSuccess: "Respuesta creada correctamente",
      updateSuccess: "Respuesta actualizada correctamente",
      deleteSuccess: "Respuesta eliminada correctamente"
    },
    supportRequest: {
      createSuccess: "Solicitud de soporte creada correctamente",
      updateSuccess: "Solicitud de soporte actualizada correctamente",
      deleteSuccess: "Solicitud de soporte eliminada correctamente"
    },
    supportReply: {
      createSuccess: "Respuesta de soporte creada correctamente",
      updateSuccess: "Respuesta de soporte actualizada correctamente",
      deleteSuccess: "Respuesta de soporte eliminada correctamente"
    },
    limitUsage: {
      createSuccess: "Límite de uso creado correctamente",
      updateSuccess: "Límite de uso actualizado correctamente",
      deleteSuccess: "Límite de uso eliminado correctamente"
    },
    recipient: {
      createSuccess: "Destinatario creado correctamente",
      updateSuccess: "Destinatario actualizado correctamente",
      deleteSuccess: "Destinatario eliminado correctamente",
      bulkUpdateSuccess: "Se actualizaron {count} destinatarios"
    },
    auditLog: {
      createSuccess: "Registro de auditoría creado correctamente",
      recordSuccess: "Registro de auditoría guardado correctamente"
    },
    stripe: {
      customerCreateSuccess: "Cliente creado correctamente",
      setupIntentCreateSuccess: "Setup Intent creado correctamente",
      paymentMethodDeleteSuccess: "Método de pago eliminado correctamente",
      paymentHistoryFetchSuccess: "Historial de pagos obtenido correctamente",
      defaultPaymentMethodSetSuccess: "Método de pago predeterminado establecido correctamente",
      addressUpdateSuccess: "Dirección actualizada correctamente"
    },
    api: {
      requestSuccess: "Solicitud completada correctamente",
      operationCompleted: "Operación completada correctamente"
    },
    verificationEmail: {
      sendSuccess: "Se ha enviado el correo de verificación"
    },
    cognito: {
      emailVerificationCompleted: "Verificación por correo completada",
      signInStarted: "Proceso de inicio de sesión iniciado"
    }
  }
} as const;

export default es;


