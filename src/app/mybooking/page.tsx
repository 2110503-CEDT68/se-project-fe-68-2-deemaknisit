'use client';

import BookingList from '@/components/BookingList';
import { useEffect, useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import { getBookings } from '@/libs/bookingService';
import { Booking, BookingWithDetails } from '@/../interface';
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
      
      // Filter: only show bookings belonging to the current user
      const currentUserId = (session?.user as any)?._id;
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
    return (
      <main className="w-full min-h-screen flex flex-col items-center bg-white p-8 mt-20">
        <div className="w-24 h-1 bg-stone-100 rounded-full mb-6" />
        <div className="h-10 w-64 bg-stone-100 rounded-2xl animate-pulse mb-12" />
        
        <div className="w-full max-w-4xl space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full bg-stone-50 rounded-[28px] border border-stone-100 animate-pulse flex p-6 gap-6">
              <div className="w-48 h-full bg-stone-100 rounded-2xl" />
              <div className="flex-grow space-y-4">
                <div className="w-1/3 h-6 bg-stone-100 rounded-lg" />
                <div className="w-full h-4 bg-stone-100 rounded-lg" />
                <div className="w-2/3 h-4 bg-stone-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
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