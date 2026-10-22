<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;
    public function test_guest_cannot_access_settings(): void
    {
        $response = $this->get('/settings');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_view_settings(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/settings');
        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_update_settings(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/settings', [
            'alert_email' => 'new-alert@febnine.com',
            'brevo_sender_email' => 'sender@febnine.com',
            'brevo_sender_name' => 'Febnine Team',
        ]);

        $response->assertRedirect();
        $this->assertEquals('new-alert@febnine.com', Setting::get('alert_email'));
        $this->assertEquals('sender@febnine.com', Setting::get('brevo_sender_email'));
        $this->assertEquals('Febnine Team', Setting::get('brevo_sender_name'));
    }
}
