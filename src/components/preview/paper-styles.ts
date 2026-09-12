import type { CSSProperties } from 'react';
import {
  PAPER_BORDER,
  PAPER_FONT_SIZE,
  PAPER_HEADER_BG,
  PAPER_LINE_HEIGHT,
  PAPER_TEXT,
} from './paper-constants';

export const paperText: CSSProperties = {
  color: PAPER_TEXT,
  fontSize: PAPER_FONT_SIZE,
  lineHeight: PAPER_LINE_HEIGHT,
  fontVariantNumeric: 'tabular-nums',
};

export const cell: CSSProperties = {
  border: `1px solid ${PAPER_BORDER}`,
  padding: '4px 8px',
};

export const headerCell: CSSProperties = {
  ...cell,
  background: PAPER_HEADER_BG,
  fontWeight: 600,
  textAlign: 'center',
};
