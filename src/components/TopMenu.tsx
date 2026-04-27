import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";

import AuthLinks from "./AuthLinks";

export default async function TopMenu() {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role || null;
    const name = session?.user?.name || null;

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white backdrop-blur-xl border-b border-stone-100 flex items-center px-8 z-[50] transition-all duration-300">
            {/* Brand Logo */}
            <Link href="/" className="flex-none group">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FFD600] rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-[#111111] font-black text-lg">R</span>
                    </div>
                    <span className="text-[#111111] font-black tracking-tighter text-xl uppercase italic">Ratatouille</span>
                </div>
            </Link>
            
            {/* Centered Navigation */}
            <div className="flex-grow flex justify-center items-center gap-1">
                <TopMenuItem title='Providers' pageRef='/provider' />
                <TopMenuItem title='Cars' pageRef='/car' />
                <TopMenuItem title='Bookings' pageRef='/bookings' />
                <TopMenuItem title='Reviews' pageRef='/reviews' />
                <TopMenuItem title='Wishlist' pageRef='/wishlist' />
                {role === 'admin' && (
                    <TopMenuItem title='Admin' pageRef='/admin' />
                )}
            </div>

            {/* Profile / Auth Section */}
            <div className="flex-none flex items-center gap-6">
                <AuthLinks session={!!session} name={name} role={role} />
            </div>
        </nav>
    );
}