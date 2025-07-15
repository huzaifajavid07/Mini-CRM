import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { Users, Trophy, CheckCircle, Activity } from "lucide-react";
import useClientsStore from "../store/clientsStore";
import useLeadsStore from "../store/leadsStore";
import useTasksStore from "../store/tasksStore";

export default function Dashboard() {
  const { clients } = useClientsStore();
  const { leads } = useLeadsStore();
  const { tasks, setTasks } = useTasksStore();

  const [loading, setLoading] = useState(true);

  const wonLeads = leads.filter(l => l.stage === "Won");

  const today = new Date();

  const upcomingTasks = tasks
    .filter(t => !t.completed && new Date(t.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const overdueTasks = tasks
    .filter(t => !t.completed && new Date(t.dueDate) < today);

  const leadStages = [...new Set(leads.map(l => l.stage))];
  const leadData = leadStages.map(stage => ({
    name: stage,
    value: leads.filter(l => l.stage === stage).length
  }));

  const completeTask = (id) => {
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed: true } : t
    );
    setTasks(updatedTasks);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const COLORS = ["#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"];

  const lineData = [
    { name: 'Week 1', Leads: 10 },
    { name: 'Week 2', Leads: 20 },
    { name: 'Week 3', Leads: 15 },
    { name: 'Week 4', Leads: 25 }
  ];

  

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4"> Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        <div className="glass-card flex flex-col items-center">
          <Users className="text-green-600 text-3xl" />
          <p>Clients</p>
          <h2 className="text-2xl font-bold">{clients.length}</h2>
        </div>
        <div className="glass-card flex flex-col items-center">
          <Trophy className="text-green-600 text-3xl" />
          <p>Leads Won</p>
          <h2 className="text-2xl font-bold">{wonLeads.length}</h2>
        </div>
        <div className="glass-card flex flex-col items-center">
          <Activity className="text-green-600 text-3xl" />
          <p>Leads Total</p>
          <h2 className="text-2xl font-bold">{leads.length}</h2>
        </div>
        <div className="glass-card flex flex-col items-center">
          <CheckCircle className="text-green-600 text-3xl" />
          <p>Tasks</p>
          <h2 className="text-2xl font-bold">{tasks.length}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card">
          <h2 className="font-semibold mb-2"> Leads by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadData}
                cx="50%" cy="50%"
                outerRadius={80} label
                dataKey="value"
              >
                {leadData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h2 className="font-semibold mb-2">Leads Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Leads" stroke="#34D399" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming & Overdue Tasks */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card">
          <h2 className="font-semibold mb-2">Upcoming Tasks</h2>
          {upcomingTasks.length ? (
            <ul className="space-y-1">
              {upcomingTasks.map(task => (
                <li
                  key={task.id}
                  className="flex justify-between items-center"
                >
                  <span>{task.title} — <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span></span>
                 
                </li>
              ))}
            </ul>
          ) : <p> No upcoming tasks</p>}
        </div>

        <div className="glass-card">
          <h2 className="font-semibold mb-2"> Overdue Tasks</h2>
          {overdueTasks.length ? (
            <ul className="space-y-1">
              {overdueTasks.map(task => (
                <li
                  key={task.id}
                  className="flex justify-between items-center"
                >
                  <span>{task.title} — <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span></span>
                
                </li>
              ))}
            </ul>
          ) : <p>No overdue tasks</p>}
        </div>
      </div>
    </div>
  );
}
