export interface PropertyParams {
  id: string;
  name: string;
  slug: string;
  description?: string;
  city: string;
  property?: string;
  imageUrl: string | null;
  price: number;
  rating: number;
  category?: string;
}

export interface PropsParams {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  category: string;
  facilities: string[];
  imageUrl: string | null;
  price: number;
  rating: number;
}

export interface PropertyDetailParams {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  category: string;
  images: string[];
  price: number;
  rating: number;
  rooms: {
    id: string;
    name: string;
    capacity: number;
    price: number;
    images: string[];
    facilities: string[];
    daily: { date: string; price: number; available: number }[];
  }[];
}



export interface CityPropsParams {
  category: string;
  setCategory: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  facilities: string[];
  setFacilities: (v: string[]) => void;
  resetFilters: () => void;
  MAX_PRICE: number;
  city: string;
  setCity: (v: string) => void;
}

export interface SearcPropsParams {
  onSearch: (params: {
    location?: string;
    duration?: { startDate?: Date; endDate?: Date };
    guests?: { adults: number; children: number };
  }) => void;
}

export interface SearchPropsResult {
  loading: boolean;
  properties: PropsParams[];
  category: string;
  location: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}