'use client';

import { useState } from 'react';
import { Booking } from '@/../interface';
import { updateBooking, deleteBooking, completeBooking } from '@/libs/bookingService';
import { useSession } from 'next-auth/react';
import BookingCard from './BookingCard';
import BookingDialog from './BookingDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ReviewSubmissionDialog from './ReviewSubmissionDialog';
import { addBookingReview } from '@/libs/reviewService';

export default function BookingList({ initialBookings, onRefresh }: { initialBookings: Booking[], onRefresh: () => void }) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null);

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

  const handleComplete = async (booking: Booking) => {
    if (!token) return;
    try {
      await completeBooking(token, booking._id);
      alert("Car returned successfully. Booking completed!");
      onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to complete booking");
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!token || !reviewingBooking) return;
    try {
      await addBookingReview(token, reviewingBooking._id, { rating, comment });
      setReviewingBooking(null);
      alert("Thank you for your feedback!");
    } catch (err: any) {
      alert(err.message || "Failed to submit review");
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
          onComplete={() => handleComplete(booking)}
          onReview={() => setReviewingBooking(booking)}
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

      {/* Review Dialog */}
      <ReviewSubmissionDialog 
        open={!!reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        onSave={handleReviewSubmit}
        bookingDescription={reviewingBooking ? `${reviewingBooking.car?.brand} ${reviewingBooking.car?.model}` : ""}
      />
    </div>
  );
}

