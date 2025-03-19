'use client';
import { ROUTES } from '@/constants/route';
import { pointerWithin } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { DndMonitorContext } from './DndMonitorContext';
import { DargOverlay } from './DragOverlay/DragOverlay';
import { ElementClickPositionContext } from './ElementClickPositionContext';
import { pointerWithinWithClosestCenter } from './pointerWithinWithClosestCenter';
import { useGetDndContextSensor } from './useGetDndContextSensor';

/**
 * @description pick과 folder에서 drag & drop을 이용할 시에 context로 감싸줘야합니다.
 */
export function FolderAndPickDndContextProvider({
  children,
}: PropsWithChildren) {
  const [elementClickPosition, setElementClickPosition] = useState({
    x: 0,
    y: 0,
  });
  const { sensors } = useGetDndContextSensor({
    setElementClickPosition,
  });
  const pathname = usePathname();
  const collisionDetectionAlgorithm = pathname.includes(ROUTES.RECOMMEND)
    ? pointerWithin
    : pointerWithinWithClosestCenter;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionAlgorithm}
    >
      <ElementClickPositionContext.Provider
        value={{ elementClickPosition, setElementClickPosition }}
      >
        <DndMonitorContext />
        <DargOverlay />
        {children}
      </ElementClickPositionContext.Provider>
    </DndContext>
  );
}
