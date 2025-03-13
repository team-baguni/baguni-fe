'use client';

import { useFolderToFolderDndMonitor } from '@/hooks/useFolderToFolderDndMonitor';
import { usePickToFolderDndMonitor } from '@/hooks/usePickToFolderDndMonitor';
import { usePickToPickDndMonitor } from '@/hooks/usePickToPickDndMonitor';
import { useRecommendPickToFolderDndMonitor } from '@/hooks/useRecommendPickToFolderDndMonitor';

export function DndMonitorContext() {
  usePickToPickDndMonitor();
  useFolderToFolderDndMonitor();
  usePickToFolderDndMonitor();
  useRecommendPickToFolderDndMonitor();
  return null;
}
