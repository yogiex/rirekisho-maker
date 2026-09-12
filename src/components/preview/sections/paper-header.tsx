import type { CSSProperties } from 'react';
import { strings } from '@/lib/constants/strings';
import type { RirekishoData } from '@/lib/schema/rirekisho-schema';
import { formatJpFullDate, type WarekiInfo } from '@/lib/utils/wareki';
import {
  PAPER_BORDER,
  PAPER_FURIGANA_SIZE,
  PAPER_PHOTO_BG,
  PAPER_PLACEHOLDER,
  PAPER_TITLE_SIZE,
  PAPER_TITLE_TRACKING,
  PHOTO_H_PX,
  PHOTO_W_PX,
} from '../paper-constants';
import { paperText } from '../paper-styles';

interface PaperHeaderProps {
  data: RirekishoData;
  wareki: WarekiInfo | null;
  age: number;
}

const L = strings.paperLabel;

const smallStyle: CSSProperties = { fontSize: PAPER_FURIGANA_SIZE, lineHeight: 1.2 };
const rowStyle: CSSProperties = {
  borderBottom: `1px solid ${PAPER_BORDER}`,
  padding: '4px 0',
};

function genderLabel(gender: RirekishoData['gender']): string {
  if (gender === 'male') return L.male;
  if (gender === 'female') return L.female;
  return '';
}

export function PaperHeader({ data, wareki, age }: PaperHeaderProps) {
  const warekiPart = wareki ? `${wareki.label}・` : '';
  const gender = genderLabel(data.gender);
  const contact = data.alternateContact;
  const showContact =
    data.alternateContactEnabled &&
    contact !== undefined &&
    (contact.name !== '' || contact.phone !== '' || contact.relation !== '');

  return (
    <header style={paperText}>
      <h1
        style={{
          margin: 0,
          textAlign: 'center',
          fontSize: PAPER_TITLE_SIZE,
          fontWeight: 600,
          letterSpacing: PAPER_TITLE_TRACKING,
          textIndent: PAPER_TITLE_TRACKING,
        }}
      >
        {L.title}
      </h1>
      <div style={{ textAlign: 'right' }}>{formatJpFullDate(data.fillDate)}現在</div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `1fr ${PHOTO_W_PX}px`,
          columnGap: 16,
          alignItems: 'start',
          marginTop: 8,
        }}
      >
        <div>
          <div style={rowStyle}>
            {data.furigana !== '' && <div style={smallStyle}>{data.furigana}</div>}
            <div style={{ fontSize: 20, fontWeight: 500 }}>{data.fullName || '\u00a0'}</div>
          </div>
          <div style={rowStyle}>
            {L.dob}：{formatJpFullDate(data.dateOfBirth)}生（{warekiPart}満{age}歳）　{L.gender}：{gender}
          </div>
          <div style={rowStyle}>
            {data.addressFurigana !== '' && <div style={smallStyle}>{data.addressFurigana}</div>}
            <div>
              {L.postal}
              {data.postalCode}　{data.prefecture}
              {data.address}
            </div>
          </div>
          <div style={rowStyle}>
            {L.phone}：{data.phone}　{L.email}：{data.email}
          </div>
          {showContact && contact && (
            <div style={rowStyle}>
              {L.contact}：{contact.name}
              {contact.relation !== '' ? `（${contact.relation}）` : ''}　{contact.phone}
            </div>
          )}
        </div>

        <div
          style={{
            width: PHOTO_W_PX,
            height: PHOTO_H_PX,
            border: `1px solid ${PAPER_BORDER}`,
            background: PAPER_PHOTO_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {data.photo ? (
            <img
              src={data.photo}
              alt="Foto profil"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <span style={{ color: PAPER_PLACEHOLDER }}>{L.photo}</span>
          )}
        </div>
      </div>
    </header>
  );
}
