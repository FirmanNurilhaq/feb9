<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SalesTransaction;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Laporan Penjualan & Laba Rugi
     */
    public function sales(Request $request): Response
    {
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());

        $transactions = SalesTransaction::with(['items.product'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->orderBy('transaction_date', 'asc')
            ->get();

        $totalRevenue = (float) $transactions->sum('total_amount');
        $totalCogs = (float) $transactions->sum('total_cogs');
        $totalProfit = (float) $transactions->sum('total_profit');
        $transactionCount = $transactions->count();

        return Inertia::render('Reports/Sales', [
            'transactions' => $transactions,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_cogs' => $totalCogs,
                'total_profit' => $totalProfit,
                'profit_margin' => $totalRevenue > 0 ? round(($totalProfit / $totalRevenue) * 100, 1) : 0,
                'transaction_count' => $transactionCount,
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Ekspor CSV Laporan Penjualan
     */
    public function exportSalesCsv(Request $request): StreamedResponse
    {
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());

        $transactions = SalesTransaction::with(['items.product'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->orderBy('transaction_date', 'asc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=laporan-penjualan-{$startDate}-to-{$endDate}.csv",
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['No Invoice', 'Tanggal', 'Nama Pembeli', 'Barang (Qty)', 'Total Penjualan (Rp)', 'Total HPP (Rp)', 'Laba Bersih (Rp)', 'Status']);

            foreach ($transactions as $t) {
                $itemsStr = $t->items->map(function ($i) {
                    return ($i->product ? $i->product->sku : 'Item') . ' (' . $i->quantity . ')';
                })->implode('; ');

                fputcsv($file, [
                    $t->invoice_number,
                    $t->transaction_date->format('Y-m-d'),
                    $t->buyer_name,
                    $itemsStr,
                    $t->total_amount,
                    $t->total_cogs,
                    $t->total_profit,
                    $t->has_override ? 'Paksa Selesai' : 'Normal',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Laporan Kartu Stok (Stock Card)
     */
    public function stockCard(Request $request): Response
    {
        $products = Product::where('is_active', true)->orderBy('name')->get(['id', 'sku', 'name', 'variant_color', 'variant_size']);
        $selectedProductId = $request->query('product_id', $products->first()?->id);
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());

        $selectedProduct = Product::find($selectedProductId);

        $movements = [];
        $openingBalance = 0;
        $endingBalance = 0;

        if ($selectedProduct) {
            // Hitung saldo awal sebelum tanggal mulai
            $lastBeforeStart = StockMovement::where('product_id', $selectedProduct->id)
                ->where('created_at', '<', Carbon::parse($startDate)->startOfDay())
                ->latest('id')
                ->first();

            $openingBalance = $lastBeforeStart ? (int) $lastBeforeStart->balance_after : 0;

            // Ambil mutasi dalam periode
            $movements = StockMovement::where('product_id', $selectedProduct->id)
                ->whereBetween('created_at', [
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay(),
                ])
                ->orderBy('id', 'asc')
                ->get()
                ->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'date' => $m->created_at->format('Y-m-d H:i'),
                        'type' => $m->type,
                        'quantity' => $m->quantity,
                        'in_qty' => $m->quantity > 0 ? $m->quantity : 0,
                        'out_qty' => $m->quantity < 0 ? abs($m->quantity) : 0,
                        'balance_after' => $m->balance_after,
                        'notes' => $m->notes,
                    ];
                });

            $endingBalance = $movements->isNotEmpty() ? $movements->last()['balance_after'] : $openingBalance;
        }

        return Inertia::render('Reports/StockCard', [
            'products' => $products,
            'selectedProduct' => $selectedProduct,
            'openingBalance' => $openingBalance,
            'endingBalance' => $endingBalance,
            'movements' => $movements,
            'filters' => [
                'product_id' => $selectedProductId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
