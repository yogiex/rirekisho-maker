import type { RirekishoData } from '@/lib/schema/rirekisho-schema';
import { getWareki } from '@/lib/utils/wareki';
import { getFullAge } from '@/lib/utils/age';
import { PaperHeader } from '@/components/preview/sections/paper-header';
import { PaperHistory } from '@/components/preview/sections/paper-history';
import { PaperLicenses } from '@/components/preview/sections/paper-licenses';
import { PaperBottom } from '@/components/preview/sections/paper-bottom';
import {
  PAPER_BG,
  PAPER_HEIGHT_PX,
  PAPER_PADDING_PX,
  PAPER_WIDTH_PX,
} from './paper-constants';
import { paperText } from './paper-styles';

export function RirekishoPaper({ data }: { data: RirekishoData }) {
  const wareki = getWareki(data.dateOfBirth);
  const age = getFullAge(data.dateOfBirth, new Date());

  return (
    <div
      id="rirekisho-paper"
      style={{
        ...paperText,
        fontFamily: 'var(--font-paper)',
        width: PAPER_WIDTH_PX,
        minHeight: PAPER_HEIGHT_PX,
        background: PAPER_BG,
        padding: PAPER_PADDING_PX,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      <PaperHeader data={data} wareki={wareki} age={age} />
      <PaperHistory history={data.history} historyCurrent={data.historyCurrent} />
      <PaperLicenses licenses={data.licenses} />
      <PaperBottom data={data} />
    </div>
  );
}
