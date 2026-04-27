// Shared mock data and helpers for review e2e tests (EPIC1: Review System)

export const TEST_USER = {
  _id: 'user-test-001',
  name: 'Test User',
  email: 'testuser@example.com',
  role: 'user' as const,
  telephone: '0812345678',
  token: 'fake-test-jwt-token-12345',
};

export const TEST_PROVIDER = {
  _id: 'provider-001',
  name: 'Premium Rentals',
  address: '123 Sukhumvit Rd',
  district: 'Watthana',
  province: 'Bangkok',
  postalcode: '10110',
  tel: '021234567',
  region: 'Central',
  picture: '/img/cover.jpg',
};

export const TEST_CAR = {
  _id: 'car-001',
  licensePlate: 'AB-1234',
  brand: 'Toyota',
  model: 'Camry',
  year: 2023,
  color: 'Black',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  available: true,
  provider: TEST_PROVIDER._id,
  picture: '/img/cover.jpg',
  rentPrice: 1500,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

export const COMPLETED_BOOKING = {
  _id: 'booking-001',
  bookingDate: '2026-04-01',
  returnDate: '2026-04-05',
  totalCost: 6000,
  user: { _id: TEST_USER._id, name: TEST_USER.name, email: TEST_USER.email },
  car: {
    _id: TEST_CAR._id,
    licensePlate: TEST_CAR.licensePlate,
    brand: TEST_CAR.brand,
    model: TEST_CAR.model,
    provider: {
      _id: TEST_PROVIDER._id,
      name: TEST_PROVIDER.name,
      address: TEST_PROVIDER.address,
      tel: TEST_PROVIDER.tel,
    },
  },
  provider: TEST_PROVIDER._id,
  status: 'complete' as const,
  createdAt: '2026-04-01T00:00:00.000Z',
  updatedAt: '2026-04-05T00:00:00.000Z',
  review: null,
};

export const PENDING_BOOKING = {
  ...COMPLETED_BOOKING,
  _id: 'booking-002',
  status: 'pending' as const,
  review: null,
};

export const SAMPLE_REVIEW = {
  _id: 'review-001',
  userId: { _id: TEST_USER._id, name: TEST_USER.name },
  providerId: TEST_PROVIDER._id,
  bookingId: {
    _id: COMPLETED_BOOKING._id,
    car: {
      picture: TEST_CAR.picture,
      brand: TEST_CAR.brand,
      model: TEST_CAR.model,
      year: TEST_CAR.year,
      licensePlate: TEST_CAR.licensePlate,
    },
  },
  rating: 4,
  comment: 'Great service, the car was clean and on time!',
  createdAt: '2026-04-06T10:00:00.000Z',
  updatedAt: '2026-04-06T10:00:00.000Z',
};

export const SAMPLE_REVIEW_2 = {
  _id: 'review-002',
  userId: { _id: TEST_USER._id, name: TEST_USER.name },
  providerId: TEST_PROVIDER._id,
  bookingId: {
    _id: 'booking-003',
    car: {
      picture: TEST_CAR.picture,
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      licensePlate: 'XY-9999',
    },
  },
  rating: 5,
  comment: 'Excellent driving experience!',
  createdAt: '2026-03-20T10:00:00.000Z',
  updatedAt: '2026-03-20T10:00:00.000Z',
};
