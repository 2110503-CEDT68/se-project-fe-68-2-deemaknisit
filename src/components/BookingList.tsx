'use client';

import { useState } from 'react';
import { Booking } from '@/../interface';
import { updateBooking, deleteBooking } from '@/libs/bookingService';
import { useSession } from 'next-auth/react';
import BookingCard from './BookingCard';
import BookingDialog from './BookingDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

export default function BookingList({ initialBookings, onRefresh }: { initialBookings: Booking[], onRefresh: () => void }) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const handleUpdate = async (payload: { bookingDate: string; returnDate: string }) => {
    if (!token || !editingBooking) return;
    try {
      await updateBooking(token, editingBooking._id, payload.bookingDate, payload.returnDate);
      setEditingBooking(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to update booking");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !bookingToDelete) return;
    try {
      await deleteBooking(token, bookingToDelete._id);
      setBookingToDelete(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete booking");
    }
  };

  if (initialBookings.length === 0) {
    return (
      <div className="py-20 text-center w-full">
        <p className="text-stone-400 italic text-lg">No car bookings found in your schedule.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl pb-10">
      {initialBookings.map((booking) => (
        <BookingCard 
          key={booking._id} 
          booking={booking}
          onEdit={() => setEditingBooking(booking)}
          onDelete={() => setBookingToDelete(booking)}
        />
      ))}

      {/* Editing Dialog */}
      <BookingDialog 
        open={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onSave={handleUpdate}
        initialData={editingBooking}
      />

      {/* Deleting Confirmation */}
      {bookingToDelete && (
        <ConfirmDeleteDialog 
          open={!!bookingToDelete}
          title="Cancel Booking"
          description="Are you sure you want to cancel this booking? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onClose={() => setBookingToDelete(null)}
        />
      )}
    </div>
  );
}

