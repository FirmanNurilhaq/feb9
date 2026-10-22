<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SalesTransaction;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = SalesTransaction::with(['items.product', 'creator'])->latest('transaction_date')->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhere('buyer_name', 'like', "%{$search}%");
            });
        }

        $transactions = $query->paginate(10)->withQueryString();

        $products = Product::where('is_active', true)->with('latestStockMovement')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'sku' => $p->sku,
                'name' => $p->name,
                'variant_color' => $p->variant_color,
                'variant_size' => $p->variant_size,
                'cost_price' => (float) $p->cost_price,
                'selling_price' => (float) $p->selling_price,
                'current_stock' => $p->current_stock,
            ];
        });

        return Inertia::render('Sales/Index', [
            'transactions' => $transactions,
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Endpoint untuk cek ketersediaan stok sebelum submit
     */
    public function checkStock(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $shortages = $this->inventoryService->validateStockForSales($request->input('items'));

        return response()->json([
            'has_shortage' => count($shortages) > 0,
            'shortages' => $shortages,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'invoice_number' => 'nullable|string|max:50|unique:sales_transactions,invoice_number',
            'buyer_name' => 'required|string|max:150',
            'transaction_date' => 'required|date',
            'force_complete' => 'nullable|boolean',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.selling_price' => 'nullable|numeric|min:0',
        ]);

        // Jika tidak di-force complete, cek validasi stok
        if (empty($validated['force_complete'])) {
            $shortages = $this->inventoryService->validateStockForSales($validated['items']);
            if (count($shortages) > 0) {
                return redirect()->back()->with([
                    'stock_shortages' => $shortages,
                    'error' => 'Beberapa produk tidak memiliki stok fisik yang mencukupi. Silakan tinjau kembali atau pilih Paksa Selesai.',
                ]);
            }
        }

        $this->inventoryService->recordSale($validated, auth()->id());

        return redirect()->route('sales.index')->with('success', 'Transaksi penjualan berhasil dicatat dan stok telah diperbarui.');
    }

    public function show(SalesTransaction $sales): Response
    {
        $sales->load(['items.product.category', 'creator', 'returns']);

        return Inertia::render('Sales/Show', [
            'transaction' => $sales,
        ]);
    }
}
