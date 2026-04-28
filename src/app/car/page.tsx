'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getCars, updateCar, deleteCar, createCar } from '@/libs/carService';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/libs/wishlistService';
import { CarWithProvider, Car } from '@/types/interface';
import CarCard from '@/components/CarCard';
import CarDialog from '@/components/CarDialog';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import NotificationDialog from '@/components/NotificationDialog';

export default function CarGalleryPage() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  const isAdmin = session?.user?.role === 'admin';
  
  const [cars, setCars] = useState<CarWithProvider[]>([]);
  const [notification, setNotification] = useState<{ title: string; message: string; severity: 'success' | 'error' | 'info' } | null>(null);
  const [wishlistMap, setWishlistMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Admin States
  const [editingCar, setEditingCar] = useState<CarWithProvider | null>(null);
  const [carToDelete, setCarToDelete] = useState<CarWithProvider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingCar, setIsAddingCar] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [carsRes, wishlistRes] = await Promise.all([
        getCars(),
        token ? getWishlist(token) : Promise.resolve({ data: [] })
      ]);

      setCars(carsRes.data || []);
      
      const map: Record<string, string> = {};
      if (wishlistRes.data) {
        wishlistRes.data.forEach((item: any) => {
          map[item._id] = item.wishlistItemId || item._id;
        });
      }
      setWishlistMap(map);
    } catch (error) {
      console.error("Error fetching cars or wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWishlistToggle = async (carId: string) => {
    if (!token) {
        setNotification({ title: 'Login required', message: 'Please log in first to manage your wishlist.', severity: 'info' });
        return;
    }
    setWishlistLoading(true);
    try {
      const wishlistItemId = wishlistMap[carId];
      if (wishlistItemId) {
        await removeFromWishlist(token, wishlistItemId);
        setWishlistMap(prev => {
          const next = { ...prev };
          delete next[carId];
          return next;
        });
      } else {
        const res = await addToWishlist(token, carId);
        setWishlistMap(prev => ({ ...prev, [carId]: res.data._id }));
        setNotification({ title: 'Added to Wishlist', message: 'Item added successfully.', severity: 'success' });
      }
    } catch (e) {
      console.error("Wishlist toggle error:", e);
      setNotification({ title: 'Wishlist Error', message: e instanceof Error ? e.message : 'Unable to update wishlist.', severity: 'error' });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleEditCar = (car: CarWithProvider) => {
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  const handleSaveCar = async (payload: Partial<Car>) => {
    if (!token) return;
    try {
      if (editingCar) {
        await updateCar(token, editingCar._id, payload);
        setNotification({ title: 'Car Updated', message: 'Vehicle information was updated successfully.', severity: 'success' });
      } else {
        await createCar(token, payload);
        setNotification({ title: 'Car Added', message: 'New vehicle added to fleet successfully.', severity: 'success' });
      }
      setIsDialogOpen(false);
      setEditingCar(null);
      setIsAddingCar(false);
      await fetchData();
    } catch (err: any) {
      setNotification({ title: editingCar ? 'Update Failed' : 'Add Failed', message: err.message || `Failed to ${editingCar ? 'update' : 'add'} car.`, severity: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !carToDelete) return;
    try {
      await deleteCar(token, carToDelete._id);
      setCarToDelete(null);
      await fetchData();
      setNotification({ title: 'Car Removed', message: 'Vehicle deleted from fleet successfully.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Delete Failed', message: err.message || 'Failed to delete car.', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 px-8">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-4">
                <div className="h-4 w-32 bg-stone-100 rounded-full animate-pulse" />
                <div className="h-16 w-96 bg-stone-100 rounded-2xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="h-[450px] bg-stone-50 rounded-[40px] border border-stone-100 animate-pulse" />
                ))}
            </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-24 px-8 relative overflow-hidden">
        {/* Aesthetic Background */}
        <div className="absolute top-0 right-0 w-1/2 h-[50vh] bg-[#FFD600]/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
            <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-2">
                    <span className="text-[#FFD600] text-xs font-black uppercase tracking-[0.4em]">Our Fleet</span>
                    <h1 className="text-[#111111] text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                        Premium <br /> <span className="text-[#FFD600]">Selection</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <button
                            onClick={() => { setIsAddingCar(true); setIsDialogOpen(true); }}
                            className="bg-[#FFD600] text-[#111111] px-6 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-[#111111] hover:text-[#FFD600] transition-all duration-300"
                        >
                            Add Vehicle
                        </button>
                    )}
                    <div className="bg-stone-50 px-8 py-4 rounded-3xl border border-stone-100 flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Active Inventory</p>
                            <p className="text-2xl font-black text-[#111111] tracking-tight">{cars.length} Vehicles</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {cars.map((car) => (
                    <CarCard 
                        key={car._id}
                        id={car._id}
                        brand={car.brand}
                        model={car.model}
                        imgSrc={car.picture}
                        licensePlate={car.licensePlate}
                        year={car.year}
                        color={car.color}
                        transmission={car.transmission}
                        fuelType={car.fuelType}
                        rentPrice={car.rentPrice}
                        available={car.available}
                        isInWishlist={!!wishlistMap[car._id]}
                        isWishlistLoading={wishlistLoading}
                        onAddToWishlist={() => handleWishlistToggle(car._id)}
                        onRemoveFromWishlist={() => handleWishlistToggle(car._id)}
                        onEdit={isAdmin ? () => handleEditCar(car) : undefined}
                        onDelete={isAdmin ? () => setCarToDelete(car) : undefined}
                    />
                ))}
            </div>

            {cars.length === 0 && (
                <div className="py-40 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
                    <p className="text-stone-400 font-bold italic text-2xl uppercase tracking-[0.2em]">No vehicles currently in stock</p>
                </div>
            )}
        </div>

        {/* Dialogs */}
        <CarDialog 
            open={isDialogOpen}
            onClose={() => { setIsDialogOpen(false); setEditingCar(null); setIsAddingCar(false); }}
            onSave={handleSaveCar}
            initialData={editingCar || (isAddingCar ? {} : null)}
            onError={(message) => setNotification({ title: 'Validation Error', message, severity: 'error' })}
        />

        <ConfirmDeleteDialog 
            open={!!carToDelete}
            onClose={() => setCarToDelete(null)}
            onConfirm={handleDeleteConfirm}
            title="Delete Vehicle"
            description={`Are you sure you want to remove ${carToDelete?.brand} ${carToDelete?.model} from the fleet? This action cannot be undone.`}
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
