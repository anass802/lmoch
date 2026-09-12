<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    private const PASSWORD_RULE = ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*[A-Z])(?=.*\d).+$/'];
    public function register(Request $request){
        $validated=$request->validate([
            
            'name'=>'required|string|max:255',
            'email'=>'required|email|unique:users,email',
            'phone'=>'required|string|max:255',
            'password'=> self::PASSWORD_RULE
        ]);
        $validated['password']=hash::make($validated['password']);
        $clientRole=Role::where('name','client')->first();
        $validated['role_id']=$clientRole->id;

        $user=User::create($validated);
        $user->refresh(); 
        $token=$user->createToken('auth_token')->plainTextToken;
        $user->load('role');
        return response()->json([
        'user' => $user,
        'token' => $token
    ]);
    }
    public function login(Request $request){
         $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string',
        ]);
        $user = User::where('email', $validated['email'])->first();
        $user->refresh(); 
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

    
        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load('role');

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

    }
    public function updateUser(Request $request)
    {
        $request->validate([
            'field' => 'required|in:name,email,phone',
            'value' => 'required|string',
        ]);

        $user = $request->user();

        $field = $request->field;
        $value = $request->value;

        // extra validation per field
        if ($field === 'email') {
            $request->validate([
                'value' => 'required|email|unique:users,email,' . $user->id,
            ]);
        }

        if ($field === 'phone') {
            $request->validate([
                'value' => 'required|string|unique:users,phone,' . $user->id,
            ]);
        }

        $user->update([$field => $value]);

        return response()->json([
            'message' => 'User updated successfully',
            'field' => $field,
        ]);
    }
    public function deleteAccount(Request $request)
{
    $user = $request->user();

    // revoke all tokens first so the deleted account can't keep making requests
    $user->tokens()->delete();

    $user->delete();

    return response()->json([
        'message' => 'Account deleted successfully',
    ]);
}
}
