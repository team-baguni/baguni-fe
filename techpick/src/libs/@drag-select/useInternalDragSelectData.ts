import { useContext } from 'react';
import { InternalDragSelectDataContext } from './context';

export function useInternalDragSelectData() {
  const context = useContext(InternalDragSelectDataContext);

  if (!context) {
    throw new Error(
      'useInternalDragSelectData must be used within a children of <DragSelectContext>',
    );
  }

  return context;
}
