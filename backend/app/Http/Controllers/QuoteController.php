<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate incoming data strings from your React form
        $validatedData = $request->validate([
            'client_name'     => 'required|string|max:255',
            'company_name'    => 'nullable|string|max:255',
            'email'           => 'required|email|max:255',
            'phone'           => 'nullable|string|max:20',
            'project_details' => 'required|string',
        ]);

        // 2. Use Eloquent to persist the validated request to MySQL
        $quote = Quote::create($validatedData);
        $pendingAmount = \App\Models\Quote::where('status', 'pending')->sum('amount');
        // 3. Return a clean HTTP 201 response back to your React frontend UI
        return response()->json([
            'success' => true,
            'message' => 'Quote specification logged successfully.',
            'data'    => $quote
        ], 201);
    }





    // Add this method inside your QuoteController class
public function index()
{
    try {
        // Fetch all quotes, sorted by the newest record first
        $quotes = Quote::latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $quotes
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch quotes: ' . $e->getMessage()
        ], 500);
    }
}
}