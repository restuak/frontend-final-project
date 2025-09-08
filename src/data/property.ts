export interface Property {
  id: number;
  name: string;
  city: string;
  type: string;
  image?: string;
}

export const properties: Property[] = [
  {
    id: 1,
    name: "Villa Kuta",
    city: "Bali",
    type: "Villa",
    image: "/img/prev1.webp",
  },
  {
    id: 3,
    name: "Villa Ubud",
    city: "Bali",
    type: "Villa",
    image: "/img/prev4.webp",
  },
  {
    id: 4,
    name: "Hotel Bandung",
    city: "Bandung",
    type: "Hotel",
    image: "/img/prev2.webp",
  },
];
