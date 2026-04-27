'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getCars } from '@/libs/carService';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/libs/wishlistService';
import { CarWithProvider } from '@/../interface';
import CarCard from '@/components/CarCard';

export default function CarGalleryPage() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  
  const [cars, setCars] = useState<CarWithProvider[]>([]);
  const [wishlistMap, setWishlistMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [token]);

  const handleWishlistToggle = async (carId: string) => {
    if (!token) return;
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
      }
    } catch (e) {
      console.error("Wishlist toggle error:", e);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-32 px-8">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-4">
                <div className="h-4 w-32 bg-stone-100 rounded-full animate-pulse" />
                <div className="h-16 w-96 bg-stone-100 rounded-2xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-[450px] bg-stone-50 rounded-[40px] border border-stone-100 animate-pulse" />
                ))}
            </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-32 pb-24 px-8 relative overflow-hidden">
        {/* Aesthetic Background */}
        <div className="absolute top-0 right-0 w-1/2 h-[50vh] bg-[#FFD600]/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
            <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="space-y-2">
                    <span className="text-[#FFD600] text-xs font-black uppercase tracking-[0.4em]">Our Fleet</span>
                    <h1 className="text-[#111111] text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                        Premium <br /> <span className="text-[#FFD600]">Selection</span>
                    </h1>
                </div>
                <div className="bg-stone-50 px-8 py-4 rounded-3xl border border-stone-100 flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Active Inventory</p>
                        <p className="text-2xl font-black text-[#111111] tracking-tight">{cars.length} Vehicles</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    />
                ))}
            </div>

            {cars.length === 0 && (
                <div className="py-40 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
                    <p className="text-stone-400 font-bold italic text-2xl uppercase tracking-[0.2em]">No vehicles currently in stock</p>
                </div>
            )}
        </div>
    </main>
  );
}
