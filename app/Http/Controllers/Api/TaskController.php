<?php

namespace App\Http\Controllers\Api;
use App\Models\Task;
use App\Models\Subtask;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;

//import Http request
use Illuminate\Http\Request;

//import facade Validator
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{    
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        $tasks = Task::with('subtasks')->get();

        return new TaskResource(true, 'List Data Task', $tasks);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'title'     => 'required',
            'description' => 'required',
            'deadline'    => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task = Task::create([
            'title'     => $request->title,
            'description' => $request->description,
            'status' => 'ongoing',
            'deadline'    => $request->deadline,
            'progress'    =>0,
        ]);

        return new TaskResource(true, 'Task Created', $task);
        
    }

    public function show($id)
    {
        //get post
        $task = Task::with('subtasks')->findOrFail($id);

        //return single post as a resource
        return new TaskResource(true, 'Task Detail', $task);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'required',
            'description' => 'required',
            'status' => 'required',
            'deadline'    => 'required|date',
            'progress'    => 'required|integer|between:0,100',
        ]);

        //check if validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // get post
        $task = Task::findOrFail($id);

        // update post
        $task->update([
            'title'     => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'deadline'    => $request->deadline,
            'progress'    => $request->progress,
        ]);

        return new TaskResource(true, 'Task Updated', $task);
    }

    public function destroy($id)
    {
        // get post
        $task = Task::findOrFail($id);

        // delete post
        $task->delete();

        return new TaskResource(true, 'Task Deleted', $task);
    }

    // add subtask
    public function addSubtask(Request $request, $taskId)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task = Task::findOrFail($taskId);
        $subtask = $task->subtasks()->create([
            'title'     => $request->title,
            'status' => 'pending',
        ]);

        return new TaskResource(true, 'Subtask Created', $subtask);
    }

    // update subtask
        public function updateSubtask(Request $request, $subtaskId)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'required',
            'status'    => 'required|in:pending,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subtask = Subtask::findOrFail($subtaskId);

        $subtask->update([
            'title' => $request->title,
            'status' => $request->status,
        ]);

        $this->updateTaskProgress($subtask->task);

        return new TaskResource(true, 'Subtask Updated', $subtask);
    }

    

    // delete subtask
    public function deleteSubtask($subtaskId)
    {
        $subtask = Subtask::findOrFail($subtaskId);
    
        $subtask->delete();
    
        $this->updateTaskProgress($subtask->task);
    
        return new TaskResource(true, 'Subtask Deleted', $subtask);
    }

    // complete subtask and update progress
    public function completeSubtask($subtaskId)
    {
        $subtask = Subtask::findOrFail($subtaskId);
    
        $subtask->update(['status' => 'completed']);
    
        $this->updateTaskProgress($subtask->task);
    
        return new TaskResource(true, 'Subtask Completed', $subtask);
    }
    
    // update task progress
    private function updateTaskProgress(Task $task)
    {
        $totalSubtasks = $task->subtasks()->count();
        $completedSubtasks = $task->subtasks()->where('status', 'completed')->count();

        $progress = $totalSubtasks > 0 ? ($completedSubtasks / $totalSubtasks) * 100 : 0;

        $task->update(['progress' => $progress]);
        if ($progress === 100) {
            $task->update(['status' => 'completed']);
        } else {
            $task->update(['status' => 'ongoing']);
        }
    }

}