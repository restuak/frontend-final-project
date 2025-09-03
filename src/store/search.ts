import { create } from "zustand";
import { SearchState } from "../interface/searchstate";


export const useSearchStore = create<SearchState>((set) => ({
  location: "",
  dateRange: ["", ""],
  guests: 0,
  setLocation: (loc) => set({ location: loc }),
  setDateRange: (range) => set({ dateRange: range }), 
  setGuests: (num) => set({ guests: num }),
}));
