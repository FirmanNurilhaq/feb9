<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Services\BrevoMailService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Tampilkan halaman pengaturan notifikasi & Brevo
     */
    public function index(): Response
    {
        $alertEmail = Setting::get('alert_email', env('ALERT_EMAIL', 'admin@febnine.com'));
        $brevoSenderEmail = Setting::get('brevo_sender_email', env('BREVO_SENDER_EMAIL', 'manzrockys@gmail.com'));
        $brevoSenderName = Setting::get('brevo_sender_name', env('BREVO_SENDER_NAME', 'Febnine Atelier'));
        $rawApiKey = Setting::get('brevo_api_key', env('BREVO_API_KEY', ''));

        // Mask API key for security
        $maskedApiKey = strlen($rawApiKey) > 12 
            ? substr($rawApiKey, 0, 10) . '...' . substr($rawApiKey, -6)
            : 'Belum diatur';

        return Inertia::render('Settings/Index', [
            'settings' => [
                'alert_email' => $alertEmail,
                'brevo_sender_email' => $brevoSenderEmail,
                'brevo_sender_name' => $brevoSenderName,
                'has_api_key' => !empty($rawApiKey),
                'masked_api_key' => $maskedApiKey,
            ],
            'cron_command' => 'php artisan stock:check-low-alert',
            'server_path' => base_path(),
        ]);
    }

    /**
     * Simpan pengaturan notifikasi
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'alert_email' => 'required|email|max:255',
            'brevo_sender_email' => 'nullable|email|max:255',
            'brevo_sender_name' => 'nullable|string|max:100',
            'brevo_api_key' => 'nullable|string|max:255',
        ]);

        Setting::set('alert_email', $validated['alert_email']);
        if (!empty($validated['brevo_sender_email'])) {
            Setting::set('brevo_sender_email', $validated['brevo_sender_email']);
        }
        if (!empty($validated['brevo_sender_name'])) {
            Setting::set('brevo_sender_name', $validated['brevo_sender_name']);
        }

        if (!empty($validated['brevo_api_key'])) {
            Setting::set('brevo_api_key', trim($validated['brevo_api_key']));
        }

        return redirect()->back()->with('success', 'Pengaturan notifikasi email berhasil disimpan.');
    }

    /**
     * Kirim email uji coba (Test Alert) ke target alert_email via Brevo
     */
    public function testEmail(Request $request, BrevoMailService $brevo)
    {
        $targetEmail = Setting::get('alert_email', env('ALERT_EMAIL', 'admin@febnine.com'));

        $subject = '🔔 [Uji Coba Brevo] Notifikasi Gudang Febnine Atelier Berhasil!';
        $htmlContent = '
        <div style="font-family: \'Poppins\', sans-serif; background-color: #FCFCFC; padding: 24px; color: #27272A;">
            <div style="max-width: 520px; margin: auto; background-color: #FFFFFF; border: 1px solid #E8E8E9; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="color: #27272A; margin-top: 0;">Febnine Atelier — Tes Brevo API</h2>
                <p style="color: #436453; background-color: #EFF6F2; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 13px;">
                    ✓ Integrasi Brevo REST API v3 Berhasil Terhubung!
                </p>
                <p style="font-size: 13px; color: #646467; line-height: 1.6;">
                    Email ini adalah konfirmasi bahwa sistem notifikasi stok menipis otomatis (*push email alert*) untuk Febnine Atelier telah aktif. Setiap kali produk mencapai batas minimum atau dipicu oleh scheduler berkala, Anda akan menerima email rincian barang.
                </p>
                <hr style="border: none; border-top: 1px solid #F0F0F1; margin: 20px 0;" />
                <p style="font-size: 11px; color: #959595; margin: 0;">
                    Target Penerima: <strong>' . htmlspecialchars($targetEmail) . '</strong><br />
                    Waktu Pengiriman: ' . date('d F Y H:i:s') . ' WIB
                </p>
            </div>
        </div>';

        $result = $brevo->sendEmail($targetEmail, $subject, $htmlContent);

        if ($result['success']) {
            return redirect()->back()->with('success', 'Email uji coba berhasil dikirim ke ' . $targetEmail . ' via Brevo!');
        }

        $errorMsg = is_string($result['error'] ?? null) ? $result['error'] : json_encode($result['error'] ?? 'Gagal');
        return redirect()->back()->with('error', 'Gagal mengirim email Brevo: ' . $errorMsg);
    }
}
