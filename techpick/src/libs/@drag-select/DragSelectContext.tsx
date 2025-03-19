'use client';

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DragSelectContainer } from './DragSelectContainer';
import { DragSelectMonitorContext } from './context';
import type {
  CoordinateType,
  DragSelectMonitorEvent,
  DragSelectMonitorListener,
} from './type';
import { createRectFromPoints, isInRect } from './util';

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
  const dragSelectContainerRef = useRef<HTMLElement | null>(null);
  const [listeners] = useState(
    () =>
      new Set<DragSelectMonitorListener>([
        { onDragSelectStart, onDragSelectMove, onDragSelectEnd },
      ]),
  );

  const registerListener = useCallback(
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

  const getElementsInRect = useCallback(function getElementsInRect(
    rect: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    },
    container: HTMLElement,
  ): HTMLElement[] {
    const dragSelectContainer = dragSelectContainerRef.current;

    if (!dragSelectContainer || !container) {
      return [];
    }

    const elements = Array.from(
      dragSelectContainer.querySelectorAll<HTMLElement>('[data-draggable]'),
    );

    return elements.filter((element) => isInRect({ rect, element, container }));
  }, []);

  const getContainerScrollOffset = useCallback((container: HTMLElement) => {
    const { top, left } = container.getBoundingClientRect();

    return {
      scrollLeft: container.scrollLeft + left,
      scrollTop: container.scrollTop + top,
    };
  }, []);

  const getAbsoluteCoordinates = useCallback(
    (event: PointerEvent, container?: HTMLElement) => {
      const { scrollLeft, scrollTop } = container
        ? getContainerScrollOffset(container)
        : { scrollLeft: window.scrollX, scrollTop: window.scrollY };

      return {
        x: event.clientX - scrollLeft,
        y: event.clientY + scrollTop,
      };
    },
    [getContainerScrollOffset],
  );

  useEffect(() => {
    if (!container) {
      return;
    }

    let startCoordinate: CoordinateType | null = null;

    const handlePointerDown = (event: PointerEvent) => {
      startCoordinate = getAbsoluteCoordinates(event, container);
      const target = event.target as HTMLElement;
      dragSelectContainerRef.current = target.closest(
        '[data-drag-selectable-container]',
      );

      dispatch({
        type: 'onDragSelectStart',
        event: { startPositionCoordinate: startCoordinate },
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!startCoordinate) {
        return;
      }

      const currentCoordinate = getAbsoluteCoordinates(event, container);
      const rect = createRectFromPoints(startCoordinate, currentCoordinate);
      const elements = getElementsInRect(rect, container);

      dispatch({
        type: 'onDragSelectMove',
        event: {
          currentPositionCoordinate: currentCoordinate,
          startPositionCoordinate: startCoordinate,
          elementList: elements,
        },
      });
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!startCoordinate) {
        return;
      }

      const currentCoordinate = getAbsoluteCoordinates(event);
      const rect = createRectFromPoints(startCoordinate, currentCoordinate);
      const elements = getElementsInRect(rect, container);

      dispatch({
        type: 'onDragSelectEnd',
        event: {
          currentPositionCoordinate: currentCoordinate,
          startPositionCoordinate: startCoordinate,
          elementList: elements,
        },
      });

      startCoordinate = null;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dispatch, getElementsInRect, getAbsoluteCoordinates, container]);

  return (
    <DragSelectContainer>
      <DragSelectMonitorContext.Provider value={registerListener}>
        {children}
      </DragSelectMonitorContext.Provider>
    </DragSelectContainer>
  );
}
