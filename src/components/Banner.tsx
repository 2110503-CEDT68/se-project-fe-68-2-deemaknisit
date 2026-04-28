"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Banner() {
  const images = ["/img/cover.jpg", "/img/cover1.jpg", "/img/cover2.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div 
        className="relative w-full h-[100vh] bg-[#111111] overflow-hidden flex items-center px-6 md:px-20"
    >
      {/* Background Carousel */}
      {images.map((src, index) => (
        <div 
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-60' : 'opacity-0'}`}
        >
          <Image 
            src={src} 
            alt={`Slide ${index}`} 
            fill
            className="object-cover mix-blend-luminosity grayscale"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Dynamic Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent z-10" />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pt-32 pb-20">
        
        <div className="flex flex-col gap-10 max-w-4xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex flex-col gap-0 md:gap-2">
                <p className="text-[#FFD600] text-sm md:text-base font-black tracking-[0.5em] uppercase">Drive your journey</p>
                <h1 className="text-white text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.85] uppercase">
                    Rental <br /> <span className="text-[#FFD600]">Cars</span>
                </h1>
            </div>

            <div className="flex flex-col gap-6 max-w-md">
                <p className="text-stone-300 text-sm md:text-base font-bold leading-relaxed">
                    Experience premium mobility with our curated selection of vehicles from top-tier providers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link id="banner-browse-cars-link" href="/car" className="bg-[#FFD600] text-[#111111] px-10 py-5 text-sm font-black uppercase tracking-widest rounded-full hover:bg-white transition-all text-center shadow-2xl shadow-yellow-600/20">
                        Browse Cars
                    </Link>
                </div>
            </div>
        </div>

        {/* Floating Abstract Element */}
        <div className="hidden lg:flex flex-col items-end gap-1 px-4 border-r-2 border-[#FFD600] animate-in fade-in zoom-in duration-1000 delay-500">
            <span className="text-white text-[10px] font-black uppercase tracking-widest opacity-40">Ratatouille Systems</span>
            <span className="text-[#FFD600] text-3xl font-black italic tracking-tighter">EST. 2026</span>
        </div>
      </div>

      {/* Aesthetic Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD600] to-transparent z-30 opacity-50" />
    </div>
  );
}
