<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $Blueprint) {
            $Blueprint->id();
            $Blueprint->string('client_name');
            $Blueprint->string('company_name')->nullable();
            $Blueprint->string('email');
            $Blueprint->string('phone')->nullable();
            $Blueprint->text('project_details');
            $Blueprint->string('status')->default('Pending'); // Default status for new forms
            $Blueprint->timestamps(); // Generates created_at and updated_at automatically
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};