'use client';

import { type ComponentPropsWithoutRef, useState } from 'react';
import type { CoordinateType } from './type';
import { useDragSelectMonitor } from './useDragSelectMonitor';
import { useInternalDragSelectData } from './useInternalDragSelectData';

export function DragSelectOverlay(props: ComponentPropsWithoutRef<'div'>) {
  const { style: propsStyle, ...otherProps } = props;
  const [startPositionCoordinate, setStartPositionCoordinate] =
    useState<CoordinateType | null>(null);
  const [currentPositionCoordinate, setCurrentPositionCoordinate] =
    useState<CoordinateType | null>(null);
  const { container } = useInternalDragSelectData();

  useDragSelectMonitor({
    onDragSelectStart({ startPositionCoordinate }) {
      setStartPositionCoordinate(startPositionCoordinate);
    },
    onDragSelectMove({ currentPositionCoordinate }) {
      setCurrentPositionCoordinate(currentPositionCoordinate);
    },
    onDragSelectEnd() {
      setCurrentPositionCoordinate(null);
      setCurrentPositionCoordinate(null);
    },
  });

  if (!startPositionCoordinate || !currentPositionCoordinate) {
    return null;
  }

  const rectX = Math.min(
    startPositionCoordinate.x,
    currentPositionCoordinate.x,
  );
  const rectY = Math.min(
    startPositionCoordinate.y,
    currentPositionCoordinate.y,
  );
  const containerRect = container.getBoundingClientRect();
  const maxWidth =
    document.documentElement.clientWidth -
    (containerRect.left +
      rectX +
      (document.documentElement.clientWidth - containerRect.right));
  const rectWidth = Math.min(
    Math.abs(startPositionCoordinate.x - currentPositionCoordinate.x),
    maxWidth,
  );
  const rectHeight = Math.abs(
    startPositionCoordinate.y - currentPositionCoordinate.y,
  );

  const style: React.CSSProperties = {
    position: 'absolute',
    left: rectX,
    top: rectY,
    width: rectWidth,
    height: rectHeight,
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    border: '1px solid rgba(0, 123, 255, 0.8)',
    pointerEvents: 'none',
    willChange: 'left, top, width, height',
  };

  return <div style={{ ...style, ...propsStyle }} {...otherProps} />;
}
