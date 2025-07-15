import { useState } from "react";
import useClientsStore from "../store/clientsStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ClientsPage() {
  const { clients, setClients } = useClientsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [errors, setErrors] = useState({});

  const tags = [...new Set(clients.flatMap((c) => c.tags))];

  const filteredClients = clients.filter((client) => {
    const matchesSearch = `${client.name} ${client.email} ${client.company}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesTag = !filterTag || client.tags.includes(filterTag);

    return matchesSearch && matchesTag;
  });

  const handleDelete = (id) => {
    if (!confirm("Are you sure to delete this client?")) return;
    setClients(clients.filter((c) => c.id !== id));
    toast.success("Client deleted");
  };

  const validate = (data) => {
    const newErrors = {};
    if (!data.name) newErrors.name = "Name is required.";
    if (!data.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Invalid email.";
    return newErrors;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      company: form.company.value.trim(),
      tags: form.tags.value.trim().split(",").map(t => t.trim()).filter(t => t)
    };

    const newErrors = validate(data);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...data } : c));
      toast.success("Client updated");
    } else {
      setClients([...clients, { id: Date.now().toString(), ...data }]);
      toast.success("Client added");
    }

    setModalOpen(false);
    setEditingClient(null);
    setErrors({});
    form.reset();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold  text-green-900">Clients</h2>
        <button
          onClick={() => {
            setEditingClient(null);
            setModalOpen(true);
            setErrors({});
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add Client
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 rounded-md border border-gray-300 shadow-sm w-full md:w-1/2 focus:ring-2 focus:ring-green-400"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="p-3 rounded-md border border-gray-300 shadow-sm w-full md:w-1/4 focus:ring-2 focus:ring-green-400"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white/80 backdrop-blur-md">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-green-600 text-white text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Company</th>
              <th className="p-3">Tags</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="p-3 font-medium">
                  <Link to={`/client/${client.id}`} className="text-green-600 ">
                    {client.name}
                  </Link>
                </td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3">{client.company}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {client.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setModalOpen(true);
                      setErrors({});
                    }}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto animate-fadeIn">
  <div className="bg-white rounded shadow p-6 w-96 animate-slideUp relative">
            <button
              onClick={() => {
                setModalOpen(false);
                setEditingClient(null);
                setErrors({});
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-600">
              {editingClient ? "Edit Client" : "Add Client"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <input
                  name="name"
                  defaultValue={editingClient?.name || ""}
                  placeholder="Name"
                  className="w-full border p-2 rounded"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div>
                <input
                  name="email"
                  defaultValue={editingClient?.email || ""}
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <input
                name="phone"
                defaultValue={editingClient?.phone || ""}
                placeholder="Phone"
                className="w-full border p-2 rounded"
              />
              <input
                name="company"
                defaultValue={editingClient?.company || ""}
                placeholder="Company"
                className="w-full border p-2 rounded"
              />
              <input
                name="tags"
                defaultValue={editingClient?.tags?.join(", ") || ""}
                placeholder="Tags (comma separated)"
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
