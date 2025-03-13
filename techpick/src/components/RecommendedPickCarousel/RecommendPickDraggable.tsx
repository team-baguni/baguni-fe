import { RECOMMEND_PICK } from '@/constants/recommendPick';
import type { RecommendPickCategoryType } from '@/types/RecommendPickCategoryType';
import type { RecommendPickType } from '@/types/RecommendPickType';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties, PropsWithChildren } from 'react';
import { draggableStyle } from './recommendPickDraggable.css';
export function RecommendPickDraggable({
  recommendPick,
  recommendPickCategoryType,
  children,
}: PropsWithChildren<RecommendPickDraggableProps>) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${RECOMMEND_PICK}-${recommendPickCategoryType}-${recommendPick.url}`,
      data: {
        ...recommendPick,
        type: RECOMMEND_PICK,
      },
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      id={`${RECOMMEND_PICK}-${recommendPickCategoryType}-${recommendPick.url}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={isDragging ? draggableStyle : ''}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}

interface RecommendPickDraggableProps {
  recommendPick: RecommendPickType;
  recommendPickCategoryType: RecommendPickCategoryType;
}
