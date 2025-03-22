import { useCallback } from 'react';
import type { UniqueId } from './type';
import { useInternalDragSelectData } from './useInternalDragSelectData';

interface UseDragSelectParam {
  id: UniqueId;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data?: Record<string, any>;
}

export function useDragSelect({ id, data = {} }: UseDragSelectParam) {
  const { dragSelectItems, dragSelectableItemsMap } =
    useInternalDragSelectData();

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return;
      }

      const hasItem = dragSelectableItemsMap.get(id);
      if (!hasItem) {
        dragSelectItems.push(id);
        dragSelectableItemsMap.set(id, { data, node });
      }
    },
    [id, data, dragSelectableItemsMap, dragSelectItems],
  );

  return { setNodeRef };
}
