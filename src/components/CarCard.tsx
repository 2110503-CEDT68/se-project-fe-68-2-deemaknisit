"use client";

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
        setShowWishlistMessage({ type: 'success', message: 'Removed from wishlist' });
      } else if (!isInWishlist && onAddToWishlist) {
        await onAddToWishlist();
        setShowWishlistMessage({ type: 'success', message: 'Added to wishlist' });
      }
      setTimeout(() => setShowWishlistMessage(null), 2000);
    } catch (error) {
      setShowWishlistMessage({ type: 'error', message: 'Failed to update wishlist' });
      setTimeout(() => setShowWishlistMessage(null), 2000);
    }
  };

  return (
    <Link href={`/car/${id}`} className="w-full">
      <InteractiveCard contentName={`${brand} ${model}`} className="w-full h-auto flex-col sm:flex-row shadow-lg">
      <div className="w-full sm:w-[250px] min-h-[200px] relative overflow-hidden flex-shrink-0 bg-stone-100">
        <Image
          src={decodeSafeUrl(imgSrc) || '/img/logo.png'}
          alt={`${brand} ${model}`}
          fill={true}
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {available ? 'Available' : 'Reserved'}
        </div>
        {(onAddToWishlist || onRemoveFromWishlist) && (
          <button
            onClick={handleWishlistClick}
            disabled={isWishlistLoading}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill={isInWishlist ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={isInWishlist ? 'text-red-500' : 'text-[#111111]'}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex-grow p-6 flex flex-col justify-between bg-white">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#111111] font-bold text-xl">{brand} {model}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[#111111] text-xs font-bold uppercase tracking-widest opacity-50">{licensePlate}</p>
                {reviewCount !== undefined && reviewCount > 0 && (
                  <>
                    <span className="text-stone-300">•</span>
                    <div className="flex items-center gap-1">
                      <Rating value={rating} readOnly precision={0.5} size="small" sx={{ color: '#FFD600', fontSize: '14px' }} />
                      <span className="text-[10px] font-black text-[#111111]">{rating?.toFixed(1)}</span>
                      <span className="text-[10px] font-bold text-stone-400">({reviewCount})</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <span className="bg-[#FFD600]/10 text-[#111111] px-2 py-1 rounded text-[10px] font-bold uppercase border border-[#FFD600]/20">
              {year}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Color</p>
              <p className="text-[#111111] font-medium">{color}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Transmission</p>
              <p className="text-[#111111] font-medium">{transmission}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Fuel</p>
              <p className="text-[#111111] font-medium">{fuelType}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Rate</p>
              <p className="text-[#111111] font-bold">฿{rentPrice}/day</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-50">
          {/* Admin Action Buttons */}
          {(onEdit || onDelete) && (
            <div 
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
              }}
            >
              {onEdit && (
                <button 
                  onClick={onEdit} 
                  className="w-9 h-9 flex items-center justify-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-90"
                  title="Edit"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={onDelete} 
                  className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-90"
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              )}
            </div>
          )}
        </div>
        {showWishlistMessage && (
          <div className={`mt-3 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest text-center ${
            showWishlistMessage.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {showWishlistMessage.message}
          </div>
        )}
      </div>
    </InteractiveCard>
    </Link>
  );
}
