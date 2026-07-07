<?php
 
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuoteController;
 
// Public
Route::post('/login', [AuthController::class, 'login']);
 
// Protected — only reachable with a valid token from the seeded admin
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'index']);
    Route::post('/quotes', [QuoteController::class, 'store']);
 
    // Add the rest of your admin-only API routes here.
});
 