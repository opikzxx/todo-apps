import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GrCalendar, GrInProgress } from "react-icons/gr";
import { CiCirclePlus, CiEdit, CiTrash } from "react-icons/ci";
import PropTypes from "prop-types";
import useStore from "../utils/useStore";

const CardTask = ({ task }) => {
  const {
    toggleTaskEditor,
    deleteTask,
    addSubtask,
    deleteSubtask,
    toggleAddSubtask,
    isAddingSubtask,
    toggleSubtaskCompletion,
    toggleSubtaskEditor,
    isSubtaskEditorVisible,
    updateSubtask,
    fetchTasks,
  } = useStore();

  const { register, handleSubmit, reset, setValue } = useForm();

  const [allSubtasksCompleted, setAllSubtasksCompleted] = useState(
    task.subtasks?.every((subtask) => subtask.status === "completed")
  );

  useEffect(() => {
    if (task.subtasks && task.subtasks.length > 0) {
      setAllSubtasksCompleted(
        task.subtasks.every((subtask) => subtask.status === "completed")
      );
    } else {
      setAllSubtasksCompleted(false);
    }
  }, [task.subtasks]);

  // Handle task editing
  const handleEditTask = () => {
    toggleTaskEditor(task);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("deadline", task.deadline);
  };

  // Handle task deletion
  const handleDeleteTask = () => {
    deleteTask(task.id);
  };

  // Handle subtask completion toggle for all
  const handleToggleAllSubtasks = () => {
    task.subtasks.forEach((subtask) => {
      toggleSubtaskCompletion(task.id, subtask.id);
    });
    setAllSubtasksCompleted(!allSubtasksCompleted);
  };

  // Handle subtask deletion
  const handleDeleteSubtask = (subtaskId) => {
    deleteSubtask(task.id, subtaskId);
  };

  // Handle adding a new subtask
  const handleAddSubtask = async (data) => {
    const newSubtask = {
      title: data.newSubtaskTitle,
      taskId: task.id,
    };
    await addSubtask(task.id, newSubtask);
    toggleAddSubtask(task.id, false);
    fetchTasks();
    reset();
  };

  // Handle subtask editing
  const onSubtaskSubmit = async (data, index) => {
    const updatedSubtask = {
      ...task.subtasks[index],
      title: data.subtasks[index].title,
    };
    await updateSubtask(task.id, task.subtasks[index].id, updatedSubtask);
    fetchTasks();
    toggleSubtaskEditor(task.id, task.subtasks[index].id);
  };

  return (
    <>
      <div className="bg-[#333] w-full h-20 rounded-lg hover:bg-[#444] px-4 py-2 group">
        <div className="flex justify-between items-center">
          <div className="flex-col">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded mr-2"
                checked={allSubtasksCompleted}
                onChange={handleToggleAllSubtasks}
                disabled={task.subtasks?.length === 0} // Disable checkbox if no subtasks
              />
              <span className="text-white">{task.title}</span>
            </div>
            <span className="text-white font-extralight text-xs ml-8">
              {task.description}
            </span>
            <div className="flex items-center gap-2 ml-8 text-slate-300 text-xs">
              <GrInProgress />
              <span>{task.progress}%</span>
              <GrCalendar className="ml-2" />
              <span>{task.deadline}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CiCirclePlus
              className="text-white cursor-pointer"
              size={20}
              onClick={() => toggleAddSubtask(task.id, true)}
            />
            <CiEdit
              className="text-white cursor-pointer"
              size={20}
              onClick={handleEditTask}
            />
            <CiTrash
              className="text-red-500 cursor-pointer"
              size={20}
              onClick={handleDeleteTask}
            />
          </div>
        </div>
      </div>

      {isAddingSubtask[task.id] && (
        <div className="ml-8">
          <div className="border-2 border-[#333] p-4 rounded-lg mt-1">
            <form onSubmit={handleSubmit(handleAddSubtask)}>
              <input
                type="text"
                className="w-full p-2 text-white rounded-md bg-[#222] focus:outline-none"
                placeholder="Subtask Name"
                {...register("newSubtaskTitle", {
                  required: "Subtask name is required",
                })}
              />
              <div className="flex justify-end gap-2 mt-2 border-t-2 border-[#333]">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-xs text-white px-2 rounded-md mt-2"
                  onClick={() => toggleAddSubtask(task.id, false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-xs text-white px-2 rounded-md mt-2"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {task?.subtasks?.map((subtask, index) => (
        <div key={subtask.id} className="ml-8">
          <div className="bg-[#333] rounded-lg hover:bg-[#444] flex items-center justify-between py-2 px-4 group">
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={subtask.status === "completed"}
                onChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                className="w-4 h-4 rounded"
              />
              <span className="text-white text-sm">{subtask?.title}</span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CiEdit
                className="text-white cursor-pointer"
                size={16}
                onClick={() => toggleSubtaskEditor(task.id, subtask.id)}
              />
              <CiTrash
                className="text-red-500 cursor-pointer"
                size={16}
                onClick={() => handleDeleteSubtask(subtask.id)}
              />
            </div>
          </div>

          {isSubtaskEditorVisible[subtask.id] && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-[#222] border-2 border-[#333] p-4 rounded-lg w-full md:w-96">
                <form
                  onSubmit={handleSubmit((data) =>
                    onSubtaskSubmit(data, index)
                  )}
                >
                  <input
                    type="text"
                    defaultValue={subtask.title}
                    {...register(`subtasks[${index}].title`)}
                    className="w-full p-2 rounded-md bg-[#222] text-white"
                  />
                  <div className="flex justify-end gap-2 mt-2 border-t-2 border-[#333] pt-2">
                    <button
                      type="button"
                      onClick={() => toggleSubtaskEditor(task.id, subtask.id)}
                      className="bg-red-500 hover:bg-red-600 text-xs text-white px-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-xs text-white px-4 py-2 rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

CardTask.propTypes = {
  task: PropTypes.object.isRequired,
};

export default CardTask;
