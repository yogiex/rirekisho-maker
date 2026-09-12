export const strings = {
  app: { title: 'Rirekisho Maker' },
  nav: { back: '戻る', next: '次へ', navAria: 'Navigasi wizard' },
  common: {
    deleteAria: 'Hapus baris ini',
    deleteTitle: 'Hapus baris ini?',
    deleteDesc: 'Data pada baris ini akan dihapus dari form.',
    deleteCancel: 'Batal',
    deleteConfirm: 'Hapus',
  },

  steps: [
    { jp: '基本情報', id: 'Informasi Dasar' },
    { jp: '学歴・職歴', id: 'Riwayat Pendidikan & Kerja' },
    { jp: '免許・資格', id: 'Izin & Sertifikasi' },
    { jp: '志望動機・希望', id: 'Motivasi & Harapan' },
    { jp: 'プレビュー', id: 'Pratinjau & PDF' },
  ] as const,

  step2: {
    furiganaHint: 'ふりがな hanya perlu diisi pada entri PERTAMA setiap sekolah/perusahaan.',
    addEducation: '追加 (学歴)',
    addWork: '追加 (職歴)',
    emptyTitle: 'まだ履歴がありません',
    emptyDesc: 'Tambahkan riwayat pendidikan atau pekerjaanmu.',
    categoryEducation: '学歴',
    categoryWork: '職歴',
    dateYear: 'Tahun (年)',
    dateMonth: 'Bulan (月)',
    categoryLabel: 'Kategori',
    actionLabel: 'Status',
    nameLabel: 'Nama sekolah / perusahaan',
    namePlaceholderEdu: '例: 日本大学',
    namePlaceholderWork: '例: 株式会社サンプル',
    furiganaLabel: 'ふりがな',
    detailLabel: 'Detail',
    detailPlaceholderEdu: '例: 情報工学部',
    detailPlaceholderWork: '例: 営業部 / 主任',
    historyCurrent: '現在学校・会社に在籍中（「現在に至る」行を追加）',
    chronologyWarning: (rows: string) =>
      `Baris ${rows} tidak berurutan secara waktu — periksa kembali. (Tidak menghalangi lanjut)`,
  },

  step3: {
    hint: 'Contoh: JLPT N3, 普通運転免許, ITパスポート. Bagian ini opsional — kosongkan bila belum ada.',
    add: '資格を追加',
    emptyTitle: 'まだ登録がありません',
    emptyDesc: 'Tambahkan izin atau sertifikasi yang kamu miliki (opsional).',
    dateYear: 'Tahun (年)',
    dateMonth: 'Bulan (月)',
    nameLabel: 'Nama izin / sertifikasi',
    namePlaceholder: '例: JLPT N3',
    issuerLabel: 'Penerbit (発行元)',
    issuerPlaceholder: '例: The Japan Foundation',
  },

  step4: {
    specialties: '特技 (Keterampilan khusus)',
    specialtiesPlaceholder: '例: 料理',
    hobbies: '趣味 (Hobi)',
    hobbiesPlaceholder: '例: 読書',
    motivation: '志望動機 (Alasan melamar)',
    motivationPlaceholder: 'なぜこの会社で働きたいのか、具体的に書きましょう（300〜400字が目安）',
    insertExample: '例文を挿入',
    insertConfirmTitle: 'Ganti isi 志望動機 dengan contoh?',
    insertConfirmDesc: 'Teks yang sudah kamu tulis akan diganti dengan contoh. Tindakan ini tidak bisa dibatalkan.',
    insertConfirmCancel: 'Batal',
    insertConfirmOk: 'Ya, ganti',
    commute: '通勤時間 (Waktu tempuh ke kantor)',
    commuteHourLabel: '時間 (jam)',
    commuteMinuteLabel: '分 (menit)',
    spouse: '配偶者 (Status pernikahan)',
    spouseYes: 'あり (menikah)',
    spouseNo: 'なし (belum menikah)',
    dependents: '扶養家族 (Tanggungan, di luar pasangan)',
    requests: '本人希望記入欄 (Permintaan khusus)',
    requestsPlaceholder: '例: 希望する勤務地や給与など。なければ空欄で構いません。',
    requestsHint: 'Isi hanya jika ada permintaan khusus (gaji, lokasi, jam kerja). Kosong = tidak ada permintaan.',
  },

  examples: {
    motivation:
      '私は大学で〇〇を専攻し、卒業後は〇〇の分野で〇年間の経験を積んでまいりました。貴社の「〇〇」という事業方針に強く共感し、これまでの経験とスキルを活かして貢献できると考えております。特に〇〇という強みを活かし、入社後は一日も早く戦力になれるよう努力する所存です。貴社でさらなる成長を目指しながら、長期的に働きたいと考えております。',
    insertedToast:
      'Contoh dimasukkan — ganti 〇〇 dengan pengalaman dan hal spesifik tentang perusahaanmu, lalu sesuaikan panjangnya ke 300–400字.',
  },

  step1: {
    title: '基本情報',
    photoHeading: 'Foto (写真)',
    furigana: 'Nama Kana (ふりがな)',
    fullName: 'Nama Lengkap (氏名)',
    dob: 'Tanggal Lahir (生年月日)',
    dobYear: 'Tahun (年)',
    dobMonth: 'Bulan (月)',
    dobDay: 'Tanggal (日)',
    age: 'Usia (満年齢)',
    gender: 'Jenis Kelamin (性別)',
    genderMale: 'Laki-laki (男)',
    genderFemale: 'Perempuan (女)',
    genderNone: 'Tidak diisi (設定しない)',
    postal: 'Kode Pos (郵便番号)',
    prefecture: 'Prefektur (都道府県)',
    prefecturePlaceholder: 'Pilih prefektur',
    address: 'Alamat (現住所)',
    addressFurigana: 'Alamat Kana (ふりがな)',
    phone: 'Telepon (電話番号)',
    email: 'Email (メールアドレス)',
    altToggle: 'Punya kontak/alamat berbeda? (連絡先)',
    altRelation: 'Hubungan (続柄)',
    altName: 'Nama (氏名)',
    altPhone: 'Telepon (電話番号)',
  },

  photo: {
    placeholder: '写真',
    hint: 'Klik untuk unggah · rasio 3:4',
    processing: 'Memproses foto…',
    change: 'Ganti foto',
    remove: 'Hapus',
    errorNotImage: 'File bukan gambar. Gunakan JPG/PNG.',
    errorTooLarge: 'Ukuran maksimal 10MB.',
    errorFailed: 'Gagal memproses foto. Coba file lain.',
  },

  tips: {
    ariaLabel: 'Penjelasan kolom ini',
    photo:
      'Foto 3×4 cm, latar polos, berjas/atasan kerja, ekspresi tenang seperti foto visa. Lebih baik ambil di studio foto sertifikasi. Jika ragu, konfirmasikan ke perekrut.',
    furigana:
      'ふりがな = cara baca nama dalam HIRAGANA (あ), bukan katakana (ア). Contoh: ブディ → ぶでぃ. Jika ragu, konfirmasikan ke perekrut.',
    fullName:
      'Tulis sesuai paspor. Warga asing umumnya memakai katakana atau alfabet. Jika ragu, konfirmasikan ke perekrut.',
    historyStart:
      'Umumnya cukup mulai dari SMA (高校入学). SD/SMP jarang ditulis bila Anda sudah berpengalaman kerja. Jika ragu, konfirmasikan ke perekrut.',
    motivation:
      'Hindari kalimat generik. Sebut nama perusahaan + alasan spesifik, panjang ideal 300–400 字. Jika ragu, konfirmasikan ke perekrut.',
  },

  trust: {
    privacyFooter:
      'Data tersimpan di browser ini saja — tidak pernah dikirim ke server. Foto diproses lokal; metadata lokasi (EXIF) otomatis dihapus.',
    sharedComputerTitle: 'Memakai komputer bersama (warnet/kantor)?',
    sharedComputer:
      'Draft tersimpan di browser ini. Setelah selesai, tekan tombol Reset di langkah terakhir agar data terhapus dari perangkat ini.',
    autosave: '自動保存済み',
  },

  errors: {
    required: 'Wajib diisi',
    furigana: 'Gunakan hiragana (あ), bukan katakana/alfabet',
    postal: 'Format: 123-4567',
    phone: 'Contoh: 090-1234-5678',
    email: 'Format email tidak valid',
    invalidDate: 'Tanggal tidak valid untuk bulan tersebut',
    futureDate: 'Tidak boleh di masa depan',
    actionMismatch: 'Aksi tidak sesuai kategori',
  },

  misc: {
    stepPlaceholder: (n: number) => `Step ${n} — dibuat di milestone berikutnya`,
  },
} as const;
