'use client';

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Provider, ProviderWithCars, Car } from "@/types/interface";
import { decodeSafeUrl } from "@/libs/urlUtils";
import { useSession } from "next-auth/react";
import CarCard from "./CarCard";
import CarDialog from "./CarDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { createCar, updateCar, deleteCar } from "@/libs/carService";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/libs/wishlistService";
import { Fab, Typography, Rating } from "@mui/material";

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function ProviderDetailWithCars({ initialProvider }: { initialProvider: ProviderWithCars }) {
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const isAdminUser = session?.user?.role === 'admin';

  const [provider, setProvider] = useState<ProviderWithCars>(initialProvider);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [wishlistMap, setWishlistMap] = useState<Record<string, any>>({});
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);

  const refreshProviderData = useCallback(async () => {
    try {
      const response = await fetch(`/api/backend/providers/${initialProvider._id}`);
      if (response.ok) {
        const json = await response.json();
        setProvider(json.data);
      }
    } catch (e) {
      console.error("Failed to refresh provider data", e);
    }
  }, [initialProvider._id]);

  // Load user's wishlist
  useEffect(() => {
    if (!token) return;

    const loadWishlist = async () => {
      try {
        setIsLoadingWishlist(true);
        const wishlist = await getWishlist(token);

        const map: Record<string, any> = {};
        if (wishlist.data) {
          wishlist.data.forEach((item: any) => {
            map[item._id] = item;
          });
        }
        setWishlistMap(map);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setIsLoadingWishlist(false);
      }
    };

    loadWishlist();
  }, [token]);

  const handleAddCarToWishlist = async (carId: string) => {
    if (!token) {
        alert("please log in first");
        return;
    }
    try {
      const response = await addToWishlist(token, carId);
      // Response from add is the Wishlist object: { _id, carId, ... }
      // We need to map it back to what getWishlist returns if possible, 
      // or just enough for it to work.
      setWishlistMap(prev => ({ 
        ...prev, 
        [carId]: { _id: carId, wishlistItemId: response.data._id } 
      }));
      alert("Added successfully");
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleRemoveCarFromWishlist = async (carId: string) => {
    if (!token) {
        alert("please log in first");
        return;
    }
    const wishlistItem = wishlistMap[carId];
    const wishlistItemId = wishlistItem?.wishlistItemId || wishlistItem?._id;
    if (!wishlistItemId) return;

    try {
      await removeFromWishlist(token, wishlistItemId);
      setWishlistMap(prev => {
        const newMap = { ...prev };
        delete newMap[carId];
        return newMap;
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleSaveCar = async (payload: any) => {
    if (!token) return;
    try {
      if (editingCar) {
        await updateCar(token, editingCar._id, payload);
      } else {
        await createCar(token, payload);
      }
      setIsCarDialogOpen(false);
      setEditingCar(null);
      await refreshProviderData();
    } catch (err: any) {
      alert(err.message || "Failed to save car");
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsCarDialogOpen(true);
  };

  const handleDeleteCarConfirm = async () => {
    if (!token || !carToDelete) return;
    try {
      await deleteCar(token, carToDelete._id);
      setCarToDelete(null);
      await refreshProviderData();
    } catch (err: any) {
      alert(err.message || "Failed to delete car");
    }
  };

  return (
    <main className="flex flex-col items-center bg-white min-h-screen relative pb-32">
      {/* Header Profile Section */}
      <div className="w-full h-48 bg-[#111111] absolute top-16 left-0 right-0 z-0" />
      
      <div className="relative z-10 w-full max-w-5xl mt-24 px-8 flex flex-col items-center">
        <div className="bg-white rounded-[32px] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] w-full flex flex-col md:flex-row gap-12 border border-stone-100">
            <div className="relative w-full md:w-[320px] h-[320px] rounded-[24px] overflow-hidden shadow-2xl flex-none border-4 border-white">
                <Image
                    src={decodeSafeUrl(provider.picture)}
                    alt={provider.name}
                    fill
                    className="object-cover"
                />
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-[2px] bg-[#FFD600]" />
                    <span className="text-[#FFD600] text-xs font-black uppercase tracking-[0.3em]">Verified Provider</span>
                  </div>
                  <h1 className="text-[#111111] text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                    {provider.name}
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-4">
                  <div>
                    <Typography className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Operations Base</Typography>
                    <p className="text-[#111111] font-bold text-sm leading-tight">{provider.address}, {provider.district}, {provider.province}</p>
                  </div>
                  <div>
                    <Typography className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Contact Support</Typography>
                    <p className="text-[#111111] font-bold text-sm leading-tight">{provider.tel}</p>
                  </div>
                  <div>
                    <Typography className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Service Region</Typography>
                    <span className="inline-block bg-[#111111] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-1">{provider.region}</span>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  {/* Wishlist button removed - now on individual car cards */}
                </div>
            </div>
        </div>
          </div>

      {/* Car Inventory Section */}
      <div className="w-full max-w-6xl mt-24 px-8 pb-20">
        <div className="flex justify-between items-end mb-12">
            <div>
                <span className="text-[#FFD600] font-black text-[12px] uppercase tracking-[0.3em] mb-2 block">Live Status</span>
                <h2 className="text-4xl font-black text-[#111111] tracking-tighter uppercase italic">Available <span className="text-[#FFD600]">Cars</span></h2>
            </div>
            <div className="bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100 flex items-center gap-4 group">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Provider Inventory</span>
                    <span className="text-xl font-black text-[#111111] leading-none">{provider.cars?.length || 0} Cars listed</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {provider.cars && provider.cars.length > 0 ? (
            provider.cars.map((car) => (
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
                onEdit={isAdminUser ? () => handleEditCar(car) : undefined}
                onDelete={isAdminUser ? () => setCarToDelete(car) : undefined}
                onAddToWishlist={() => handleAddCarToWishlist(car._id)}
                onRemoveFromWishlist={() => handleRemoveCarFromWishlist(car._id)}
                isInWishlist={!!wishlistMap[car._id]}
                isWishlistLoading={isLoadingWishlist}
              />
            ))
          ) : (
            <div className="py-24 text-center w-full bg-stone-50 rounded-[32px] border-2 border-dashed border-stone-100">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <p className="text-stone-400 italic text-xl font-medium uppercase tracking-[0.2em]">No cars available from this provider</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Quick Action */}
      {isAdminUser && (
        <Fab 
          id="provider-add-car-button"
          color="primary" 
          aria-label="add-car" 
          onClick={() => setIsCarDialogOpen(true)}
          sx={{ 
            position: 'fixed', 
            bottom: 32, 
            right: 32, 
            width: 64,
            height: 64,
            backgroundColor: '#FFD600', 
            color: '#111111', 
            boxShadow: '0 8px 32px rgba(255, 214, 0, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': { backgroundColor: '#111111', color: '#FFD600', transform: 'scale(1.1)' } 
          }}
        >
          <PlusIcon />
        </Fab>
      )}

      {/* Modular Dialog Components */}
      <CarDialog 
        open={isCarDialogOpen}
        onClose={() => { setIsCarDialogOpen(false); setEditingCar(null); }}
        onSave={handleSaveCar}
        initialData={editingCar}
        providerId={provider._id}
      />

      {carToDelete && (
        <ConfirmDeleteDialog 
          open={!!carToDelete}
          title="Delete Car"
          description={`Are you sure you want to delete the ${carToDelete.brand} ${carToDelete.model}?`}
          onConfirm={handleDeleteCarConfirm}
          onClose={() => setCarToDelete(null)}
        />
      )}
    </main>
  );
}
