<?php

namespace App\Services;

use App\Models\InboundItem;
use App\Models\InboundShipment;
use App\Models\Product;
use App\Models\ReturnRecord;
use App\Models\SalesItem;
use App\Models\SalesTransaction;
use App\Models\StockMovement;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Mail\LowStockAlertMail;
use App\Services\BrevoMailService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InventoryService
{
    /**
     * Kirim notifikasi email live via Brevo API jika stok produk menipis di bawah reorder point
     */
    protected function checkAndNotifyLowStock(Product $product, int $newBal): void
    {
        if ($newBal <= $product->min_stock) {
            try {
                $brevo = app(BrevoMailService::class);
                $result = $brevo->sendLowStockAlert($product, $newBal);
                if ($result['success']) {
                    Log::info("Brevo alert stok menipis terkirim untuk SKU: {$product->sku} (Sisa: {$newBal})");
                } else {
                    Log::warning("Gagal mengirim Brevo alert: " . ($result['error'] ?? 'Unknown error'));
                }
            } catch (\Throwable $e) {
                Log::warning("Exception saat mengirim Brevo alert stok: " . $e->getMessage());
            }
        }
    }
    /**
     * Catat mutasi stok dengan database transaction dan pessimistic locking (lockForUpdate)
     */
    public function recordMovement(
        int $productId,
        string $type,
        int $quantity,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $notes = null,
        ?int $userId = null
    ): StockMovement {
        return DB::transaction(function () use ($productId, $type, $quantity, $referenceType, $referenceId, $notes, $userId) {
            // Lock product record to prevent race conditions
            $product = Product::where('id', $productId)->lockForUpdate()->firstOrFail();

            // Ambil mutasi terakhir untuk saldo sebelum
            $lastMovement = StockMovement::where('product_id', $productId)
                ->latest('id')
                ->lockForUpdate()
                ->first();

            $balanceBefore = $lastMovement ? (int) $lastMovement->balance_after : 0;
            $balanceAfter = $balanceBefore + $quantity;

            $movement = StockMovement::create([
                'product_id' => $productId,
                'type' => $type,
                'quantity' => $quantity,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'notes' => $notes,
                'created_by' => $userId,
            ]);

            if ($quantity < 0) {
                $this->checkAndNotifyLowStock($product, $balanceAfter);
            }

            return $movement;
        });
    }

    /**
     * Validasi ketersediaan stok sebelum penjualan disimpan
     * Mengembalikan list item yang stoknya kurang
     */
    public function validateStockForSales(array $items): array
    {
        $shortages = [];

        foreach ($items as $item) {
            $productId = $item['product_id'];
            $requestedQty = (int) $item['quantity'];

            $product = Product::find($productId);
            if (!$product) {
                continue;
            }

            $currentStock = $product->current_stock;
            if ($currentStock < $requestedQty) {
                $shortages[] = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'current_stock' => $currentStock,
                    'requested_qty' => $requestedQty,
                    'difference' => $requestedQty - $currentStock,
                ];
            }
        }

        return $shortages;
    }

    /**
     * Catat Transaksi Penjualan Manual
     */
    public function recordSale(array $data, ?int $userId = null): SalesTransaction
    {
        return DB::transaction(function () use ($data, $userId) {
            $hasOverride = !empty($data['force_complete']);

            $invoiceNumber = $data['invoice_number'] ?? ('INV-' . date('Ym') . '-' . str_pad(SalesTransaction::count() + 1, 4, '0', STR_PAD_LEFT));

            $transaction = SalesTransaction::create([
                'invoice_number' => $invoiceNumber,
                'buyer_name' => $data['buyer_name'],
                'transaction_date' => $data['transaction_date'] ?? now()->toDateString(),
                'total_amount' => 0,
                'total_cogs' => 0,
                'total_profit' => 0,
                'has_override' => $hasOverride,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            $totalAmount = 0;
            $totalCogs = 0;

            foreach ($data['items'] as $itemData) {
                $product = Product::where('id', $itemData['product_id'])->lockForUpdate()->firstOrFail();
                $qty = (int) $itemData['quantity'];
                $costPrice = (float) $product->cost_price;
                $sellingPrice = (float) ($itemData['selling_price'] ?? $product->selling_price);

                $subtotal = $qty * $sellingPrice;
                $cogs = $qty * $costPrice;
                $profit = ($sellingPrice - $costPrice) * $qty;

                $totalAmount += $subtotal;
                $totalCogs += $cogs;

                // Periksa apakah item ini dipaksa saat stok kurang
                $lastMovement = StockMovement::where('product_id', $product->id)->latest('id')->first();
                $currentBal = $lastMovement ? (int) $lastMovement->balance_after : 0;
                $isForced = $currentBal < $qty;

                SalesItem::create([
                    'sales_transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'cost_price' => $costPrice,
                    'selling_price' => $sellingPrice,
                    'subtotal_amount' => $subtotal,
                    'subtotal_profit' => $profit,
                    'was_forced' => $isForced,
                ]);

                // Kurangi stok via movement
                $newBal = $currentBal - $qty;
                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'sales',
                    'quantity' => -$qty,
                    'balance_before' => $currentBal,
                    'balance_after' => $newBal,
                    'reference_type' => SalesTransaction::class,
                    'reference_id' => $transaction->id,
                    'notes' => 'Penjualan ke ' . $data['buyer_name'] . ' (' . $invoiceNumber . ')' . ($isForced ? ' [Paksa Selesai]' : ''),
                    'created_by' => $userId,
                ]);

                // Live trigger email notification jika stok mencapai / di bawah reorder point
                $this->checkAndNotifyLowStock($product, $newBal);
            }

            $transaction->update([
                'total_amount' => $totalAmount,
                'total_cogs' => $totalCogs,
                'total_profit' => $totalAmount - $totalCogs,
            ]);

            return $transaction;
        });
    }

    /**
     * Catat Barang Masuk (Inbound Shipment)
     */
    public function recordInbound(array $data, ?int $userId = null): InboundShipment
    {
        return DB::transaction(function () use ($data, $userId) {
            $shipmentNumber = $data['shipment_number'] ?? ('INB-' . date('Ym') . '-' . str_pad(InboundShipment::count() + 1, 4, '0', STR_PAD_LEFT));

            $shipment = InboundShipment::create([
                'shipment_number' => $shipmentNumber,
                'supplier_name' => $data['supplier_name'] ?? null,
                'inbound_date' => $data['inbound_date'] ?? now()->toDateString(),
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $itemData) {
                $product = Product::where('id', $itemData['product_id'])->lockForUpdate()->firstOrFail();
                $qty = (int) $itemData['quantity'];
                $purchasePrice = (float) $itemData['purchase_price'];
                $subtotal = $qty * $purchasePrice;

                InboundItem::create([
                    'inbound_shipment_id' => $shipment->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'purchase_price' => $purchasePrice,
                    'subtotal' => $subtotal,
                ]);

                // Opsional: perbarui HPP produk jika dicentang update_cost_price
                if (!empty($itemData['update_cost_price'])) {
                    $product->update(['cost_price' => $purchasePrice]);
                }

                $lastMovement = StockMovement::where('product_id', $product->id)->latest('id')->first();
                $currentBal = $lastMovement ? (int) $lastMovement->balance_after : 0;
                $newBal = $currentBal + $qty;

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'inbound',
                    'quantity' => $qty,
                    'balance_before' => $currentBal,
                    'balance_after' => $newBal,
                    'reference_type' => InboundShipment::class,
                    'reference_id' => $shipment->id,
                    'notes' => 'Barang masuk dari ' . ($data['supplier_name'] ?? 'Vendor') . ' (' . $shipmentNumber . ')',
                    'created_by' => $userId,
                ]);
            }

            return $shipment;
        });
    }

    /**
     * Catat Retur Barang (Dijual Kembali vs Dibuang)
     */
    public function recordReturn(array $data, ?int $userId = null): ReturnRecord
    {
        return DB::transaction(function () use ($data, $userId) {
            $returnNumber = $data['return_number'] ?? ('RET-' . date('Ym') . '-' . str_pad(ReturnRecord::count() + 1, 4, '0', STR_PAD_LEFT));
            $product = Product::where('id', $data['product_id'])->lockForUpdate()->firstOrFail();
            $qty = (int) $data['quantity'];
            $disposition = $data['disposition']; // 'restock' | 'discard'

            $return = ReturnRecord::create([
                'return_number' => $returnNumber,
                'sales_transaction_id' => $data['sales_transaction_id'] ?? null,
                'product_id' => $product->id,
                'quantity' => $qty,
                'disposition' => $disposition,
                'reason' => $data['reason'],
                'notes' => $data['notes'] ?? null,
                'return_date' => $data['return_date'] ?? now()->toDateString(),
                'created_by' => $userId,
            ]);

            $lastMovement = StockMovement::where('product_id', $product->id)->latest('id')->first();
            $currentBal = $lastMovement ? (int) $lastMovement->balance_after : 0;

            if ($disposition === 'restock') {
                // Tambah kembali ke stok fisik
                $newBal = $currentBal + $qty;
                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'return_restock',
                    'quantity' => $qty,
                    'balance_before' => $currentBal,
                    'balance_after' => $newBal,
                    'reference_type' => ReturnRecord::class,
                    'reference_id' => $return->id,
                    'notes' => 'Retur barang masuk kembali ke stok: ' . $data['reason'],
                    'created_by' => $userId,
                ]);
            } else {
                // Dibuang / Rusak: catat sebagai pergerakan return_discard tanpa menambah saldo fisik
                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'return_discard',
                    'quantity' => 0, // Tidak menambah stok fisik
                    'balance_before' => $currentBal,
                    'balance_after' => $currentBal,
                    'reference_type' => ReturnRecord::class,
                    'reference_id' => $return->id,
                    'notes' => 'Retur barang rusak/dibuang (tidak masuk stok): ' . $data['reason'],
                    'created_by' => $userId,
                ]);
            }

            return $return;
        });
    }

    /**
     * Catat Penyesuaian Stock Opname Fisik vs Sistem
     */
    public function recordStockOpname(array $data, ?int $userId = null): StockOpname
    {
        return DB::transaction(function () use ($data, $userId) {
            $opnameNumber = $data['opname_number'] ?? ('OPN-' . date('Ym') . '-' . str_pad(StockOpname::count() + 1, 4, '0', STR_PAD_LEFT));

            $opname = StockOpname::create([
                'opname_number' => $opnameNumber,
                'opname_date' => $data['opname_date'] ?? now()->toDateString(),
                'status' => 'completed',
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $itemData) {
                $product = Product::where('id', $itemData['product_id'])->lockForUpdate()->firstOrFail();
                $lastMovement = StockMovement::where('product_id', $product->id)->latest('id')->first();
                $systemStock = $lastMovement ? (int) $lastMovement->balance_after : 0;
                $physicalStock = (int) $itemData['physical_stock'];
                $diff = $physicalStock - $systemStock;

                StockOpnameItem::create([
                    'stock_opname_id' => $opname->id,
                    'product_id' => $product->id,
                    'system_stock' => $systemStock,
                    'physical_stock' => $physicalStock,
                    'difference' => $diff,
                    'reason' => $itemData['reason'] ?? 'Penyesuaian Fisik Berkala',
                    'notes' => $itemData['notes'] ?? null,
                ]);

                if ($diff !== 0) {
                    StockMovement::create([
                        'product_id' => $product->id,
                        'type' => 'opname_adjustment',
                        'quantity' => $diff,
                        'balance_before' => $systemStock,
                        'balance_after' => $physicalStock,
                        'reference_type' => StockOpname::class,
                        'reference_id' => $opname->id,
                        'notes' => 'Penyesuaian Stock Opname: ' . ($itemData['reason'] ?? 'Selisih Fisik') . ' (' . $opnameNumber . ')',
                        'created_by' => $userId,
                    ]);
                }
            }

            return $opname;
        });
    }
}
