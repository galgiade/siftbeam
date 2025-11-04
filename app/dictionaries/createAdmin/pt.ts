import type { CreateAdminLocale } from './createAdmin.d.ts';

const pt: CreateAdminLocale = {
  label: {
    back: "Voltar",
    submit: "Enviar",
    loading: "Carregando...",
    createAdminTitle: "Criar conta de administrador",
    userNameLabel: "Nome de usuário",
    userNamePlaceholder: "João Silva",
    userNameDescription: "Insira pelo menos 2 caracteres",
    departmentLabel: "Departamento",
    departmentPlaceholder: "Vendas",
    positionLabel: "Cargo",
    positionPlaceholder: "Gerente",
    languageLabel: "Idioma",
    languagePlaceholder: "Selecione um idioma",
    japanese: "Japonês",
    english: "Inglês",
    spanish: "Espanhol",
    french: "Francês",
    german: "Alemão",
    korean: "Coreano",
    portuguese: "Português",
    indonesian: "Indonésio",
    chinese: "Chinês",
    createAdmin: "Criar conta de administrador",
    creating: "Criando...",
    accountCreation: "Criação de conta",
    companyInfo: "Informações da empresa",
    adminSetup: "Configuração do administrador",
    paymentSetup: "Configuração de pagamento"
  },
  alert: {
    userNameRequired: "Digite o nome de usuário",
    userNameMinLength: "O nome de usuário deve ter pelo menos 2 caracteres",
    departmentRequired: "Digite o departamento",
    positionRequired: "Digite o cargo",
    invalidAuthInfo: "Informações de autenticação inválidas. Faça login novamente.",
    adminCreationFailed: "Falha ao criar conta de administrador",
    networkError: "Erro de rede"
  }
};

export default pt;