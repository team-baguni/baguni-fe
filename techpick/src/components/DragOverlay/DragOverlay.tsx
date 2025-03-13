'use client';

import { useGetDragOverStyle } from '@/hooks/useGetDragOverStyle';
import { useFolderStore } from '@/stores/folderStore';
import { usePickStore } from '@/stores/pickStore';
import type { RecommendPickType } from '@/types/RecommendPickType';
import { isRecommendPickDraggableObject } from '@/utils/isRecommendPickDraggableObject';
import {
  DragOverlay as DragOverlayPrimitive,
  type DragStartEvent,
  useDndMonitor,
} from '@dnd-kit/core';
import { useState } from 'react';
import { FolderItemOverlay } from './FolderItemOverlay';
import { PickCarouselCardOverlay } from './PickCarouselCardOverlay';
import { PickDragOverlayShadowList } from './PickDragOverlayShadowList';
import { PickRecordOverlay } from './PickRecordOverlay';
import { dragCountStyle, stackedOverlayStyle } from './dragOverlay.css';

export function DargOverlay({ elementClickPosition }: DargOverlayProps) {
  const { isDragging: isFolderDragging, draggingFolderInfo } = useFolderStore();
  const isPickDragging = usePickStore((state) => state.isDragging);
  const draggingPickInfo = usePickStore((state) => state.draggingPickInfo);
  const selectedPickIdList = usePickStore((state) => state.selectedPickIdList);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingObjectType, setDraggingObjectType] =
    useState<DraggingObjectType>(null);
  const [draggingRecommendPickInfo, setDraggingRecommendPickInfo] =
    useState<RecommendPickType | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeObject = active.data.current;
    setIsDragging(true);

    if (isRecommendPickDraggableObject(activeObject)) {
      setDraggingObjectType('recommendPick');
      setDraggingRecommendPickInfo(activeObject);
      return;
    }
  };

  const onDragEnd = async () => {
    setIsDragging(false);
    setDraggingObjectType(null);
  };

  useDndMonitor({ onDragStart, onDragEnd });

  const { overlayStyle: pickOverlayStyle } = useGetDragOverStyle({
    elementClickPosition,
    isDragging: isPickDragging,
    scale: 0.7,
  });
  const { overlayStyle: folderOverlayStyle } = useGetDragOverStyle({
    elementClickPosition,
    isDragging: isFolderDragging,
  });
  const { overlayStyle: recommendPickOverlayStyle } = useGetDragOverStyle({
    elementClickPosition,
    isDragging: draggingObjectType === 'recommendPick',
    scale: 0.4,
  });
  const selectedPickListCount = selectedPickIdList.length - 1;
  const shadowCount = Math.min(selectedPickListCount, 5);

  if (!isDragging) {
    return null;
  }

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

  if (isFolderDragging && draggingFolderInfo) {
    return (
      <DragOverlayPrimitive style={folderOverlayStyle}>
        <FolderItemOverlay name={draggingFolderInfo.name} />
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
}

interface DargOverlayProps {
  elementClickPosition: {
    x: number;
    y: number;
  };
}

type DraggingObjectType = 'recommendPick' | 'Pick' | 'Folder' | null;
