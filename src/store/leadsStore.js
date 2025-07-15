import { create } from "zustand";
import { dummyLeads } from "../utils/dummyLeads";

const useLeadsStore = create((set) => ({
  leads: JSON.parse(localStorage.getItem("leads")) || dummyLeads,

  setLeads: (leads) => {
    set({ leads });
    localStorage.setItem("leads", JSON.stringify(leads));
  }
}));

export default useLeadsStore;
