const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
};

export { formatDate };
