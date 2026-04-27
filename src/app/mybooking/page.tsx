'use client';

import BookingList from '@/components/BookingList';
import { useEffect, useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import { getBookings } from '@/libs/bookingService';
import { Booking, BookingWithDetails } from '@/../interface';
import { getPayloadFromToken } from '@/libs/authService';
import { useSession } from 'next-auth/react';

export default function MyBookingPage() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const bookingsResponse = await getBookings(token);
      
      // Get the current user ID - we need this to filter if the user is an admin
      const payload = getPayloadFromToken(token);
      const currentUserId = payload?.id || payload?._id;

      // Filter: only show bookings belonging to the current user
      const filtered = bookingsResponse.data.filter((b: any) => {
          // Some backends return user as a string ID, some as an object
          const bUserId = b.user?._id || b.user;
          return bUserId === currentUserId;
      });

      setBookings(filtered);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message || 'Failed to load your bookings.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, fetchBookings]);

  if (!session) {
    return <div className="text-center text-xl mt-20 text-stone-400 font-bold uppercase tracking-widest">Please log in to view your bookings</div>;
  }

  if (isLoading) {
    return <div className="text-center text-xl mt-20 text-stone-400 animate-pulse font-bold uppercase tracking-widest">Loading your bookings...</div>;
  }

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-white p-8 mt-20">
      <Typography variant="h4" component="h1" className="text-[#111111] font-bold mb-10 mt-12">
        My Bookings
      </Typography>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <BookingList initialBookings={bookings} onRefresh={fetchBookings} /> 
    </main>
  );
}