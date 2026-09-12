import type { Metadata } from 'next';
import Link from 'next/link';

import { GuideArticle, GuideCta, GuideNote, GuideShell } from '@/components/guides/guide-layout';

export const metadata: Metadata = {
  title: 'Cara Membuat Rirekisho (履歴書): Panduan Lengkap CV Jepang untuk Orang Indonesia',
  description:
    'Panduan langkah demi langkah mengisi rirekisho format JIS: data diri, furigana, foto, riwayat pendidikan & pekerjaan (学歴・職歴), sertifikat, 志望動機, dan kesalahan umum pelamar asing.',
};

export default function CaraMembuatRirekishoPage() {
  return (
    <GuideShell>
      <GuideArticle>
        <header>
          <p className="text-sm text-muted-foreground">
            <Link href="/panduan" className="hover:underline">
              Panduan
            </Link>{' '}
            / Cara Membuat Rirekisho
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Cara Membuat Rirekisho (履歴書): Panduan Lengkap CV Jepang untuk Orang Indonesia
          </h1>
          <p className="mt-4 text-muted-foreground">
            Rirekisho adalah dokumen pertama yang dibaca perekrut Jepang — dan formatnya sangat berbeda dari CV
            Indonesia. Artikel ini menjelaskan struktur resminya, cara mengisi setiap kolom, serta hal-hal yang
            sering membuat lamaran warga asing langsung tersisih.
          </p>
        </header>

        <GuideCta>
          Tidak mau mengatur tabel sendiri? Isi formulir berbahasa Indonesia dan dapatkan rirekisho format JIS siap
          cetak — gratis, tanpa akun, data tetap di perangkat Anda.
        </GuideCta>

        <h2 id="apa-itu-rirekisho">Apa itu rirekisho dan mengapa formatnya kaku?</h2>
        <p>
          <strong>Rirekisho (履歴書)</strong> secara harfiah berarti &ldquo;dokumen riwayat&rdquo;. Berbeda dengan CV
          Barat yang bebas didesain, rirekisho mengikuti tata letak baku yang hampir sama di semua perusahaan.
          Perekrut membacanya dengan pola tetap: foto dan nama di kanan atas, riwayat di kiri, motivasi di bawah.
          Karena semua pelamar memakai format yang sama, perekrut menilai <em>ketelitian</em> Anda — bukan
          kreativitas.
        </p>
        <p>
          Sejak 2021 Kementerian Kesehatan, Tenaga Kerja dan Kesejahteraan Jepang (厚生労働省) merekomendasikan
          templat yang menghapus kolom-kolom sensitif seperti jenis kelamin wajib, jumlah tanggungan, dan waktu tempuh
          ke kantor. Templat inilah yang umum disebut <strong>format JIS terbaru</strong> dan yang digunakan oleh
          sebagian besar tool pembuat rirekisho, termasuk 履歴書メーカー.
        </p>
        <GuideNote>
          Rirekisho berbeda dari <strong>shokumu-keirekisho (職務経歴書)</strong>. Rirekisho berisi ringkasan
          riwayat, sedangkan shokumu-keirekisho adalah uraian detail pengalaman kerja untuk pelamar berpengalaman.
          Untuk posisi pertama atau program 特定技能/技能実習, biasanya rirekisho saja sudah cukup.
        </GuideNote>

        <h2 id="struktur">Struktur rirekisho format JIS</h2>
        <p>Satu lembar A4 (atau dua halaman B5) terbagi menjadi enam blok:</p>
        <table>
          <thead>
            <tr>
              <th>Blok</th>
              <th>Isi</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tanggal & foto</td>
              <td>Tanggal pengisian, foto 3×4 cm</td>
              <td>Tanggal = hari Anda menyerahkan dokumen</td>
            </tr>
            <tr>
              <td>Data diri</td>
              <td>ふりがな, 氏名, 生年月日, alamat, telepon, email</td>
              <td>Furigana ditulis di baris atas nama dan alamat</td>
            </tr>
            <tr>
              <td>学歴・職歴</td>
              <td>Riwayat pendidikan dan pekerjaan</td>
              <td>Kronologis, dari yang paling lama</td>
            </tr>
            <tr>
              <td>免許・資格</td>
              <td>Sertifikat & lisensi</td>
              <td>JLPT, SIM, sertifikat keahlian</td>
            </tr>
            <tr>
              <td>志望の動機</td>
              <td>Motivasi melamar</td>
              <td>Kolom yang paling menentukan</td>
            </tr>
            <tr>
              <td>本人希望記入欄</td>
              <td>Permintaan khusus</td>
              <td>Umumnya diisi 貴社の規定に従います</td>
            </tr>
          </tbody>
        </table>

        <h2 id="tanggal">Langkah 1: Tanggal pengisian dan sistem tahun</h2>
        <p>
          Di kanan atas tertulis 「◯年◯月◯日現在」 — tanggal saat dokumen diserahkan atau dikirim, bukan tanggal Anda
          mulai menulis. Jepang memakai dua sistem tahun: <strong>西暦</strong> (Masehi, 2026) dan{' '}
          <strong>和暦</strong> (era kekaisaran, 令和8年). Keduanya diterima, tetapi{' '}
          <strong>harus konsisten di seluruh dokumen</strong>. Mencampur 2019 dan 令和3年 dalam satu lembar adalah
          kesalahan kecil yang sangat terlihat.
        </p>
        <p>
          Bagi pelamar asing, Masehi lebih aman karena Anda tidak perlu menghitung konversi ijazah tahun 2015 menjadi
          平成27年. Jika perusahaan meminta wareki, gunakan patokan: 平成 = tahun − 1988, 令和 = tahun − 2018.
        </p>

        <h2 id="foto">Langkah 2: Foto</h2>
        <p>
          Ukuran resmi <strong>3 cm lebar × 4 cm tinggi</strong>, diambil dalam tiga bulan terakhir. Standarnya
          mendekati foto visa: latar polos (putih, biru muda, atau abu-abu), tampak depan sampai dada, ekspresi
          tenang, rambut tidak menutupi wajah. Pria mengenakan jas gelap dan dasi; wanita blazer dengan atasan
          terang.
        </p>
        <ul>
          <li>Hindari swafoto, foto liburan yang dipotong, filter kecantikan, dan latar bermotif.</li>
          <li>Studio foto di Jepang menawarkan paket 履歴書用写真; di Indonesia minta &ldquo;pas foto latar putih 3×4 formal&rdquo;.</li>
          <li>Jika dikirim sebagai PDF, tempelkan foto digital dengan rasio 3:4 yang tajam — jangan foto yang meregang.</li>
        </ul>
        <GuideNote>
          Foto ponsel sering menyimpan metadata lokasi (EXIF GPS). Jika Anda mengunggah foto ke tool daring, pastikan
          metadata ini dibuang. 履歴書メーカー memproses foto di browser dan menghapus EXIF secara otomatis.
        </GuideNote>

        <h2 id="nama-furigana">Langkah 3: Nama, furigana, dan data diri</h2>
        <h3>氏名 (nama)</h3>
        <p>
          Tulis <strong>persis seperti di paspor dan 在留カード</strong>, karena HR akan mencocokkannya. Warga asing
          umumnya menulis dalam katakana (ブディ サントソ) atau alfabet kapital (BUDI SANTOSO). Tanyakan preferensi
          perusahaan jika ada; jika tidak, katakana lebih umum untuk perusahaan domestik dan alfabet untuk perusahaan
          asing/IT.
        </p>
        <h3>ふりがな (furigana)</h3>
        <p>
          Baris kecil di atas nama berlabel <strong>ふりがな</strong> (hiragana) atau <strong>フリガナ</strong>{' '}
          (katakana). Aturannya sederhana namun sering salah:
        </p>
        <ul>
          <li>Label ふりがな → tulis cara baca dalam <strong>hiragana</strong>: ブディ → ぶでぃ</li>
          <li>Label フリガナ → tulis dalam <strong>katakana</strong>: ブディ → ブディ</li>
          <li>Jika nama sudah ditulis alfabet, furigana tetap diisi dengan cara baca dalam kana</li>
        </ul>
        <h3>生年月日 dan usia</h3>
        <p>
          Format 「1998年 5月 12日生 (満27歳)」. 満 berarti usia penuh pada tanggal pengisian — hitung dengan benar,
          bukan sekadar tahun sekarang dikurangi tahun lahir.
        </p>
        <h3>Alamat dan kontak</h3>
        <p>
          Alamat Jepang ditulis lengkap dari kode pos 〒123-4567, prefektur, kota, sampai nama gedung dan nomor
          kamar. Furigana alamat hanya untuk bagian kanji (nama daerah), bukan angka. Jika Anda masih di Indonesia,
          tulis alamat Indonesia dalam alfabet dan tambahkan kode negara pada nomor telepon (+62). Gunakan email
          profesional — hindari alamat yang mengandung kata gaul atau angka acak.
        </p>

        <h2 id="gakureki-shokureki">Langkah 4: 学歴・職歴 (riwayat pendidikan dan pekerjaan)</h2>
        <p>
          Ini adalah bagian yang paling berbeda dengan CV Indonesia. Alih-alih daftar bullet, riwayat ditulis
          sebagai tabel kronologis <strong>satu baris per peristiwa</strong>, dari yang paling lama ke terbaru.
        </p>
        <ol>
          <li>Baris pertama: tulis 「学歴」 di tengah kolom.</li>
          <li>Setiap sekolah mendapat dua baris: masuk (入学) dan lulus (卒業).</li>
          <li>Setelah pendidikan selesai, sisakan satu baris kosong, lalu tulis 「職歴」 di tengah.</li>
          <li>Setiap pekerjaan dua baris: masuk (入社) dan keluar (退社 / 一身上の都合により退社).</li>
          <li>Jika masih bekerja, tulis 「現在に至る」 di baris terakhir.</li>
          <li>Tutup dengan 「以上」 rata kanan.</li>
        </ol>
        <p>
          <strong>Mulai dari mana?</strong> Untuk lulusan baru umumnya cukup dari SMA (高等学校 入学). Untuk pelamar
          berpengalaman, cukup dari kelulusan SMA atau langsung dari perguruan tinggi. SD dan SMP hampir tidak pernah
          ditulis.
        </p>
        <p>
          Nama sekolah dan perusahaan Indonesia ditulis dalam katakana atau alfabet, diikuti keterangan singkat
          dalam bahasa Jepang agar perekrut paham, misalnya 「SMA Negeri 1 Bandung 高等学校 卒業」 atau 「PT Maju Jaya
          (自動車部品製造) 入社」. Jangan disingkat — ハイスクール atau 会社 saja tidak cukup informatif.
        </p>
        <GuideNote>
          Riwayat yang panjang bisa melebihi baris yang tersedia. Prioritaskan yang relevan, gabungkan pekerjaan
          singkat, dan pindahkan detail ke shokumu-keirekisho jika diminta.
        </GuideNote>

        <h2 id="menkyo-shikaku">Langkah 5: 免許・資格 (lisensi dan sertifikat)</h2>
        <p>
          Tulis dengan nama resmi dan tanggal perolehan, kronologis. Yang paling bernilai bagi pelamar Indonesia:
        </p>
        <ul>
          <li>日本語能力試験 (JLPT) N2 合格 — tulis level yang sudah lulus, bukan yang sedang dikejar</li>
          <li>特定技能評価試験 sesuai bidang, atau sertifikat 技能実習 (技能検定)</li>
          <li>普通自動車第一種運転免許 jika Anda sudah mengonversi SIM ke lisensi Jepang</li>
          <li>Sertifikat profesi Indonesia (BNSP, perawat, las) — tambahkan padanan Jepang dalam kurung</li>
        </ul>
        <p>Jika tidak punya sertifikat sama sekali, tulis 「特になし」 daripada membiarkannya kosong.</p>

        <h2 id="shibou-douki">Langkah 6: 志望の動機 (motivasi melamar)</h2>
        <p>
          Kolom ini yang paling dibaca. Panjang ideal <strong>250–400 karakter</strong>, mengisi sekitar 80–90% ruang
          yang tersedia. Struktur yang aman:
        </p>
        <ol>
          <li>
            <strong>Mengapa perusahaan ini</strong> — sebut nama perusahaan (貴社) dan satu hal spesifik: produk,
            pasar, nilai, atau proyek.
          </li>
          <li>
            <strong>Apa yang Anda bawa</strong> — pengalaman atau keahlian yang relevan, dengan contoh singkat.
          </li>
          <li>
            <strong>Apa yang ingin Anda capai di sana</strong> — kontribusi konkret, bukan &ldquo;ingin belajar
            banyak&rdquo;.
          </li>
        </ol>
        <p>
          Hindari kalimat generik seperti 「日本が好きだから」 atau 「成長したいから」. Perekrut membacanya ratusan
          kali. Sebaliknya, kalimat seperti 「インドネシア工場での品質管理経験を活かし、貴社の東南アジア展開に貢献したい」
          langsung menunjukkan nilai Anda.
        </p>
        <p>
          Kalau kemampuan bahasa Jepang Anda masih terbatas, tulis dalam kalimat pendek dan jelas. Kalimat sederhana
          yang benar jauh lebih baik daripada kalimat panjang dengan keigo yang salah.
        </p>

        <h2 id="honnin-kibou">Langkah 7: 本人希望記入欄 (permintaan khusus)</h2>
        <p>
          Kolom ini bukan tempat menawar gaji. Standarnya adalah 「貴社の規定に従います。」 (Saya mengikuti ketentuan
          perusahaan). Tulis hal lain hanya jika benar-benar merupakan syarat mutlak: posisi yang dilamar jika ada
          beberapa lowongan, lokasi kerja yang tidak bisa Anda tinggalkan, atau tanggal paling awal bisa mulai
          bekerja karena visa.
        </p>

        <h2 id="kesalahan-umum">Kesalahan umum pelamar asing</h2>
        <ul>
          <li>
            <strong>Sistem tahun tercampur</strong> — Masehi di pendidikan, wareki di pekerjaan.
          </li>
          <li>
            <strong>Furigana dalam katakana</strong> padahal labelnya ふりがな.
          </li>
          <li>
            <strong>Menyingkat nama sekolah/perusahaan</strong> tanpa keterangan bidang.
          </li>
          <li>
            <strong>Lupa 現在に至る dan 以上</strong> — dianggap tidak memahami konvensi.
          </li>
          <li>
            <strong>志望動機 terlalu pendek</strong> (2–3 kalimat) atau bisa ditempel ke perusahaan mana pun.
          </li>
          <li>
            <strong>Foto tidak formal</strong> — swafoto, latar rumah, tersenyum lebar.
          </li>
          <li>
            <strong>Kolom kosong</strong> — gunakan 特になし atau 貴社の規定に従います, jangan biarkan kosong.
          </li>
          <li>
            <strong>Nama tidak sama dengan 在留カード</strong> — urutan nama dibalik atau ejaan berbeda.
          </li>
        </ul>

        <h2 id="menyerahkan">Cara menyerahkan: cetak atau PDF?</h2>
        <p>
          Dulu rirekisho ditulis tangan, tetapi sekarang <strong>versi cetak atau PDF diterima hampir semua
          perusahaan</strong>, kecuali lowongan yang secara eksplisit meminta 手書き. Jika dicetak, gunakan kertas A4
          putih polos, tanpa lipatan bila diantar langsung, dan masukkan ke amplop bertuliskan 履歴書在中 berwarna
          merah di pojok kiri bawah. Jika PDF, beri nama file yang jelas seperti 「履歴書_BUDI SANTOSO_20260912.pdf」.
        </p>
        <p>
          Periksa ulang seluruh dokumen sekali lagi sebelum dikirim, terutama konsistensi tahun, ejaan nama, dan
          nomor telepon. Satu angka salah di nomor telepon berarti perekrut tidak bisa menghubungi Anda.
        </p>

        <h2 id="ringkasan">Ringkasan</h2>
        <p>
          Rirekisho yang baik bukan yang paling indah, melainkan yang <strong>lengkap, konsisten, dan spesifik</strong>.
          Ikuti format JIS, tulis nama sesuai dokumen resmi, susun riwayat secara kronologis dengan 現在に至る dan 以上,
          isi sertifikat yang relevan, dan curahkan tenaga terbesar pada 志望動機 yang menyebut alasan nyata Anda
          memilih perusahaan tersebut. Jika ragu pada detail tertentu, konfirmasikan langsung ke perekrut — bertanya
          jauh lebih baik daripada menebak.
        </p>

        <GuideCta>
          Semua aturan di atas sudah tertanam di 履歴書メーカー: label Bahasa Indonesia, validasi furigana, penomoran
          otomatis 学歴・職歴, dan cetak PDF format JIS. Gratis dan tanpa akun.
        </GuideCta>
      </GuideArticle>
    </GuideShell>
  );
}
