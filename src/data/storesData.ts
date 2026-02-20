export interface Store {
  id: string;
  name: string;
  distance_km: number;
  rating?: number;
  delivery_time?: string;
  image_url?: string;
  category?: string;
}

export const mockStores: Store[] = [
  {
    id: 'store-1',
    name: 'Hungry Lion',
    distance_km: 0.9,
    rating: 4.8,
    delivery_time: '15-25 min',
    image_url: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fast Food'
  },
  {
    id: 'store-2',
    name: 'Legana Food Heist',
    distance_km: 2.8,
    rating: 3.9,
    delivery_time: '20-35 min',
    image_url: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Restaurant'
  },
  {
    id: 'store-3',
    name: 'My Oyster House',
    distance_km: 3.0,
    rating: 4.6,
    delivery_time: '25-40 min',
    image_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Seafood'
  },
  {
    id: 'store-4',
    name: 'The Asian Kitchen',
    distance_km: 3.3,
    rating: 4.7,
    delivery_time: '30-45 min',
    image_url: 'https://images.pexels.com/photos/2455529/pexels-photo-2455529.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Asian'
  },
  {
    id: 'store-5',
    name: "Milla's Pastries",
    distance_km: 3.8,
    rating: 4.6,
    delivery_time: '25-40 min',
    image_url: 'https://images.pexels.com/photos/3296516/pexels-photo-3296516.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Bakery'
  },
  {
    id: 'store-6',
    name: 'Pizza Palace',
    distance_km: 2.5,
    rating: 4.5,
    delivery_time: '20-30 min',
    image_url: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pizza'
  },
  {
    id: 'store-7',
    name: 'Smoothie Bar',
    distance_km: 1.2,
    rating: 4.4,
    delivery_time: '10-15 min',
    image_url: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Beverages'
  },
  {
    id: 'store-8',
    name: 'Burger Heaven',
    distance_km: 1.5,
    rating: 4.7,
    delivery_time: '12-20 min',
    image_url: 'https://images.pexels.com/photos/2689714/pexels-photo-2689714.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Burgers'
  }
];
