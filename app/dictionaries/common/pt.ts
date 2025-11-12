import type { CommonLocale } from './common.d.ts';

const pt: CommonLocale = {
  common: {
    navigation: {
      home: 'Início',
      about: 'Sobre',
      pricing: 'Preços',
      contact: 'Contato',
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      signOut: 'Sair',
      dashboard: 'Painel',
      flow: 'Fluxo',
      announcement: 'Anúncios',
      services: 'Serviços',
      myPage: 'Minha página',
      supportCenter: 'Centro de suporte',
      faq: 'Perguntas Frequentes',
    },
    footer: {
      title: 'siftbeam',
      description:
        'Uma plataforma de análise preditiva inteligente que libera o poder dos dados para moldar o futuro do seu negócio.',
      links: {
        terms: 'Termos de serviço',
        privacy: 'Política de privacidade',
        legalDisclosures: 'Divulgações legais',
        faq: 'Perguntas Frequentes',
      },
      copyright: 'Connect Tech Inc.',
    },
    fileUploader: {
      dragAndDrop: 'Arrastar e soltar arquivos',
      or: 'ou',
      selectFile: 'Selecionar arquivos',
      maxFilesAndSize: 'Máx. {maxFiles} arquivos, {maxFileSize}MB cada',
      supportedFormats: 'Formatos suportados: Imagens, Vídeos, Áudio, Documentos',
      pendingFiles: 'Pendentes ({count} arquivos)',
      uploadStart: 'Iniciar upload',
      uploading: 'Enviando...',
      uploadedFiles: 'Enviados ({count} arquivos)',
      uploadComplete: 'Upload concluído',
      uploadError: 'Erro de upload',
      uploadFailed: 'Falha no upload',
      maxFilesExceeded: 'Você pode fazer upload de até {maxFiles} arquivos.',
      fileSizeExceeded: 'O tamanho do arquivo deve ser de {maxFileSize}MB ou menos.\nArquivos muito grandes: {files}',
      oversizedFiles: 'Arquivos muito grandes',
    },
  },
};

export default pt;
