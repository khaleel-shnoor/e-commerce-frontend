import { useState, useMemo } from 'react';

export function usePagination(items, perPage = 8) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return { page, totalPages, paginatedItems, goToPage, setPage };
}
