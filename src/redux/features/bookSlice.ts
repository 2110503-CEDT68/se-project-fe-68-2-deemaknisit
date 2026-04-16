import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocalBookingItem } from '@/../interface';

export interface BookState {
  bookItems: LocalBookingItem[];
}

const initialState: BookState = {
  bookItems: [],
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<LocalBookingItem>) => {
      // Find if a booking for the same provider and date already exists
      const existingIndex = state.bookItems.findIndex(
        item => item.provider === action.payload.provider && item.bookDate === action.payload.bookDate
      );
      
      if (existingIndex !== -1) {
        // Replace existing booking
        state.bookItems[existingIndex] = action.payload;
      } else {
        // Add new booking
        state.bookItems.push(action.payload);
      }
    },
    removeBooking: (state, action: PayloadAction<LocalBookingItem>) => {
      // Remove the booking if all fields match exactly
      state.bookItems = state.bookItems.filter(
        item => 
          item.nameLastname !== action.payload.nameLastname ||
          item.tel !== action.payload.tel ||
          item.provider !== action.payload.provider ||
          item.bookDate !== action.payload.bookDate
      );
    }
  }
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
