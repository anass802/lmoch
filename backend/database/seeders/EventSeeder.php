<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
    ['key' => 'birthDay', 'name' => 'Anniversaire'],
    ['key' => 'blackFriday', 'name' => 'Black Friday'],
    ['key' => 'eidAdha', 'name' => 'Aïd al-Adha'],
    ['key' => 'halowin', 'name' => 'Halloween'],
    ['key' => 'newYear', 'name' => 'Nouvel an'],
    ['key' => 'ramadan', 'name' => 'Ramadan'],
] as $event) {
    Event::updateOrCreate(['key' => $event['key']], $event);
}
    }
}
