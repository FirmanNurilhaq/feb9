<?php

namespace App\Http\Controllers;

use App\Models\InboundShipment;
use App\Models\Product;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboundController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = InboundShipment::with(['items.product', 'creator'])->latest('inbound_date');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('shipment_number', 'like', "%{$search}%")
                  ->orWhere('supplier_name', 'like', "%{$search}%");
            });
        }

        $shipments = $query->paginate(10)->withQueryString();

        $products = Product::where('is_active', true)->get(['id', 'sku', 'name', 'variant_color', 'variant_size', 'cost_price', 'selling_price']);

        return Inertia::render('Inbound/Index', [
            'shipments' => $shipments,
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'shipment_number' => 'nullable|string|max:50|unique:inbound_shipments,shipment_number',
            'supplier_name' => 'nullable|string|max:150',
            'inbound_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.purchase_price' => 'required|numeric|min:0',
            'items.*.update_cost_price' => 'nullable|boolean',
        ]);

        $this->inventoryService->recordInbound($validated, auth()->id());

        return redirect()->route('inbound.index')->with('success', 'Penerimaan barang masuk berhasil dicatat.');
    }
}
