<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatsController extends Controller
{
    // GET /admin/stats/revenue-by-day?days=30
    public function revenueByDay(Request $request)
    {
        $days = (int) $request->query('days', 30);
        $from = Carbon::now()->subDays($days - 1)->startOfDay();

        $rows = Order::selectRaw('DATE(created_at) as date, SUM(total_price) as revenue, COUNT(*) as orders_count')
            ->where('created_at', '>=', $from)
            ->where('status', '!=', 'cancelled')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $result = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $from->copy()->addDays($i)->toDateString();
            $row = $rows->get($date);
            $result[] = [
                'date' => $date,
                'revenue' => (float) ($row->revenue ?? 0),
                'orders_count' => (int) ($row->orders_count ?? 0),
            ];
        }

        return response()->json(['data' => $result]);
    }

    // GET /admin/stats/stock-summary
    public function stockSummary()
    {
        $total = Product::count();
        $lowStock = Product::where('stock', '>', 0)->where('stock', '<=', 5)->count();
        $outOfStock = Product::where('stock', '<=', 0)->count();

        return response()->json(['data' => [
            'total_products' => $total,
            'in_stock'       => max($total - $lowStock - $outOfStock, 0),
            'low_stock'      => $lowStock,
            'out_of_stock'   => $outOfStock,
        ]]);
    }

    // GET /admin/stats/low-stock?limit=10
    public function lowStock(Request $request)
    {
        $limit = (int) $request->query('limit', 10);

        $products = Product::with('category:id,name')
            ->orderBy('stock', 'asc')
            ->limit($limit)
            ->get(['id', 'name', 'stock', 'category_id']);

        return response()->json(['data' => $products->map(fn ($p) => [
            'product_id' => $p->id,
            'name'       => $p->name,
            'stock'      => $p->stock,
            'category'   => $p->category?->name,
        ])]);
    }

    // GET /admin/orders/by-day?date=YYYY-MM-DD&limit=10
    public function ordersByDay(Request $request)
    {
        $request->validate(['date' => 'required|date']);
        $limit = (int) $request->query('limit', 10);

        $orders = Order::with(['user:id,name', 'items'])
            ->whereDate('created_at', $request->query('date'))
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return response()->json(['data' => $orders->map(fn ($o) => [
            'id'           => $o->id,
            'user'         => $o->user ? ['name' => $o->user->name] : null,
            'total_price'  => (float) $o->total_price,
            'status'       => $o->status,
            'created_at'   => $o->created_at,
            'items_count'  => $o->items->count(),
        ])]);
    }
}