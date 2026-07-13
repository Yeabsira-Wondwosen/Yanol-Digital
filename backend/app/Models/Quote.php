<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'company_name',
        'email',
        'phone',
        'project_details',
        'status',
        'payment_status',
        'payment_method',
        'estimated_amount',
        // Detailed quote form fields
        'project_type',
        'budget',
        'timeline',
        'priority',
        'industry',
        'business_profile',
        'contact_method',
        'existing_url',
        'referral_source',
        'requirement',
    ];

    /**
     * Get the client associated with the quote.
     */
    public function client()
    {
        // If you don't have a separate clients table yet, we can return a fallback
        // object so the frontend doesn't break trying to read a null relationship:
        return $this->belongsTo(User::class, 'user_id')->withDefault([
            'name' => $this->client_name,
        ]);
    }
}