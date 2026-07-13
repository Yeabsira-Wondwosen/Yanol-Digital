<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            if (!Schema::hasColumn('quotes', 'project_type')) {
                $table->string('project_type')->nullable()->after('project_details');
            }
            if (!Schema::hasColumn('quotes', 'budget')) {
                $table->string('budget')->nullable()->after('project_type');
            }
            if (!Schema::hasColumn('quotes', 'timeline')) {
                $table->string('timeline')->nullable()->after('budget');
            }
            if (!Schema::hasColumn('quotes', 'priority')) {
                $table->string('priority')->nullable()->after('timeline');
            }
            if (!Schema::hasColumn('quotes', 'industry')) {
                $table->string('industry')->nullable()->after('priority');
            }
            if (!Schema::hasColumn('quotes', 'business_profile')) {
                $table->string('business_profile')->nullable()->after('industry');
            }
            if (!Schema::hasColumn('quotes', 'contact_method')) {
                $table->string('contact_method')->nullable()->after('business_profile');
            }
            if (!Schema::hasColumn('quotes', 'existing_url')) {
                $table->string('existing_url')->nullable()->after('contact_method');
            }
            if (!Schema::hasColumn('quotes', 'referral_source')) {
                $table->string('referral_source')->nullable()->after('existing_url');
            }
            if (!Schema::hasColumn('quotes', 'requirement')) {
                $table->text('requirement')->nullable()->after('referral_source');
            }
        });

        // Make sure status exists with a sensible default. If the column
        // is already there (it's in $fillable already), this just backfills
        // any existing rows and locks in the default going forward.
        if (!Schema::hasColumn('quotes', 'status')) {
            Schema::table('quotes', function (Blueprint $table) {
                $table->string('status')->default('pending')->after('requirement');
            });
        } else {
            \DB::table('quotes')->whereNull('status')->update(['status' => 'pending']);
        }
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};