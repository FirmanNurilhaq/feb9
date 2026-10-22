<?php

namespace App\Mail;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LowStockAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public Product $product;
    public int $currentStock;

    /**
     * Create a new message instance.
     */
    public function __construct(Product $product, int $currentStock)
    {
        $this->product = $product;
        $this->currentStock = $currentStock;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⚠️ [Febnine Atelier Alert] Stok Menipis: ' . $this->product->name . ' (' . $this->product->sku . ')',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.low_stock',
        );
    }
}
