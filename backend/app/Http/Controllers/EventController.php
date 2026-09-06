<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
class EventController extends Controller
{
    public function index(){
    return response()->json(['data'=>Event::orderBy('name')->get()]);        
    }
    public function activate(Event $event)
{
    Event::where('is_active', true)->update(['is_active' => false]);
    $event->update(['is_active' => true]);
    return response()->json(['data' => $event]);
}
public function deactivateAll()
{
    Event::where('is_active', true)->update(['is_active' => false]);
    return response()->json(['message' => 'ok']);
}

public function active()
{
    return response()->json(['data' => Event::where('is_active', true)->first()]);
}

}
