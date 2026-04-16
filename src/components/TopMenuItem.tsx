import Link from "next/link";

export default function TopMenuItem({title,pageRef}:{title:string, pageRef:string}) {
    return (
        <Link 
            className="w-auto px-4 py-2 text-center my-auto font-sans text-xs font-black text-[#111111] hover:text-[#FFD600] relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-[#FFD600] after:transition-all after:duration-300 hover:after:w-3/4 uppercase tracking-widest transition-colors duration-300" 
            href={pageRef}
        >
            {title}
        </Link>
    );
}