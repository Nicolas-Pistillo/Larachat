<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LobbyController;
use App\Http\Controllers\MessageController;
use Symfony\Component\Mime\MessageConverter;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';

Route::get('auth/user',function() {
    if (auth()->check()) {
        return response()->json([
            'authUser' => auth()->user()
        ]);
    } else {
        return null;
    }
});

Route::get('chat/{lobby}',[LobbyController::class,"show"])->name('lobby.show');

Route::get('chat/{lobby}/getUsers',[LobbyController::class,"getUsers"])->name('lobby.getUsers');

Route::get('chat/{lobby}/getMessages',[LobbyController::class,"getMessages"])->name('lobby.getMessages');

Route::get('chat/with/{user}',[LobbyController::class,"chatWith"])->name('lobby.with');

Route::post('message/sent',[MessageController::class,"sent"])->name('message.sent');