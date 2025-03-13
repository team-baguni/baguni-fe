'use client';

import { movePicks } from '@/apis/pick/movePicks';
import { PICK_LIST_SIZE } from '@/constants/pickListSize';
import { useMutationWithSyncUpdate } from '@/libs/@react-query/useMutationWithSyncUpdate';
import type { GetPickListResponseType } from '@/types/GetPickListResponseType';
import type { UseMovePicksMutationFnParamType } from '@/types/UseMovePicksMutationFnParamType';
import { convertToInfiniteDataFromPickList } from '@/utils/convertToInfiniteDataFromPickList';
import { getMovedToEqualFolderPickList } from '@/utils/getMovedToEqualFolderPickList';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { pickKeys } from './pickKeys';

export function useMovePicksToEqualFolder() {
  const queryClient = useQueryClient();

  return useMutationWithSyncUpdate({
    mutationFn: (movePicksParam: UseMovePicksMutationFnParamType) =>
      movePicks(movePicksParam.movePicksInfo),
    onMutate({ fromPickId, movePicksInfo, sourceFolderId, toPickId }) {
      const prevInfiniteData = queryClient.getQueryData<
        InfiniteData<GetPickListResponseType>
      >(pickKeys.folderInfinite(sourceFolderId));
      const prevPickList =
        prevInfiniteData?.pages.flatMap((page) => page.content) ?? [];

      const nextPickList = getMovedToEqualFolderPickList({
        prevPickList,
        fromPickId,
        toPickId,
        movePicksInfo,
      });

      const nextInfiniteData = convertToInfiniteDataFromPickList({
        pickList: nextPickList,
        contentSize: PICK_LIST_SIZE,
        oldData: prevInfiniteData,
      });

      queryClient.setQueryData<InfiniteData<GetPickListResponseType>>(
        pickKeys.folderInfinite(sourceFolderId),
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return nextInfiniteData;
        },
      );
    },
    onSettled(_data, _error, { sourceFolderId }) {
      queryClient.invalidateQueries({
        queryKey: pickKeys.folderInfinite(sourceFolderId),
      });
    },
  });
}
