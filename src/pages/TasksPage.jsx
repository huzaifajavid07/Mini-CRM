import { useState } from "react";
import useTasksStore from "../store/tasksStore";
import useClientsStore from "../store/clientsStore";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

export default function TasksPage() {
  const { tasks, setTasks } = useTasksStore();
  const { clients } = useClientsStore();

  const [newTask, setNewTask] = useState("");
  const [linkedTo, setLinkedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [notes, setNotes] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState("All");

  const addTask = () => {
    if (!newTask.trim() || !linkedTo || !dueDate) {
      toast.error("All fields are required");
      return;
    }

    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error("Due date cannot be in the past");
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      linkedTo,
      dueDate,
      priority,
      notes,
      completed: false,
    };

    setTasks([...tasks, task]);
    toast.success("Task added!");
    setModalOpen(false);
    setNewTask("");
    setLinkedTo("");
    setDueDate("");
    setPriority("Normal");
    setNotes("");
  };

  const markAsComplete = (id) => {
    const updated = tasks.map((task) =>
      task.id === id && !task.completed ? { ...task, completed: true } : task
    );
    setTasks(updated);
    toast.success("Task marked as completed");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filterTab === "All") return true;
      if (filterTab === "Overdue")
        return !task.completed && new Date(task.dueDate) < new Date();
      if (filterTab === "Upcoming")
        return !task.completed && new Date(task.dueDate) >= new Date();
      if (filterTab === "Completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
   <div className="px-4 py-6 md:px-10 md:py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-900">
         Tasks Manager
      </h2>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6 ">
  {/* Tab Buttons */}
  <div className="flex gap-2">
    {["All", "Overdue", "Upcoming", "Completed"].map((tab) => (
      <button
        key={tab}
        onClick={() => setFilterTab(tab)}
        className={`px-4 py-1 text-sm rounded-full transition ${
          filterTab === tab
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-green-100"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Search Bar */}
  <div className="relative w-full md:w-1/3">
    <input
      type="text"
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
    />
    <svg
      className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
      />
    </svg>
  </div>
</div>


      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add Task
        </button>
      </div>

     <ul className="space-y-2 min-h-[100px]">
  {filteredTasks.length === 0 ? (
    <div className="flex items-center justify-center h-30">
  <p className="text-center text-green-900 font-medium text-base bg-white/60 backdrop-blur-sm inline-block px-4 py-2 rounded">
     No tasks in this category yet.
  </p>
</div>

  ) : (
    <AnimatePresence>
      {filteredTasks.map((task) => (
        <motion.li
          key={task.id}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className={`flex flex-col md:flex-row md:justify-between md:items-center p-4 border rounded-md shadow-sm bg-white
            ${
              task.completed
                ? "border-green-300 bg-green-50"
                : new Date(task.dueDate) < new Date()
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
            }`}
        >
          <div className="space-y-1">
            <p
              className={`font-medium text-base flex flex-wrap items-center gap-2 ${
                task.completed && "line-through text-green-700"
              }`}
            >
              {task.title}
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  task.priority === "High"
                    ? "bg-red-200 text-red-800"
                    : task.priority === "Low"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {task.priority}
              </span>
            </p>
            <p className="text-xs text-gray-600">
              Linked to: <strong>{task.linkedTo}</strong> | Due:{" "}
              <strong>{task.dueDate}</strong>
            </p>
            {task.notes && (
              <p className="text-xs italic text-gray-500">
                Notes: {task.notes}
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-3 md:mt-0">
            {task.completed ? (
              <span className="px-3 py-1 text-sm rounded shadow-sm bg-green-100 text-green-700 border border-green-200">
                ✅ Completed
              </span>
            ) : (
              <button
                onClick={() => markAsComplete(task.id)}
                className="px-3 py-1 text-sm rounded shadow bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
              >
                ✔ Mark as Completed
              </button>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              className="px-3 py-1 text-sm rounded shadow bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
            >
              🗑 Delete
            </button>
          </div>
        </motion.li>
      ))}
    </AnimatePresence>
  )}
</ul>


      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-sm relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                ✖
              </button>
              <h3 className="text-xl font-bold mb-4 text-green-700">
                Add New Task
              </h3>
              <input
                type="text"
                placeholder="Task title"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />

              <select
                value={linkedTo}
                onChange={(e) => setLinkedTo(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              >
                <option value="">Select Client</option>
                {clients.length === 0 && (
                  <option disabled>No clients available</option>
                )}
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              >
                <option>High</option>
                <option>Normal</option>
                <option>Low</option>
              </select>

              <textarea
                placeholder="Optional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />

              <button
                onClick={addTask}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Add Task
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
