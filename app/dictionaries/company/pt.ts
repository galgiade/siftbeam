export default {
  alert: {
    updateSuccess: "As informações da empresa foram atualizadas.",
    updateFail: "Falha na atualização.",
    networkError: "Erro de rede: {message}",
    required: '"{label}" é obrigatório.',
    fetchCustomerFailed: "Falha ao obter informações do cliente",
    customerNotFound: "Informações do cliente não encontradas",
    customerDeleted: "Esta conta de cliente foi excluída",
    adminOnlyEditMessage: "A edição das informações da empresa é permitida apenas para administradores. Você não tem permissão para editar.",
    invalidEmail: "Por favor, insira um endereço de email válido",
    invalidPhone: "Por favor, insira um número de telefone válido",
    invalidPostalCode: "Por favor, insira um código postal válido",
    nameTooLong: "O nome da empresa deve ter 100 caracteres ou menos",
    addressTooLong: "O endereço deve ter 200 caracteres ou menos",
    validationError: "Há problemas com a entrada. Por favor, verifique."
  },
  label: {
    title: "Informações da empresa",
    country: "País",
    countryPlaceholder: "Pesquise e selecione um país",
    postal_code: "CEP",
    state: "Estado/Província",
    city: "Cidade",
    line2: "Prédio",
    line1: "Endereço",
    name: "Nome da empresa",
    phone: "Telefone",
    email: "E-mail de faturamento"
  },
  placeholder: {
    postal_code: "ex. 01234-567",
    state: "ex. São Paulo",
    city: "ex. São Paulo",
    line2: "ex. Sala 100 (opcional)",
    line1: "ex. Av. Paulista, 123",
    name: "ex. Empresa Exemplo Ltda.",
    phone: "ex. +55-11-1234-5678",
    email: "ex. contato@exemplo.com.br"
  },
  button: {
    cancel: "Cancelar"
  }
} as const;


