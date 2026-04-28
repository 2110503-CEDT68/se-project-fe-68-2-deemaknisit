'use client';

import { useState, useEffect, useCallback } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import { getBookings, updateBooking, deleteBooking } from '@/libs/bookingService';
import { useSession } from 'next-auth/react';
import BookingDialog from '@/components/BookingDialog';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import NotificationDialog from '@/components/NotificationDialog';
import { BookingWithDetails } from '@/types/interface';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [notification, setNotification] = useState<{ title: string; message: string; severity: 'success' | 'error' | 'info' } | null>(null);

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingBooking, setEditingBooking] = useState<BookingWithDetails | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<BookingWithDetails | null>(null);

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
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleUpdate = async (payload: { bookingDate: string; returnDate: string }) => {
    if (!token || !editingBooking) return;
    try {
      await updateBooking(token, editingBooking._id, payload.bookingDate, payload.returnDate);
      setEditingBooking(null);
      await fetchAllBookings();
      setNotification({ title: 'Booking Updated', message: 'Booking dates were updated successfully.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Update Failed', message: err.message || 'Failed to update booking.', severity: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !bookingToDelete) return;
    try {
      await deleteBooking(token, bookingToDelete._id);
      setBookingToDelete(null);
      await fetchAllBookings();
      setNotification({ title: 'Booking Removed', message: 'Booking was deleted successfully.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Delete Failed', message: err.message || 'Failed to delete booking.', severity: 'error' });
    }
  };

  if (isLoading) return <Box p={4}><Typography id="admin-loading-message" sx={{ color: '#111111', fontStyle: 'italic', fontWeight: 'bold' }}>ACCESSING SYSTEM LOGS...</Typography></Box>;
  if (error) return <Box p={4}><Typography id="admin-error-message" color="error">{error}</Typography></Box>;

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 px-8 relative overflow-hidden">
        {/* Aesthetic Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-1 bg-[#FFD600]" />
        
        <div className="max-w-7xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <span className="text-[#FFD600] text-xs font-black uppercase tracking-[0.4em]">Control Center</span>
                    <h1 className="text-[#111111] text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                        System <br /> <span className="text-[#FFD600]">Administration</span>
                    </h1>
                </div>
                <div className="bg-stone-50 px-8 py-4 rounded-3xl border border-stone-100">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Global Reservations</p>
                    <p className="text-3xl font-black text-[#111111] tracking-tight">{bookings.length}</p>
                </div>
            </header>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '32px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#111111' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#FFD600', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em' }}>Customer</TableCell>
                            <TableCell sx={{ color: '#FFD600', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em' }}>Vehicle Details</TableCell>
                            <TableCell sx={{ color: '#FFD600', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em' }}>Duration</TableCell>
                            <TableCell sx={{ color: '#FFD600', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em' }}>Cost</TableCell>
                            <TableCell sx={{ color: '#FFD600', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em', textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking._id} sx={{ '&:hover': { bgcolor: '#fafafa' }, transition: 'background-color 0.2s' }}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-black text-[#111111] uppercase tracking-tight">{(booking.user as any).name}</span>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase">{(booking.user as any).email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#111111]">{booking.car?.brand} {booking.car?.model}</span>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{booking.car?.provider?.name || 'Authorized Dealer'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-[11px] font-black text-[#111111]">
                                        {new Date(booking.bookingDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-black text-[#111111]">฿{booking.totalCost}</span>
                                </TableCell>
                                <TableCell align="right">
                                    <div className="flex justify-end gap-2">
                                        <IconButton id={`admin-booking-edit-button-${booking._id}`} onClick={() => setEditingBooking(booking)} sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#FFD600', color: '#111111' } }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </IconButton>
                                        <IconButton id={`admin-booking-delete-button-${booking._id}`} onClick={() => setBookingToDelete(booking)} sx={{ '&:hover': { bgcolor: '#ef4444', color: '#fff' } }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

        {/* Dialogs */}
        <BookingDialog
            open={!!editingBooking}
            onClose={() => setEditingBooking(null)}
            onSave={handleUpdate}
            initialData={editingBooking}
        />

        <ConfirmDeleteDialog
            open={!!bookingToDelete}
            title="System Alert"
            description={`Are you sure you want to terminate the reservation for ${bookingToDelete?.car?.brand} ${bookingToDelete?.car?.model}? This data will be purged from the system.`}
            onConfirm={handleDeleteConfirm}
            onClose={() => setBookingToDelete(null)}
        />

        <NotificationDialog
          open={!!notification}
          title={notification?.title ?? ''}
          message={notification?.message ?? ''}
          severity={notification?.severity ?? 'info'}
          onClose={() => setNotification(null)}
        />
    </main>
  );
}
