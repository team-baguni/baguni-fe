import { orangeSolidButtonStyle } from '@/styles/orangeButtonStyle.css';
import { style } from '@vanilla-extract/css';

export const formStyle = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '16px',
  width: '300px',
  height: '100dvh',
  margin: '0 auto',
});

export const labelStyle = style({
  fontSize: '14px',
  fontWeight: 'bold',
});

export const inputStyle = style({
  padding: '8px',
  fontSize: '14px',
  border: '1px solid #ccc',
  borderRadius: '4px',
});

export const buttonStyle = style([
  orangeSolidButtonStyle,
  {
    padding: '10px',
    fontSize: '14px',
  },
]);
