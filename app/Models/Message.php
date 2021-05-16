<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'lobby_id'
    ];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function lobby() {
        return $this->belongsTo('App\Models\Lobby');
    }
}
