'use client';

import { FolderContentHeader } from '@/components/FolderContentHeader/FolderContentHeader';
import { FolderContentLayout } from '@/components/FolderContentLayout';
import { PickContentLayout } from '@/components/PickContentLayout';
import { PickDraggableInfiniteScrollList } from '@/components/PickDraggableInfiniteScrollList';
import { useClearSelectedPickIdsOnMount } from '@/hooks/useClearSelectedPickIdsOnMount';
import { useResetPickFocusOnOutsideClick } from '@/hooks/useResetPickFocusOnOutsideClick';
import { DragSelectContext } from '@/libs/@drag-select/DragSelectContext';
import { DragSelectOverlay } from '@/libs/@drag-select/DragSelectOverlay';
import type { DragSelectMoveEvent } from '@/libs/@drag-select/type';
import { usePickStore } from '@/stores/pickStore';
import { isPickInfoObject } from '@/utils/isPickInfoObject';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { dragSelectOverlayStyle } from './page.css';

export default function FolderDetailPage() {
  const { folderId: stringFolderId } = useParams<{ folderId: string }>();
  const folderId = Number(stringFolderId);
  useResetPickFocusOnOutsideClick();
  useClearSelectedPickIdsOnMount();
  const setSelectedPickIdList = usePickStore(
    (state) => state.setSelectedPickIdList,
  );
  const setFocusedPickId = usePickStore((state) => state.setFocusedPickId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, []);

  const onDragSelectEnd = ({ dragSelectItems }: DragSelectMoveEvent) => {
    const selectedPickIdList: number[] = [];

    for (const dragSelectItem of dragSelectItems) {
      const pickInfo = dragSelectItem.data?.pickInfo;
      if (isPickInfoObject(pickInfo)) {
        selectedPickIdList.push(pickInfo.id);
      }
    }

    setSelectedPickIdList(selectedPickIdList);
    if (selectedPickIdList[0]) {
      setFocusedPickId(selectedPickIdList[0]);
    }
  };

  return (
    <FolderContentLayout ref={containerRef}>
      <DragSelectContext
        container={container!}
        onDragSelectEnd={onDragSelectEnd}
      >
        <FolderContentHeader folderId={folderId} />
        <PickContentLayout>
          <PickDraggableInfiniteScrollList folderId={folderId} />
        </PickContentLayout>
        <DragSelectOverlay className={dragSelectOverlayStyle} />
      </DragSelectContext>
    </FolderContentLayout>
  );
}
