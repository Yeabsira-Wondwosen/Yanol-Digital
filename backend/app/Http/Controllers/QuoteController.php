<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        return response()->json(Quote::orderBy('created_at', 'desc')->get(), 200);
    }

    public function store(Request $request)
    {
        try {
            // 1. Map frontend field keys dynamically to prevent validation failures
            $clientName = $request->input('client_name') ?? $request->input('full_name') ?? 'Unknown Client';
            $email = $request->input('email') ?? $request->input('email_address');
            $phone = $request->input('phone') ?? $request->input('phone_number') ?? null;

            // 2. Combine frontend fields safely to form the project details text
            $details = $request->input('project_details');
            if (!$details) {
                $details = "Requirements: " . ($request->input('detailed_requirements') ?? $request->input('requirement') ?? 'None provided');
                if ($request->has('project_type')) {
                    $details .= "\nProject Type: " . $request->input('project_type');
                }
                if ($request->has('business_profile')) {
                    $details .= "\nBusiness Profile: " . $request->input('business_profile');
                }
            }

            // 3. Fallback check for missing emails
            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'The email address field is required.'
                ], 422);
            }

            // 4. Save the entry to the database, including the structured
            //    fields so the frontend can display each one individually
            //    instead of only the combined text blob.
            $quote = Quote::create([
                'client_name'       => $clientName,
                'company_name'      => $request->input('company_name'),
                'email'             => $email,
                'phone'             => $phone,
                'project_details'   => $details,
                'status'            => strtolower($request->input('status', 'pending')),
                'payment_status'    => 'pending',
                'payment_method'    => 'cash',
                'estimated_amount'  => $request->input('estimated_amount') ?? 0.00,
                'project_type'      => $request->input('project_type'),
                'budget'            => $request->input('budget'),
                'timeline'          => $request->input('timeline'),
                'priority'          => $request->input('priority'),
                'industry'          => $request->input('industry'),
                'business_profile'  => $request->input('business_profile'),
                'contact_method'    => $request->input('contact_method'),
                'existing_url'      => $request->input('existing_url'),
                'referral_source'   => $request->input('referral_source'),
                'requirement'       => $request->input('requirement'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Quote saved successfully!',
                'data'    => $quote
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Quote save failure: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to save to database.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a quote — used for status changes (pending / approved / deleted)
     * from the admin Client Directory UI.
     */
    public function update(Request $request, Quote $quote)
    {
        try {
            $validated = $request->validate([
                'client_name'       => 'sometimes|string|max:255',
                'company_name'      => 'sometimes|nullable|string|max:255',
                'email'             => 'sometimes|email|max:255',
                'phone'             => 'sometimes|nullable|string|max:255',
                'project_details'   => 'sometimes|nullable|string',
                'status'            => 'sometimes|string|in:pending,approved,deleted',
                'payment_status'    => 'sometimes|string',
                'payment_method'    => 'sometimes|string',
                'estimated_amount'  => 'sometimes|numeric',
                'project_type'      => 'sometimes|nullable|string|max:255',
                'budget'            => 'sometimes|nullable|string|max:255',
                'timeline'          => 'sometimes|nullable|string|max:255',
                'priority'          => 'sometimes|nullable|string|max:255',
                'industry'          => 'sometimes|nullable|string|max:255',
                'business_profile'  => 'sometimes|nullable|string|max:255',
                'contact_method'    => 'sometimes|nullable|string|max:255',
                'existing_url'      => 'sometimes|nullable|string|max:255',
                'referral_source'   => 'sometimes|nullable|string|max:255',
                'requirement'       => 'sometimes|nullable|string',
            ]);

            if (isset($validated['status'])) {
                $validated['status'] = strtolower($validated['status']);
            }

            $quote->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Quote updated successfully!',
                'data'    => $quote,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Quote update failure: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update quote.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Permanently delete a quote from the database.
     */
    public function destroy(Quote $quote)
    {
        try {
            $quote->delete();

            return response()->json([
                'success' => true,
                'message' => 'Quote permanently deleted.',
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Quote delete failure: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete quote.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Fetch distinct clients derived from existing quotes.
     */
    public function getClients()
    {
        $clients = Quote::select('client_name as name', 'company_name', 'email', 'phone')
            ->distinct()
            ->get();

        return response()->json($clients, 200);
    }
    



    

}