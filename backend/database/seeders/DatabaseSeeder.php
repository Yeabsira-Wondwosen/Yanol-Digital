<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Drop any old records to avoid duplicate keys
        User::truncate();

        // Create your admin account
        User::create([
            'username' => 'Admin',
            'email' => 'yeabsirawondwosen27@gmail.com',
            'password' => Hash::make('password123'), // Change this if you want a different password
        ]);
    }
}