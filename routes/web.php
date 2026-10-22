<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InboundController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StockOpnameController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products (Master Data SKU)
    Route::resource('products', ProductController::class)->except(['create', 'show', 'edit']);
    Route::post('/categories', [ProductController::class, 'storeCategory'])->name('categories.store');

    // Inbound (Barang Masuk)
    Route::get('/inbound', [InboundController::class, 'index'])->name('inbound.index');
    Route::post('/inbound', [InboundController::class, 'store'])->name('inbound.store');

    // Sales (Pencatatan Penjualan)
    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
    Route::post('/sales/check-stock', [SalesController::class, 'checkStock'])->name('sales.check-stock');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');
    Route::get('/sales/{sales}', [SalesController::class, 'show'])->name('sales.show');

    // Returns (Manajemen Retur)
    Route::get('/returns', [ReturnController::class, 'index'])->name('returns.index');
    Route::post('/returns', [ReturnController::class, 'store'])->name('returns.store');

    // Stock Opname
    Route::get('/opname', [StockOpnameController::class, 'index'])->name('opname.index');
    Route::post('/opname', [StockOpnameController::class, 'store'])->name('opname.store');

    // Reports (Laporan)
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('/reports/sales/export-csv', [ReportController::class, 'exportSalesCsv'])->name('reports.sales.export');
    Route::get('/reports/stock-card', [ReportController::class, 'stockCard'])->name('reports.stock-card');

    // Settings (Pengaturan Notifikasi & Brevo)
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    Route::post('/settings/test-email', [SettingController::class, 'testEmail'])->name('settings.test-email');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
