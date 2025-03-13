'use client';

import type { TagType } from '@/types/TagType';
import { useDeleteTagDialogStore } from './DeleteTagDialog.store';
import { deleteTagDialogButtonStyle } from './deleteTagDialogTriggerButton.css';

export function DeleteTagDialogTriggerButton({
  tag,
  onClick: parentOnClick = () => {},
}: DeleteTagDialogTriggerButtonProps) {
  const { setIsOpen, setDeleteTagId } = useDeleteTagDialogStore();

  const showDeleteTagDialog = () => {
    setIsOpen(true);
    setDeleteTagId(tag.id);
    parentOnClick();
  };

  return (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={showDeleteTagDialog}
      className={deleteTagDialogButtonStyle}
    >
      삭제
    </button>
  );
}

interface DeleteTagDialogTriggerButtonProps {
  tag: TagType;
  onClick?: () => void;
}
