<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required',
        ]);

        $email = $request->input('email');
        $username = $request->input('username');
        $loginVal = $request->input('login');

        if (!$email && !$username && !$loginVal) {
            return response()->json([
                'message' => 'Username, Email, or Login field is required.'
            ], 422);
        }

        $query = User::query();

        if ($loginVal) {
            $query->where(function($q) use ($loginVal) {
                $q->where('email', $loginVal)->orWhere('username', $loginVal);
            });
        } else {
            if ($email && $username) {
                $query->where('email', $email)->where('username', $username);
            } elseif ($email) {
                $query->where('email', $email);
            } else {
                $query->where('username', $username);
            }
        }

        $user = $query->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 200);
    }

    public function index(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'current_password' => 'required_with:new_password|string',
            'new_password' => 'sometimes|string|min:6|confirmed',
        ]);

        if ($request->has('name')) {
            $user->name = $request->input('name');
        }

        if ($request->filled('new_password')) {
            if (!Hash::check($request->input('current_password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.'
                ], 422);
            }
            $user->password = Hash::make($request->input('new_password'));
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ], 200);
    }
}