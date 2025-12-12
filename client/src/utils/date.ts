

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' }).format(
    new Date(value)
  );