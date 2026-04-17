'use client';

import { Rating } from "@mui/material";
import { Review } from "@/../interface";

export default function ReviewCard({ 
  review, 
  showUser = false,
  onEdit,
  onDelete
}: { 
  review: Review, 
  showUser?: boolean,
  onEdit?: () => void,
  onDelete?: () => void
}) {
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  return (
    <div className="bg-white border border-stone-100 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FFD600] rounded-full flex items-center justify-center font-black text-[#111111] text-lg shadow-inner">
            {showUser ? 'U' : 'P'}
          </div>
          <div>
            <h4 className="font-black text-[#111111] uppercase tracking-tight">
              {showUser ? 'Verified User' : 'Provider Feedback'}
            </h4>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">{date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Rating value={review.rating} readOnly precision={0.5} size="small" />
          <span className="text-[10px] font-black text-[#FFD600] uppercase tracking-widest mt-1">Verified</span>
        </div>
      </div>
      
      <div className="relative mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD600" className="opacity-10 absolute -top-2 -left-2 rotate-180">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM3 21V18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21ZM3 21V18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21Z" />
        </svg>
        <p className="text-stone-600 leading-relaxed italic font-medium relative z-10 pl-4">
          "{review.comment || 'No written feedback provided.'}"
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        {onEdit && (
          <button 
            onClick={onEdit} 
            className="w-9 h-9 flex items-center justify-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-90"
            title="Edit Review"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete} 
            className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-90"
            title="Delete Review"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        )}
      </div>
    </div>
  );
}
