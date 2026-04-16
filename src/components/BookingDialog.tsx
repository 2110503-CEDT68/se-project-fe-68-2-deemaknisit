'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Booking } from "@/../interface";

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { bookingDate: string; returnDate: string }) => Promise<void>;
  initialData: Booking | null;
}

export default function BookingDialog({
  open,
  onClose,
  onSave,
  initialData,
}: BookingDialogProps) {
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setBookingDate(dayjs(initialData.bookingDate));
      setReturnDate(dayjs(initialData.returnDate));
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!bookingDate || !returnDate) return alert('Dates are required');
    
    // Date Validation: Return date cannot be before booking date
    if (returnDate.isBefore(bookingDate, 'day')) {
      return alert("Return date cannot be before booking date");
    }

    setIsSubmitting(true);
    try {
      await onSave({ 
        bookingDate: bookingDate.format('YYYY-MM-DD'), 
        returnDate: returnDate.format('YYYY-MM-DD') 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="xs" sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontWeight: 'bold', pt: 3 }}>Update Reservation</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '10px !important' }}>
          <Typography variant="body2" className="text-stone-400 mb-2">
            Modifying dates for: <span className="text-[#111111] font-bold">{initialData?.car?.brand} {initialData?.car?.model}</span>
          </Typography>

          <DatePicker
            label="New Booking Date"
            value={bookingDate}
            onChange={(newValue) => setBookingDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="New Return Date"
            value={returnDate}
            onChange={(newValue) => setReturnDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={isSubmitting}
            sx={{ 
              backgroundColor: '#FFD600', 
              color: '#111111', 
              fontWeight: 'bold', 
              borderRadius: '12px', 
              px: 4,
              '&:hover': { backgroundColor: '#e0b400' } 
            }}
          >
            {isSubmitting ? 'Saving...' : 'Confirm Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
