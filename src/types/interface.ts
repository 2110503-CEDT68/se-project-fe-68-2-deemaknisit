export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  telephone: string;
  createdAt: string;
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
}

export type ProviderWithCars = Provider & { cars: Car[] };

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
  provider: string;
  picture: string;
  rentPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type CarWithProvider = Omit<Car, 'provider'> & {
  provider: Pick<Provider, '_id' | 'name' | 'address' | 'tel'>;
  isWishlisted?: any;
};

export interface Booking {
  _id: string;
  bookingDate: string;
  returnDate: string;
  totalCost: number;
  user: string;
  car: string;
  provider: string;
  status: 'pending' | 'complete';
  createdAt: string;
  updatedAt: string;
}

export type BookingWithDetails = Omit<Booking, 'user' | 'car' | 'provider'> & {
  user: User | Pick<User, '_id' | 'name' | 'email'>;
  car: Pick<Car, '_id' | 'licensePlate' | 'brand' | 'model'> & {
    provider: Pick<Provider, '_id' | 'name' | 'address' | 'tel'>;
  };
  provider: string | Provider; // Some responses might have provider as ID or object
  review?: Review | null;
};

// If we need a fully populated booking
export type BookingWithUserCarProvider = Omit<Booking, 'user' | 'car' | 'provider'> & {
  user: User;
  car: CarWithProvider;
  provider: Provider;
  review?: Review | null;
};

export interface Review {
  _id: string;
  userId: string;
  providerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export type ReviewPayload = Pick<Review, 'rating' | 'comment'>;

export interface Wishlist {
  _id: string;
  userId: string;
  carId: string;
  createdAt: string;
  updatedAt: string;
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
  pagination?: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
  data: T[];
}

export interface ResponseSingle<T> {
  success: boolean;
  data: T;
}
