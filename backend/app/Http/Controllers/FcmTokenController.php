<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class FcmTokenController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user && $bearerToken = $request->bearerToken()) {
            $tokenInstance = PersonalAccessToken::findToken($bearerToken);
            $user = $tokenInstance?->tokenable;
        }

        if ($user) {
            $user->update(['fcm_token' => $request->token]);
            return response()->json([
                'success' => true,
                'message' => 'FCM token saved successfully for user',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'FCM token received',
            'token'   => $request->token,
        ]);
    }
}
