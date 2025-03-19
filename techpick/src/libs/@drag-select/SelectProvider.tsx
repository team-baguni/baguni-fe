// import { createContext, useRef, useState } from 'react';

// // SelectProvider.tsx
// const SelectContext = createContext({
//   registerMonitor: (monitor: SelectMonitor) => {},
//   unregisterMonitor: (monitor: SelectMonitor) => {},
// });

// export const SelectProvider = ({ children }) => {
//   const monitorsRef = useRef<Set<SelectMonitor>>(new Set());
//   const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
//     null,
//   );
//   const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(
//     null,
//   );

//   // 요소 선택 영역 계산
//   const getSelectionRect = () => {
//     if (!startPos || !currentPos) return null;
//     return {
//       left: Math.min(startPos.x, currentPos.x),
//       top: Math.min(startPos.y, currentPos.y),
//       right: Math.max(startPos.x, currentPos.x),
//       bottom: Math.max(startPos.y, currentPos.y),
//     };
//   };

//   // 이벤트 핸들러 통합 처리
//   const handleStart = (e: MouseEvent | TouchEvent) => {
//     const target = e.target as HTMLElement;
//     if (target.closest('.non-select-area')) return;

//     const pos = getEventPosition(e);
//     setStartPos(pos);
//     setCurrentPos(pos);

//     monitorsRef.current.forEach((monitor) => {
//       monitor.onSelectStart?.(pos.x, pos.y);
//     });
//   };

//   const handleMove = (e: MouseEvent | TouchEvent) => {
//     if (!startPos) return;
//     const pos = getEventPosition(e);
//     setCurrentPos(pos);

//     const rect = getSelectionRect();
//     const elements = getElementsInRect(rect);

//     monitorsRef.current.forEach((monitor) => {
//       monitor.onSelectMove?.(pos.x, pos.y, elements);
//     });
//   };

//   // 이벤트 위치 추출 유틸리티
//   const getEventPosition = (e: MouseEvent | TouchEvent) => {
//     if ('touches' in e) {
//       return { x: e.touches[0].clientX, y: e.touches[0].clientY };
//     }
//     return { x: e.clientX, y: e.clientY };
//   };

//   // 영역 내 요소 필터링
//   const getElementsInRect = (rect: DOMRect) => {
//     return Array.from(document.elementsFromPoint(rect.left, rect.top)).filter(
//       (el) => !el.closest('.non-select-area'),
//     );
//   };

//   return (
//     <SelectContext.Provider value={{ registerMonitor, unregisterMonitor }}>
//       {children}
//       <SelectOverlay rect={getSelectionRect()} />
//     </SelectContext.Provider>
//   );
// };

// // 이벤트 타입 통합 관리
// type UnifiedEvent = MouseEvent | TouchEvent;
// const events = {
//   start: ['mousedown', 'touchstart'],
//   move: ['mousemove', 'touchmove'],
//   end: ['mouseup', 'touchend'],
// };
