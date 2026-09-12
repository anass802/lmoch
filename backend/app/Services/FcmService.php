<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FcmService
{
    /**
     * Send notification to a specific token or all admin tokens.
     */
    public static function sendNotification(string $title, string $body, ?string $token = null, array $data = []): bool
    {
        $serverKey = config('services.firebase.server_key') ?? env('FIREBASE_SERVER_KEY');

        if ($token) {
            $tokens = [$token];
        } else {
            // Find all users with admin/staff role or simply all users with fcm_token set
            $tokens = User::whereNotNull('fcm_token')
                ->where('fcm_token', '!=', '')
                ->pluck('fcm_token')
                ->toArray();
        }

        if (empty($tokens)) {
            Log::info("FCM: No tokens available to send notification.");
            return false;
        }

        foreach ($tokens as $targetToken) {
            self::sendToToken($targetToken, $title, $body, $data, $serverKey);
        }

        return true;
    }

    private static function sendToToken(string $token, string $title, string $body, array $data = [], ?string $serverKey = null): void
    {
        if ($serverKey) {
            // Send using Legacy FCM Endpoint if Server Key configured
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'key=' . $serverKey,
                    'Content-Type' => 'application/json',
                ])->post('https://fcm.googleapis.com/fcm/send', [
                    'to' => $token,
                    'notification' => [
                        'title' => $title,
                        'body' => $body,
                        'icon' => '/logo.png',
                    ],
                    'data' => $data,
                ]);

                Log::info("FCM Response: " . $response->body());
            } catch (\Throwable $e) {
                Log::error("FCM Send Error: " . $e->getMessage());
            }
        } else {
            Log::info("FCM Notification triggered (no SERVER_KEY configured): {$title} - {$body} to token: {$token}");
        }
    }
}