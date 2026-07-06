<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate the structure of incoming inputs
        $request->validate([
            'username' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Strict match check for exactly your credentials
        $isAdmin = $request->username === 'Admin';
        $isEmail = $request->email === 'yeabsirawondwosen27@gmail.com';
        $isPassword = $request->password === 'password123';

        if ($isAdmin && $isEmail && $isPassword) {
            
            // Generate a token for React to store (using basic secure random token or Sanctum)
            // For a single hardcoded user, a random token string works instantly for front-back communication
            $token = bin2hex(random_bytes(32)); 

            return response()->json([
                'token' => $token,
                'user' => [
                    'name' => 'Yanol Digital',
                    'username' => 'Admin',
                    'email' => 'yeabsirawondwosen27@gmail.com',
                ]
            ], 200);
        }

        // 3. Fail immediately if anything does not match perfectly
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }
}