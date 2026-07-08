<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('company_name')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('project_details');
            $table->string('status')->default('Pending'); 
            $table->string('payment_status')->default('pending');
            $table->string('payment_method')->default('cash');
            $table->decimal('estimated_amount', 10, 2)->default(0.00); 
            $table->timestamps(); // Generates created_at and updated_at automatically
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};