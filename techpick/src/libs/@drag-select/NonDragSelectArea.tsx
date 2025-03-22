import type { PropsWithChildren } from 'react';

export const NonDragSelectArea = ({ children }: PropsWithChildren) => {
  return <div data-non-drag-selectable>{children}</div>;
};
