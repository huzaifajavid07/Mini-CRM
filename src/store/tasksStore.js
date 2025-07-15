import { create } from "zustand";
import { dummyTasks } from "../utils/dummyTasks";

const useTasksStore = create((set) => ({
  tasks: JSON.parse(localStorage.getItem("tasks")) || dummyTasks,

  setTasks: (tasks) => {
    set({ tasks });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  },
}));

export default useTasksStore;
