export const announcement = {
  locale: 'es',
  hero: {
    title: 'Anuncios',
    subtitle: 'Consulta los últimos anuncios',
  },
  table: {
    date: 'Fecha',
    category: 'Categoría',
    title: 'Título',
    priority: 'Prioridad',
    action: 'Acción',
    viewDetails: 'Ver Detalles',
    noAnnouncements: 'No hay anuncios disponibles',
  },
  category: {
    price: 'Precio',
    feature: 'Función',
    other: 'Otro',
  },
  priority: {
    high: 'Alta Prioridad',
    medium: 'Prioridad Media',
    low: 'Baja Prioridad',
  },
  error: {
    fetchFailed: 'Error al obtener anuncios',
    notFound: 'Anuncio no encontrado',
  },
  detail: {
    backToList: 'Volver a Anuncios',
    noContent: 'No hay contenido disponible',
  },
  categoryDisplay: {
    price: 'Precio',
    feature: 'Función',
    other: 'Otro',
  },
} as const;

export default announcement;
