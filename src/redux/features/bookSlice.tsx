import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '@/types/interface'; // Assuming Booking interface is defined here

// Define the shape of the state managed by this slice
interface BookState {
  bookItems: Booking[];
}

// Define the initial state
const initialState: BookState = {
  bookItems: [],
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    // Reducer to add a single booking
    addBooking: (state, action: PayloadAction<Booking>) => {
      // Prevent adding duplicate bookings if needed (e.g., by checking ID)
      // For simplicity, just push for now.
      state.bookItems.push(action.payload);
    },
    // Reducer to remove a single booking
    removeBooking: (state, action: PayloadAction<Booking>) => {
      state.bookItems = state.bookItems.filter(item => item.id !== action.payload.id);
    },
    // Reducer to set the entire list of bookings, useful for fetching data
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookItems = action.payload;
    },
    // Reducer to clear all bookings (e.g., on logout)
    clearBookings: (state) => {
      state.bookItems = [];
    }
  },
});

// Export the actions
export const { addBooking, removeBooking, setBookings, clearBookings } = bookSlice.actions;

// Export the reducer
export default bookSlice.reducer;
