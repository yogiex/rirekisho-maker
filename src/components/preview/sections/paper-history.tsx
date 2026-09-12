import type { CSSProperties } from 'react';
import { strings } from '@/lib/constants/strings';
import type { HistoryEntry } from '@/lib/schema/rirekisho-schema';
import { padRows, sortHistoryStable } from '@/lib/utils/paper';
import { HISTORY_DATE_COL_PCT, HISTORY_MIN_ROWS, PAPER_FURIGANA_SIZE } from '../paper-constants';
import { cell, headerCell, paperText } from '../paper-styles';

interface PaperHistoryProps {
  history: HistoryEntry[];
  historyCurrent: boolean;
}

const L = strings.paperLabel;

const fillerCell: CSSProperties = { ...cell, height: 22 };
const rightCell: CSSProperties = { ...cell, textAlign: 'right' };
const centerCell: CSSProperties = { ...cell, textAlign: 'center' };

export function PaperHistory({ history, historyCurrent }: PaperHistoryProps) {
  const sorted = sortHistoryStable(history);
  const rows = padRows(sorted, HISTORY_MIN_ROWS);

  return (
    <table style={{ ...paperText, width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <thead>
        <tr>
          <th style={{ ...headerCell, width: HISTORY_DATE_COL_PCT }}>{L.dateCol}</th>
          <th style={headerCell}>{L.historyCol}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) =>
          row === null ? (
            <tr key={`filler-${i}`}>
              <td style={fillerCell}>&nbsp;</td>
              <td style={fillerCell}>&nbsp;</td>
            </tr>
          ) : (
            <tr key={row.id}>
              <td style={centerCell}>
                {row.date.year}年{row.date.month}月
              </td>
              <td style={cell}>
                {row.nameFurigana !== '' && (
                  <div style={{ fontSize: PAPER_FURIGANA_SIZE, lineHeight: 1.2 }}>{row.nameFurigana}</div>
                )}
                <div>
                  {row.name}
                  {row.detail !== '' ? `　${row.detail}` : ''}　{row.action}
                </div>
              </td>
            </tr>
          ),
        )}
        {historyCurrent && (
          <tr>
            <td style={cell}>&nbsp;</td>
            <td style={rightCell}>{L.current}</td>
          </tr>
        )}
        {sorted.length > 0 && (
          <tr>
            <td style={cell}>&nbsp;</td>
            <td style={rightCell}>{L.end}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
