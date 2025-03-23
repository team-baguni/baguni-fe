'use client';
import { useGetDragOverStyle } from '@/hooks/useGetDragOverStyle';
import { useFetchFolders } from '@/queries/useFetchFolders';
import { usePickStore } from '@/stores/pickStore';
import type { FolderType } from '@/types/FolderType';
import type { RecommendPickType } from '@/types/RecommendPickType';
import { getFolderInfoByFolderId } from '@/utils/getFolderInfoByFolderId';
import { isFolderDraggableObject } from '@/utils/isFolderDraggableObject';
import { isRecommendPickDraggableObject } from '@/utils/isRecommendPickDraggableObject';
import {
  DragOverlay as DragOverlayPrimitive,
  type DragStartEvent,
  useDndMonitor,
} from '@dnd-kit/core';
import { memo, useState } from 'react';
import { useElementClickPosition } from '../useElementClickPosition';
import { FolderItemOverlay } from './FolderItemOverlay';
import { PickCarouselCardOverlay } from './PickCarouselCardOverlay';
import { PickDragOverlayShadowList } from './PickDragOverlayShadowList';
import { PickRecordOverlay } from './PickRecordOverlay';
import { dragCountStyle, stackedOverlayStyle } from './dragOverlay.css';

export const DargOverlay = memo(function DragOverlay() {
  const { elementClickPosition } = useElementClickPosition();
  const isPickDragging = usePickStore((state) => state.isDragging);
  const draggingPickInfo = usePickStore((state) => state.draggingPickInfo);
  const selectedPickIdList = usePickStore((state) => state.selectedPickIdList);
  const [draggingObjectType, setDraggingObjectType] =
    useState<DraggingObjectType>(null);
  const [draggingRecommendPickInfo, setDraggingRecommendPickInfo] =
    useState<RecommendPickType | null>(null);
  const [draggingFolderInfo, setDraggingFolderInfo] =
    useState<FolderType | null>(null);
  const { data: folderRecord } = useFetchFolders();

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeObject = active.data.current;

    if (isRecommendPickDraggableObject(activeObject)) {
      setDraggingObjectType('recommendPick');
      setDraggingRecommendPickInfo(activeObject);
      return;
    }

    if (isFolderDraggableObject(activeObject)) {
      const folderId = Number(activeObject.id);
      const folderInfo = getFolderInfoByFolderId({ folderId, folderRecord });

      if (!folderInfo) {
        return;
      }

      setDraggingObjectType('folder');
      setDraggingFolderInfo(folderInfo);
    }
  };

  const onDragEnd = async () => {
    setDraggingObjectType(null);
  };

  useDndMonitor({ onDragStart, onDragEnd });

  const { overlayStyle: pickOverlayStyle } = useGetDragOverStyle({
    elementClickPosition,
    isDragging: isPickDragging,
    scale: 0.7,
  });
  const { overlayStyle: recommendPickOverlayStyle } = useGetDragOverStyle({
    elementClickPosition,
    isDragging: draggingObjectType === 'recommendPick',
    scale: 0.4,
  });
  const { overlayStyle: folderOverlayStyle } = useGetDragOverStyle({
    elementClickPosition,
    isDragging: draggingObjectType === 'folder',
  });
  const selectedPickListCount = selectedPickIdList.length - 1;
  const shadowCount = Math.min(selectedPickListCount, 5);

  if (isPickDragging && draggingPickInfo) {
    return (
      <DragOverlayPrimitive style={pickOverlayStyle}>
        <div className={stackedOverlayStyle}>
          <PickRecordOverlay pickInfo={draggingPickInfo} />
          {0 < selectedPickListCount && (
            <>
              <PickDragOverlayShadowList count={shadowCount} />
              <div className={dragCountStyle}>{selectedPickIdList.length}</div>
            </>
          )}
        </div>
      </DragOverlayPrimitive>
    );
  }

  if (draggingObjectType === 'recommendPick' && draggingRecommendPickInfo) {
    return (
      <DragOverlayPrimitive style={recommendPickOverlayStyle}>
        <PickCarouselCardOverlay recommendPick={draggingRecommendPickInfo} />
      </DragOverlayPrimitive>
    );
  }

  if (draggingObjectType === 'folder' && draggingFolderInfo) {
    return (
      <DragOverlayPrimitive style={{ ...folderOverlayStyle }}>
        <FolderItemOverlay name={draggingFolderInfo.name} />
      </DragOverlayPrimitive>
    );
  }
});

type DraggingObjectType = 'recommendPick' | 'pick' | 'folder' | null;
