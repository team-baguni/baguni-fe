export interface CoordinateType {
  x: number;
  y: number;
}

export interface RectType {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DragSelectEvent {
  startPositionCoordinate: CoordinateType;
}

export interface DragSelectMoveEvent extends DragSelectEvent {
  currentPositionCoordinate: CoordinateType;
  dragSelectData: DragSelectableItemData[];
}

export interface DragSelectMonitorListener {
  onDragSelectStart?(event: DragSelectEvent): void;
  onDragSelectMove?(event: DragSelectMoveEvent): void;
  onDragSelectEnd?(event: DragSelectMoveEvent): void;
}

export type UnregisterListener = () => void;

export type RegisterListener = (
  listener: DragSelectMonitorListener,
) => UnregisterListener;

export interface DragSelectMonitorEvent {
  type: keyof DragSelectMonitorListener;
  event: DragSelectEvent | DragSelectMoveEvent;
}

/**
 * Internal context
 */
export type UniqueId = string | number;

export interface DragSelectableItemData {
  node: HTMLElement;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: Record<string, any>;
}

export type DragSelectableItemsWeakMapKey = UniqueId;
export type DragSelectItems = UniqueId[];
export type DragSelectableItemsWeakMap = Map<
  DragSelectableItemsWeakMapKey,
  DragSelectableItemData
>;

export interface DragSelectInternalContextType {
  dragSelectableItemsWeakMap: DragSelectableItemsWeakMap;
  dragSelectItems: DragSelectItems;
  container: HTMLElement;
}
