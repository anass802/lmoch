<?php
namespace App\Services;

use App\Models\User;

class PointsService
{
    private float $rate;

    public function __construct()
    {
        // 2000dh = 50 points
        $this->rate = 50 / 2000; // 0.025
    }

    // ➕ إضافة points
    public function earn(User $user, float $amount): float
    {
        $points = round($amount * $this->rate, 2);

        $user->points_balance += $points;
        $user->save();
        return $points;
    }

    
    public function redeem(User $user, float $orderTotal): float
    {
        $points = $user->points_balance;

        if ($points >= $orderTotal) {
            $user->points_balance -= $orderTotal;
            $finalTotal = 0;
        } else {
            $finalTotal = $orderTotal - $points;
            $user->points_balance = 0;
        }

        $user->save();

        return $finalTotal;
    }
    public function refund(User $user, float $points): void
    {
        if ($points <= 0) {
            return;
        }

        $user->points_balance += $points;
        $user->save();
    }
}