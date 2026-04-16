import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import { decodeSafeUrl } from "@/libs/urlUtils";

export default function ProviderCard({
  providerName,
  imgSrc,
  providerAddress,
  providerTelephone,
  onEdit,
  onDelete,
}: {
  providerName: string;
  imgSrc: string;
  providerAddress?: string;
  providerTelephone?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <InteractiveCard contentName={providerName}>
      <div className="w-full h-[55%] relative overflow-hidden flex-shrink-0">
        <Image
          src={decodeSafeUrl(imgSrc) || '/img/logo.png'}
          alt={providerName}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
      
      <div className="relative w-full h-[45%] p-5 flex flex-col justify-between bg-white overflow-hidden"> 
        <div className="space-y-1">
            <span className="text-[10px] font-black text-[#FFD600] uppercase tracking-[0.2em] leading-none mb-1 block">Verified Provider</span>
            <h3 className="text-[#111111] font-black text-xl tracking-tight truncate leading-tight">
              {providerName}
            </h3>
        </div>

        <div className="space-y-1 mb-2">
            {providerAddress && (
              <p className="text-stone-500 text-[11px] font-bold truncate flex items-center gap-1.5 uppercase tracking-wide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {providerAddress}
              </p>
            )}
            {providerTelephone && (
              <p className="text-stone-500 text-[11px] font-bold truncate flex items-center gap-1.5 uppercase tracking-wide">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.81 12.81 0 0 0 .62 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.62A2 2 0 0 1 22 16.92z"></path></svg>
                {providerTelephone}
              </p>
            )}
        </div>

        <div className="flex flex-row justify-between items-center pt-2">
           <span className="text-[10px] font-black italic tracking-widest text-[#111111]/30">RATATOUILLE EXCLUSIVE</span>
          
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
                  className="w-8 h-8 flex items-center justify-center bg-[#FFD600] text-[#111111] rounded-lg hover:bg-black hover:text-white transition-all duration-300 shadow-sm"
                  title="Edit Provider Info"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={onDelete} 
                  className="w-8 h-8 flex items-center justify-center bg-[#f87171] text-white rounded-lg hover:bg-black transition-all duration-300 shadow-sm"
                  title="Delete Provider"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </InteractiveCard>
  );
}
