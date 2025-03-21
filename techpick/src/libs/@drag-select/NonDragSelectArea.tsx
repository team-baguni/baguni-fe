import type { PointerEvent, PropsWithChildren } from 'react';

export const NonDragSelectArea = ({ children }: PropsWithChildren) => {
  const handlePointerDown = (e: PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div onPointerDown={handlePointerDown} data-non-drag-selectable>
      {children}
    </div>
  );
};
