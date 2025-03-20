import { style } from '@vanilla-extract/css';
import { globalStyle } from '@vanilla-extract/css';

export const preventOverscrollBehaviorY = style({
  overscrollBehaviorY: 'none',
});

globalStyle('::selection', {
  backgroundColor: '#e0edfb',
});
