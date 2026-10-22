<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'variant_color',
        'variant_size',
        'unit',
        'cost_price',
        'selling_price',
        'min_stock',
        'image_path',
        'description',
        'is_active',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'min_stock' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'current_stock',
        'is_low_stock',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function latestStockMovement(): HasOne
    {
        return $this->hasOne(StockMovement::class)->latestOfMany();
    }

    public function inboundItems(): HasMany
    {
        return $this->hasMany(InboundItem::class);
    }

    public function salesItems(): HasMany
    {
        return $this->hasMany(SalesItem::class);
    }

    public function returns(): HasMany
    {
        return $this->hasMany(ReturnRecord::class);
    }

    public function stockOpnameItems(): HasMany
    {
        return $this->hasMany(StockOpnameItem::class);
    }

    /**
     * Get real-time stock balance from stock movements
     */
    public function getCurrentStockAttribute(): int
    {
        if ($this->relationLoaded('latestStockMovement')) {
            return $this->latestStockMovement ? (int) $this->latestStockMovement->balance_after : 0;
        }

        $latest = $this->stockMovements()->latest('id')->first();
        return $latest ? (int) $latest->balance_after : 0;
    }

    /**
     * Check if item has hit reorder point
     */
    public function getIsLowStockAttribute(): bool
    {
        return $this->current_stock <= $this->min_stock;
    }
}
