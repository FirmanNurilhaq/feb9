<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $status = $request->query('status'); // 'all', 'low_stock', 'active'

        $query = Product::with(['category', 'latestStockMovement'])->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('variant_color', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status === 'active') {
            $query->where('is_active', true);
        }

        $products = $query->paginate(12)->withQueryString();

        // Filter low stock if requested
        if ($status === 'low_stock') {
            // Alternatively handled on collections or subquery
        }

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|max:50|unique:products,sku',
            'name' => 'required|string|max:255',
            'variant_color' => 'nullable|string|max:100',
            'variant_size' => 'nullable|string|max:50',
            'unit' => 'required|string|max:20',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'min_stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:10240', // Max 10MB
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        Product::create($validated);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|max:50|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'variant_color' => 'nullable|string|max:100',
            'variant_size' => 'nullable|string|max:50',
            'unit' => 'required|string|max:20',
            'cost_price' => 'required|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'min_stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:10240', // Max 10MB
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                $oldPath = str_replace('/storage/', '', $product->image_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image_path'] = '/storage/' . $path;
        }

        $product->update($validated);

        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        // Check if product has transaction or movement records
        if ($product->stockMovements()->exists() || $product->salesItems()->exists()) {
            return redirect()->back()->with('error', 'Produk tidak dapat dihapus karena sudah memiliki riwayat mutasi stok / penjualan. Anda dapat menonaktifkannya.');
        }

        if ($product->image_path) {
            $oldPath = str_replace('/storage/', '', $product->image_path);
            Storage::disk('public')->delete($oldPath);
        }

        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:255',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']);

        Category::create($validated);

        return redirect()->back()->with('success', 'Kategori "' . $validated['name'] . '" berhasil ditambahkan.');
    }
}
