import { useCallback } from 'react';
import type { UniqueId } from './type';
import { useInternalDragSelectData } from './useInternalDragSelectData';

interface UseDragSelectParam {
  id: UniqueId;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data?: Record<string, any>;
}

export function useDragSelect({ id, data = {} }: UseDragSelectParam) {
  const { dragSelectItems, dragSelectableItemsWeakMap } =
    useInternalDragSelectData();

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return;
      }

      const hasItem = dragSelectableItemsWeakMap.get(id);
      if (!hasItem) {
        dragSelectItems.push(id);
        dragSelectableItemsWeakMap.set(id, { data, node });
      }
    },
    [id, data, dragSelectableItemsWeakMap, dragSelectItems],
  );

  return { setNodeRef };
}
