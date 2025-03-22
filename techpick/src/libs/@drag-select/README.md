# drag-select 명세
notion처럼 drag-select로 무언가를 선택하는 기능을 가지고 있습니다.

## DragSelectContext
모든 훅과 컴포넌트는 DragSelectContext 내부에 존재해야합니다.

## DragSelectOverlay
현재 마우스로 드래그 하고 있는 영역입니다. 스타일은 자유롭게 부여할 수 있습니다.

## useDragSelect
선택하고 싶은 컴포넌트 혹은 타겟을 지정하는 hook입니다.
id는 반드시 고유해야합니다.
```
const { setNodeRef } = useDragSelect({
  id: pickId,
  data: {},
});

return <div ref={setNodeRef} />
```

## NonDragSelectArea
`DragSelectContext` 내부에서 드래그를 시작하고 싶지 않은 영역의 경우 해당 컴포넌트로 감싸주세요.

## useDragSelectMonitor
`DragSelectContext` 내의 이벤트에 감지하여 트리거됩니다.
이벤트는 아래와 같습니다.
```
onDragSelectStart?(event: DragSelectEvent): void;
onDragSelectMove?(event: DragSelectMoveEvent): void;
onDragSelectEnd?(event: DragSelectMoveEvent): void;
```