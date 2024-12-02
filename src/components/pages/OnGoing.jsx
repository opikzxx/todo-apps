import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CardTask from "../elements/CardTask";
import useStore from "../utils/useStore";
import Completed from "./Completed"; 

const OnGoing = () => {
  const {
    tasks,
    isTaskEditorVisible,
    setIsTaskEditorVisible,
    fetchTasks,
    addTask,
    taskToEdit,
    setTaskToEdit,
  } = useStore();
  const { register, handleSubmit, reset, setValue } = useForm();

  const [activeTab, setActiveTab] = useState("ongoing"); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (taskToEdit) {
      setValue("title", taskToEdit.title);
      setValue("description", taskToEdit.description);
      setValue("deadline", taskToEdit.deadline);
    }
  }, [taskToEdit, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      if (taskToEdit) {
        console.log("Updating Task Data:", data);
        await useStore.getState().updateTask({ ...taskToEdit, ...data });
      } else {
        console.log("Task Data Submitted:", data);
        await addTask(data);
      }
      reset();
      setIsTaskEditorVisible(false);
      setTaskToEdit(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const ongoingTasks = tasks.filter((task) => task.status === "ongoing");

  return (
    <div className="bg-[#222] min-h-screen w-full">
      <div className="max-w-screen-md mx-auto p-4 md:p-10">
        <div className="flex flex-col gap-10">
          <h1 className="flex justify-center text-3xl md:text-4xl text-white font-bold">
            📋 My Tasks
          </h1>

          <div className="flex justify-between mb-4 text-white text-sm md:text-md">
            <div className="flex justify-center gap-2">
              <span
                className={`border-b-2 px-2 md:px-4 py-2 cursor-pointer ${
                  activeTab === "ongoing" ? "border-white" : "border-[#333]"
                }`}
                onClick={() => setActiveTab("ongoing")}
              >
                On Going
              </span>
              <span
                className={`border-b-2 px-2 md:px-4 py-2 cursor-pointer ${
                  activeTab === "completed" ? "border-white" : "border-[#333]"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </span>
            </div>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskEditorVisible(true);
              }}
              className="flex justify-center items-center bg-[#333] hover:bg-[#444] rounded-lg px-4 py-2"
            >
              Add Task
            </button>
          </div>

          {isTaskEditorVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-[#222] border-2 border-[#333] p-4 rounded-lg mb-4 w-full md:w-96">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type="text"
                    className="w-full p-2 text-white rounded-md bg-[#222] focus:outline-none"
                    placeholder="Task Name"
                    {...register("title", {
                      required: "Task name is required",
                    })}
                  />
                  <input
                    type="text"
                    className="w-full p-2 text-white text-xs rounded-md bg-[#222] focus:outline-none"
                    placeholder="Add a description..."
                    {...register("description")}
                  />
                  <input
                    type="datetime-local"
                    className="datetime-button-only p-2 text-slate-300 text-xs text-white rounded-md bg-[#333] focus:outline-none mt-2"
                    placeholder="Pilih waktu"
                    {...register("deadline")}
                  />

                  <div className="flex justify-end gap-2 mt-2 border-t-2 border-[#333]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTaskEditorVisible(false); 
                        setTaskToEdit(null); 
                        reset(); 
                      }}
                      className="bg-red-500 hover:bg-red-600 text-xs text-white px-2 rounded-md mt-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-xs text-white px-4 py-2 rounded-md mt-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {activeTab === "ongoing" ? (
              ongoingTasks.length > 0 ? (
                ongoingTasks.map((task) => (
                  <CardTask
                    key={task?.id}
                    task={task}
                    editTask={() => {
                      setTaskToEdit(task); 
                      setIsTaskEditorVisible(true);
                    }}
                    updateTask={(updatedTask) => {
                      useStore.getState().updateTask(updatedTask);
                    }}
                  />
                ))
              ) : (
                <div className="text-center text-white p-4">
                  <p>No ongoing tasks. Add a new task to get started!</p>
                </div>
              )
            ) : (
              <Completed />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnGoing;
