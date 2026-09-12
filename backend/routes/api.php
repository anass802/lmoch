<?php
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\CatsListingController;
use App\Http\Controllers\CatListingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ReservationController;


Route::get('chat-jouets',[ProductController::class,'JouetChat']);
Route::get('chien-jouets',[ProductController::class,'JouetDog']);
ROUTE::get('random-products',[ProductController::class,'randomProducts']);
Route::get('/top-customers',[OrderController::class,'topCustomers']);
Route::get('search',[ProductController::class,'search']);
Route::get('get-species',[ProductController::class,'species']);
Route::get('/species/{slug}/categories', [ProductController::class, 'categories']);
Route::get('get-filtred-product/{category_id}/{species_id}',[ProductController::class,'getFilteredProducts']);
Route::get('get-product-details/{slug}',[ProductController::class,'getProductDetails']);
Route::get('get-animal-details/{catListing}',[CatListingController::class,'show']);
Route::get('suggestion-products/{product_id}/{species_id}/{category_id}',[ProductController::class,'getSuggestionProduct']);
Route::post('/checkout', [OrderController::class, 'store']);
Route::get('/active-event', [EventController::class, 'active']);
Route::get('/promo-products', [ProductController::class, 'getPromoProducts']);


Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('update-user', [UserController::class, 'updateUser']);
    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', function (\Illuminate\Http\Request $request) {
            return $request->user()->load('role');
        });
    });
});


// admin 
Route::get('stats/revenue-by-day', [StatsController::class, 'revenueByDay']);
Route::get('stats/stock-summary',  [StatsController::class, 'stockSummary']);
Route::get('stats/low-stock',      [StatsController::class, 'lowStock']);
Route::get('orders/by-day',        [StatsController::class, 'ordersByDay']);


Route::get('products/uncategorized', [ProductController::class, 'uncategorized']); // before products/{product}
Route::patch('products/{product}/category', [ProductController::class, 'updateCategory']);
Route::get('products/{product}/variants', [ProductVariantController::class, 'index']);
Route::post('products/{product}/variants', [ProductVariantController::class, 'store']);
Route::post('products', [ProductController::class, 'store']);
Route::put('products/{product}', [ProductController::class, 'update']);
Route::delete('products/{product}', [ProductController::class, 'delete']);
Route::get('get-all-products',[ProductController::class,'getAllProducts']);
Route::get('/products/out-of-stock', [ProductController::class, 'outOfStockProducts']);
Route::apiResource('admin/cat-listings', CatsListingController::class);

Route::post('/reservations', [ReservationController::class, 'store']);


Route::get('categories/{category}/attribute-types', [CategoryController::class, 'attributeTypes']);
Route::get('get-categories', [CategoryController::class, 'index']);


Route::get('orders', [OrderController::class, 'index']);
Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);


Route::get('/cat-listings', [CatListingController::class, 'index']);
Route::get('/cat-listings/breeds', [CatListingController::class, 'distinctBreeds']);
Route::get('/cat-listings/{catListing}', [CatListingController::class, 'show']);

Route::get('/admin/events', [EventController::class, 'index']);
Route::post('/admin/events/{event}/activate', [EventController::class, 'activate']);
Route::post('/admin/events/deactivate', [EventController::class, 'deactivateAll']);

Route::get('/admin/reservations', [ReservationController::class, 'index']);
Route::patch('/admin/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
Route::delete('/admin/reservations/{id}', [ReservationController::class, 'destroy']);

