const formatDate = (value: Date): string => {
  const date = new Date(value);

  return Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export default formatDate;
