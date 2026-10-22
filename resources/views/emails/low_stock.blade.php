<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Peringatan Stok Menipis</title>
</head>
<body style="font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FCFCFC; color: #27272A; padding: 30px; margin: 0;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E8E8E9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(39, 39, 42, 0.05);">
        <!-- Header -->
        <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #F0F0F1; text-align: left; background-color: #FCFCFC;">
                <h1 style="margin: 0; font-size: 18px; color: #27272A; font-weight: 700; letter-spacing: -0.5px;">Febnine Atelier</h1>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: #959595; text-transform: uppercase; letter-spacing: 1px;">Sistem Notifikasi Gudang Terpusat</p>
            </td>
        </tr>

        <!-- Alert Content -->
        <tr>
            <td style="padding: 32px;">
                <div style="background-color: #FCF0F1; border: 1px solid #F7DDE2; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                    <p style="margin: 0; color: #D9777F; font-size: 13px; font-weight: 600;">
                        ⚠️ Perhatian: Stok produk telah mencapai batas minimum (Reorder Point).
                    </p>
                </div>

                <h2 style="font-size: 15px; margin: 0 0 16px 0; color: #27272A;">Rincian Barang yang Perlu Segera Direstok:</h2>

                <table width="100%" style="font-size: 13px; border-collapse: collapse; margin-bottom: 24px;">
                    <tr style="border-bottom: 1px solid #F0F0F1;">
                        <td style="padding: 10px 0; color: #959595;">Nama Produk</td>
                        <td style="padding: 10px 0; font-weight: 600; text-align: right; color: #27272A;">{{ $product->name }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #F0F0F1;">
                        <td style="padding: 10px 0; color: #959595;">SKU Varian</td>
                        <td style="padding: 10px 0; font-family: monospace; font-weight: 600; text-align: right; color: #27272A;">{{ $product->sku }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #F0F0F1;">
                        <td style="padding: 10px 0; color: #959595;">Varian (Warna / Size)</td>
                        <td style="padding: 10px 0; text-align: right; color: #646467;">{{ $product->variant_color ?? '-' }} / {{ $product->variant_size ?? '-' }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #F0F0F1;">
                        <td style="padding: 10px 0; color: #959595;">Sisa Stok Fisik Gudang</td>
                        <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #D9777F; font-size: 15px;">{{ $currentStock }} {{ $product->unit }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; color: #959595;">Batas Reorder Point</td>
                        <td style="padding: 10px 0; font-weight: 600; text-align: right; color: #646467;">{{ $product->min_stock }} {{ $product->unit }}</td>
                    </tr>
                </table>

                <p style="font-size: 12px; color: #646467; line-height: 1.6; margin: 0 0 24px 0;">
                    Notifikasi ini dikirimkan secara otomatis dan seketika (*live trigger*) saat transaksi penjualan atau mutasi keluar tercatat di sistem gudang.
                </p>

                <!-- Button -->
                <div style="text-align: center; margin: 28px 0 10px 0;">
                    <a href="{{ url('/inbound') }}" style="background-color: #E59AA6; color: #FFFFFF; font-size: 12px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 10px; display: inline-block;">
                        Buka Menu Barang Masuk (Inbound) &rarr;
                    </a>
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 20px 32px; background-color: #FBFBFC; border-top: 1px solid #F0F0F1; text-align: center; font-size: 11px; color: #B3B3B3;">
                &copy; {{ date('Y') }} Febnine Atelier Inventory System. Email ini dikirim otomatis oleh server.
            </td>
        </tr>
    </table>
</body>
</html>
