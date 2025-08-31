import React, { useEffect, useState } from 'react';

export function useInfiniteScroll(
  fetchItems: (
    setItems: (items: any) => void,
    page: number,
    limit: number,
    setHasMore: (hasMore: boolean) => void,
  ) => Promise<void>,
  divRef: React.RefObject<HTMLDivElement>,
  offset: number,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(offset);

  useEffect(() => {
    const appendItems = (newItems: any) => {
      if (page === 1) {
        setItems(newItems);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }
    };
    fetchItems(appendItems, page, limit, setHasMore);
  }, [fetchItems, page]);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    const handleScroll = () => {
      if (
        (divRef.current?.offsetHeight ?? 0) +
          (divRef.current?.scrollTop ?? 0) !==
          (divRef.current?.scrollHeight ?? 0) ||
        isLoading
      ) {
        return;
      }
      setIsLoading(true);
      if (hasMore) {
        setPage(page + 1);
      }
      setIsLoading(false);
    };

    divRef.current.addEventListener('scroll', handleScroll);
    return () => divRef.current?.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchItems, isLoading, hasMore, divRef.current]);

  return { isLoading, hasMore, items, page, limit };
}
