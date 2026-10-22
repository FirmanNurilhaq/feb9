<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InboundItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'inbound_shipment_id',
        'product_id',
        'quantity',
        'purchase_price',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'purchase_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(InboundShipment::class, 'inbound_shipment_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
