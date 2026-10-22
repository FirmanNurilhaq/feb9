<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BrevoMailService
{
    /**
     * Kirim email transaksional via Brevo REST API v3
     */
    public function sendEmail(string $toEmail, string $subject, string $htmlContent): array
    {
        $apiKey = Setting::get('brevo_api_key', env('BREVO_API_KEY', ''));
        $senderEmail = Setting::get('brevo_sender_email', env('BREVO_SENDER_EMAIL', 'manzrockys@gmail.com'));
        $senderName = Setting::get('brevo_sender_name', env('BREVO_SENDER_NAME', 'Febnine Atelier'));

        try {
            $response = Http::withHeaders([
                'api-key' => $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->withOptions([
                'curl' => [
                    defined('CURLOPT_IPRESOLVE') ? CURLOPT_IPRESOLVE : 113 => defined('CURL_IPRESOLVE_V4') ? CURL_IPRESOLVE_V4 : 1,
                ],
            ])->timeout(30)->post('https://api.brevo.com/v3/smtp/email', [
                'sender' => [
                    'name' => $senderName,
                    'email' => $senderEmail,
                ],
                'to' => [
                    [
                        'email' => $toEmail,
                    ],
                ],
                'subject' => $subject,
                'htmlContent' => $htmlContent,
            ]);

            if ($response->successful()) {
                Log::info("Brevo email sent successfully to {$toEmail}: " . $response->body());
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            Log::error("Brevo API error (" . $response->status() . "): " . $response->body());
            return [
                'success' => false,
                'error' => $response->body(),
                'status' => $response->status(),
            ];
        } catch (\Throwable $e) {
            Log::error("Brevo exception: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Kirim notifikasi stok menipis khusus produk Febnine Atelier
     */
    public function sendLowStockAlert(Product $product, int $currentStock): array
    {
        $targetEmail = Setting::get('alert_email', env('ALERT_EMAIL', 'admin@febnine.com'));
        $subject = '⚠️ [Febnine Atelier Alert] Stok Menipis: ' . $product->name . ' (' . $product->sku . ')';

        $htmlContent = view('emails.low_stock', [
            'product' => $product,
            'currentStock' => $currentStock,
        ])->render();

        return $this->sendEmail($targetEmail, $subject, $htmlContent);
    }
}
