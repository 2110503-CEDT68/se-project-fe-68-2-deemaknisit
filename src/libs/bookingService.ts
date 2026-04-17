import { Booking, ResponseList, ResponseSingle } from "@/../interface";
import { baseUrl } from '../config/api';

export async function getBookings(token: string): Promise<ResponseList<Booking>> {
  const response = await fetch(`${baseUrl}/bookings`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch bookings");
  }
  return await response.json();
}

export async function getBooking(token: string, id: string): Promise<ResponseSingle<Booking>> {
  const response = await fetch(`${baseUrl}/bookings/${id}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch booking");
  }
  return await response.json();
}

export async function addBooking(token: string, carId: string, bookingDate: string, returnDate: string) {
  const response = await fetch(`${baseUrl}/cars/${carId}/bookings`, {
    method: "POST",
    headers: {  
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingDate, returnDate }),
  });
  console.log(response);
  console.log(bookingDate, returnDate);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add booking");
  }
  return await response.json();
}

export async function updateBooking(token: string, id: string, bookingDate?: string, returnDate?: string) {
  const response = await fetch(`${baseUrl}/bookings/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookingDate, returnDate }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update booking");
  }
  return await response.json();
}

export async function deleteBooking(token: string, id: string) {
  const response = await fetch(`${baseUrl}/bookings/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete booking");
  }
  return await response.json();
}

export async function completeBooking(token: string, id: string) {
  const response = await fetch(`${baseUrl}/bookings/${id}/complete`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to complete booking");
  }
  return await response.json();
}