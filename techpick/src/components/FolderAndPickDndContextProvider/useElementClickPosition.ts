import { useContext } from 'react';
import { ElementClickPositionContext } from './ElementClickPositionContext';

export function useElementClickPosition() {
  const elementClickPosition = useContext(ElementClickPositionContext);

  if (!elementClickPosition) {
    throw new Error(
      'useElementClickPosition must be used within a children of <FolderAndPickDndContextProvider>',
    );
  }

  return elementClickPosition;
}
