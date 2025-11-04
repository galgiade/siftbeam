import type { CreateCompanyInfoLocale } from './createCompanyInfo.d.ts';

const pt: CreateCompanyInfoLocale = {
  label: {
    back: "Voltar",
    submit: "Enviar",
    next: "Próximo",
    submitting: "Enviando...",
    loading: "Carregando...",
    companyInfoTitle: "Informações da empresa",
    countryLabel: "País",
    countryPlaceholder: "Pesquise e selecione um país",
    postalCodeLabel: "CEP",
    postalCodePlaceholder: "ex: 01234-567",
    stateLabel: "Estado/Província",
    statePlaceholder: "ex: São Paulo",
    cityLabel: "Cidade",
    cityPlaceholder: "ex: São Paulo",
    line1Label: "Endereço linha 1",
    line1Placeholder: "ex: Rua das Flores, 123",
    line2Label: "Endereço linha 2 (Prédio, Sala)",
    line2Placeholder: "ex: Sala 101",
    nameLabel: "Nome da empresa",
    namePlaceholder: "ex: Empresa Exemplo Ltda",
    emailLabel: "E-mail de faturamento",
    emailPlaceholder: "ex: faturamento@empresa.com.br",
    phoneLabel: "Telefone",
    phonePlaceholder: "ex: +55-11-1234-5678",
    accountCreation: "Criação de conta",
    companyInfo: "Informações da empresa",
    adminSetup: "Configuração do administrador",
    paymentSetup: "Configuração de pagamento"
  },
  alert: {
    countryRequired: "País é obrigatório",
    postalCodeRequired: "CEP é obrigatório",
    stateRequired: "Estado/Província é obrigatório",
    cityRequired: "Cidade é obrigatória",
    line1Required: "Endereço linha 1 é obrigatório",
    nameRequired: "Nome da empresa é obrigatório",
    emailRequired: "E-mail é obrigatório",
    phoneRequired: "Telefone é obrigatório",
    userAttributeUpdateFailed: "Falha ao atualizar atributos do usuário",
    stripeCustomerCreationFailed: "Falha ao criar cliente Stripe",
    communicationError: "Erro de comunicação"
  }
};

export default pt;