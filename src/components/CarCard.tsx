'use client';

import Link from "next/link";
import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { decodeSafeUrl } from "@/libs/urlUtils";
import { useState, type MouseEvent } from "react";
import { Rating } from "@mui/material";

export default function CarCard({
  id,
  brand,
  model,
  imgSrc,
  licensePlate,
  year,
  color,
  transmission,
  fuelType,
  rentPrice,
  available,
  rating,
  reviewCount,
  onEdit,
  onDelete,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist = false,
  isWishlistLoading = false,
}: {
  id: string;
  brand: string;
  model: string;
  imgSrc: string;
  licensePlate: string;
  year: number;
  color: string;
  transmission: string;
  fuelType: string;
  rentPrice: number;
  available: boolean;
  rating?: number;
  reviewCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddToWishlist?: () => void;
  onRemoveFromWishlist?: () => void;
  isInWishlist?: boolean;
  isWishlistLoading?: boolean;
}) {
  const [showWishlistMessage, setShowWishlistMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleWishlistClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isInWishlist && onRemoveFromWishlist) {
        await onRemoveFromWishlist();
      } else if (!isInWishlist && onAddToWishlist) {
        await onAddToWishlist();
      }
    } catch (error) {
      console.error("Wishlist error", error);
    }
  };

  return (
    <Link href={`/car/${id}`} className="group block w-full">
      <article className="overflow-hidden rounded-[28px] border border-stone-100 bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-24px_rgba(0,0,0,0.18)]">
        {/* Visual Header */}
        <div className="relative h-64 overflow-hidden bg-stone-100">
          <Image
            src={decodeSafeUrl(imgSrc) || '/img/logo.png'}
            alt={`${brand} ${model}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border ${available ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
              {available ? 'Available' : 'Reserved'}
            </div>
            
            {(onAddToWishlist || onRemoveFromWishlist) && (
              <button
                onClick={handleWishlistClick}
                disabled={isWishlistLoading}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-50 group/heart"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill={isInWishlist ? '#ef4444' : 'none'} 
                  stroke={isInWishlist ? '#ef4444' : 'white'} 
                  strokeWidth="2.5" 
                  className={`transition-colors duration-300 ${!isInWishlist && 'group-hover/heart:stroke-[#ef4444]'}`}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            )}
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end gap-4">
              <div>
                <p className="text-[#FFD600] text-[10px] font-black uppercase tracking-[0.4em] mb-1">{brand}</p>
                <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none">{model}</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Year</p>
                <p className="text-white text-xs font-black">{year}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Daily Rate</p>
                <p className="text-[#111111] text-xl font-black italic uppercase tracking-tighter">฿{rentPrice}</p>
             </div>
             <div className="space-y-1 text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Plate</p>
                <p className="text-[#111111] font-bold text-sm uppercase">{licensePlate}</p>
             </div>
          </div>

          <div className="h-px bg-stone-100 w-full" />

          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Transmission</p>
              <p className="text-[#111111] text-[11px] font-bold uppercase">{transmission}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Fuel Type</p>
              <p className="text-[#111111] text-[11px] font-bold uppercase">{fuelType}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">Color</p>
              <p className="text-[#111111] text-[11px] font-bold uppercase">{color}</p>
            </div>
          </div>

          {/* Admin Actions */}
          {(onEdit || onDelete) && (
            <div className="flex gap-2 pt-2 border-t border-stone-100">
               {onEdit && (
                 <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} className="flex-1 py-3 bg-stone-100 text-[#111111] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#111111] hover:text-white transition-all">Edit</button>
               )}
               {onDelete && (
                 <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} className="flex-1 py-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all">Delete</button>
               )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
