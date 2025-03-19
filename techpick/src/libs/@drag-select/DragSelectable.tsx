import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

export function DragSelectable(
  props: PropsWithChildren<ComponentPropsWithoutRef<'div'>>,
) {
  const { children, ...otherProps } = props;
  return (
    <div {...otherProps} data-draggable>
      {children}
    </div>
  );
}
