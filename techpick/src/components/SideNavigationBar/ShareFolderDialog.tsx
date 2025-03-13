'use client';

import { ROUTES } from '@/constants/route';
import { dialogOverlayStyle } from '@/styles/dialogStyle.css';
import { notifySuccess } from '@/utils/toast';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { ShareFolderStatusContext } from './ShareFolderStatusProvider';
import {
  closeIcon,
  copyButton,
  dialogContent,
  dialogDescription,
  dialogTitle,
  icon,
  linkContent,
  myLinkPageLinkText,
  shareFolderDialogContentStyle,
  sharedFolderLink,
} from './shareFolderDialog.css';

export function ShareFolderDialog() {
  const { isOpenShareFolderDialog, onCloseShareFolderDialog, uuid } =
    useContext(ShareFolderStatusContext);
  const shareFolderLink = `${window.location.origin}/share/${uuid}`;
  const writeUserClipboard = () => {
    navigator.clipboard.writeText(shareFolderLink).then(() => {
      notifySuccess('링크 복사 완료');
    });
  };

  return (
    <DialogPrimitive.Root
      open={isOpenShareFolderDialog}
      onOpenChange={onCloseShareFolderDialog}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={dialogOverlayStyle} />
        <DialogPrimitive.Content className={dialogContent}>
          <DialogPrimitive.Title className={dialogTitle}>
            폴더가 공유되었습니다.
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className={dialogDescription}>
            <Link href={ROUTES.MY_PAGE} className={myLinkPageLinkText}>
              <span
                className={linkContent}
                onClick={onCloseShareFolderDialog}
                onKeyDown={(e) => {
                  if (e.key === 'enter') {
                    onCloseShareFolderDialog();
                  }
                }}
              >
                <Settings className={icon} size={14} />
                내설정
              </span>
            </Link>
            에서 공유를 취소할 수 있습니다.
          </DialogPrimitive.Description>
          <div className={shareFolderDialogContentStyle}>
            <div
              className={sharedFolderLink}
              id="shared-folder-link"
              title={shareFolderLink}
            >
              {shareFolderLink}
            </div>
            <button
              type="button"
              className={copyButton}
              onClick={writeUserClipboard}
            >
              Copy
            </button>
          </div>
          <DialogPrimitive.Close
            className={closeIcon}
            onClick={onCloseShareFolderDialog}
          >
            ×
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
