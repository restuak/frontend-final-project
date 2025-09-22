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