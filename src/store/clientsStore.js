import { create } from 'zustand';
import { loadData, saveData } from '../utils/storage';


import { dummyClients } from '../utils/dummyClients';
const initialClients = loadData('clients') || dummyClients;


const useClientsStore = create((set) => ({
  clients: initialClients,

  addClient: (client) => set((state) => {
    const updated = [...state.clients, client];
    saveData('clients', updated);
    return { clients: updated };
  }),

  updateClient: (id, updatedClient) => set((state) => {
    const updated = state.clients.map(c => c.id === id ? updatedClient : c);
    saveData('clients', updated);
    return { clients: updated };
  }),

  removeClient: (id) => set((state) => {
    const updated = state.clients.filter(c => c.id !== id);
    saveData('clients', updated);
    return { clients: updated };
  }),

  setClients: (clients) => set(() => {
    saveData('clients', clients);
    return { clients };
  }),
}));

export default useClientsStore;
