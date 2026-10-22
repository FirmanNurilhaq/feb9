<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ReturnRecord;
use App\Models\SalesTransaction;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReturnController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request): Response
    {
        $disposition = $request->query('disposition');

        $query = ReturnRecord::with(['transaction', 'product', 'creator'])->latest('return_date');

        if ($disposition) {
            $query->where('disposition', $disposition);
        }

        $returns = $query->paginate(10)->withQueryString();

        $transactions = SalesTransaction::with('items.product')->latest('transaction_date')->limit(30)->get();
        $products = Product::where('is_active', true)->get(['id', 'sku', 'name']);

        return Inertia::render('Returns/Index', [
            'returns' => $returns,
            'transactions' => $transactions,
            'products' => $products,
            'filters' => [
                'disposition' => $disposition,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sales_transaction_id' => 'nullable|exists:sales_transactions,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'disposition' => 'required|in:restock,discard',
            'reason' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'return_date' => 'required|date',
        ]);

        $this->inventoryService->recordReturn($validated, auth()->id());

        return redirect()->route('returns.index')->with('success', 'Pencatatan retur berhasil disimpan.');
    }
}
