<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\InboundItem;
use App\Models\InboundShipment;
use App\Models\Product;
use App\Models\ReturnRecord;
use App\Models\SalesItem;
use App\Models\SalesTransaction;
use App\Models\StockMovement;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with luxury boutique data.
     */
    public function run(): void
    {
        // 1. Single Role Admin Account (memory.md: Single Role Admin/Pemilik Gudang via seeder)
        $admin = User::updateOrCreate(
            ['email' => 'admin@febnine.com'],
            [
                'name' => 'Admin Febnine',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Categories
        $categoriesData = [
            ['name' => 'Dress & Gown', 'description' => 'Gaun elegan dan dress pesta bernuansa luxury.'],
            ['name' => 'Blouse & Tops', 'description' => 'Atasan bahan silk, satin, dan organza premium.'],
            ['name' => 'Outer & Blazer', 'description' => 'Tweed jacket, long outer, dan blazer formal.'],
            ['name' => 'Skirts & Pants', 'description' => 'Bawahan plisket, rok A-line, dan kulot satin.'],
            ['name' => 'Scarf & Hijab', 'description' => 'Hijab voal premium dan scarf bermotif signature.'],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $categories[$data['name']] = Category::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => $data['description'],
            ]);
        }

        // 3. Products (SKU unik per varian ukuran & warna)
        $productsData = [
            [
                'category_name' => 'Dress & Gown',
                'sku' => 'FA-DRS-01-S',
                'name' => 'Luna Silk Tiered Dress',
                'variant_color' => 'Signature Rose',
                'variant_size' => 'S',
                'cost_price' => 285000,
                'selling_price' => 549000,
                'min_stock' => 5,
                'initial_stock' => 20,
            ],
            [
                'category_name' => 'Dress & Gown',
                'sku' => 'FA-DRS-01-M',
                'name' => 'Luna Silk Tiered Dress',
                'variant_color' => 'Signature Rose',
                'variant_size' => 'M',
                'cost_price' => 285000,
                'selling_price' => 549000,
                'min_stock' => 5,
                'initial_stock' => 25,
            ],
            [
                'category_name' => 'Dress & Gown',
                'sku' => 'FA-DRS-01-L',
                'name' => 'Luna Silk Tiered Dress',
                'variant_color' => 'Signature Rose',
                'variant_size' => 'L',
                'cost_price' => 285000,
                'selling_price' => 549000,
                'min_stock' => 5,
                'initial_stock' => 15,
            ],
            [
                'category_name' => 'Blouse & Tops',
                'sku' => 'FA-BLS-02-S',
                'name' => 'Aurelia Organza Blouse',
                'variant_color' => 'Obsidian Charcoal',
                'variant_size' => 'S',
                'cost_price' => 195000,
                'selling_price' => 389000,
                'min_stock' => 4,
                'initial_stock' => 18,
            ],
            [
                'category_name' => 'Blouse & Tops',
                'sku' => 'FA-BLS-02-M',
                'name' => 'Aurelia Organza Blouse',
                'variant_color' => 'Obsidian Charcoal',
                'variant_size' => 'M',
                'cost_price' => 195000,
                'selling_price' => 389000,
                'min_stock' => 4,
                'initial_stock' => 22,
            ],
            [
                'category_name' => 'Outer & Blazer',
                'sku' => 'FA-OUT-03-ALL',
                'name' => 'Seraphina Pearl Tweed Outer',
                'variant_color' => 'Alabaster White',
                'variant_size' => 'All Size',
                'cost_price' => 340000,
                'selling_price' => 679000,
                'min_stock' => 3,
                'initial_stock' => 12,
            ],
            [
                'category_name' => 'Skirts & Pants',
                'sku' => 'FA-SKT-04-M',
                'name' => 'Celeste Accordion Pleated Skirt',
                'variant_color' => 'Muted Rose',
                'variant_size' => 'M',
                'cost_price' => 165000,
                'selling_price' => 329000,
                'min_stock' => 4,
                'initial_stock' => 16,
            ],
            [
                'category_name' => 'Scarf & Hijab',
                'sku' => 'FA-HJB-05-ALL',
                'name' => 'Étoile Voile Premium Scarf',
                'variant_color' => 'Sage Green',
                'variant_size' => '115x115',
                'cost_price' => 75000,
                'selling_price' => 179000,
                'min_stock' => 8,
                'initial_stock' => 40,
            ],
        ];

        $createdProducts = [];
        foreach ($productsData as $item) {
            $product = Product::create([
                'category_id' => $categories[$item['category_name']]->id,
                'sku' => $item['sku'],
                'name' => $item['name'],
                'variant_color' => $item['variant_color'],
                'variant_size' => $item['variant_size'],
                'unit' => 'pcs',
                'cost_price' => $item['cost_price'],
                'selling_price' => $item['selling_price'],
                'min_stock' => $item['min_stock'],
                'is_active' => true,
            ]);
            $createdProducts[$item['sku']] = [
                'model' => $product,
                'initial_stock' => $item['initial_stock'],
                'cost_price' => $item['cost_price'],
            ];
        }

        // 4. Initial Inbound Shipment (Penerimaan stok pertama dari vendor konveksi)
        $inbound = InboundShipment::create([
            'shipment_number' => 'INB-' . date('Ym') . '-0001',
            'supplier_name' => 'Konveksi Signature Bandung',
            'inbound_date' => Carbon::now()->subDays(14)->toDateString(),
            'notes' => 'Stok awal batch produksi Autumn/Winter Febnine Atelier.',
            'created_by' => $admin->id,
        ]);

        foreach ($createdProducts as $sku => $data) {
            $product = $data['model'];
            $qty = $data['initial_stock'];
            $cost = $data['cost_price'];

            InboundItem::create([
                'inbound_shipment_id' => $inbound->id,
                'product_id' => $product->id,
                'quantity' => $qty,
                'purchase_price' => $cost,
                'subtotal' => $qty * $cost,
            ]);

            StockMovement::create([
                'product_id' => $product->id,
                'type' => 'inbound',
                'quantity' => $qty,
                'balance_before' => 0,
                'balance_after' => $qty,
                'reference_type' => InboundShipment::class,
                'reference_id' => $inbound->id,
                'notes' => 'Penerimaan stok awal dari supplier: ' . $inbound->shipment_number,
                'created_by' => $admin->id,
                'created_at' => Carbon::now()->subDays(14),
            ]);
        }

        // 5. Realistic Sales Transactions (Penjualan beberapa hari terakhir)
        $salesData = [
            [
                'invoice' => 'INV-' . date('Ym') . '-0001',
                'buyer' => 'Ibu Clarissa Wardhana',
                'date' => Carbon::now()->subDays(7),
                'items' => [
                    ['sku' => 'FA-DRS-01-M', 'qty' => 2],
                    ['sku' => 'FA-HJB-05-ALL', 'qty' => 2],
                ],
            ],
            [
                'invoice' => 'INV-' . date('Ym') . '-0002',
                'buyer' => 'Nona Amanda Safira',
                'date' => Carbon::now()->subDays(5),
                'items' => [
                    ['sku' => 'FA-OUT-03-ALL', 'qty' => 1],
                    ['sku' => 'FA-SKT-04-M', 'qty' => 1],
                ],
            ],
            [
                'invoice' => 'INV-' . date('Ym') . '-0003',
                'buyer' => 'Ny. Jessica Hartono',
                'date' => Carbon::now()->subDays(2),
                'items' => [
                    ['sku' => 'FA-DRS-01-S', 'qty' => 1],
                    ['sku' => 'FA-BLS-02-S', 'qty' => 2],
                ],
            ],
            [
                'invoice' => 'INV-' . date('Ym') . '-0004',
                'buyer' => 'Dr. Nadia Putri',
                'date' => Carbon::now()->subDay(),
                'items' => [
                    ['sku' => 'FA-DRS-01-M', 'qty' => 3],
                    ['sku' => 'FA-OUT-03-ALL', 'qty' => 1],
                ],
            ],
        ];

        foreach ($salesData as $sale) {
            $totalAmount = 0;
            $totalCogs = 0;

            $tx = SalesTransaction::create([
                'invoice_number' => $sale['invoice'],
                'buyer_name' => $sale['buyer'],
                'transaction_date' => $sale['date']->toDateString(),
                'total_amount' => 0,
                'total_cogs' => 0,
                'total_profit' => 0,
                'created_by' => $admin->id,
                'created_at' => $sale['date'],
            ]);

            foreach ($sale['items'] as $item) {
                $product = $createdProducts[$item['sku']]['model'];
                $qty = $item['qty'];
                $cost = (float) $product->cost_price;
                $price = (float) $product->selling_price;

                $subtotal = $qty * $price;
                $profit = ($price - $cost) * $qty;
                $cogs = $qty * $cost;

                $totalAmount += $subtotal;
                $totalCogs += $cogs;

                SalesItem::create([
                    'sales_transaction_id' => $tx->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                    'cost_price' => $cost,
                    'selling_price' => $price,
                    'subtotal_amount' => $subtotal,
                    'subtotal_profit' => $profit,
                ]);

                // Update stock balance via StockMovement
                $lastMovement = StockMovement::where('product_id', $product->id)->latest('id')->first();
                $currentBal = $lastMovement ? $lastMovement->balance_after : 0;
                $newBal = $currentBal - $qty;

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'sales',
                    'quantity' => -$qty,
                    'balance_before' => $currentBal,
                    'balance_after' => $newBal,
                    'reference_type' => SalesTransaction::class,
                    'reference_id' => $tx->id,
                    'notes' => 'Penjualan ke ' . $sale['buyer'] . ' (' . $sale['invoice'] . ')',
                    'created_by' => $admin->id,
                    'created_at' => $sale['date'],
                ]);
            }

            $tx->update([
                'total_amount' => $totalAmount,
                'total_cogs' => $totalCogs,
                'total_profit' => $totalAmount - $totalCogs,
            ]);
        }

        // 6. Sample Return Record (Retur 1 pcs Paris Voile Scarf -> Dijual Kembali)
        $tx1 = SalesTransaction::first();
        $scarf = $createdProducts['FA-HJB-05-ALL']['model'];
        $lastMovement = StockMovement::where('product_id', $scarf->id)->latest('id')->first();
        $balBefore = $lastMovement ? $lastMovement->balance_after : 0;

        $return = ReturnRecord::create([
            'return_number' => 'RET-' . date('Ym') . '-0001',
            'sales_transaction_id' => $tx1->id,
            'product_id' => $scarf->id,
            'quantity' => 1,
            'disposition' => 'restock',
            'reason' => 'Tukar warna pesanan pelanggan',
            'notes' => 'Kondisi barang mulus dengan hangtag utuh.',
            'return_date' => Carbon::now()->subDays(3)->toDateString(),
            'created_by' => $admin->id,
        ]);

        StockMovement::create([
            'product_id' => $scarf->id,
            'type' => 'return_restock',
            'quantity' => 1,
            'balance_before' => $balBefore,
            'balance_after' => $balBefore + 1,
            'reference_type' => ReturnRecord::class,
            'reference_id' => $return->id,
            'notes' => 'Retur barang masuk kembali ke stok: ' . $return->return_number,
            'created_by' => $admin->id,
            'created_at' => Carbon::now()->subDays(3),
        ]);

        // 7. Sample Stock Opname (Penyesuaian 1 pcs Luna Silk Dress L karena noda display)
        $dressL = $createdProducts['FA-DRS-01-L']['model'];
        $lastMov = StockMovement::where('product_id', $dressL->id)->latest('id')->first();
        $sysStock = $lastMov ? $lastMov->balance_after : 15;
        $physStock = $sysStock - 1; // Selisih -1

        $opname = StockOpname::create([
            'opname_number' => 'OPN-' . date('Ym') . '-0001',
            'opname_date' => Carbon::now()->subDays(1)->toDateString(),
            'status' => 'completed',
            'notes' => 'Opname berkala mingguan rak gaun pesta.',
            'created_by' => $admin->id,
        ]);

        StockOpnameItem::create([
            'stock_opname_id' => $opname->id,
            'product_id' => $dressL->id,
            'system_stock' => $sysStock,
            'physical_stock' => $physStock,
            'difference' => -1,
            'reason' => 'Cacat/Noda saat display showroom',
            'notes' => 'Dipindahkan ke rak afkir.',
        ]);

        StockMovement::create([
            'product_id' => $dressL->id,
            'type' => 'opname_adjustment',
            'quantity' => -1,
            'balance_before' => $sysStock,
            'balance_after' => $physStock,
            'reference_type' => StockOpname::class,
            'reference_id' => $opname->id,
            'notes' => 'Penyesuaian opname: Cacat/Noda saat display showroom (' . $opname->opname_number . ')',
            'created_by' => $admin->id,
            'created_at' => Carbon::now()->subDays(1),
        ]);
    }
}
