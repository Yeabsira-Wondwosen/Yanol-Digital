<?php
 
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
 
// Public
Route::post('/login', [AuthController::class, 'login']);
 
// Protected — only reachable with a valid token from the seeded admin
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
 
    // Add the rest of your admin-only API routes here.
});
 