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
        $quotes = Quote::with('client')
        ->latest()
        ->take(5)
        ->get();

    return response()->json($quotes, 200);
    }

    /**
     * Report stats: approved projects grouped by month + full approved list.
     */
    public function getReportStats()
    {
        $approvedQuotes = Quote::whereIn('status', ['approved', 'accepted'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by month for the chart
        $monthlyData = [];
        foreach ($approvedQuotes as $quote) {
            $monthLabel = $quote->created_at->format('M Y');
            if (!isset($monthlyData[$monthLabel])) {
                $monthlyData[$monthLabel] = [
                    'label' => $monthLabel,
                    'count' => 0,
                    'revenue' => 0,
                ];
            }
            $monthlyData[$monthLabel]['count'] += 1;
            $monthlyData[$monthLabel]['revenue'] += (float)$quote->estimated_amount;
        }

        // Group by project type for breakdown
        $byType = [];
        foreach ($approvedQuotes as $quote) {
            $type = $quote->project_type ?? 'other';
            if (!isset($byType[$type])) {
                $byType[$type] = ['type' => $type, 'count' => 0, 'revenue' => 0];
            }
            $byType[$type]['count'] += 1;
            $byType[$type]['revenue'] += (float)$quote->estimated_amount;
        }

        return response()->json([
            'totalApproved' => $approvedQuotes->count(),
            'totalRevenue' => $approvedQuotes->sum('estimated_amount'),
            'monthlyChart' => array_values($monthlyData),
            'byProjectType' => array_values($byType),
            'projects' => $approvedQuotes->map(function ($q) {
                return [
                    'id' => $q->id,
                    'client_name' => $q->client_name,
                    'company_name' => $q->company_name,
                    'project_type' => $q->project_type,
                    'budget' => $q->budget,
                    'estimated_amount' => $q->estimated_amount,
                    'timeline' => $q->timeline,
                    'status' => $q->status,
                    'created_at' => $q->created_at->toDateString(),
                ];
            }),
        ], 200);
    }
}