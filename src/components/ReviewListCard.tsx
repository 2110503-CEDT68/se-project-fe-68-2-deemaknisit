'use client';

import { Rating } from "@mui/material";
import Image from "next/image";
import { decodeSafeUrl } from "@/libs/urlUtils";

export interface ReviewListData {
  reviewId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  carImage: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  licensePlate: string;
  createdAt?: string;
}

export default function ReviewListCard({ 
  review, 
  isOwner = false,
  onEdit,
  onDelete 
}: { 
  review: ReviewListData,
  isOwner?: boolean,
  onEdit?: () => void,
  onDelete?: () => void
}) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : '';

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* User and Rating Header */}
      <div className="p-4 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-grow">
            <div className="w-10 h-10 bg-[#FFD600] rounded-full flex items-center justify-center font-bold text-sm text-[#111111]">
              {review.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-sm text-[#111111]">{review.userName}</p>
              <p className="text-xs text-stone-500">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Rating value={review.rating} readOnly size="small" />
            <span className="text-xs font-bold text-[#FFD600]">{review.rating.toFixed(1)}</span>
            {isOwner && (
              <div className="flex gap-2 ml-4 pl-4 border-l border-stone-200">
                <button
                  onClick={onEdit}
                  className="p-1.5 text-xs font-bold bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  title="Edit review"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 text-xs font-bold bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  title="Delete review"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="p-4 border-b border-stone-100">
          <p className="text-sm text-stone-700 leading-relaxed italic">
            "{review.comment}"
          </p>
        </div>
      )}

      {/* Car Details */}
      <div className="p-4 flex gap-4">
        <div className="w-24 h-24 relative flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
          <Image
            src={decodeSafeUrl(review.carImage) || '/img/logo.png'}
            alt={`${review.carBrand} ${review.carModel}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-grow flex flex-col justify-center gap-1">
          <h4 className="font-bold text-sm text-[#111111]">
            {review.carBrand} {review.carModel}
          </h4>
          <p className="text-xs text-stone-600">
            Year: <span className="font-semibold">{review.carYear}</span>
          </p>
          <p className="text-xs text-stone-600">
            License: <span className="font-mono font-semibold">{review.licensePlate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
