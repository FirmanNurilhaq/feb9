# Project Memory: Febnine Atelier Inventory & Sales Dashboard

## 1. Project Overview
Sistem informasi berbasis web untuk manajemen stok barang dan pemantauan
penjualan (dashboard) khusus gudang. Terpusat dengan otorisasi tunggal.

## 2. Architecture & Tech Stack
- **Role:** Single Role (Admin / Pemilik Gudang).
- **Backend:** Laravel (PHP 8.2+).
- **Database:** MySQL (dikelola via phpMyAdmin) - **Wajib Full Relational (InnoDB)** dengan Foreign Key Constraints eksplisit & integritas referensial.
- **Frontend:** React.js + TypeScript.
- **Bridge:** Inertia.js (SPA tanpa REST API terpisah, mode non-SSR).
- **UI & Icons:** Tailwind CSS + shadcn/ui + Phosphor Icons (`@phosphor-icons/react`, variant `regular` / `light`).
- **Autentikasi:** Laravel starter kit React (session + CSRF bawaan). Registrasi publik dinonaktifkan; akun admin dibuat via seeder.
- **Zona Waktu:** Asia/Jakarta. Nilai uang disimpan sebagai DECIMAL atau integer (rupiah), bukan float.

## 3. Hosting Target
- **Paket:** Starter (SSH, NVMe 10 GB, PHP 8.2+, Composer, Cron). Paket Competent tidak dipakai (tanpa SSH, storage 2 GB).
- **Dikonfirmasi Penyedia:** PHP 8.2+, Composer, dan pengaturan via .htaccess tersedia.
- **Uji Sebelum Data Nyata:** Deploy Laravel kosong, cek versi PHP, ekstensi, koneksi DB, dan akses SSH.

## 4. Deployment Strategy
- **Build:** `npm run build` (Vite) wajib dilakukan di komputer developer. Node.js tidak dipakai di server.
- **Struktur Folder (Utama, lebih aman):**
  - Kode Laravel di luar web root: `home/user/febnine` (berisi app, vendor, .env, storage, dll).
  - Isi folder `public` Laravel disalin ke `public_html`.
  - Ubah path di `public_html/index.php`:
    - `require __DIR__ . '/../febnine/vendor/autoload.php';`
    - `$app = require_once __DIR__ . '/../febnine/bootstrap/app.php';`
  - Hasil build diunggah ke `public_html/build`.
- **Alternatif:** Kode di web root dengan rule .htaccess yang mengarahkan semua request ke `public`, plus blokir file tersembunyi (`.env`, dll).
- **Langkah Deploy via SSH:**
  1. Upload kode (tanpa `node_modules`, tanpa `.env` lokal).
  2. `composer install --no-dev --optimize-autoloader` (atau upload `vendor` dari lokal jika Composer bermasalah).
  3. Buat `.env` produksi: `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` baru, kredensial DB.
  4. `php artisan migrate --force`
  5. `php artisan storage:link`
  6. `php artisan config:cache && php artisan route:cache`
- **Verifikasi Keamanan:** Akses `.env`, `composer.json`, dan `storage/logs/laravel.log` harus menghasilkan 403 / 404.
- **Cron Job (cPanel):** `php /home/user/febnine/artisan schedule:run`
- **Queue Driver:** `sync` atau `database` (diproses via scheduler). Tidak memakai worker permanen dan tidak memakai WebSocket.
- **Backup:** Database terjadwal (otomatis dari hosting dan/atau `mysqldump` via cron) disimpan di luar server.

## 5. Core Features & Business Rules
1. **Dashboard & Analitik:**
   - **Grafik Pendapatan & Laba:** Visualisasi tren penjualan kotor dan laba bersih (harian/mingguan/bulanan) menggunakan shadcn Area Chart (`#E59AA6`).
   - **Top Selling Products:** Menyoroti barang *Fast Moving* untuk referensi restok.
   - **Ringkasan Aktivitas Terkini:** Log aktivitas barang masuk/keluar dan transaksi terbaru.

2. **Manajemen Inventori (Gudang):**
   - **Master Data Barang:** Setiap varian memiliki SKU unik sendiri (misal: `FA-DRS-01-S`, `FA-DRS-01-M`). Pengguna dapat menambahkan kategori baru secara dinamis. Menyimpan foto produk (maksimal 10 MB), nama, kategori, satuan, HPP (harga modal/buat), harga jual, dan batas minimal stok.
   - **Low Stock Alerts & Live Email Notification:** Peringatan otomatis ketika stok mencapai atau di bawah batas minimum (*Reorder Point*). Server memicu *live trigger* pengiriman email alert (`LowStockAlertMail`) langsung saat transaksi penjualan memotong stok hingga batas reorder, serta didukung cron job harian (`php artisan stock:check-low-alert`).
   - **Barang Masuk (Inbound):** Pencatatan stok masuk dari *supplier* / konveksi beserta riwayat harga beli dan tanggal terima.
   - **Barang Keluar (Outbound):** Pencatatan manual (rusak, hilang, sample) dan otomatis (dari modul penjualan).
   - **Stock Opname:** Penyesuaian stok fisik vs database dengan opsi alasan (Cacat/Noda, Sample/Display, Hilang, Selisih Hitung Fisik, dll).

