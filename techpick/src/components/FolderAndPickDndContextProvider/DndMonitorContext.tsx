'use client';

import { memo } from 'react';
import { useFolderToFolderDndMonitor } from './useFolderToFolderDndMonitor';
import { usePickToFolderDndMonitor } from './usePickToFolderDndMonitor';
import { usePickToPickDndMonitor } from './usePickToPickDndMonitor';
import { useRecommendPickToFolderDndMonitor } from './useRecommendPickToFolderDndMonitor';

export const DndMonitorContext = memo(function DndMonitorContext() {
  usePickToPickDndMonitor();
  useFolderToFolderDndMonitor();
  usePickToFolderDndMonitor();
  useRecommendPickToFolderDndMonitor();
  return null;
});
