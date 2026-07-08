<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get aggregate statistics for the dashboard layout cards.
     */
    public function getDashboardStatuses()
    {
        $totalQuotes = Quote::count();
        
        // Note: Used lowercase 'accepted' and 'pending' to match your query style, 
        // but make sure it aligns with your DB defaults!
        $acceptedQuotes = Quote::where('status', 'accepted')
            ->orWhere('status', 'Accepted')
            ->count();
            
        $pendingAmount = Quote::where('status', 'pending')
            ->orWhere('status', 'Pending')
            ->sum('estimated_amount');

        return response()->json([
            'totalQuotes' => $totalQuotes,
            'acceptedQuotes' => $acceptedQuotes,
            'pendingAmount' => $pendingAmount ?? 0
        ], 200);
    }

    /**
     * Fetch the 5 most recent quotes.
     */
    public function getRecentQuotes()
    {
        // If your Quote model does not have a formal 'client' relationship defined yet,
        // you can temporarily remove ->with('client') to prevent errors.
        $quotes = Quote::latest()
            ->take(5)
            ->get();

        return response()->json($quotes, 200);
    }
}