3. **Pencatatan Penjualan & Retur:**
   - **Pencatatan Penjualan Manual:** Input manual setiap terjadi penjualan (nama pembeli, tanggal, pilihan item SKU, kuantitas, harga jual aktual). Tanpa kalkulasi diskon atau pajak.
   - **Peringatan Stok & Validasi:** Jika kuantitas penjualan melebihi stok yang ada, sistem menampilkan modal peringatan informatif dengan rincian (stok saat ini vs jumlah diminta, selisih minus) dan memberikan 2 pilihan tindakan:
     - *Perbaiki Stok Dulu* (kembali mengedit transaksi/inbound).
     - *Paksa Selesai* (override transaksi tetap dicatat dengan catatan selisih).
   - **Kalkulasi Untung Bersih:** Laba per transaksi dihitung langsung: `(Harga Jual - HPP) * Kuantitas`.
   - **Manajemen Retur:** Barang kembali ke gudang dengan dua opsi alur:
     - *Dijual Kembali:* Menambah kembali stok gudang fisik.
     - *Dibuang / Rusak:* Tidak menambah stok, dicatat sebagai barang afkir/kerugian.

4. **Pelaporan (Reporting):**
   - **Laporan Penjualan & Laba Rugi:** Rekapitulasi penjualan dengan tampilan *printable* bersih (siap cetak / Simpan ke PDF via browser print) dan ekspor Excel.
   - **Kartu Stok:** Rekapitulasi pergerakan barang (saldo awal, masuk, keluar, saldo akhir) berbasis `stock_movements`.

## 6. Technical & Database Guidelines
- **Database Full Relational (Engine InnoDB):**
  - Seluruh relasi tabel diikat dengan Foreign Key Constraints eksplisit:
    - `categories` (1) ── (N) `products` (`category_id` -> `onDelete('restrict')`)
    - `products` (1) ── (N) `sales_items` (`product_id` -> `onDelete('restrict')`, mencegah hapus produk yang ada riwayat penjualan)
    - `sales_transactions` (1) ── (N) `sales_items` (`sales_transaction_id` -> `onDelete('cascade')`)
    - `products` (1) ── (N) `stock_movements` (`product_id` -> `onDelete('restrict')`)
    - `inbound_shipments` (1) ── (N) `inbound_items` (`inbound_shipment_id` -> `onDelete('cascade')`)
    - `products` (1) ── (N) `inbound_items` (`product_id` -> `onDelete('restrict')`)
    - `sales_transactions` (1) ── (N) `returns` (`sales_transaction_id` -> `onDelete('restrict')`)
    - `products` (1) ── (N) `returns` (`product_id` -> `onDelete('restrict')`)
    - `stock_opnames` (1) ── (N) `stock_opname_items` (`stock_opname_id` -> `onDelete('cascade')`)
    - `products` (1) ── (N) `stock_opname_items` (`product_id` -> `onDelete('restrict')`)
  - Tidak ada data menggantung / yatim (*orphaned data*).
  - Seluruh index relasi dibuat rapi untuk query joins dan eager loading `with()`.
- **Integritas Stok:** Semua perubahan stok (penjualan, retur, inbound, outbound, opname) dicatat sebagai baris di tabel `stock_movements`. Saldo dapat dihitung ulang dari tabel ini, sekaligus menjadi sumber Kartu Stok. Operasi stok dibungkus `DB::transaction` dengan `lockForUpdate`.
- **Data ke Frontend:** Kirim hanya kolom yang diperlukan lewat API Resource / Inertia props. Jangan kirim model utuh.
- **Validasi:** Selalu di server (Form Request), terlepas dari tipe TypeScript.
- **Ekspor Besar:** Gunakan chunking/queue dan batasi rentang tanggal per ekspor agar tidak kena limit memori/CPU hosting.
- **Dependensi:** Commit `composer.lock` dan `package-lock.json`; jalankan `composer audit` dan `npm audit` secara berkala.
- **Skala:** Jika pengguna atau data tumbuh besar, migrasi ke VPS.