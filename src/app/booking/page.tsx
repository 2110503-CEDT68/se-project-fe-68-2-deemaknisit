'use client';

import { useState, useEffect } from 'react';
import { Typography, MenuItem, TextField, Button, Box, Alert } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import { getProviders } from '@/libs/providerService';
import { addBooking, getBookings } from '@/libs/bookingService';
import { getUserProfile } from '@/libs/authService';
import { Provider, Car, ProviderWithCars } from '@/../interface';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carIdParam = searchParams.get('carId');
  const token = session?.user?.token;

  const [providers, setProviders] = useState<ProviderWithCars[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  
  const [bookingDate, setBookingDate] = useState<Dayjs | null>(null);
  const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Parallel fetching: Providers and Bookings at the same time
        const providersPromise = getProviders();
        const bookingsPromise = token ? getBookings(token) : Promise.resolve({ data: [] });

        const [providersRes, bookingsRes] = await Promise.all([providersPromise, bookingsPromise]);

        setProviders(providersRes.data || []);

        if (token && bookingsRes?.data) {
          const currentUserId = (session?.user as any)?._id;
          const ownBookings = (bookingsRes.data as any[]).filter(b => {
            const bookingUserId = typeof b.user === 'string' ? b.user : b.user?._id;
            return bookingUserId === currentUserId;
          });
          if (ownBookings.length >= 3) setIsLimitReached(true);
        }

        // Smart Auto-select from URL (Inside try block)
        if (carIdParam && providersRes.data) {
          const foundProvider = providersRes.data.find((p: any) => 
            p.cars?.some((c: any) => c._id === carIdParam)
          );
          if (foundProvider) {
            setSelectedProviderId(foundProvider._id);
            setSelectedCarId(carIdParam);
          }
        }
      } catch (e) {
        console.error("Failed to load initial booking data", e);
        setError("Failed to sync data with the server.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status !== 'loading') {
      fetchInitialData();
    }
  }, [token, session, status, carIdParam]);

  useEffect(() => {
    if (selectedProviderId) {
      const provider = providers.find(p => p._id === selectedProviderId);
      if (provider?.cars) {
        setAvailableCars(provider.cars.filter((car: Car) => car.available));
      } else {
        setAvailableCars([]);
      }
      setSelectedCarId('');
    }
  }, [selectedProviderId, providers]);

  const handleSubmit = async () => {
    if (!token) return;
    if (!selectedCarId || !bookingDate || !returnDate) {
      return setError("All fields are required");
    }

    // Date Validation: Return date cannot be before booking date
    if (returnDate.isBefore(bookingDate, 'day')) {
      return setError("Return date cannot be before booking date");
    }

    if (isLimitReached) {
      return setError("You have reached your maximum limit of 3 bookings.");
    }

    setIsLoading(true);
    setError(null);
    try {
      await addBooking(
        token, 
        selectedCarId, 
        bookingDate.format('YYYY-MM-DD'), 
        returnDate.format('YYYY-MM-DD')
      );
      router.push('/mybooking');
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <main className="w-full min-h-screen bg-white px-6 py-20 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-1 bg-stone-100" />
                <div className="w-full max-w-xl flex flex-col gap-12">
                    {/* Header Skeleton */}
                    <div className="flex flex-col gap-3">
                        <div className="w-12 h-1 bg-stone-100 rounded-full mb-2" />
                        <div className="h-12 w-48 bg-stone-100 rounded-2xl animate-pulse" />
                        <div className="h-4 w-32 bg-stone-50 rounded-full mt-2 animate-pulse" />
                    </div>

                    {/* Form Skeleton */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-24 bg-stone-50 rounded-full ml-1 mb-1" />
                            <div className="h-14 w-full bg-stone-100 rounded-[16px] animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-3 w-20 bg-stone-50 rounded-full ml-1 mb-1" />
                            <div className="h-14 w-full bg-stone-100 rounded-[16px] animate-pulse" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-3 w-16 bg-stone-50 rounded-full ml-1 mb-1" />
                                <div className="h-14 w-full bg-stone-100 rounded-[16px] animate-pulse" />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="h-3 w-16 bg-stone-50 rounded-full ml-1 mb-1" />
                                <div className="h-14 w-full bg-stone-100 rounded-[16px] animate-pulse" />
                            </div>
                        </div>
                        <div className="h-16 w-full bg-stone-100 rounded-[20px] mt-6 animate-pulse" />
                    </div>
                </div>
            </main>
        </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <main className="w-full min-h-screen flex flex-col items-center bg-white px-6 py-20 relative overflow-hidden">
        {/* Aesthetic Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1 bg-[#FFD600]" />
        <div className="absolute top-48 -left-24 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-50" />
        
        <div className="w-full max-w-xl relative z-10 flex flex-col gap-12">
            <div className="flex flex-col gap-3 text-center sm:text-left">
                <div className="w-12 h-1 bg-[#FFD600] rounded-full mb-2 hidden sm:block" />
                <h1 className="text-[#111111] text-5xl font-black tracking-tighter uppercase italic leading-none">Book <br /><span className="text-[#FFD600]">a Car</span></h1>
                <p className="text-stone-400 text-sm font-bold uppercase tracking-[0.2em]">Select your details</p>
            </div>

            <Box className="flex flex-col gap-8">
                {isLimitReached && (
                    <Alert 
                        severity="warning" 
                        icon={false}
                        sx={{ 
                            borderRadius: '20px', 
                            backgroundColor: '#fffbeb', 
                            border: '1px solid #fef3c7',
                            color: '#92400e',
                            fontWeight: 'bold',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            tracking: '0.1em'
                        }}
                    >
                        Warning: You have reached the limit of 3 bookings.
                    </Alert>
                )}
                
                {error && (
                    <div className="text-white text-[10px] font-black uppercase tracking-widest bg-[#f87171] p-4 rounded-xl text-center">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Select Provider</label>
                        <TextField
                            select
                            fullWidth
                            value={selectedProviderId}
                            onChange={(e) => setSelectedProviderId(e.target.value)}
                            variant="outlined"
                            sx={{ 
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '16px',
                                    backgroundColor: '#fafaf9',
                                    '& fieldset': { borderColor: '#f5f5f4' },
                                    '&:hover fieldset': { borderColor: '#FFD600' },
                                    '&.Mui-focused fieldset': { borderColor: '#FFD600' },
                                } 
                            }}
                        >
                            {providers.map((provider) => (
                                <MenuItem key={provider._id} value={provider._id}>
                                    {provider.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Select Car</label>
                        <TextField
                            select
                            fullWidth
                            disabled={!selectedProviderId}
                            value={selectedCarId}
                            onChange={(e) => setSelectedCarId(e.target.value)}
                            sx={{ 
                                '& .MuiOutlinedInput-root': { 
                                    borderRadius: '16px',
                                    backgroundColor: '#fafaf9',
                                    '& fieldset': { borderColor: '#f5f5f4' },
                                    '&:hover fieldset': { borderColor: '#FFD600' },
                                    '&.Mui-focused fieldset': { borderColor: '#FFD600' },
                                } 
                            }}
                        >
                            {availableCars.map((car) => (
                                <MenuItem key={car._id} value={car._id}>
                                    {car.brand} {car.model} — ฿{car.rentPrice}/day
                                </MenuItem>
                            ))}
                            {availableCars.length === 0 && selectedProviderId && (
                                <MenuItem disabled>No available cars from this provider</MenuItem>
                            )}
                        </TextField>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Date</label>
                            <DatePicker 
                                value={bookingDate}
                                onChange={(newValue) => setBookingDate(newValue)}
                                slotProps={{ 
                                    textField: { 
                                        fullWidth: true,
                                        sx: { 
                                            '& .MuiOutlinedInput-root': { 
                                                borderRadius: '16px',
                                                backgroundColor: '#fafaf9',
                                                '& fieldset': { borderColor: '#f5f5f4' },
                                            } 
                                        }
                                    } 
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-[#111111] text-[10px] font-black uppercase tracking-[0.2em] ml-1">Return Date</label>
                            <DatePicker 
                                value={returnDate}
                                onChange={(newValue) => setReturnDate(newValue)}
                                slotProps={{ 
                                    textField: { 
                                        fullWidth: true,
                                        sx: { 
                                            '& .MuiOutlinedInput-root': { 
                                                borderRadius: '16px',
                                                backgroundColor: '#fafaf9',
                                                '& fieldset': { borderColor: '#f5f5f4' },
                                            } 
                                        }
                                    } 
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isLoading || isLimitReached || !session}
                        sx={{ 
                            py: 2.5, 
                            fontSize: '12px',
                            fontFamily: 'inherit',
                            fontWeight: '900', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.3em',
                            backgroundColor: '#111111', 
                            color: '#FFFFFF', 
                            borderRadius: '20px',
                            '&:hover': { backgroundColor: '#FFD600', color: '#111111' },
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&.Mui-disabled': { backgroundColor: '#f5f5f4', color: '#d6d3d1' }
                        }}
                    >
                        {isLoading ? 'Booking...' : 'Reserve Now'}
                    </Button>

                    {!session ? (
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest text-center mt-2">
                        Please login to book a car.
                        </p>
                    ) : (
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest text-center mt-2">
                        Secure connection active.
                        </p>
                    )}
                </div>
            </Box>
        </div>

        <div className="mt-32 text-stone-200 text-[8px] font-black uppercase tracking-[0.5em] select-none text-center">
            Ratatouille Advanced Rental Systems — Mission Control Alpha
        </div>
      </main>
    </LocalizationProvider>
  );
}
