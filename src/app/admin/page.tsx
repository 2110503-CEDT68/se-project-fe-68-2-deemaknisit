'use client';

import { useState, useEffect, useCallback } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import { getBookings, updateBooking, deleteBooking } from '@/libs/bookingService';
import { useSession } from 'next-auth/react';
import BookingDialog from '@/components/BookingDialog';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import { Booking } from '@/../interface';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const fetchAllBookings = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await getBookings(token);
      setBookings(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAllBookings();
  }, [token, fetchAllBookings]);

  const handleUpdate = async (payload: { bookingDate: string; returnDate: string }) => {
    if (!token || !editingBooking) return;
    try {
      await updateBooking(token, editingBooking._id, payload.bookingDate, payload.returnDate);
      setEditingBooking(null);
      await fetchAllBookings();
    } catch (err: any) {
      alert(err.message || "Failed to update booking");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !bookingToDelete) return;
    try {
      await deleteBooking(token, bookingToDelete._id);
      setBookingToDelete(null);
      await fetchAllBookings();
    } catch (err: any) {
      alert(err.message || "Failed to delete booking");
    }
  };

  if (isLoading) return <div className="text-center py-20 text-stone-400 font-bold uppercase tracking-widest animate-pulse">Loading Global Schedule...</div>;

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-white p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-10 mt-12">
            <Typography variant="h4" component="h1" className="text-[#111111] font-bold">
              Admin Dashboard
            </Typography>
            <div className="flex items-center gap-2 bg-[#FFD600]/10 border border-[#FFD600]/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">{bookings.length} Total Bookings</span>
            </div>
        </div>
        
        <TableContainer component={Paper} elevation={0} sx={{ 
            borderRadius: '24px', 
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.03)'
          }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#111111' }}>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', py: 3, pl: 4 }}>User</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Car & Provider</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>Dates</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', pr: 4 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10, color: '#9ca3af', fontStyle: 'italic' }}>
                    No bookings found in the system.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 3, pl: 4 }}>
                      <p className="font-bold text-[#111111]">{booking.user?.name || "Anonymous"}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase">{booking.user?.email || "No Email"}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-[#111111]">{booking.car?.brand} {booking.car?.model}</p>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{booking.car?.provider?.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-stone-600">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                        <span className="text-stone-300">→</span>
                        <span className="text-xs font-medium text-stone-600">{new Date(booking.returnDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <div className="flex justify-end gap-2">
                        <IconButton 
                          onClick={() => setEditingBooking(booking)}
                          sx={{ 
                            backgroundColor: '#FFD600', 
                            color: '#111111', 
                            borderRadius: '10px',
                            '&:hover': { backgroundColor: '#e0b400' }
                          }} 
                          size="small"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </IconButton>
                        <IconButton 
                          onClick={() => setBookingToDelete(booking)}
                          sx={{ 
                            backgroundColor: '#f87171', 
                            color: '#FFFFFF', 
                            borderRadius: '10px',
                            '&:hover': { backgroundColor: '#ef4444' }
                          }} 
                          size="small"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <BookingDialog 
        open={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onSave={handleUpdate}
        initialData={editingBooking}
      />

      {bookingToDelete && (
        <ConfirmDeleteDialog 
          open={!!bookingToDelete}
          title="Cancel User Booking"
          description={`Are you sure you want to cancel the booking for ${bookingToDelete.user?.name}'s ${bookingToDelete.car?.brand}?`}
          onConfirm={handleDeleteConfirm}
          onClose={() => setBookingToDelete(null)}
        />
      )}
    </main>
  );
}
