
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100
}: UseInfiniteScrollProps) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || isFetching) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Check if we're near the bottom of the page
    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      console.log('Infinite scroll triggered', { scrollTop, scrollHeight, clientHeight, threshold });
      setIsFetching(true);
      onLoadMore();
    }
  }, [hasMore, isLoading, isFetching, onLoadMore, threshold]);

  useEffect(() => {
    const debouncedHandleScroll = () => {
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(handleScroll, 50);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout((window as any).scrollTimeout);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!isLoading) {
      setIsFetching(false);
    }
  }, [isLoading]);

  return { isFetching };
};
