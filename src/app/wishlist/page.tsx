'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CarWithProvider } from '@/../interface';
import { getWishlist, removeFromWishlist } from '@/libs/wishlistService';
import { decodeSafeUrl } from '@/libs/urlUtils';

type WishlistItem = CarWithProvider & { wishlistItemId: string };

function WishlistCard({
  item,
  onRemove,
  removing,
}: {
  item: WishlistItem;
  onRemove: (wishlistItemId: string) => void;
  removing: boolean;
}) {
  const imageSrc = decodeSafeUrl(item.picture || '/img/logo.png');
  const provider = typeof item.provider === 'string' ? null : item.provider;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-stone-100 bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-24px_rgba(0,0,0,0.24)]">
      <Link href={`/car/${item._id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-stone-100">
          <Image
            src={imageSrc}
            alt={`${item.brand} ${item.model}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="mt-1 text-2xl font-black italic uppercase leading-none text-white">
                {item.brand} {item.model}
              </h2>
            </div>
            <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md">
              Wishlist
            </div>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-5 p-6">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-stone-600">
            {item.licensePlate} • {item.year}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-bold text-stone-400">Color</p>
              <p className="text-stone-600">{item.color || 'N/A'}</p>
            </div>
            <div>
              <p className="font-bold text-stone-400">Transmission</p>
              <p className="text-stone-600">{item.transmission || 'N/A'}</p>
            </div>
            <div>
              <p className="font-bold text-stone-400">Fuel</p>
              <p className="text-stone-600">{item.fuelType || 'N/A'}</p>
            </div>
            <div>
              <p className="font-bold text-stone-400">Daily Rate</p>
              <p className="text-[#111111] font-black">฿{item.rentPrice}</p>
            </div>
          </div>
          {provider && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mt-2">
              Provider: {provider.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/car/${item._id}`}
            className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:!text-[#FFD600]"
          >
            View Car
          </Link>

          <button
            type="button"
            onClick={() => onRemove(item.wishlistItemId)}
            disabled={removing}
            className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-600 transition-all duration-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {removing ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const token = session?.user?.token as string | undefined;

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist(token);
      setItems((response?.data || []) as WishlistItem[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load wishlist';
      
      // If it looks like an auth issue or a fetch failure (often CORS-related 401),
      // force the "Sign In" UI instead of showing a technical error.
      if (message.toLowerCase().includes('authorized') || message.includes('401') || message.includes('fetch')) {
        setIsUnauthorized(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status === 'loading') return;
    void loadWishlist();
  }, [status, loadWishlist]);

  const handleRemove = async (wishlistItemId: string) => {
    if (!token) return;

    try {
      setRemovingId(wishlistItemId);
      await removeFromWishlist(token, wishlistItemId);
      setItems((prev) => prev.filter((item) => item.wishlistItemId !== wishlistItemId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove item';
      setError(message);
    } finally {
      setRemovingId(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-white px-6 pt-28 pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="h-14 w-72 rounded-2xl bg-stone-100 animate-pulse" />
          <div className="h-6 w-96 rounded-full bg-stone-100 animate-pulse" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-96 rounded-[28px] bg-stone-100 animate-pulse" />
            <div className="h-96 rounded-[28px] bg-stone-100 animate-pulse" />
            <div className="h-96 rounded-[28px] bg-stone-100 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!token || status === 'unauthenticated' || isUnauthorized) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="mx-auto max-w-xl w-full rounded-[32px] border border-blue-100 bg-blue-50 p-12 text-center shadow-[0_20px_60px_-30px_rgba(59,130,246,0.35)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-blue-500">Authentication Required</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#111111]">
            Please sign in first
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-blue-700/70">
            Your saved cars will appear here after you log in to your account.
          </p>
          <Link
            href="/api/auth/signin"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#FFD600] px-8 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:!text-[#FFD600] hover:scale-105 active:scale-95 shadow-xl"
          >
            Sign In to Continue
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-1 w-1/3 bg-[#FFD600]" />
      <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-stone-50 blur-3xl opacity-60" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-8 bg-[#FFD600]" />
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#FFD600]">Personal Collection</p>
            </div>
            <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter text-[#111111] md:text-7xl">
              My <span className="text-[#FFD600]">Wishlist</span>
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-stone-500">
              Save cars you like and come back to them anytime.
            </p>
          </div>

          <div className="rounded-[24px] border border-stone-100 bg-white px-6 py-4 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.22)]">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">Saved Cars</p>
            <p className="mt-2 text-3xl font-black text-[#111111]">{items.length}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-stone-200 bg-stone-50 px-8 py-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">Nothing here yet</p>
            <h2 className="mt-4 text-3xl font-black italic uppercase tracking-tighter text-[#111111]">
              Your wishlist is currently empty.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-stone-500">
              Browse cars and tap the wishlist button on a car card to save it here.
            </p>
            <Link
              href="/car"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#111111] transition-all duration-300 hover:bg-[#111111] hover:!text-[#FFD600]"
            >
              Browse Cars
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                onRemove={handleRemove}
                removing={removingId === item._id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
