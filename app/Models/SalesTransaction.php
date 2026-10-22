<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SalesTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'buyer_name',
        'transaction_date',
        'total_amount',
        'total_cogs',
        'total_profit',
        'has_override',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'total_amount' => 'decimal:2',
        'total_cogs' => 'decimal:2',
        'total_profit' => 'decimal:2',
        'has_override' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(SalesItem::class);
    }

    public function returns(): HasMany
    {
        return $this->hasMany(ReturnRecord::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
