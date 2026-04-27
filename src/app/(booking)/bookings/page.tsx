'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Typography, Select, MenuItem, FormControl, InputLabel, Box, Alert, Rating, Divider } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { getProviders } from '@/libs/providerService';
import { addBooking, getBookings, deleteBooking, updateBooking } from '@/libs/bookingService';
import { Provider, Car, ProviderWithCars, BookingWithDetails } from '@/types/interface';
import BookingList from '@/components/BookingList';

export default function BookingsHubPage() {
  const { data: session, status } = useSession();
  const token = session?.user?.token;
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tab State: 'history' or 'new'
  const [activeTab, setActiveTab] = useState<'history' | 'new'>(
    searchParams.get('tab') === 'new' || searchParams.get('carId') ? 'new' : 'history'
  );

  // Shared Data
  const [providers, setProviders] = useState<ProviderWithCars[]>([]);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Booking State
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const carIdParam = searchParams.get('carId');

  const fetchData = useCallback(async () => {
    if (status === 'loading') return;
    setIsLoading(true);
    setError(null);

    try {
      const [providersRes, bookingsRes] = await Promise.all([
        getProviders(),
        token ? getBookings(token) : Promise.resolve({ data: [] })
      ]);

      setProviders(providersRes.data || []);
      const allBookings = bookingsRes.data || [];
      
      if (token) {
        const currentUserId = (session?.user as any)?._id;
        const ownBookings = allBookings.filter((b: any) => {
          const bUserId = typeof b.user === 'string' ? b.user : b.user?._id;
          return bUserId === currentUserId;
        });
        setBookings(ownBookings);
        if (ownBookings.length >= 3) setIsLimitReached(true);
      }

      // Handle auto-selection from URL
      if (carIdParam && providersRes.data) {
        const foundProvider = (providersRes.data as ProviderWithCars[]).find(p => 
          p.cars?.some(c => c._id === carIdParam)
        );
        if (foundProvider) {
          setSelectedProviderId(foundProvider._id);
          setSelectedCarId(carIdParam);
        }
      }
    } catch (e) {
      console.error("Failed to load bookings data", e);
      setError("Failed to sync data with the server.");
    } finally {
      setIsLoading(false);
    }
  }, [token, status, session, carIdParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync available cars when provider changes
  useEffect(() => {
    if (selectedProviderId) {
      const provider = providers.find(p => p._id === selectedProviderId);
      setAvailableCars(provider?.cars?.filter(c => c.available) || []);
      // Only clear if not auto-selecting
      if (!carIdParam || selectedCarId === '') setSelectedCarId('');
    }
  }, [selectedProviderId, providers, carIdParam]);

  const handleCreateBooking = async () => {
    if (!token) return;
    if (!selectedCarId || !bookingDate || !returnDate) {
      return setError("All fields are required");
    }

    if (returnDate.isBefore(bookingDate, 'day')) {
      return setError("Return date cannot be before booking date");
    }

    setIsLoading(true);
    try {
      await addBooking(
        token,
        selectedCarId,
        bookingDate.format('YYYY-MM-DD'),
        returnDate.format('YYYY-MM-DD')
      );
      // Success! Switch to history and refresh
      setActiveTab('history');
      await fetchData();
      // Clear form
      setSelectedProviderId('');
      setSelectedCarId('');
      setBookingDate(null);
      setReturnDate(null);
    } catch (e) {
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!token) return;
    try {
      await deleteBooking(token, id);
      await fetchData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleUpdateBooking = async (id: string, bookingDate: string, returnDate: string) => {
    if (!token) return;
    try {
      await updateBooking(token, id, bookingDate, returnDate);
      await fetchData();
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-stone-50 p-10 rounded-[32px] border border-stone-100 text-center">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#111111] mb-4">Access Denied</h1>
            <p className="text-stone-500 mb-8">Please sign in to manage your bookings.</p>
            <button onClick={() => router.push('/api/auth/signin')} className="w-full py-4 bg-[#111111] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#FFD600] hover:text-[#111111] transition-all">Sign In</button>
        </div>
      </main>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className="min-h-screen bg-white pt-24 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="flex flex-col gap-3">
                    <span className="text-[#FFD600] text-xs font-black uppercase tracking-[0.4em]">Reservations</span>
                    <h1 className="text-[#111111] text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                        Bookings <span className="text-[#FFD600]">Hub</span>
                    </h1>
                </div>

                {/* Tab Switcher */}
                <div className="bg-stone-50 p-1.5 rounded-[24px] flex gap-1 border border-stone-100 shadow-sm h-fit">
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                            activeTab === 'history' 
                            ? 'bg-white text-[#111111] shadow-sm' 
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                    >
                        My Schedule ({bookings.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('new')}
                        className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                            activeTab === 'new' 
                            ? 'bg-white text-[#111111] shadow-sm' 
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                    >
                        Reserve a Car
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="relative w-full">
                {isLoading && (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 w-full bg-stone-50 rounded-[32px] animate-pulse border border-stone-100" />
                        ))}
                    </div>
                )}

                {!isLoading && activeTab === 'history' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        {bookings.length === 0 ? (
                            <div className="py-32 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
                                <p className="text-stone-400 font-bold italic text-xl uppercase tracking-widest mb-6">Booking not complete yet. Review will appear here after return</p>
                                <button onClick={() => setActiveTab('new')} className="bg-[#111111] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#FFD600] hover:text-[#111111] transition-all">Make Your First Booking</button>
                            </div>
                        ) : (
                            <BookingList 
                                initialBookings={bookings} 
                                onRefresh={fetchData} 
                            />
                        )}
                    </div>
                )}

                {!isLoading && activeTab === 'new' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Info Column */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#111111] rounded-[40px] p-10 text-white relative overflow-hidden h-full min-h-[300px] flex flex-col justify-end shadow-2xl">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD600] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20" />
                                <p className="text-[#FFD600] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Reservation Policy</p>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-6">Secure Your <br />Premium Drive</h3>
                                <div className="space-y-4 opacity-60 text-xs font-bold uppercase tracking-widest leading-loose">
                                    <p>• Max 3 active bookings</p>
                                    <p>• Verified providers only</p>
                                    <p>• 24/7 Support included</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[40px] border border-stone-100 p-10 shadow-xl relative">
                                <Box className="flex flex-col gap-8">
                                    {isLimitReached && (
                                        <Alert severity="warning" sx={{ borderRadius: '20px', fontWeight: 'bold' }}>
                                            Warning: You have reached the limit of 3 bookings.
                                        </Alert>
                                    )}
                                    
                                    {error && (
                                        <Alert severity="error" sx={{ borderRadius: '20px', fontWeight: 'bold' }}>{error}</Alert>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormControl fullWidth>
                                            <InputLabel sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em' }}>Select Provider</InputLabel>
                                            <Select
                                                value={selectedProviderId}
                                                label="Select Provider"
                                                onChange={(e) => setSelectedProviderId(e.target.value)}
                                                sx={{ borderRadius: '16px', bgcolor: 'stone.50' }}
                                            >
                                                {providers.map((p) => (
                                                    <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth disabled={!selectedProviderId}>
                                            <InputLabel sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', tracking: '0.2em' }}>Select Vehicle</InputLabel>
                                            <Select
                                                value={selectedCarId}
                                                label="Select Vehicle"
                                                onChange={(e) => setSelectedCarId(e.target.value)}
                                                sx={{ borderRadius: '16px' }}
                                            >
                                                {availableCars.map((c) => (
                                                    <MenuItem key={c._id} value={c._id}>{c.brand} {c.model}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <DatePicker
                                            label="Pickup Date"
                                            value={bookingDate}
                                            onChange={(val) => setBookingDate(val)}
                                            slotProps={{ textField: { fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '16px' } } } }}
                                        />
                                        <DatePicker
                                            label="Return Date"
                                            value={returnDate}
                                            onChange={(val) => setReturnDate(val)}
                                            slotProps={{ textField: { fullWidth: true, sx: { '& .MuiOutlinedInput-root': { borderRadius: '16px' } } } }}
                                        />
                                    </div>

                                    <button 
                                        onClick={handleCreateBooking}
                                        disabled={isLimitReached || !selectedCarId || !bookingDate || !returnDate}
                                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                            !isLimitReached && selectedCarId && bookingDate && returnDate
                                            ? 'bg-[#FFD600] text-[#111111] hover:bg-[#111111] hover:text-[#FFD600] shadow-[0_20px_40px_-15px_rgba(255,214,0,0.4)]' 
                                            : 'bg-stone-50 text-stone-300 cursor-not-allowed'
                                        }`}
                                    >
                                        {isLimitReached ? 'Limit Reached' : 'Confirm Reservation'}
                                    </button>
                                </Box>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>
    </LocalizationProvider>
  );
}
