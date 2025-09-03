export interface SearchState {
  location: string;
  dateRange: [string, string] ; 
  guests: number;
  setLocation: (loc: string) => void;
  setDateRange: (range: [string, string]) => void; 
  setGuests: (num: number) => void;
}

