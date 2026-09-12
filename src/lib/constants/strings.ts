export const strings = {
  app: { title: 'Rirekisho Maker' },
  nav: { back: '戻る', next: '次へ', navAria: 'Navigasi wizard' },

  steps: [
    { jp: '基本情報', id: 'Informasi Dasar' },
    { jp: '学歴・職歴', id: 'Riwayat Pendidikan & Kerja' },
    { jp: '免許・資格', id: 'Izin & Sertifikasi' },
    { jp: '志望動機・希望', id: 'Motivasi & Harapan' },
    { jp: 'プレビュー', id: 'Pratinjau & PDF' },
  ] as const,

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
