import type { CSSProperties } from 'react';
import { strings } from '@/lib/constants/strings';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';
import { formatCommute, formatDependents } from '@/lib/utils/paper';
import { cell, headerCell, paperText } from '../paper-styles';

interface PaperBottomProps {
  data: RirekishoData;
}

const L = strings.paperLabel;

const tableStyle: CSSProperties = {
  ...paperText,
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
};
const centerCell: CSSProperties = { ...cell, textAlign: 'center' };
const preCell: CSSProperties = {
  ...cell,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  verticalAlign: 'top',
};

export function PaperBottom({ data }: PaperBottomProps) {
  return (
    <section style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCell}>{L.specialty}</th>
            <th style={headerCell}>{L.hobby}</th>
            <th style={headerCell}>{L.commute}</th>
            <th style={headerCell}>{L.dependents}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={centerCell}>{data.specialties || '\u00a0'}</td>
            <td style={centerCell}>{data.hobbies || '\u00a0'}</td>
            <td style={centerCell}>{formatCommute(data.commuteHours, data.commuteMinutes)}</td>
            <td style={centerCell}>{formatDependents(data.spouse, data.dependents)}</td>
          </tr>
        </tbody>
      </table>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...headerCell, textAlign: 'left' }}>{L.motivation}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...preCell, minHeight: 96, height: 96 }}>{data.motivation}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ ...tableStyle, flex: 1, height: '100%' }}>
        <thead>
          <tr>
            <th style={{ ...headerCell, textAlign: 'left' }}>{L.requests}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...preCell, height: '100%' }}>{data.requests}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
