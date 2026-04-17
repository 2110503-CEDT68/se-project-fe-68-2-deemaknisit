'use client';

import { Booking } from "@/../interface";
import { Button } from "@mui/material";

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  onComplete
}: {
  booking: Booking;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}) {
  // Extract info from backend structure
  const providerName = booking.car?.provider?.name || "Rental Provider";
  const carDescription = `${booking.car?.brand || ''} ${booking.car?.model || ''}`.trim() || "Rental Car";
  const isComplete = booking.status === 'complete';
  
  const bDate = new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const rDate = new Date(booking.returnDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className={`w-full max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center gap-6 ${isComplete ? 'opacity-75' : ''}`}>
      <div className="flex-grow space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[#111111] font-bold text-xl">{carDescription}</h3>
                {isComplete && (
                    <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-stone-200">
                        Returned
                    </span>
                )}
            </div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">{providerName}</p>
          </div>
          <div className="bg-[#FFD600]/10 text-[#111111] px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-[#FFD600]/20">
             ฿{booking.totalCost} Total
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Pickup</p>
            <p className="text-[#111111] font-medium">{bDate}</p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Return</p>
            <p className="text-[#111111] font-medium">{rDate}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-stone-100 sm:pl-6">
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
