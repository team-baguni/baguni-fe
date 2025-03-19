import { useContext, useEffect } from 'react';
import { DragSelectMonitorContext } from './context';
import type { DragSelectMonitorListener } from './type';

export function useDragSelectMonitor(listener: DragSelectMonitorListener) {
  const registerListener = useContext(DragSelectMonitorContext);

  useEffect(() => {
    if (!registerListener) {
      throw new Error(
        'useDragSelectMonitor must be used within a children of <DragSelectContext>',
      );
    }

    const unsubscribe = registerListener(listener);

    return unsubscribe;
  }, [listener, registerListener]);
}
