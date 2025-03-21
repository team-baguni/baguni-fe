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
  elementList: HTMLElement[];
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
