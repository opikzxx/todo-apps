<?php

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware(Authenticate::using('sanctum'));

//tasks
Route::apiResource('/tasks', TaskController::class);


Route::prefix('subtasks')->group(function () {
    Route::post('/{taskId}', [TaskController::class, 'addSubtask']);
    Route::put('/{subtask}', [TaskController::class, 'updateSubtask']);
    Route::delete('/{subtask}', [TaskController::class, 'deleteSubtask']);
    Route::patch('/{subtask}/complete', [TaskController::class, 'completeSubtask']);
});