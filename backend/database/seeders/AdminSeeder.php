<?php
namespace Database\Seeders;
 
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
 
class AdminSeeder extends Seeder
{
    /**
     * This app has exactly ONE account. There is no registration route
     * anywhere, so this seeder is the only way an account ever gets created.
     * Run it once: php artisan db:seed --class=AdminSeeder
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => env('ADMIN_USERNAME', 'admin')],
            [
                'name' => 'Administrator',
                'email' => env('ADMIN_EMAIL', 'yeabsirawondwosen27@gmail.com'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password123')),
            ]
        );
    }
}
 