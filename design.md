# Design Specification: Febnine Atelier

## 1. Color Palette (Elegant Fashion & Understated Luxury)
Palet warna dirancang untuk memberikan nuansa butik *fashion* kelas atas yang mahal, bersih, dan berkelas, mengekstrak warna dari logo "febnine atelier" dan memadukannya dengan warna netral yang elegan.

*   **Primary Accent (Signature Rose / Soft Pink):** `#E59AA6` 
    *   *Fungsi:* Aksi utama (*Call to Action*), tombol "Login", garis area grafik pendapatan, dan *highlight* menu aktif. Warna ini memberikan sentuhan *fashionable* dan identitas *brand* tanpa terlihat terlalu mencolok.
*   **Deep Neutral (Charcoal / Obsidian):** `#27272A`
    *   *Fungsi:* Teks utama, *heading*, dan angka metrik penting. Menggunakan abu-abu pekat (bukan hitam murni `#000000`) memberikan tingkat keterbacaan yang tinggi namun tetap terasa mahal dan lembut di mata.
*   **Secondary Tone (Muted Grey):** `#959595`
    *   *Fungsi:* Teks sekunder (sub-judul), deskripsi metrik, ikon navigasi *sidebar*, dan garis pemisah (*border*) tabel. Memberikan struktur tanpa mengganggu fokus utama.
*   **Premium Canvas (Alabaster / Pearl White):** `#FCFCFC` hingga `#F5F5F5`
    *   *Fungsi:* Warna latar belakang (*background*). Menggunakan *off-white* alih-alih putih terang menciptakan kesan kanvas bernuansa minimalis-elegan ala situs web *brand fashion* mewah.
*   **Classy Status Indicators:** (Warna status yang diredupkan agar tetap elegan)
    *   *Alert / Low Stock:* Muted Rose (`#D9777F`).
    *   *Success / Inbound:* Sage Green (`#7A9D8C`).
    *   *Warning / Opname:* Soft Camel (`#D4B872`).

## 2. Typography
*   **Font Utama:** **Poppins** (Google Fonts).
*   *Karakteristik:* Memberikan nuansa geometris, membulat, dan ramah yang sangat cocok dengan elemen logo. Digunakan untuk seluruh elemen teks. Penggunaan variasi ketebalan (*Light* untuk deskripsi, *Medium* untuk tabel, dan *SemiBold* untuk angka) akan memperkuat kesan *clean* dan terstruktur.

## 3. Landing Page / Login UI
*   **Background:** Menggunakan desain latar belakang bergaya *neomorphic* atau *embossed* 3D dengan pola geometris yang lembut (bertekstur putih mutiara/Alabaster).
*   **Layout:** Tata letak teks sapaan dan form login merapat ke sisi kiri (*left-aligned*) dengan *whitespace* (ruang kosong) yang luas, ciri khas desain *fashion* mewah yang minimalis.
*   **Aksen Brand:** Tombol login menggunakan warna solid *Signature Rose* (`#E59AA6`) dengan sudut melengkung halus (*rounded-lg*), memberikan titik fokus yang elegan.

## 4. Dashboard Layout & Components
*   **Sidebar Kiri:** Area navigasi bersih dengan logo di bagian atas (menggunakan `logo_clean.png` yang telah dipangkas dari whitespace berlebih sehingga proporsional dan tajam). Menu yang aktif ditandai dengan latar belakang tipis berwarna *Signature Rose* transparan (10% opacity) atau indikator garis vertikal tipis di sebelah kiri.
*   **Header & Metrik Utama:** Area konten utama menampilkan kartu metrik dengan bayangan (*shadow*) yang sangat tipis dan menyebar (*diffused shadow*), seolah-olah kartu tersebut melayang tipis di atas latar *Alabaster*.
*   **Visualisasi Data (Chart):** 
    *   Komponen grafik wajib menggunakan **Area Chart** dari `https://ui.shadcn.com/charts/area`.
    *   *Styling:* Garis kurva dan area gradasi di bawahnya menggunakan *Signature Rose* (`#E59AA6`), tampil estetik dan mudah dianalisis.
*   **Tabel Data:** Tabel didesain sangat lapang (memiliki ruang antar baris yang luas). Tidak ada garis vertikal, hanya garis horizontal setebal 1px berwarna *Muted Grey* yang nyaris transparan untuk mempertahankan estetika *clean* ala katalog *fashion*.
*   **Printable Reports:** Laporan Penjualan dan Kartu Stok dirancang dengan styling CSS khusus `@media print` sehingga saat dicetak langsung rapi tanpa elemen sidebar/header navigasi.

## 5. Micro-Animations & Interaction Feel (Anti "AI-Slop")
*   **Filosofi Gerak:** *Understated, purposeful, and whisper-quiet*. Menghindari animasi norak, memantul berlebihan (*bouncy/elastic*), kartu berpendar (*glow pulse*), atau dekorasi generik tanpa fungsi.
*   **Timing & Easing:**
    *   Durasi mikro: 150ms - 200ms dengan kurva `cubic-bezier(0.16, 1, 0.3, 1)` (smooth ease-out).
    *   *Hover states:* Perubahan halus pada warna latar/border dan elevasi bayangan mikro (`shadow-xs` ke `shadow-sm`), bukan zoom/scale agresif.
    *   *Modal / Sheet / Dropdown:* Fade-in lembut dengan transisi vertikal mikro (4px offset) yang terasa stabil dan berbobot.
    *   *Feedback Status:* Indikator loading berupa shimmer tenang (*subtle off-white gradient*), tidak berkedip menyilaukan.

## 6. Iconography: Phosphor Icons (https://phosphoricons.com/)
*   **Paket:** `@phosphor-icons/react`.
*   **Weight Style:** Wajib menggunakan varian **`regular`** atau **`light`** untuk mempertahankan garis tipis, elegan, dan proporsional terhadap font Poppins.
*   **Skala:**
    *   Navigasi Sidebar: 18px - 20px (warna `#959595`, berubah menjadi `#27272A` atau aksen `#E59AA6` saat aktif).
    *   Tombol & Aksi Form: 16px - 18px (posisi presisi di sisi teks label).
    *   Status Badges: 14px - 16px (misal `CheckCircle`, `WarningCircle`, `ArrowDownLeft` untuk Inbound, `ArrowUpRight` untuk Penjualan).