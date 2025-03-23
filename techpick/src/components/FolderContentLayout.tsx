'use client';

import { type PropsWithChildren, forwardRef } from 'react';
import { folderContentLayoutStyle } from './folderContentLayout.css';

/**
 * @description FolderTree에 따라 선택된 폴더의 컨텐츠(픽 리스트)를 감쌉니다.
 */
export const FolderContentLayout = forwardRef<
  HTMLDivElement,
  PropsWithChildren
>(function FolderContentLayout({ children }, ref) {
  return (
    <div className={folderContentLayoutStyle} ref={ref}>
      {children}
    </div>
  );
});
