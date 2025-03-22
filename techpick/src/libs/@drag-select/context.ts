import { createContext } from 'react';
import type { DragSelectInternalContextType, RegisterListener } from './type';

export const DragSelectMonitorContext = createContext<RegisterListener | null>(
  null,
);

export const InternalDragSelectDataContext =
  createContext<DragSelectInternalContextType | null>(null);
