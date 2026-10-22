<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InboundShipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'shipment_number',
        'supplier_name',
        'inbound_date',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'inbound_date' => 'date',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InboundItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
