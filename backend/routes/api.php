<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/quotes', [QuoteController::class, 'store']);

// Protected Routes — only reachable with a valid token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'index']);

    // Core Quotes Endpoints
    Route::get('/quotes', [QuoteController::class, 'index']);
    Route::patch('/quotes/{quote}', [QuoteController::class, 'update']);
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy']);

    // Profile & Settings
    Route::put('/update-profile', [AuthController::class, 'updateProfile']);

    // Reports
    Route::get('/report-stats', [DashboardController::class, 'getReportStats']);
});

// Publicly accessible dashboard endpoints
Route::get('/dashboard-stats', [DashboardController::class, 'getDashboardStatuses']);
Route::get('/quotes/recent', [DashboardController::class, 'getRecentQuotes']);
Route::get('/clients', [QuoteController::class, 'getClients']);