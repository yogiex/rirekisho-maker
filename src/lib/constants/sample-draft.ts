import { createDefaultDraft, type RirekishoData } from '@/lib/schema/rirekisho-schema';

const MOTIVATION =
  '私は専門学校と大学で情報処理と経営学を学び、卒業後は株式会社サンプルテクノロジーの開発部にて約2年間、ReactとTypeScriptを用いたフロントエンド開発に従事してまいりました。要件定義から実装、テスト、リリースまで一連の工程を経験し、チームでの開発を通じてコミュニケーション力と課題解決力を磨いてきました。日本語はビジネスレベルで、日本語での報告や資料作成にも対応できます。これまでに培った技術力と経験を活かし、貴社のプロダクト開発に貢献するとともに、新しい技術にも積極的に挑戦して成長していきたいと考えております。';

export function createSampleDraft(today: Date): RirekishoData {
  return {
    ...createDefaultDraft(today),
    fillDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
    furigana: 'ぶでぃ・さんとそ',
    fullName: 'ブディ・サントソ',
    dateOfBirth: { year: 1999, month: 8, day: 17 },
    gender: 'male',
    postalCode: '160-0022',
    prefecture: '東京都',
    address: '新宿区新宿3丁目XX-XX',
    addressFurigana: 'しんじゅくくしんじゅくさんちょうめ',
    phone: '090-1234-5678',
    email: 'budi.santoso@example.com',
    history: [
      { id: 'sample-h1', date: { year: 2018, month: 4 }, category: 'education', name: '日本電子専門学校', nameFurigana: 'にほんでんしせんもんがっこう', action: '入学', detail: '情報処理科' },
      { id: 'sample-h2', date: { year: 2020, month: 3 }, category: 'education', name: '日本電子専門学校', nameFurigana: 'にほんでんしせんもんがっこう', action: '卒業', detail: '情報処理科' },
      { id: 'sample-h3', date: { year: 2020, month: 4 }, category: 'education', name: 'アジア大学', nameFurigana: 'あじあだいがく', action: '入学', detail: '経営学部' },
      { id: 'sample-h4', date: { year: 2022, month: 3 }, category: 'education', name: 'アジア大学', nameFurigana: 'あじあだいがく', action: '卒業', detail: '経営学部' },
      { id: 'sample-h5', date: { year: 2022, month: 4 }, category: 'work', name: '株式会社サンプルテクノロジー', nameFurigana: 'かぶしきがいしゃさんぷるてくのろじー', action: '入社', detail: '開発部' },
      { id: 'sample-h6', date: { year: 2024, month: 9 }, category: 'work', name: '株式会社サンプルテクノロジー', nameFurigana: 'かぶしきがいしゃさんぷるてくのろじー', action: '退社', detail: '開発部' },
    ],
    historyCurrent: false,
    licenses: [
      { id: 'sample-l1', date: { year: 2020, month: 6 }, name: 'ITパスポート', issuer: '経済産業省' },
      { id: 'sample-l2', date: { year: 2021, month: 7 }, name: 'JLPT N3', issuer: '国際交流基金' },
      { id: 'sample-l3', date: { year: 2023, month: 5 }, name: '普通運転免許', issuer: '公安委員会' },
    ],
    specialties: 'プログラミング（React・TypeScript）',
    hobbies: '読書、ランニング',
    motivation: MOTIVATION,
    commuteHours: 0,
    commuteMinutes: 40,
    spouse: false,
    dependents: 0,
    requests: '勤務地は東京を希望します。柔軟な働き方に対応できます。',
  };
}
