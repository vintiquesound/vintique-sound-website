import * as React from "react";

function clampIndex(index: number, max: number) {
  return Math.min(Math.max(index, 0), Math.max(0, max));
}

export type UseCollectionBuilderOptions<T> = {
  createEmptyItem: () => T;
  initialCount?: number;
  minCount?: number;
};

export function useCollectionBuilder<T>({
  createEmptyItem,
  initialCount = 1,
  minCount = 1,
}: UseCollectionBuilderOptions<T>) {
  const [count, setRawCount] = React.useState(initialCount);
  const [items, setItems] = React.useState<T[]>(() => Array.from({ length: initialCount }, () => createEmptyItem()));
  const [activeIndex, setActiveIndex] = React.useState(0);

  const setCount = React.useCallback(
    (nextCount: number) => {
      const normalized = Number.isFinite(nextCount) ? Math.max(minCount, Math.trunc(nextCount)) : minCount;
      setRawCount(normalized);
    },
    [minCount]
  );

  React.useEffect(() => {
    setItems((prev) => {
      const next = prev.slice(0, count);
      while (next.length < count) next.push(createEmptyItem());
      return next;
    });
    setActiveIndex((prev) => clampIndex(prev, count - 1));
  }, [count, createEmptyItem]);

  const activeItem = items[activeIndex];

  const updateActiveItem = React.useCallback(
    (updater: Partial<T> | ((current: T) => T)) => {
      setItems((prev) => {
        const next = prev.slice();
        const current = next[activeIndex] ?? createEmptyItem();
        next[activeIndex] = typeof updater === "function"
          ? (updater as (current: T) => T)(current)
          : { ...current, ...updater };
        return next;
      });
    },
    [activeIndex, createEmptyItem]
  );

  const goToPreviousItem = React.useCallback(() => {
    setActiveIndex((prev) => clampIndex(prev - 1, count - 1));
  }, [count]);

  const goToNextItem = React.useCallback(() => {
    setActiveIndex((prev) => clampIndex(prev + 1, count - 1));
  }, [count]);

  return {
    count,
    setCount,
    items,
    setItems,
    activeIndex,
    setActiveIndex,
    activeItem,
    updateActiveItem,
    goToPreviousItem,
    goToNextItem,
  };
}
