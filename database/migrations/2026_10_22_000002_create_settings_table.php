<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Default initial settings
        DB::table('settings')->insert([
            ['key' => 'alert_email', 'value' => 'admin@febnine.com', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'brevo_sender_email', 'value' => 'notif@febnine.com', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'brevo_sender_name', 'value' => 'Febnine Atelier Gudang', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'enable_live_email_alert', 'value' => '1', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
