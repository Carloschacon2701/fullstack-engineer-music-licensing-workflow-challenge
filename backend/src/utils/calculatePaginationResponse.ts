export const calculatePaginationResponse = (
  total: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previous = page > 1 ? page - 1 : null;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    nextPage,
    previous,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    pageSize: limit,
  };
};
