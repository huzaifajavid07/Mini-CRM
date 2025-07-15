import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useLeadsStore from "../store/leadsStore";
import toast from "react-hot-toast";
import { dummyLeads } from "../utils/dummyLeads";

const stages = [
  { name: "New", color: "bg-blue-100 text-blue-800" },
  { name: "Contacted", color: "bg-yellow-100 text-yellow-800" },
  { name: "Proposal", color: "bg-purple-100 text-purple-800" },
  { name: "Won", color: "bg-green-100 text-green-800" },
];

export default function LeadsPage() {
  const { leads, setLeads } = useLeadsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    priority: "Normal",
    stage: "New",
  });

  useEffect(() => {
  if (leads.length === 0) {
    setLeads(dummyLeads);
  }
}, [leads, setLeads]);

  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.name] = leads.filter((lead) => lead.stage === stage.name);
    return acc;
  }, {});

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedLeads = leads.map((lead) =>
      lead.id === result.draggableId
        ? { ...lead, stage: result.destination.droppableId }
        : lead
    );

    setLeads(updatedLeads);
    toast.success(`Lead moved to ${result.destination.droppableId}`);
  };

  const handleAddLead = () => {
    if (!newLead.name.trim() || !newLead.company.trim() || !newLead.stage.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    const lead = {
      id: Date.now().toString(),
      ...newLead,
    };

    setLeads([...leads, lead]);
    setModalOpen(false);
    setNewLead({ name: "", company: "", priority: "Normal", stage: "New" });
    toast.success("Lead added!");
  };

  const handleDelete = (id) => {
    setLeads(leads.filter((l) => l.id !== id));
    toast.success("Lead deleted.");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold  text-green-900 "> Leads Board</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
         ➕ Add Leads
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <Droppable key={stage.name} droppableId={stage.name}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-xl shadow-md flex flex-col"
                >
                  <div
                    className={`p-3 rounded-t-xl ${stage.color} font-bold`}
                  >
                    {stage.name}
                  </div>

                  <div className="p-3 space-y-2 min-h-[300px] bg-gray-50">
                    {leadsByStage[stage.name].map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded shadow p-3 hover:scale-[1.02] transition-all"
                          >
                            <div className="flex justify-between">
                              <p className="font-medium">{lead.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                {lead.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{lead.company}</p>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => handleDelete(lead.id)}
                                className="text-red-500 text-xs hover:cursor-pointer"
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4 text-green-700">
              Add New Lead
            </h3>
            <input
              type="text"
              placeholder="Name"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              placeholder="Company"
              value={newLead.company}
              onChange={(e) =>
                setNewLead({ ...newLead, company: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            />
            <select
              value={newLead.stage}
              onChange={(e) =>
                setNewLead({ ...newLead, stage: e.target.value })
              }
              className="w-full p-2 mb-2 border rounded"
            >
              {stages.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={newLead.priority}
              onChange={(e) =>
                setNewLead({ ...newLead, priority: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
            <button
              onClick={handleAddLead}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Add Lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
