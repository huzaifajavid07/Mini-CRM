import { useParams, Link } from "react-router-dom";
import useClientsStore from "../store/clientsStore";

export default function ClientDetail() {
  const { id } = useParams();
  const { clients } = useClientsStore();

  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="p-6">
        <h2 className="text-2xl text-red-600 font-bold mb-4 animate-pulse">
          ⚠️ Client not found
        </h2>
        <Link
          to="/client"
          className="text-green-600 hover:underline"
        >
          ← Back to Clients
        </Link>
      </div>
    );
  }

  // Example of additional client data
  const details = {
    description: client.description || "No description available.",
    createdAt: client.createdAt || "2024-01-15",
    updatedAt: client.updatedAt || "2024-06-20",
    assignedTo: client.assignedTo || "John Doe",
    address: client.address || "123 Main St, New York, NY"
  };

  return (
    <div className="p-6 flex justify-center items-start min-h-[70vh]">
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl animate-fade-in"
        style={{ animation: "fadeInUp 0.5s ease" }}
      >
        <h2 className="text-3xl font-bold text-green-600 mb-4">Client Details</h2>

        <div className="space-y-3 text-gray-800">
          <p><span className="font-semibold">Name:</span> {client.name}</p>
          <p><span className="font-semibold">Email:</span> {client.email}</p>
          <p><span className="font-semibold">Phone:</span> {client.phone}</p>
          <p><span className="font-semibold">Company:</span> {client.company}</p>
          <p><span className="font-semibold">Tags:</span> {client.tags.join(", ")}</p>
          <hr className="my-3"/>
         
          
          <p><span className="font-semibold">Description:</span> {details.description}</p>
          
        </div>

        <Link
          to="/client"
          className="inline-block mt-6 text-green-600 hover: transition-all"
        >
          ← Back to Clients
        </Link>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
