import type { CSSProperties } from 'react';
import { strings } from '@/lib/constants/strings';
import type { LicenseEntry } from '@/lib/schema/rirekisho-schema';
import { padRows, sortLicensesStable } from '@/lib/utils/paper';
import { LICENSE_COL_PCTS, LICENSE_MIN_ROWS } from '../paper-constants';
import { cell, headerCell, paperText } from '../paper-styles';

interface PaperLicensesProps {
  licenses: LicenseEntry[];
}

const L = strings.paperLabel;

const fillerCell: CSSProperties = { ...cell, height: 22 };
const centerCell: CSSProperties = { ...cell, textAlign: 'center' };

export function PaperLicenses({ licenses }: PaperLicensesProps) {
  const sorted = sortLicensesStable(licenses);
  const rows = sorted.length === 0 ? [] : padRows(sorted, LICENSE_MIN_ROWS);

  return (
    <table style={{ ...paperText, width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <thead>
        <tr>
          <th style={{ ...headerCell, width: LICENSE_COL_PCTS[0] }}>{L.dateCol}</th>
          <th style={{ ...headerCell, width: LICENSE_COL_PCTS[1] }}>{L.licNameCol}</th>
          <th style={{ ...headerCell, width: LICENSE_COL_PCTS[2] }}>{L.issuerCol}</th>
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td style={fillerCell}>&nbsp;</td>
            <td style={centerCell} colSpan={2}>
              {L.none}
            </td>
          </tr>
        ) : (
          rows.map((row, i) =>
            row === null ? (
              <tr key={`filler-${i}`}>
                <td style={fillerCell}>&nbsp;</td>
                <td style={fillerCell}>&nbsp;</td>
                <td style={fillerCell}>&nbsp;</td>
              </tr>
            ) : (
              <tr key={row.id}>
                <td style={centerCell}>
                  {row.date.year}年{row.date.month}月
                </td>
                <td style={cell}>{row.name}</td>
                <td style={cell}>{row.issuer}</td>
              </tr>
            ),
          )
        )}
      </tbody>
    </table>
  );
}
