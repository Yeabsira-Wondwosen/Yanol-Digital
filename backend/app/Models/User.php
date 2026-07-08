<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory; // 1. Added this import
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // 2. Added HasFactory here
 
    protected $fillable = [
        'username',
        'email',
        'password',
    ];
 
    protected $hidden = [
        'password',
        'remember_token',
    ];
 
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}