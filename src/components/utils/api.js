const api = (() => {
  const baseUrl = "http://127.0.0.1:8000/api";

  const getTasks = async () => {
    const response = await fetch(`${baseUrl}/tasks`);
    const data = await response.json();
    return data.data;
  };

  const createTask = async (task) => {
    console.log("Task Data Submitted:", task);
    const response = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();

    return data;
  };

  const updateTask = async (task) => {
    console.log("Task Data Updated:", task);
    const response = await fetch(`${baseUrl}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();

    return data;
  };

  const deleteTask = async (taskId) => {
    console.log("Task Deleted:", taskId);
    const response = await fetch(`${baseUrl}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    const data = await response.json();
    return data;
  };

  const createSubtask = async (subtask) => {
    console.log("Subtask Data Submitted:", subtask);
    const response = await fetch(`${baseUrl}/subtasks/${subtask.taskId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtask),
    });
    const data = await response.json();

    return data;
  };

  const updateSubtask = async (subtaskData) => {
    console.log("Subtask Data Updated:", subtaskData);

    const response = await fetch(`${baseUrl}/subtasks/${subtaskData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtaskData),
    });

    if (!response.ok) {
      throw new Error("Failed to update subtask");
    }

    const data = await response.json();
    return data;
  };

  const deleteSubtask = async (subtaskId) => {
    console.log("Subtask Deleted:", subtaskId);
    const response = await fetch(`${baseUrl}/subtasks/${subtaskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete subtask");
    }

    const data = await response.json();
    return data;
  };

  const subtaskCompleted = async (subtaskData) => {
    console.log("Subtask Data Updated:", subtaskData);

    const response = await fetch(
      `${baseUrl}/subtasks/${subtaskData.id}/complete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update subtask");
    }

    const data = await response.json();
    return data;
  };

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    subtaskCompleted,
  };
})();

export default api;
