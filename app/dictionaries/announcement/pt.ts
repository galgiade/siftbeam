export const announcement = {
  locale: 'pt',
  hero: {
    title: 'Anúncios',
    subtitle: 'Confira os últimos anúncios',
  },
  table: {
    date: 'Data',
    category: 'Categoria',
    title: 'Título',
    priority: 'Prioridade',
    action: 'Ação',
    viewDetails: 'Ver Detalhes',
    noAnnouncements: 'Nenhum anúncio disponível',
  },
  category: {
    price: 'Preço',
    feature: 'Recurso',
    other: 'Outro',
  },
  priority: {
    high: 'Alta Prioridade',
    medium: 'Prioridade Média',
    low: 'Baixa Prioridade',
  },
  error: {
    fetchFailed: 'Falha ao buscar anúncios',
    notFound: 'Anúncio não encontrado',
  },
  detail: {
    backToList: 'Voltar aos Anúncios',
    noContent: 'Nenhum conteúdo disponível',
  },
  categoryDisplay: {
    price: 'Preço',
    feature: 'Recurso',
    other: 'Outro',
  },
} as const;

export default announcement;
