<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    // Protects against mass-assignment vulnerabilities by specifying allowed inputs
    protected $fillable = [
        'client_name',
        'company_name',
        'email',
        'phone',
        'project_details',
        'status'
    ];
}