'use client';

import { type PropsWithChildren, memo } from 'react';

export const DragSelectContainer = memo(function DragSelectContainer({
  children,
}: PropsWithChildren) {
  return <div data-drag-selectable-container>{children}</div>;
});
