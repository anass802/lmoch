<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_chat'     => 'required|string|max:255',
            'race'         => 'required|string|max:255',
            'age_mois'     => 'required|integer|min:0|max:400',
            'telephone'    => 'required|string|max:30',
            'date_arrivee' => 'required|date|after_or_equal:today',
            'date_sortie'  => 'required|date|after:date_arrivee',
            'sterilise'    => 'required|boolean',       
        ]);

        $reservation = Reservation::create($validated);

        return response()->json(['data' => $reservation], 201);
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);
        $search  = $request->query('search');
        $status  = $request->query('status');
        $sort    = $request->query('sort', 'date_arrivee');
        $dir     = $request->query('dir', 'asc');

        // updated to match the French columns
        $allowedSorts = ['date_arrivee', 'date_sortie', 'created_at', 'nom_chat', 'age_mois'];
        if (!in_array($sort, $allowedSorts)) {
            $sort = 'date_arrivee';
        }

        $query = Reservation::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom_chat', 'like', "%{$search}%")
                  ->orWhere('race', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $reservations = $query->orderBy($sort, $dir === 'desc' ? 'desc' : 'asc')
            ->paginate($perPage);

        return response()->json(['data' => $reservations]);
    }

    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'cancelled', 'completed'])],
        ]);

        $reservation = Reservation::findOrFail($id);
        $reservation->update($validated);

        return response()->json(['data' => $reservation]);
    }

    public function destroy(int $id)
    {
        Reservation::findOrFail($id)->delete();

        return response()->json(['message' => 'deleted']);
    }
}