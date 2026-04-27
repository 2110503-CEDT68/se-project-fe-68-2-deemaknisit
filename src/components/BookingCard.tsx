'use client';

import { BookingWithDetails } from "@/../interface";
import { Button, Rating } from "@mui/material";

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  onComplete,
  onReview,
  onReviewEdit,
  onReviewDelete
}: {
  booking: BookingWithDetails;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
  onReview?: () => void;
  onReviewEdit?: () => void;
  onReviewDelete?: () => void;
}) {
  // Extract info from backend structure
  const providerName = booking.car?.provider?.name || "Rental Provider";
  const carDescription = `${booking.car?.brand || ''} ${booking.car?.model || ''}`.trim() || "Rental Car";
  const isComplete = booking.status === 'complete';
  
  const bDate = new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const rDate = new Date(booking.returnDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`w-full bg-white border rounded-[32px] p-6 shadow-sm transition-all duration-300 flex flex-col sm:flex-row items-center gap-6 ${isComplete ? 'border-green-100 bg-green-50/20' : 'border-stone-200 hover:shadow-md'}`}>
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[#111111] font-bold text-xl">{carDescription}</h3>
                {isComplete && (
                    <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full border border-green-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                    </div>
                )}
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">{providerName}</p>
          </div>
          <div className="bg-[#FFD600]/10 text-[#111111] px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-[#FFD600]/20">
             ฿{booking.totalCost} Total
          </div>
        </div>

        <div className="flex gap-6 pt-2">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Pickup</p>
            <p className="text-[#111111] font-black text-sm">{bDate}</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Return</p>
            <p className="text-[#111111] font-black text-sm">{rDate}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4 mt-4">
          {isComplete ? (
            booking.review ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-sm font-bold uppercase tracking-widest text-stone-500">Your Review</span>
                  <div className="flex items-center gap-1.5">
                    <Rating value={booking.review.rating} readOnly size="small" sx={{ color: '#FFD600' }} />
                    <span className="text-xs font-black text-[#111111]">{booking.review.rating}/5</span>
                  </div>
                </div>
                <p className="text-sm text-stone-600 mb-4">{booking.review.comment || 'No comment provided.'}</p>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  {onReviewEdit && (
                    <button 
                      onClick={onReviewEdit} 
                      className="w-7 h-7 flex items-center justify-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm active:scale-90"
                      title="Edit Review"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                  )}
                  {onReviewDelete && (
                    <button 
                      onClick={onReviewDelete} 
                      className="w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm active:scale-90"
                      title="Delete Review"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-stone-500">No review yet for this completed booking.</div>
            )
          ) : (
            <div className="text-sm text-stone-500">Booking not complete yet. Review will appear here after return.</div>
          )}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-stone-200 sm:pl-8">
        {isComplete && onReview && (
          <Button 
            onClick={onReview} 
            variant="contained" 
            fullWidth
            sx={{ backgroundColor: '#FFD600', color: '#111111', fontWeight: '900', borderRadius: '16px', py: 1.5, fontSize: '11px', letterSpacing: '0.1em', '&:hover': { backgroundColor: '#111111', color: '#FFD600' } }}
          >
            Review
          </Button>
        )}
        {!isComplete && onComplete && (
          <Button 
            onClick={onComplete} 
            variant="contained" 
            sx={{ backgroundColor: '#111111', color: '#FFD600', fontWeight: 'bold', borderRadius: '12px', '&:hover': { backgroundColor: '#333333' } }}
            className="flex-1 sm:flex-none"
          >
            Return Car
          </Button>
        )}
        {!isComplete && onEdit && (
          <Button 
            onClick={onEdit} 
            variant="contained" 
            sx={{ backgroundColor: '#FFD600', color: '#111111', fontWeight: 'bold', borderRadius: '12px', '&:hover': { backgroundColor: '#e0b400' } }}
            className="flex-1 sm:flex-none"
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button 
            onClick={onDelete} 
            variant="outlined" 
            sx={{ borderColor: '#f87171', color: '#f87171', fontWeight: 'bold', borderRadius: '12px', '&:hover': { backgroundColor: '#fef2f2', borderColor: '#ef4444' } }}
            className="flex-1 sm:flex-none"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
