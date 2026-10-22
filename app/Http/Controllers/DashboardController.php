<?php

namespace App\Http\Controllers;

use App\Models\InboundShipment;
use App\Models\Product;
use App\Models\SalesItem;
use App\Models\SalesTransaction;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->query('period', 'monthly'); // 'daily', 'weekly', 'monthly'

        // 1. Kartu Metrik Utama
        $totalRevenue = (float) SalesTransaction::sum('total_amount');
        $totalProfit = (float) SalesTransaction::sum('total_profit');
        $totalTransactions = SalesTransaction::count();

        // Nilai Aset Stok Gudang (current_stock * cost_price per produk)
        $products = Product::with('latestStockMovement')->get();
        $totalAssetValue = 0;
        $lowStockCount = 0;
        $lowStockProducts = [];

        foreach ($products as $product) {
            $stock = $product->current_stock;
            $totalAssetValue += ($stock * (float) $product->cost_price);

            if ($stock <= $product->min_stock) {
                $lowStockCount++;
                $lowStockProducts[] = [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'variant' => trim(($product->variant_color ?? '') . ' ' . ($product->variant_size ?? '')),
                    'current_stock' => $stock,
                    'min_stock' => $product->min_stock,
                    'cost_price' => (float) $product->cost_price,
                    'selling_price' => (float) $product->selling_price,
                ];
            }
        }

        // 2. Data Area Chart (Pendapatan & Laba)
        $chartData = $this->getChartData($period);

        // 3. Top Selling Products (Fast Moving)
        $topSelling = SalesItem::select(
                'product_id',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(subtotal_amount) as total_sales_amount'),
                DB::raw('SUM(subtotal_profit) as total_profit_amount')
            )
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->with('product.category')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_id' => $item->product_id,
                    'name' => $item->product ? $item->product->name : 'Unknown',
                    'sku' => $item->product ? $item->product->sku : '-',
                    'category' => $item->product && $item->product->category ? $item->product->category->name : '-',
                    'total_sold' => (int) $item->total_sold,
                    'total_revenue' => (float) $item->total_sales_amount,
                    'total_profit' => (float) $item->total_profit_amount,
                ];
            });

        // 4. Aktivitas Terkini (Recent Movements)
        $recentActivities = StockMovement::with(['product', 'creator'])
            ->latest('id')
            ->limit(6)
            ->get()
            ->map(function ($mov) {
                return [
                    'id' => $mov->id,
                    'type' => $mov->type,
                    'quantity' => $mov->quantity,
                    'balance_after' => $mov->balance_after,
                    'product_name' => $mov->product ? $mov->product->name : '-',
                    'sku' => $mov->product ? $mov->product->sku : '-',
                    'notes' => $mov->notes,
                    'created_at' => $mov->created_at ? $mov->created_at->diffForHumans() : '',
                ];
            });

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'total_asset_value' => $totalAssetValue,
                'total_transactions' => $totalTransactions,
                'low_stock_count' => $lowStockCount,
            ],
            'chartData' => $chartData,
            'period' => $period,
            'topSelling' => $topSelling,
            'lowStockProducts' => array_slice($lowStockProducts, 0, 5),
            'recentActivities' => $recentActivities,
        ]);
    }

    private function getChartData(string $period): array
    {
        $now = Carbon::now();
        $chart = [];

        if ($period === 'daily') {
            // 7 Hari Terakhir
            for ($i = 6; $i >= 0; $i--) {
                $date = $now->copy()->subDays($i)->toDateString();
                $label = Carbon::parse($date)->locale('id')->isoFormat('dd, D MMM');

                $daySales = SalesTransaction::whereDate('transaction_date', $date)->get();
                $chart[] = [
                    'label' => $label,
                    'revenue' => (float) $daySales->sum('total_amount'),
                    'profit' => (float) $daySales->sum('total_profit'),
                ];
            }
        } elseif ($period === 'weekly') {
            // 4 Minggu Terakhir
            for ($i = 3; $i >= 0; $i--) {
                $start = $now->copy()->subWeeks($i)->startOfWeek();
                $end = $now->copy()->subWeeks($i)->endOfWeek();
                $label = 'W' . $start->weekOfYear . ' (' . $start->format('d/m') . ')';

                $weekSales = SalesTransaction::whereBetween('transaction_date', [$start->toDateString(), $end->toDateString()])->get();
                $chart[] = [
                    'label' => $label,
                    'revenue' => (float) $weekSales->sum('total_amount'),
                    'profit' => (float) $weekSales->sum('total_profit'),
                ];
            }
        } else {
            // 6 Bulan Terakhir (Default: Monthly)
            for ($i = 5; $i >= 0; $i--) {
                $month = $now->copy()->subMonths($i);
                $label = $month->locale('id')->isoFormat('MMM YYYY');

                $monthSales = SalesTransaction::whereYear('transaction_date', $month->year)
                    ->whereMonth('transaction_date', $month->month)
                    ->get();

                $chart[] = [
                    'label' => $label,
                    'revenue' => (float) $monthSales->sum('total_amount'),
                    'profit' => (float) $monthSales->sum('total_profit'),
                ];
            }
        }

        return $chart;
    }
}
