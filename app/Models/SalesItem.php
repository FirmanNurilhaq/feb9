<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalesItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_transaction_id',
        'product_id',
        'quantity',
        'cost_price',
        'selling_price',
        'subtotal_amount',
        'subtotal_profit',
        'was_forced',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'cost_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'subtotal_amount' => 'decimal:2',
        'subtotal_profit' => 'decimal:2',
        'was_forced' => 'boolean',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(SalesTransaction::class, 'sales_transaction_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
