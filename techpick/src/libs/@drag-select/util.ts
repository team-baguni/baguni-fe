import type { CoordinateType, RectType } from './type';

export const createRectFromPoints = (
  p1: CoordinateType,
  p2: CoordinateType,
) => {
  const x1 = Math.min(p1.x, p2.x);
  const y1 = Math.min(p1.y, p2.y);
  const x2 = Math.max(p1.x, p2.x);
  const y2 = Math.max(p1.y, p2.y);

  return { x1, y1, x2, y2 };
};

interface IsInRectParameter {
  element: HTMLElement;
  container: HTMLElement;
  rect: RectType;
}

/**
 * @param rect 직사각형 영역입니다.
 * @param element 직사각형 영역 내에 있는지 판단이 필요한 요소입니다.
 * @param container 스크롤이 존재하는 영역입니다. 뷰포트를 넘었을 때의 계산을 위해 필요합니다.
 * @returns
 */
export const isInRect = ({ element, container, rect }: IsInRectParameter) => {
  const elRect = element.getBoundingClientRect();

  // 스크롤 값을 고려한 절대 좌표 계산
  const left = elRect.left + container.scrollLeft;
  const right = elRect.right + container.scrollLeft;
  const top = elRect.top + container.scrollTop;
  const bottom = elRect.bottom + container.scrollTop;

  const xLeft = rect.x1;
  const xRight = rect.x2;
  const xTop = rect.y1;
  const xBottom = rect.y2;

  // 좌우 교차 확인
  const isXIntersecting =
    (xLeft <= left && left <= xRight) ||
    (xLeft <= right && right <= xRight) ||
    (left <= xLeft && xRight <= right);

  // 상하 교차 확인
  const isYIntersecting =
    (xTop <= top && top <= xBottom) ||
    (xTop <= bottom && bottom <= xBottom) ||
    (top <= xTop && xBottom <= bottom);

  return isXIntersecting && isYIntersecting;
};
