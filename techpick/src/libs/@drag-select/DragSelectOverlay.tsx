'use client';

import { type ComponentPropsWithoutRef, useState } from 'react';
import type { CoordinateType } from './type';
import { useDragSelectMonitor } from './useDragSelectMonitor';

export function DragSelectOverlay(props: ComponentPropsWithoutRef<'div'>) {
  const { style: propsStyle, ...otherProps } = props;
  const [startPositionCoordinate, setStartPositionCoordinate] =
    useState<CoordinateType | null>({ x: 0, y: 0 });
  const [currentPositionCoordinate, setCurrentPositionCoordinate] =
    useState<CoordinateType | null>({ x: 0, y: 0 });

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
  const rectWidth = Math.abs(
    startPositionCoordinate.x - currentPositionCoordinate.x,
  );
  const rectHeight = Math.abs(
    startPositionCoordinate.y - currentPositionCoordinate.y,
  );

  console.log('rectX', rectX);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: rectX,
    top: rectY,
    width: rectWidth,
    height: rectHeight,
    backgroundColor: 'rgba(0, 123, 255, 0.3)', // 투명한 파란색 박스
    border: '1px solid rgba(0, 123, 255, 0.8)',
    pointerEvents: 'none', // 드래그 방해 방지
  };

  return <div style={{ ...style, ...propsStyle }} {...otherProps} />;
}
