import { createContext } from 'react';
import type { RegisterListener } from './type';

export const DragSelectMonitorContext = createContext<RegisterListener | null>(
  null,
);
