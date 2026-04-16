"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface AuthLinksProps {
    session: boolean;
    name?: string | null;
    role?: string | null;
}

export default function AuthLinks({ session, name, role }: AuthLinksProps) {
    if (session) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-[#FFD600] uppercase tracking-[0.1em] leading-none mb-0.5">{role || 'User'}</span>
                    <span className="text-sm font-black text-[#111111] leading-none">Welcome {name}</span>
                </div>
                <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-[#FFD600] text-[#111111] text-[10px] font-black px-6 py-2.5 rounded-full transition-all duration-300 uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/10 flex items-center justify-center border-2 border-transparent cursor-pointer"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <Link 
            href="/login" 
            className="bg-[#FFD600] text-[#111111] text-[10px] font-black px-6 py-2.5 rounded-full transition-all duration-300 uppercase tracking-[0.2em] shadow-lg shadow-yellow-400/20 border-2 border-transparent"
        >
            Login
        </Link>
    );
}
