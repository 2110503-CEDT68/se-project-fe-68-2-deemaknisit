export const TEST_USER = {
  _id: 'user-e2e-001',
  name: 'Review Tester',
  email: 'review.tester@example.com',
  role: 'user',
  token: 'e2e-token-001',
};

export const TEST_PROVIDER = {
  _id: 'provider-e2e-001',
  name: 'Metro Car Rental',
  address: '999 Test Road',
  district: 'Pathum Wan',
  province: 'Bangkok',
  postalcode: '10330',
  tel: '021111111',
  region: 'Central',
};

export const TEST_CAR = {
  _id: 'car-e2e-001',
  licensePlate: 'TEST-1234',
  brand: 'Toyota',
  model: 'Camry',
  year: 2024,
  color: 'White',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  available: true,
  provider: TEST_PROVIDER,
  picture: '/img/cover.jpg',
  rentPrice: 2500,
};

export const COMPLETED_BOOKING = {
  _id: 'booking-e2e-001',
  bookingDate: '2026-03-10',
  returnDate: '2026-03-14',
  totalCost: 10000,
  user: {
    _id: TEST_USER._id,
    name: TEST_USER.name,
    email: TEST_USER.email,
  },
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
  status: 'complete',
  review: null,
};

export const REVIEW_ITEM = {
  _id: 'review-e2e-001',
  userId: {
    _id: TEST_USER._id,
    name: TEST_USER.name,
  },
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
  providerId: TEST_PROVIDER._id,
  rating: 4,
  comment: 'Smooth pickup and clean car.',
  createdAt: '2026-03-15T08:00:00.000Z',
  updatedAt: '2026-03-15T08:00:00.000Z',
};

export const WISHLIST_ITEM = {
  _id: TEST_CAR._id,
  wishlistItemId: 'wishlist-e2e-001',
  licensePlate: TEST_CAR.licensePlate,
  brand: TEST_CAR.brand,
  model: TEST_CAR.model,
  year: TEST_CAR.year,
  color: TEST_CAR.color,
  transmission: TEST_CAR.transmission,
  fuelType: TEST_CAR.fuelType,
  available: TEST_CAR.available,
  provider: {
    _id: TEST_PROVIDER._id,
    name: TEST_PROVIDER.name,
    address: TEST_PROVIDER.address,
    district: TEST_PROVIDER.district,
    province: TEST_PROVIDER.province,
    postalcode: TEST_PROVIDER.postalcode,
    tel: TEST_PROVIDER.tel,
    region: TEST_PROVIDER.region,
  },
  picture: TEST_CAR.picture,
  rentPrice: TEST_CAR.rentPrice,
};