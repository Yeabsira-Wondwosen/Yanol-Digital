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

        // 3. Return a clean HTTP 201 response back to your React frontend UI
        return response()->json([
            'success' => true,
            'message' => 'Quote specification logged successfully.',
            'data'    => $quote
        ], 201);
    }
}