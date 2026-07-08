<?php
 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
 
// Public Routes
Route::post('/login', [AuthController::class, 'login']);
 
// Protected — only reachable with a valid token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'index']);
    
    // Quotes endpoints
    Route::post('/quotes', [QuoteController::class, 'store']);
    Route::get('/quotes', [QuoteController::class, 'index']);
}); // <-- The middleware group ends here!

// Publicly accessible dashboard endpoints (Moved outside the group)
Route::get('/dashboard-stats', [DashboardController::class, 'getDashboardStatuses']);
Route::get('/quotes/recent', [DashboardController::class, 'getRecentQuotes']);