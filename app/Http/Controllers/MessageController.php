<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function sent(Request $req) {
        $message = auth()->user()->messages()->create([
            'content' => $req->message,
            'lobby_id' => $req->lobby_id
        ])->load('user');

        broadcast(new MessageSent($message))->toOthers();

        return $message;

    }
}
