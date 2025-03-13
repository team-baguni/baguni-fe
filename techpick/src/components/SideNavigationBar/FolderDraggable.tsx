'use client';
import { FOLDER } from '@/constants/folder';
import type { FolderIdType } from '@/types/FolderIdType';
import { getFolderSortableContextId } from '@/utils/getFolderSortableContextId';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties, PropsWithChildren } from 'react';
import { activeDraggingFolderStyle } from './folderDraggable.css';

export const FolderDraggable = ({
  folderId,
  children,
}: PropsWithChildren<FolderDraggableProps>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: getFolderSortableContextId(folderId),
    data: {
      id: folderId,
      type: FOLDER,
    },
  });
  const folderElementId = `${FOLDER}-${folderId}`;

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={activeDraggingFolderStyle}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      id={folderElementId}
      suppressHydrationWarning={true}
    >
      {children}
    </div>
  );
};

interface FolderDraggableProps {
  folderId: FolderIdType;
}
