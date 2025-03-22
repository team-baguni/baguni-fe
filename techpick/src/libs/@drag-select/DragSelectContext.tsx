'use client';

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MOUSE_LEFT_CLICK } from './constant';
import {
  DragSelectMonitorContext,
  InternalDragSelectDataContext,
} from './context';
import type {
  CoordinateType,
  DragSelectItems,
  DragSelectMonitorEvent,
  DragSelectMonitorListener,
  DragSelectableItemData,
  DragSelectableItemsMapKey,
} from './type';
import {
  createRectFromPoints,
  getAbsoluteCoordinates,
  getDragSelectInRect,
} from './util';

interface DragSelectContextProps extends DragSelectMonitorListener {
  container?: HTMLElement;
}

export function DragSelectContext({
  children,
  container = document.querySelector('body')!,
  onDragSelectStart = () => {},
  onDragSelectMove = () => {},
  onDragSelectEnd = () => {},
}: PropsWithChildren<DragSelectContextProps>) {
  const [dragSelectableItemsMap] = useState(
    new Map<DragSelectableItemsMapKey, DragSelectableItemData>(),
  );
  const [dragSelectItems] = useState<DragSelectItems>([]);
  const [listeners] = useState(
    () =>
      new Set<DragSelectMonitorListener>([
        { onDragSelectStart, onDragSelectMove, onDragSelectEnd },
      ]),
  );
  const internalData = useMemo(
    () => ({ dragSelectItems, dragSelectableItemsMap, container }),
    [dragSelectItems, dragSelectableItemsMap, container],
  );

  const register = useCallback(
    (listener: DragSelectMonitorListener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    [listeners],
  );

  const dispatch = useCallback(
    ({ type, event }: DragSelectMonitorEvent) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      listeners.forEach((listener) => {
        if (type === 'onDragSelectStart') {
          listener[type]?.(event);
        } else if ('currentPositionCoordinate' in event) {
          listener[type]?.(event);
        }
      });
    },
    [listeners],
  );

  useEffect(() => {
    if (!container) {
      return;
    }

    let startCoordinate: CoordinateType | null = null;
    let pointerEvent: PointerEvent | null = null;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== MOUSE_LEFT_CLICK) {
        return;
      }

      const target = event.target as HTMLElement;

      const isNonDraggableElement = !!target.closest(
        '[data-non-drag-selectable]',
      );
      if (isNonDraggableElement) {
        return;
      }

      startCoordinate = getAbsoluteCoordinates(event, container);

      dispatch({
        type: 'onDragSelectStart',
        event: { startPositionCoordinate: startCoordinate },
      });
    };

    const handlePointerMove = (event: Event) => {
      requestAnimationFrame(() => {
        if (!startCoordinate) {
          return;
        }

        if (event instanceof PointerEvent) {
          pointerEvent = event;
        }

        if (!pointerEvent) {
          return;
        }

        const currentCoordinate = getAbsoluteCoordinates(
          pointerEvent,
          container,
        );
        const rect = createRectFromPoints(startCoordinate, currentCoordinate);
        const dragSelectData = getDragSelectInRect({
          container,
          rect,
          dragSelectableItemsMap,
          dragSelectItems,
        });

        dispatch({
          type: 'onDragSelectMove',
          event: {
            currentPositionCoordinate: currentCoordinate,
            startPositionCoordinate: startCoordinate,
            dragSelectData,
          },
        });
      });
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!startCoordinate) {
        return;
      }

      const currentCoordinate = getAbsoluteCoordinates(event);
      const rect = createRectFromPoints(startCoordinate, currentCoordinate);
      const dragSelectData = getDragSelectInRect({
        container,
        rect,
        dragSelectableItemsMap,
        dragSelectItems,
      });

      dispatch({
        type: 'onDragSelectEnd',
        event: {
          currentPositionCoordinate: currentCoordinate,
          startPositionCoordinate: startCoordinate,
          dragSelectData,
        },
      });

      startCoordinate = null;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('scroll', handlePointerMove, { passive: true });

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('scroll', handlePointerMove);
    };
  }, [dispatch, container, dragSelectableItemsMap, dragSelectItems]);

  return (
    <DragSelectMonitorContext.Provider value={register}>
      <InternalDragSelectDataContext.Provider value={internalData}>
        {children}
      </InternalDragSelectDataContext.Provider>
    </DragSelectMonitorContext.Provider>
  );
}
