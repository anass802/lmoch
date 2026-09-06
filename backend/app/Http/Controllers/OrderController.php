<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Services\ShippingService;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;
use App\Services\PointsService;

class OrderController extends Controller
{
    
public function index(Request $request)
{
    $query = Order::with(['user:id,name,email', 'items.product:id,name,image'])
        ->orderByDesc('created_at');

    if ($request->filled('status') && $request->status !== 'all') {
        $query->where('status', $request->status);
    }

    if ($request->filled('date_from')) {
        $query->whereDate('created_at', '>=', $request->date_from);
    }
    if ($request->filled('date_to')) {
        $query->whereDate('created_at', '<=', $request->date_to);
    }

    $orders = $query->paginate((int) $request->query('per_page', 20));

    return response()->json([
        'data' => $orders->items(),
        'meta' => [
            'current_page' => $orders->currentPage(),
            'last_page'    => $orders->lastPage(),
            'total'        => $orders->total(),
        ],
    ]);
}

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,shipped,delivered,paid,cancelled',
        ]);

        if ($request->status === 'paid') {
            $order->loadMissing(['user', 'items']);

            if ($order->user) {
                $amount = $order->items->sum('total');

                $pointsService = new PointsService();
                $pointsService->earn($order->user, $amount);
            }
        }
        if( $request->status === 'cancelled' && $order->paid_by === 'points' && $order->user) {
            $pointsService = new PointsService();
            $pointsService->refund($order->user, $order->points_used);
        }
        $order->update(['status' => $request->status]);
        return response()->json(['data' => $order->load(['user', 'items.product'])]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'items' => 'required|array',
            'paid_by' => 'required|in:money,points',
            'points_used' => 'required_if:paid_by,points|integer|min:0',
            'phone' => 'required|string|min:8|max:20',
            'city' => 'required|string|max:100',
            'address' => 'required|string|max:255',
            'emballage'=>'required|in:gratuit,standard,premium',
        ]);

        $user = null;
        if ($token = $request->bearerToken()) {
            $accessToken = PersonalAccessToken::findToken($token);
            $user = $accessToken?->tokenable;
        }
        

       if ($request->paid_by === 'points' && (float) $user->points_balance <= 0) {
        return response()->json([
            'message' => 'Vous n\'avez aucun point à utiliser.',
        ], 422);
    }

        return DB::transaction(function () use ($request, $user) {

            $order = Order::create([
                'user_id' => $user?->id,
                'total_price' => 0,
                'status' => 'pending',
                'paid_by' => $request->paid_by,
                'points_used' => 0,
                'city' => $request->city,
                'address' => $request->address,
                'embalage'=>$request->emballage,
                'phone' => $request->phone,
                'shipping' => 0,
                
            ]);

            $total = 0;

            foreach ($request->items as $item) {

                $product = Product::find($item['id']);

                if (!$product) continue;

                
                $price = $product->price;

                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'image'=>$item['image'],
                    'price' => $price,
                    'total'=>$price * $item['quantity'],
                    'value'=>$item['value']
                ]);

                $total += $price * $item['quantity'];
            }

            $shipping = ShippingService::calculate($request->city, $request->items);
            $emballagePrices = ['gratuit' => 0, 'standard' => 5, 'premium' => 10];
            $emballageCost = $emballagePrices[$request->emballage] ?? 0;
            $orderTotal = $total + $shipping['price'] + $emballageCost;

            $pointsUsed = 0;
            $finalTotal = $orderTotal;
            if ($request->paid_by === 'points' && $user) {
            $pointsBefore = (float) $user->points_balance;
            $pointsService = new PointsService();
            $finalTotal = $pointsService->redeem($user, $orderTotal);
            $pointsUsed = round(min($pointsBefore, $orderTotal), 2);
        }

            $order->update([
                'total_price' => $finalTotal,
                'shipping'=>$shipping['price'],
                'points_used' => $pointsUsed
            ]);

            return response()->json([
                'order' => $order->load('items'),
                'shipping' => $shipping,
                'success' => true,
                'message' => 'Order placed successfully',
                'points_balance' => $user?->fresh()->points_balance ?? null,
            ]);
        });
    }
    public function topCustomers(){
        $topCustomers=User::query()
            ->select('users.id','users.name')
            ->join('orders','users.id','=','orders.user_id')
            ->where('orders.status','paid')
            ->selectRaw('SUM(orders.total_price) as total_spent')
            ->selectRaw('COUNT(orders.id) as orders_count')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_spent')
            ->limit(3)
            ->get();
        return response()->json([
        'data' => $topCustomers,
    ]);
    }

   
}