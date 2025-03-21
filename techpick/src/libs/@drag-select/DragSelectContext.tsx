'use client';

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DragSelectContainer } from './DragSelectContainer';
import { MOUSE_LEFT_CLICK } from './constant';
import { DragSelectMonitorContext } from './context';
import type {
  CoordinateType,
  DragSelectMonitorEvent,
  DragSelectMonitorListener,
} from './type';
import {
  createRectFromPoints,
  getAbsoluteCoordinates,
  getElementsInRect,
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
  const dragSelectContainerRef = useRef<HTMLElement | null>(null);
  const elementPositionCache = useRef(new WeakMap<HTMLElement, DOMRect>());

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

      dragSelectContainerRef.current = target.closest(
        '[data-drag-selectable-container]',
      );

      elementPositionCache.current = new WeakMap<HTMLElement, DOMRect>();

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
        const elements = dragSelectContainerRef.current
          ? getElementsInRect({
              rect,
              container,
              dragSelectContextContainer: dragSelectContainerRef.current,
              weakMap: elementPositionCache.current,
            })
          : [];

        dispatch({
          type: 'onDragSelectMove',
          event: {
            currentPositionCoordinate: currentCoordinate,
            startPositionCoordinate: startCoordinate,
            elementList: elements,
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
      const elements = dragSelectContainerRef.current
        ? getElementsInRect({
            rect,
            container,
            dragSelectContextContainer: dragSelectContainerRef.current,
            weakMap: elementPositionCache.current,
          })
        : [];

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
  }, [dispatch, container]);

  return (
    <DragSelectContainer>
      <DragSelectMonitorContext.Provider value={registerListener}>
        {children}
      </DragSelectMonitorContext.Provider>
    </DragSelectContainer>
  );
}
