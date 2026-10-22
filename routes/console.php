<?php

use App\Models\Product;
use App\Models\Setting;
use App\Services\BrevoMailService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/**
 * Command untuk memeriksa stok menipis dan mengirim email alert secara otomatis via Brevo
 * Dapat dijalankan otomatis via cPanel / OS Cron tanpa perlu siapapun membuka web:
 * php artisan stock:check-low-alert
 */
Artisan::command('stock:check-low-alert', function (BrevoMailService $brevo) {
    $this->info('Memeriksa stok menipis di gudang Febnine Atelier...');

    $products = Product::where('is_active', true)->with('latestStockMovement')->get();
    $alertCount = 0;
    $recipient = Setting::get('alert_email', env('ALERT_EMAIL', 'admin@febnine.com'));

    foreach ($products as $product) {
        $stock = $product->current_stock;
        if ($stock <= $product->min_stock) {
            $alertCount++;
            $this->warn("Low stock detected: {$product->name} ({$product->sku}) - Sisa {$stock} pcs (Min: {$product->min_stock})");
            try {
                $result = $brevo->sendLowStockAlert($product, $stock);
                if ($result['success']) {
                    $this->info("✓ Brevo alert berhasil dikirim ke {$recipient}");
                } else {
                    $this->error("✕ Brevo error: " . ($result['error'] ?? 'Gagal'));
                }
            } catch (\Throwable $e) {
                $this->error("Gagal kirim email: " . $e->getMessage());
            }
        }
    }

    $this->info("Pemeriksaan selesai. {$alertCount} produk stok menipis diproses ke {$recipient}.");
})->purpose('Cek stok menipis dan kirim notifikasi email via Brevo');

// Jadwalkan otomatis setiap jam via Laravel scheduler (dapat dijalankan via cron server)
Schedule::command('stock:check-low-alert')->hourly();
