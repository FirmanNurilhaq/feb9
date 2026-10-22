# Febnine Atelier — Luxury Inventory & Sales Dashboard

Sistem manajemen inventori butik fashion mewah dan dashboard visualisasi penjualan untuk **Febnine Atelier**. Dibangun menggunakan Laravel 12, Inertia React TypeScript, Tailwind CSS, serta integrasi push notifikasi email stok menipis via **Brevo REST API v3**.

---

## ⚡ Panduan Menjalankan di Laptop Baru (Quick Start)

Setelah melakukan `git clone https://github.com/FirmanNurilhaq/feb9.git`, buka terminal di folder proyek dan jalankan langkah berikut:

### 1. Salin Environment File
```bash
cp .env.example .env
```
*(Di Windows PowerShell: `copy .env.example .env`)*

### 2. Install Dependensi PHP & Node
```bash
composer install
npm install
```

### 3. Generate App Key & Siapkan Database
```bash
php artisan key:generate
php artisan migrate:fresh --seed
```

### 4. Build Aset Frontend
```bash
npm run build
```

### 5. Jalankan Web Server
```bash
php artisan serve
```
Akses di browser: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🔑 Akun Login Default
* **Email:** `admin@febnine.com`
* **Password:** `password`

---

## 🔔 Sistem Notifikasi Low Stock (Brevo)
* **Email Pengirim:** Otomatis atas nama **Febnine Atelier** (`manzrockys@gmail.com`).
* **Target Penerima:** Dapat diatur langsung di halaman menu **Pengaturan Email** (`/settings`).
* **Pemicu Otomatis (Cron Scheduler):**
  Jalankan command berikut untuk mengecek stok menipis secara mandiri:
  ```bash
  php artisan stock:check-low-alert
  ```
  *(Di cPanel, jadwalkan baris di atas pada menu Cron Jobs agar email terkirim otomatis tanpa perlu membuka browser).*

---

## 🗂️ Fitur Utama
1. **Dashboard Visualisasi**: Area chart interaktif, metrik omzet, laba bersih, dan alert produk menipis.
2. **Master Produk SKU Unik**: Input HPP, harga jual, foto produk (hingga 10MB), dan tambah kategori langsung (*dynamic category*).
3. **Barang Masuk (Inbound)**: Pencatatan kedatangan stok konveksi/supplier.
4. **Pencatatan Penjualan**: Input penjualan manual dengan modal deteksi stok minus (*Perbaiki Stok* atau *Paksa Selesai*).
5. **Manajemen Retur**: Alur barang kembali ke gudang (*Dijual Kembali* vs *Dibuang*).
6. **Stock Opname**: Audit stok fisik gudang berkala dengan pencatatan alasan selisih.
7. **Laporan & Kartu Stok**: Rekap mutasi stok, ekspor CSV, dan mode siap cetak `@media print` rapi.
