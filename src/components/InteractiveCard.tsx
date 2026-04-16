"use client";

export default function InteractiveCard({
  children,
  contentName,
  className = "w-[280px] h-[360px] flex-col"
}: {
  children: React.ReactNode;
  contentName: string;
  className?: string;
}) {
  return (
    <div 
      className={`rounded-2xl shadow-lg bg-white border border-stone-200 transition-all duration-300 ease-in-out flex overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:border-[#FFD600] group cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}
