<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {

  // --------------------------
  // 🔐 AUTH ROUTES
  // --------------------------
  Route::group(['prefix' => 'auth'], function () {
    Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');

    Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');

    Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
  });

  // --------------------------
  // 🏠 HOME & TODOS (Protected)
  // --------------------------
  Route::group(['middleware' => 'check.auth'], function () {
    Route::get('/', [HomeController::class, 'home'])->name('home');

    Route::prefix('todos')->group(function () {
      Route::get('/', [TodoController::class, 'index'])->name('todos.index');
      Route::post('/store', [TodoController::class, 'store'])->name('todos.store');
      Route::post('/{todo}/update', [TodoController::class, 'update'])->name('todos.update');
      Route::post('/{todo}/delete', [TodoController::class, 'delete'])->name('todos.delete');
      Route::get('/{todo}', [TodoController::class, 'show'])->name('todos.show'); // ✅ detail
      Route::post('/{todo}/cover', [TodoController::class, 'updateCover'])->name('todos.cover'); // ✅ ubah cover
    });
  });
});
