import { createContext } from 'react';

interface Position {
  x: number;
  y: number;
}

interface ElementClickPositionContextType {
  elementClickPosition: Position;
  setElementClickPosition: (position: Position) => void;
}

export const ElementClickPositionContext =
  createContext<ElementClickPositionContextType | null>(null);
