'use client';

import { PICK_LIST_SIZE } from '@/constants/pickListSize';
import { DragSelectable } from '@/libs/@drag-select/DragSelectable';
import { NonSelectArea } from '@/libs/@drag-select/NonSelectArea';
import { useFetchPickListByFolderId } from '@/queries/useFetchPickListByFolderId';
import type { FolderIdType } from '@/types/FolderIdType';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PickDraggableListLayout } from './PickDraggableListLayout';
import { PickDraggableRecord } from './PickRecord/PickDraggableRecord';
const EmptyPickRecordImage = dynamic(() =>
  import('@/components/EmptyPickRecordImage').then(
    (mod) => mod.EmptyPickRecordImage,
  ),
);

export function PickDraggableInfiniteScrollList({
  folderId,
}: PickDraggableInfiniteScrollListProps) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useFetchPickListByFolderId(folderId, PICK_LIST_SIZE);
  const pickList = data?.pages.flatMap((page) => page.content) ?? [];

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(
    function loadNextPage() {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [inView, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (!isLoading && pickList.length === 0) {
    return <EmptyPickRecordImage />;
  }

  return (
    <PickDraggableListLayout folderId={folderId} viewType="record">
      {pickList.map((pick, index) => {
        return (
          <div
            key={pick.id}
            ref={index === pickList.length - 10 ? ref : undefined}
          >
            <DragSelectable>
              <NonSelectArea>
                <PickDraggableRecord pickInfo={pick} />
              </NonSelectArea>
            </DragSelectable>
          </div>
        );
      })}
    </PickDraggableListLayout>
  );
}

interface PickDraggableInfiniteScrollListProps {
  folderId: FolderIdType;
}
