import type { PickInfoType } from '@/types/PickInfoType';

export const isPickInfoObject = (data: unknown): data is PickInfoType => {
  if (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'linkInfo' in data &&
    'parentFolderId' in data &&
    'tagIdOrderedList' in data
  ) {
    const obj = data as PickInfoType;
    return (
      typeof obj.id === 'number' &&
      typeof obj.title === 'string' &&
      typeof obj.linkInfo === 'object' &&
      obj.linkInfo !== null &&
      typeof obj.parentFolderId === 'number' &&
      Array.isArray(obj.tagIdOrderedList)
    );
  }

  return false;
};
