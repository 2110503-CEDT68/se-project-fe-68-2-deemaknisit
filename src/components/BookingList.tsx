'use client';

import { useState } from 'react';
import { Booking, BookingWithDetails } from '@/types/interface';
import { updateBooking, deleteBooking, completeBooking } from '@/libs/bookingService';
import { useSession } from 'next-auth/react';
import BookingCard from './BookingCard';
import BookingDialog from './BookingDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ConfirmDialog from './ConfirmDialog';
import NotificationDialog from './NotificationDialog';
import ReviewSubmissionDialog from './ReviewSubmissionDialog';
import { addBookingReview, updateReview, deleteReview } from '@/libs/reviewService';

export default function BookingList({ initialBookings, onRefresh }: { initialBookings: BookingWithDetails[], onRefresh: () => void }) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [editingBooking, setEditingBooking] = useState<BookingWithDetails | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<BookingWithDetails | null>(null);
  const [bookingToReturn, setBookingToReturn] = useState<BookingWithDetails | null>(null);
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string; severity: 'success' | 'error' | 'info' } | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<BookingWithDetails | null>(null);
  const [isReviewEditing, setIsReviewEditing] = useState(false);
  const [bookingToReviewDelete, setBookingToReviewDelete] = useState<BookingWithDetails | null>(null);

  const handleUpdate = async (payload: { bookingDate: string; returnDate: string }) => {
    if (!token || !editingBooking) return;
    try {
      await updateBooking(token, editingBooking._id, payload.bookingDate, payload.returnDate);
      setEditingBooking(null);
      onRefresh();
      setNotification({ title: 'Booking Updated', message: 'Your booking changes have been saved.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Update Failed', message: err.message || 'Failed to update booking.', severity: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !bookingToDelete) return;
    try {
      await deleteBooking(token, bookingToDelete._id);
      setBookingToDelete(null);
      onRefresh();
      setNotification({ title: 'Booking Cancelled', message: 'The booking was successfully deleted.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Delete Failed', message: err.message || 'Failed to delete booking.', severity: 'error' });
    }
  };

  const handleComplete = (booking: BookingWithDetails) => {
    setBookingToReturn(booking);
  };

  const handleReturnConfirm = async () => {
    if (!token || !bookingToReturn) return;
    setReturnSubmitting(true);

    try {
      await completeBooking(token, bookingToReturn._id);
      setBookingToReturn(null);
      onRefresh();
      setNotification({ title: 'Booking Completed', message: 'Car returned successfully and booking is complete.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Return Failed', message: err.message || 'Failed to complete booking.', severity: 'error' });
    } finally {
      setReturnSubmitting(false);
    }
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!token || !reviewingBooking) return;
    try {
      if (isReviewEditing && reviewingBooking.review) {
        await updateReview(token, reviewingBooking.review._id, { rating, comment });
        setNotification({ title: 'Review Updated', message: 'Your review has been updated successfully.', severity: 'success' });
      } else {
        await addBookingReview(token, reviewingBooking._id, { rating, comment });
        setNotification({ title: 'Review Submitted', message: 'Thank you for your feedback!', severity: 'success' });
      }
      setReviewingBooking(null);
      setIsReviewEditing(false);
      onRefresh();
    } catch (err: any) {
      setNotification({ title: 'Review Failed', message: err.message || 'Failed to submit review.', severity: 'error' });
    }
  };

  const handleReviewDeleteConfirm = async () => {
    if (!token || !bookingToReviewDelete || !bookingToReviewDelete.review) return;
    try {
      await deleteReview(token, bookingToReviewDelete.review._id);
      setBookingToReviewDelete(null);
      setNotification({ title: 'Review Deleted', message: 'Your review has been removed successfully.', severity: 'success' });
      onRefresh();
    } catch (err: any) {
      setNotification({ title: 'Delete Failed', message: err.message || 'Failed to delete review.', severity: 'error' });
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pb-10">
      {initialBookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onEdit={() => setEditingBooking(booking)}
          onDelete={() => setBookingToDelete(booking)}
          onComplete={() => handleComplete(booking)}
          onReview={() => { setReviewingBooking(booking); setIsReviewEditing(false); }}
          onReviewEdit={() => { setReviewingBooking(booking); setIsReviewEditing(true); }}
          onReviewDelete={() => setBookingToReviewDelete(booking)}
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

      {/* Return Confirmation */}
      {bookingToReturn && (
        <ConfirmDialog
          open={!!bookingToReturn}
          title="Confirm Return"
          description={`Mark ${bookingToReturn.car?.brand} ${bookingToReturn.car?.model} as returned and complete this booking?`}
          confirmText="Return Car"
          cancelText="Keep Booking"
          confirmColor="#111111"
          onConfirm={handleReturnConfirm}
          onClose={() => setBookingToReturn(null)}
          isSubmitting={returnSubmitting}
        />
      )}

      <NotificationDialog
        open={!!notification}
        title={notification?.title ?? ''}
        message={notification?.message ?? ''}
        severity={notification?.severity ?? 'info'}
        onClose={() => setNotification(null)}
      />

      {/* Review Dialog */}
      <ReviewSubmissionDialog
        open={!!reviewingBooking}
        onClose={() => { setReviewingBooking(null); setIsReviewEditing(false); }}
        onSave={handleReviewSubmit}
        bookingDescription={reviewingBooking ? `${reviewingBooking.car?.brand} ${reviewingBooking.car?.model}` : ""}
        initialData={isReviewEditing ? reviewingBooking?.review : null}
      />

      {/* Review Deletion Confirmation */}
      {bookingToReviewDelete && (
        <ConfirmDeleteDialog
          open={!!bookingToReviewDelete}
          title="Delete Review"
          description="Are you sure you want to delete your review? This action cannot be undone."
          onConfirm={handleReviewDeleteConfirm}
          onClose={() => setBookingToReviewDelete(null)}
        />
      )}
    </div>
  );
}

