'use client';

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  distance?: number;
}

/**
 *
 * @param container drag-select 기능이 필요한 영역입니다. 기본적으로는 `body`입니다.
 * @param distance drag-select 이벤트가 시작하는 최소 px입니다. 기본적으로는 10px입니다.
 * @returns
 */
export function DragSelectContext({
  children,
  container = document.querySelector('body')!,
  distance = 10,
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

  const startCoordinate = useRef<CoordinateType | null>(null);
  const pointerEvent = useRef<PointerEvent | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
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

      startCoordinate.current = getAbsoluteCoordinates(event, container);
      dispatch({
        type: 'onDragSelectStart',
        event: { startPositionCoordinate: startCoordinate.current },
      });
    },
    [container, dispatch],
  );

  const handlePointerMove = useCallback(
    (event: Event) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        if (event instanceof PointerEvent) {
          pointerEvent.current = event;
        }

        if (!startCoordinate.current || !pointerEvent.current) {
          return;
        }

        const currentCoordinate = getAbsoluteCoordinates(
          pointerEvent.current,
          container,
        );
        const rect = createRectFromPoints(
          startCoordinate.current,
          currentCoordinate,
        );

        // 거리 이내면 그냥 끝
        const curDistance = (rect.x2 - rect.x1) ** 2 + (rect.y2 - rect.y1) ** 2;
        if (curDistance < distance ** 2) {
          return;
        }

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
            startPositionCoordinate: startCoordinate.current,
            dragSelectItems: dragSelectData,
          },
        });
      });
    },
    [container, distance, dispatch, dragSelectItems, dragSelectableItemsMap],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      if (!startCoordinate.current) {
        return;
      }

      const currentCoordinate = getAbsoluteCoordinates(event, container);
      const rect = createRectFromPoints(
        startCoordinate.current,
        currentCoordinate,
      );

      const curDistance = (rect.x2 - rect.x1) ** 2 + (rect.y2 - rect.y1) ** 2;
      if (curDistance < distance ** 2) {
        startCoordinate.current = null;
        return;
      }

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
          startPositionCoordinate: startCoordinate.current,
          dragSelectItems: dragSelectData,
        },
      });

      startCoordinate.current = null;
    },
    [container, distance, dispatch, dragSelectItems, dragSelectableItemsMap],
  );

  useEffect(() => {
    if (!container) {
      return;
    }

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
  }, [container, handlePointerDown, handlePointerMove, handlePointerUp]);

  return (
    <DragSelectMonitorContext.Provider value={register}>
      <InternalDragSelectDataContext.Provider value={internalData}>
        {children}
      </InternalDragSelectDataContext.Provider>
    </DragSelectMonitorContext.Provider>
  );
}
