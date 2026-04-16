export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  telephone: string;
  createdAt: string;
}

export interface Car {
  _id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  available: boolean;
  provider: Provider;
  picture: string;
  rentPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  _id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel: string;
  region: string;
  picture: string;
  dailyrate: number;
  cars?: Car[];
}

export interface Booking {
  _id: string;
  bookingDate: string;
  returnDate: string;
  totalCost: number;
  user: User;
  car: {
    _id: string;
    licensePlate: string;
    brand: string;
    model: string;
    provider: {
      _id: string;
      name: string;
      address: string;
      tel: string;
    };
  };
  provider: string;
  createdAt: string;
}

export interface LocalBookingItem {
  nameLastname: string;
  tel: string;
  provider: string;
  bookDate: string;
}


// Responses
export interface ResponseList<T> {
  success: boolean;
  count: number;
  pagination?: { next?: { page: number; limit: number }; prev?: { page: number; limit: number } };
  data: T[];
}

export interface ResponseSingle<T> {
  success: boolean;
  data: T;
}
