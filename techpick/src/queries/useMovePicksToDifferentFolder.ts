'use client';

import { movePicks } from '@/apis/pick/movePicks';
import { PICK_LIST_SIZE } from '@/constants/pickListSize';
import { useMutationWithSyncUpdate } from '@/libs/@react-query/useMutationWithSyncUpdate';
import type { GetPickListResponseType } from '@/types/GetPickListResponseType';
import type { PickListType } from '@/types/PickListType';
import type { UseMovePicksMutationFnParamType } from '@/types/UseMovePicksMutationFnParamType';
import { convertToInfiniteDataFromPickList } from '@/utils/convertToInfiniteDataFromPickList';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { pickKeys } from './pickKeys';

export function useMovePicksToDifferentFolder() {
  const queryClient = useQueryClient();

  return useMutationWithSyncUpdate({
    mutationFn: (
      movePickParam: Omit<UseMovePicksMutationFnParamType, 'toPickId'>,
    ) => movePicks(movePickParam.movePicksInfo),
    onMutate({ movePicksInfo, sourceFolderId }) {
      const { destinationFolderId } = movePicksInfo;

      const prevSourceInfiniteData = queryClient.getQueryData<
        InfiniteData<GetPickListResponseType>
      >(pickKeys.folderInfinite(sourceFolderId));
      const prevSourcePickList =
        prevSourceInfiniteData?.pages.flatMap((page) => page.content) ?? [];

      const movedPickSet = new Set(movePicksInfo.idList);
      const movedPickList: PickListType = [];
      const nextSourcePickList: PickListType = [];

      for (const pickInfo of prevSourcePickList) {
        if (movedPickSet.has(pickInfo.id)) {
          movedPickList.push(pickInfo);
        } else {
          nextSourcePickList.push(pickInfo);
        }
      }

      const nextSourceInfiniteData = convertToInfiniteDataFromPickList({
        pickList: nextSourcePickList,
        contentSize: PICK_LIST_SIZE,
        oldData: prevSourceInfiniteData,
      });

      queryClient.setQueryData(
        pickKeys.folderInfinite(sourceFolderId),
        nextSourceInfiniteData,
      );

      const prevDestinationInfiniteData = queryClient.getQueryData<
        InfiniteData<GetPickListResponseType>
      >(pickKeys.folderInfinite(destinationFolderId));
      const prevDestinationPickList =
        prevDestinationInfiniteData?.pages.flatMap((page) => page.content) ??
        [];

      const nextDestinationPickList = [
        ...movedPickList,
        ...prevDestinationPickList,
      ];
      const nextDestinationInfiniteData = convertToInfiniteDataFromPickList({
        pickList: nextDestinationPickList,
        contentSize: PICK_LIST_SIZE,
        oldData: prevDestinationInfiniteData,
      });

      queryClient.setQueryData(
        pickKeys.folderInfinite(destinationFolderId),
        nextDestinationInfiniteData,
      );

      return { prevSourceInfiniteData, prevDestinationInfiniteData };
    },
    onError(_error, { sourceFolderId, movePicksInfo }, context) {
      if (
        context?.prevDestinationInfiniteData &&
        context.prevSourceInfiniteData
      ) {
        queryClient.setQueryData(
          pickKeys.folderInfinite(sourceFolderId),
          context.prevSourceInfiniteData,
        );
        queryClient.setQueryData(
          pickKeys.folderInfinite(movePicksInfo.destinationFolderId),
          context.prevDestinationInfiniteData,
        );
      }
    },
    onSettled(_data, _error, { sourceFolderId, movePicksInfo }) {
      queryClient.invalidateQueries({
        queryKey: pickKeys.folderInfinite(sourceFolderId),
      });
      queryClient.invalidateQueries({
        queryKey: pickKeys.folderInfinite(movePicksInfo.destinationFolderId),
      });
      queryClient.invalidateQueries({
        queryKey: pickKeys.search(),
      });
    },
  });
}
