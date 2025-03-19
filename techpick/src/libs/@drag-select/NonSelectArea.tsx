import type { PointerEvent, PropsWithChildren } from 'react';
import { nonSelectAreaStyle } from './nonSelectArea.css';

export const NonSelectArea = ({ children }: PropsWithChildren) => {
  const handlePointerDown = (e: PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div onPointerDown={handlePointerDown} className={nonSelectAreaStyle}>
      {children}
    </div>
  );
};
