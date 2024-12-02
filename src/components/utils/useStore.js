import { create } from "zustand";
import api from "./api";

const useStore = create((set) => ({
  tasks: [],
  loading: false,
  isTaskEditorVisible: false,
  taskToEdit: null,
  isSubtaskEditorVisible: {},
  isAddingSubtask: {},
  isEditTaskEditor: false,

  fetchTasks: async () => {
    try {
      const tasks = await api.getTasks();
      set({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  setTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await api.getTasks();
      set({ tasks, loading: false });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    try {
      const newTask = await api.createTask({
        ...task,
        status: "pending",
      });

      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    } catch (error) {
      console.error("Error creating task:", error);
    }
  },

  updateTask: async (task) => {
    try {
      const updatedTask = await api.updateTask(task);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        ),
        isTaskEditorVisible: false,
        taskToEdit: null,
        isEditTaskEditor: false,
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },

  toggleTaskEditor: (task = null) => {
    set((state) => ({
      isTaskEditorVisible: !state.isTaskEditorVisible,
      taskToEdit: task,
      isEditTaskEditor: !!task,
      isSubtaskEditorVisible: {},
    }));
  },

  deleteTask: async (taskId) => {
    try {
      await api.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },

  addSubtask: async (taskId, subtask) => {
    try {
      const newSubtask = await api.createSubtask({ ...subtask, taskId });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, newSubtask] }
            : task
        ),
      }));
      await useStore.getState().fetchTasks();
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  },

  updateSubtask: async (taskId, subtaskId, subtaskData) => {
    try {
      const updatedSubtask = await api.updateSubtask(subtaskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId ? updatedSubtask : subtask
                ),
              }
            : task
        ),
      }));
      await useStore.getState().fetchTasks();
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  },

  deleteSubtask: async (taskId, subtaskId) => {
    try {
      await api.deleteSubtask(subtaskId);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter(
                  (subtask) => subtask.id !== subtaskId
                ),
              }
            : task
        ),
      }));
    } catch (error) {
      console.error("Error deleting subtask:", error);
    }
  },

  toggleSubtaskCompletion: async (taskId, subtaskId) => {
    set({ loading: true });

    const task = useStore.getState().tasks.find((task) => task.id === taskId);
    const subtask = task?.subtasks.find((st) => st.id === subtaskId);

    if (!subtask) return;

    try {
      const updatedSubtask = await api.updateSubtask({
        ...subtask,
        status: subtask.status === "completed" ? "pending" : "completed",
      });

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map((st) =>
                  st.id === subtaskId ? updatedSubtask : st
                ),
              }
            : task
        ),

        loading: false,
      }));
      await useStore.getState().fetchTasks();
    } catch (error) {
      console.error("Error toggling subtask completion:", error);
      set({ loading: false });
    }
  },

  toggleSubtaskEditor: (taskId, subtaskId) => {
    set((state) => ({
      isSubtaskEditorVisible: {
        ...state.isSubtaskEditorVisible,
        [subtaskId]: !state.isSubtaskEditorVisible[subtaskId],
      },
    }));
  },

  toggleAddSubtask: (taskId, isVisible) => {
    set((state) => ({
      isAddingSubtask: {
        ...state.isAddingSubtask,
        [taskId]: isVisible,
      },
    }));
  },
  setIsTaskEditorVisible: (isVisible) => {
    set({ isTaskEditorVisible: isVisible });
  },

  setTaskToEdit: (task) => {
    set({ taskToEdit: task });
  },
}));

export default useStore;
