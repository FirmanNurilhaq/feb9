<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockOpname;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockOpnameController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(): Response
    {
        $opnames = StockOpname::with(['items.product', 'creator'])->latest('opname_date')->paginate(10);

        $products = Product::where('is_active', true)->with('latestStockMovement')->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'sku' => $p->sku,
                'name' => $p->name,
                'variant_color' => $p->variant_color,
                'variant_size' => $p->variant_size,
                'current_stock' => $p->current_stock,
            ];
        });

        return Inertia::render('Opname/Index', [
            'opnames' => $opnames,
            'products' => $products,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'opname_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.physical_stock' => 'required|integer|min:0',
            'items.*.reason' => 'required|string|max:150',
            'items.*.notes' => 'nullable|string',
        ]);

        $this->inventoryService->recordStockOpname($validated, auth()->id());

        return redirect()->route('opname.index')->with('success', 'Penyesuaian stock opname berhasil dicatat dan saldo stok telah disinkronkan.');
    }
}
