'use client';

import { FolderContentHeader } from '@/components/FolderContentHeader/FolderContentHeader';
import { FolderContentLayout } from '@/components/FolderContentLayout';
import { PickContentLayout } from '@/components/PickContentLayout';
import { PickDraggableInfiniteScrollList } from '@/components/PickDraggableInfiniteScrollList';
import { useClearSelectedPickIdsOnMount } from '@/hooks/useClearSelectedPickIdsOnMount';
import { useResetPickFocusOnOutsideClick } from '@/hooks/useResetPickFocusOnOutsideClick';
import { DragSelectContext } from '@/libs/@drag-select/DragSelectContext';
import { DragSelectOverlay } from '@/libs/@drag-select/DragSelectOverlay';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function FolderDetailPage() {
  const { folderId: stringFolderId } = useParams<{ folderId: string }>();
  const folderId = Number(stringFolderId);
  useResetPickFocusOnOutsideClick();
  useClearSelectedPickIdsOnMount();
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(containerRef.current);
  }, []);

  return (
    <FolderContentLayout ref={containerRef}>
      <DragSelectContext container={container!}>
        <FolderContentHeader folderId={folderId} />
        <PickContentLayout>
          <PickDraggableInfiniteScrollList folderId={folderId} />
        </PickContentLayout>
        <DragSelectOverlay />
      </DragSelectContext>
    </FolderContentLayout>
  );
}
