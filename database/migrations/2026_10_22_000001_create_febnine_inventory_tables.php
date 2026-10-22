<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Products (Master Data SKU Varian)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('variant_color')->nullable();
            $table->string('variant_size')->nullable();
            $table->string('unit')->default('pcs');
            $table->decimal('cost_price', 15, 2)->default(0); // HPP / Modal buat
            $table->decimal('selling_price', 15, 2)->default(0); // Harga jual
            $table->integer('min_stock')->default(5); // Reorder point
            $table->string('image_path')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('sku');
            $table->index(['category_id', 'is_active']);
        });

        // 3. Inbound Shipments (Barang Masuk)
        Schema::create('inbound_shipments', function (Blueprint $table) {
            $table->id();
            $table->string('shipment_number')->unique();
            $table->string('supplier_name')->nullable();
            $table->date('inbound_date');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('inbound_date');
        });

        // 4. Inbound Items
        Schema::create('inbound_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inbound_shipment_id')->constrained('inbound_shipments')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('purchase_price', 15, 2); // Riwayat harga beli
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });

        // 5. Sales Transactions (Pencatatan Penjualan Manual)
        Schema::create('sales_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->string('buyer_name');
            $table->date('transaction_date');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('total_cogs', 15, 2)->default(0); // Total HPP
            $table->decimal('total_profit', 15, 2)->default(0); // Laba Bersih
            $table->boolean('has_override')->default(false); // Paksa selesai saat stok kurang
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('transaction_date');
            $table->index('invoice_number');
        });

        // 6. Sales Items
        Schema::create('sales_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_transaction_id')->constrained('sales_transactions')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('cost_price', 15, 2); // Snapshot HPP saat penjualan
            $table->decimal('selling_price', 15, 2); // Harga jual aktual
            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('subtotal_profit', 15, 2); // (selling_price - cost_price) * quantity
            $table->boolean('was_forced')->default(false);
            $table->timestamps();
        });

        // 7. Returns (Manajemen Retur)
        Schema::create('returns', function (Blueprint $table) {
            $table->id();
            $table->string('return_number')->unique();
            $table->foreignId('sales_transaction_id')->nullable()->constrained('sales_transactions')->onDelete('restrict');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->integer('quantity');
            $table->enum('disposition', ['restock', 'discard']); // Dijual kembali vs Dibuang
            $table->string('reason');
            $table->text('notes')->nullable();
            $table->date('return_date');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('return_date');
        });

        // 8. Stock Opnames (Penyesuaian Fisik Gudang)
        Schema::create('stock_opnames', function (Blueprint $table) {
            $table->id();
            $table->string('opname_number')->unique();
            $table->date('opname_date');
            $table->string('status')->default('completed');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index('opname_date');
        });

        // 9. Stock Opname Items
        Schema::create('stock_opname_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')->constrained('stock_opnames')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->integer('system_stock');
            $table->integer('physical_stock');
            $table->integer('difference'); // physical_stock - system_stock
            $table->string('reason')->nullable(); // Cacat/Noda, Display/Sample, Hilang, Selisih Hitung
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 10. Stock Movements (Ledger Mutasi Stok - Single Source of Truth)
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->enum('type', [
                'inbound',
                'outbound_manual',
                'sales',
                'return_restock',
                'return_discard',
                'opname_adjustment'
            ]);
            $table->integer('quantity'); // Positif (masuk) atau Negatif (keluar)
            $table->integer('balance_before');
            $table->integer('balance_after');
            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stock_opname_items');
        Schema::dropIfExists('stock_opnames');
        Schema::dropIfExists('returns');
        Schema::dropIfExists('sales_items');
        Schema::dropIfExists('sales_transactions');
        Schema::dropIfExists('inbound_items');
        Schema::dropIfExists('inbound_shipments');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
