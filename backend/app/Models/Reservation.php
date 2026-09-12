<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_chat',
        'race',
        'age_mois',
        'telephone',
        'date_arrivee',
        'date_sortie',
    ];

    protected $casts = [
        'date_arrivee' => 'date',
        'date_sortie' => 'date',
        'age_mois' => 'integer',
    ];
}