import { style } from '@vanilla-extract/css';

export const dragSelectOverlayStyle = style({
  backgroundColor: 'rgba(0, 123, 255, 0.3)',
  border: '1px solid rgba(0, 123, 255, 0.8)',
  pointerEvents: 'none',
  willChange: 'left, top, width, height',
});
