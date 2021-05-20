<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lobby;
use App\Models\User;

class LobbyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chatWith(User $user) {
        $user_a = auth()->user();
        $user_b = $user;

        $chat = $user_a->lobbies()->whereHas('users',function($q) use ($user_b) {
            $q->where('lobby_user.user_id',$user_b->id);
        })->first();

        if (!$chat) {
            $chat = Lobby::create([]);
            $chat->users()->sync([$user_a->id,$user_b->id]);
        }

        return redirect()->route('lobby.show',$chat);
    }

    public function show(Lobby $lobby) {

        // Se lanza un error de no autorizacion en el caso de que el usuario no este autorizado a ingresar al lobby en cuestion
        abort_unless($lobby->users->contains(auth()->id()),403);

        return view('chat',[
            'chat' => $lobby
        ]);
    }

    public function getUsers(Lobby $lobby) {
        $users = $lobby->users;

        return response()->json([
            'users' => $users
        ]);
    }

}
